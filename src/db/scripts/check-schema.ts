#!/usr/bin/env node
/* eslint-disable no-restricted-properties */

import pg from 'pg'

import initDotEnv from './env'

initDotEnv()

async function checkSchema() {
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
    // Vérifier la colonne role
    const result = await client.query(`
      SELECT 
        column_name,
        data_type,
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'user' AND column_name = 'role'
    `)

    console.log('\n📋 Schéma de la colonne role :')
    console.log(result.rows[0])

    // Vérifier l'enum
    const enumResult = await client.query(`
      SELECT enumlabel
      FROM pg_enum
      WHERE enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'role_type'
      )
      ORDER BY enumsortorder
    `)

    console.log("\n📋 Valeurs de l'enum role_type :")
    enumResult.rows.forEach((row) => {
      console.log(`- ${row.enumlabel}`)
    })

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    await client.end()
    process.exit(1)
  }
}

checkSchema()
