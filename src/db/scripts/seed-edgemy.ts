#!/usr/bin/env node
/* eslint-disable no-restricted-properties */

import pg from 'pg'

import initDotEnv from './env'

initDotEnv()

async function seedEdgemy() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Ne pas utiliser en production')
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL non définie')
  }

  const start = Date.now()

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  })

  console.log('⏳ Vérification de la connexion...')
  console.log(`🗄️  URL : ${process.env.DATABASE_URL}`)

  await client.connect()

  console.log('✅ Connexion réussie')

  try {
    // 1. Insérer les utilisateurs Edgemy (PLAYER, COACH, ADMIN)
    await client.query(`
      INSERT INTO "user" (email, name, email_verified, image, visibility, role)
      VALUES
        -- Administrateur
        ('admin@edgemy.fr', 'Admin Edgemy', true, 'https://randomuser.me/api/portraits/med/men/9.jpg', 'public', 'ADMIN'),
        
        -- Coachs
        ('coach1@edgemy.fr', 'Pierre Dupont', true, 'https://randomuser.me/api/portraits/med/men/4.jpg', 'public', 'COACH'),
        ('coach2@edgemy.fr', 'Sophie Martin', true, 'https://randomuser.me/api/portraits/med/women/11.jpg', 'public', 'COACH'),
        ('coach3@edgemy.fr', 'David Bernard', true, 'https://randomuser.me/api/portraits/med/men/7.jpg', 'public', 'COACH'),
        
        -- Joueurs
        ('player1@edgemy.fr', 'Lucas Petit', true, 'https://randomuser.me/api/portraits/med/men/3.jpg', 'public', 'PLAYER'),
        ('player2@edgemy.fr', 'Emma Dubois', true, 'https://randomuser.me/api/portraits/med/women/14.jpg', 'public', 'PLAYER'),
        ('player3@edgemy.fr', 'Thomas Leroy', true, 'https://randomuser.me/api/portraits/med/men/15.jpg', 'public', 'PLAYER'),
        ('player4@edgemy.fr', 'Julie Moreau', true, 'https://randomuser.me/api/portraits/med/women/10.jpg', 'public', 'PLAYER')
      ON CONFLICT (email) DO NOTHING;
    `)

    // 2. Insérer les comptes avec mots de passe (password: "password123")
    await client.query(`
      INSERT INTO "account" (
        "account_id",
        "provider_id",
        "user_id",
        "password",
        "created_at",
        "updated_at"
      )
      SELECT 
        uuid_generate_v4() as "account_id",
        'credential' as "provider_id",
        u.id as "user_id",
        '48ea88853800794bc5312d8ad65fe149:d8503b790be4373e803d663b895438fa1e8f0b809a1b86a2b3fb6290f7f2310c4acb82dfe3737d2a3dd318a786653af3438022f24286ee0e9e8b2dda9b91f8f9' as "password",
        NOW() as "created_at",
        NOW() as "updated_at"
      FROM "user" u
      WHERE u.email IN (
        'admin@edgemy.fr',
        'coach1@edgemy.fr',
        'coach2@edgemy.fr',
        'coach3@edgemy.fr',
        'player1@edgemy.fr',
        'player2@edgemy.fr',
        'player3@edgemy.fr',
        'player4@edgemy.fr'
      )
      ON CONFLICT ("account_id", "provider_id") DO NOTHING;
    `)

    // 3. Insérer les paramètres utilisateur
    await client.query(`
      INSERT INTO "user_settings" (
        "user_id",
        "theme",
        "language",
        "timezone",
        "two_factor_type",
        "enable_email_notifications",
        "enable_push_notifications",
        "notification_channel",
        "email_digest",
        "marketing_emails",
        "created_at",
        "updated_at"
      )
      SELECT 
        u.id as "user_id",
        'dark' as "theme",
        'fr' as "language",
        'Europe/Paris' as "timezone",
        'otp' as "two_factor_type",
        true as "enable_email_notifications",
        true as "enable_push_notifications",
        'push' as "notification_channel",
        true as "email_digest",
        false as "marketing_emails",
        NOW() as "created_at",
        NOW() as "updated_at"
      FROM "user" u
      ON CONFLICT (user_id) DO NOTHING;
    `)

    // 4. Insérer les profils coach
    await client.query(`
      INSERT INTO "coach_profile" (
        "user_id",
        "bio",
        "visibility",
        "is_verified",
        "created_at",
        "updated_at"
      )
      SELECT 
        u.id as "user_id",
        CASE 
          WHEN u.email = 'coach1@edgemy.fr' THEN 'Coach professionnel avec 10 ans d''expérience en tournois live et online.'
          WHEN u.email = 'coach2@edgemy.fr' THEN 'Ancienne joueuse professionnelle, spécialisée en développement mental.'
          WHEN u.email = 'coach3@edgemy.fr' THEN 'Expert en tournois rapides. Approche analytique et data-driven.'
        END as "bio",
        true as "visibility",
        CASE 
          WHEN u.email IN ('coach1@edgemy.fr', 'coach2@edgemy.fr') THEN true
          ELSE false
        END as "is_verified",
        NOW() as "created_at",
        NOW() as "updated_at"
      FROM "user" u
      WHERE u.role = 'COACH'
      ON CONFLICT (user_id) DO NOTHING;
    `)

    const end = Date.now()

    console.log('')
    console.log('✅ Seed Edgemy inséré en', end - start, 'ms')
    console.log('')
    console.log('👥 Utilisateurs créés :')
    console.log('  🔹 1 Admin : admin@edgemy.fr')
    console.log('  🔹 3 Coachs : coach1-3@edgemy.fr')
    console.log('  🔹 4 Joueurs : player1-4@edgemy.fr')
    console.log('')
    console.log('🎓 Profils coach créés :')
    console.log('  🔹 Pierre Dupont - ✅ Vérifié')
    console.log('  🔹 Sophie Martin - ✅ Vérifié')
    console.log('  🔹 David Bernard')
    console.log('')
    console.log('🔑 Mot de passe pour tous les comptes : password123')
    console.log('')

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error)
    await client.end()
    process.exit(1)
  }
}

seedEdgemy().catch((error) => {
  console.error('❌ Connexion échouée')
  console.error(error)
  process.exit(1)
})
