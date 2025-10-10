import * as dotenv from 'dotenv'
import {Client} from 'pg'

// Charger les variables d'environnement
dotenv.config({path: '.env.development'})

/**
 * Script de migration manuelle pour remplacer PLAYER par USER
 * Ce script doit être exécuté une seule fois pour mettre à jour la base de données
 */
async function migratePlayerToUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  console.log('⏳ Connexion à la base de données...')
  await client.connect()
  console.log('✅ Connecté')

  try {
    console.log('\n🔄 Début de la migration PLAYER → USER...\n')

    // Étape 1: Convertir temporairement la colonne role en text
    console.log('1️⃣  Conversion de la colonne role en text...')
    await client.query(`
      ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
    `)
    await client.query(`
      ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE text;
    `)
    console.log('✅ Colonne convertie en text')

    // Étape 2: Mettre à jour toutes les valeurs PLAYER en USER
    console.log('\n2️⃣  Mise à jour des valeurs PLAYER → USER...')
    const updateResult = await client.query(`
      UPDATE "user" SET "role" = 'USER' WHERE "role" = 'PLAYER';
    `)
    console.log(`✅ ${updateResult.rowCount} utilisateurs mis à jour`)

    // Étape 3: Supprimer l'ancien type enum
    console.log("\n3️⃣  Suppression de l'ancien type enum...")
    await client.query(`
      DROP TYPE IF EXISTS "public"."role_type" CASCADE;
    `)
    console.log('✅ Ancien type supprimé')

    // Étape 4: Créer le nouveau type enum
    console.log('\n4️⃣  Création du nouveau type enum (USER, COACH, ADMIN)...')
    await client.query(`
      CREATE TYPE "public"."role_type" AS ENUM('USER', 'COACH', 'ADMIN');
    `)
    console.log('✅ Nouveau type créé')

    // Étape 5: Reconvertir la colonne au nouveau type enum
    console.log('\n5️⃣  Reconversion de la colonne au type enum...')
    await client.query(`
      ALTER TABLE "user" 
      ALTER COLUMN "role" 
      SET DATA TYPE "public"."role_type" 
      USING "role"::"public"."role_type";
    `)
    console.log('✅ Colonne reconvertie')

    // Étape 6: Définir la nouvelle valeur par défaut
    console.log('\n6️⃣  Définition de la valeur par défaut...')
    await client.query(`
      ALTER TABLE "user" 
      ALTER COLUMN "role" 
      SET DEFAULT 'USER'::"public"."role_type";
    `)
    console.log('✅ Valeur par défaut définie')

    console.log('\n✅ Migration terminée avec succès !')
    console.log('\n📊 Résumé :')
    console.log('  • PLAYER → USER')
    console.log('  • SUPER_ADMIN supprimé')
    console.log('  • Rôles disponibles : USER, COACH, ADMIN')
  } catch (error) {
    console.error('\n❌ Erreur lors de la migration :', error)
    throw error
  } finally {
    await client.end()
    console.log('\n🔌 Déconnexion de la base de données')
  }
}

// Exécuter la migration
migratePlayerToUser()
  .then(() => {
    console.log('\n✨ Script terminé')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Échec du script :', error)
    process.exit(1)
  })
