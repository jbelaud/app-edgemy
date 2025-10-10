#!/usr/bin/env node
/* eslint-disable no-restricted-properties */

import pg from 'pg'

import initDotEnv from './env'

initDotEnv()

async function checkUser() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL non définie')
  }

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  })

  console.log('⏳ Connexion à la base de données...')
  await client.connect()
  console.log('✅ Connecté')

  try {
    const result = await client.query(`
      SELECT id, email, name, role, email_verified, created_at
      FROM "user"
      WHERE email = 'jeremy.belaud@gmail.com'
    `)

    if (result.rows.length === 0) {
      console.log('❌ Aucun utilisateur trouvé avec cet email')
    } else {
      console.log('✅ Utilisateur trouvé :')
      console.log(result.rows[0])
    }

    // Afficher tous les utilisateurs
    const allUsers = await client.query(`
      SELECT email, name, role, email_verified
      FROM "user"
      ORDER BY created_at DESC
      LIMIT 10
    `)

    console.log('\n📋 Derniers utilisateurs :')
    allUsers.rows.forEach((user) => {
      console.log(`- ${user.email} (${user.name}) - Rôle: ${user.role}`)
    })

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    await client.end()
    process.exit(1)
  }
}

checkUser()
