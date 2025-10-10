import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from 'pg'

import {env} from '@/env'

import * as auth from './auth-model'
import * as edgemy from './edgemy-model'
import * as notification from './notification-model'
import * as subscription from './subscription-model'
import * as user from './user-model'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // Limite de connexions
  idleTimeoutMillis: 30_000, // Timeout pour connexions inactives
  connectionTimeoutMillis: 10_000,
})

const db = drizzle(pool, {
  schema: {
    ...auth,
    ...user,
    ...edgemy,
    ...subscription,
    ...notification,
  },
  logger: env.NODE_ENV === 'development', // Activer les logs SQL en dev
})

if (env.NODE_ENV === 'test') {
  throw new Error('Database connections are not allowed during tests.')
}

export default db
