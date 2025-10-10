import {sql} from 'drizzle-orm'
import {boolean, pgTable, text, timestamp, uuid} from 'drizzle-orm/pg-core'

import {user} from './auth-model'

// ===== TABLES EDGEMY (VERSION MINIMALE) =====

/**
 * Table CoachProfile
 * Profil simplifié pour les coachs
 */
export const coachProfile = pgTable('coach_profile', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'})
    .unique(),
  bio: text('bio'),
  visibility: boolean('visibility').notNull().default(true),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ===== TYPES =====

export type CoachProfileModel = typeof coachProfile.$inferSelect
export type AddCoachProfileModel = typeof coachProfile.$inferInsert
export type UpdateCoachProfileModel = typeof coachProfile.$inferInsert
