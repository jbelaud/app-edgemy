import {relations, sql} from 'drizzle-orm'
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import {user} from './auth-model'

// ===== ENUMS =====

// Rôles utilisateur Edgemy
export const edgemyRoleEnum = pgEnum('edgemy_role', [
  'PLAYER',
  'COACH',
  'ADMIN',
])

// Formats de poker
export const pokerFormatEnum = pgEnum('poker_format', [
  'MTT',
  'CASH_GAME',
  'SPIN_AND_GO',
  'SIT_AND_GO',
  'EXPRESSO',
  'AUTRES',
])

// Types de coaching
export const coachingTypeEnum = pgEnum('coaching_type', [
  'SESSION_1H',
  'PACK_5H',
  'PACK_10H',
  'REVIEW_MTT',
  'REVIEW_CASH',
  'ANALYSE_MAIN',
])

// Statut des sessions
export const sessionStatusEnum = pgEnum('session_status', [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
])

// Statut des paiements
export const paymentStatusEnum = pgEnum('payment_status', [
  'PENDING',
  'SUCCEEDED',
  'FAILED',
  'REFUNDED',
])

// Plans d'abonnement coach
export const coachSubscriptionPlanEnum = pgEnum('coach_subscription_plan', [
  'BASIC',
  'PRO',
  'PREMIUM',
])

// ===== TABLES =====

/**
 * Table CoachProfiles
 * Profils des coachs avec leurs informations professionnelles
 */
export const coachProfile = pgTable('coach_profile', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'})
    .unique(), // Un user = un seul profil coach

  // Informations professionnelles
  bio: text('bio'),
  experience: text('experience'), // Années d'expérience, palmarès, etc.
  formats: text('formats').array(), // ['MTT', 'CASH_GAME', ...]
  abi: text('abi'), // Average Buy-In (ex: "50-200€")
  languages: text('languages')
    .array()
    .default(sql`ARRAY['FR']::text[]`), // ['FR', 'EN', ...]
  achievements: text('achievements'), // Palmarès, résultats notables

  // Tarification
  hourlyRate: numeric('hourly_rate', {precision: 10, scale: 2}), // Tarif horaire
  coachingTypes: text('coaching_types').array(), // Types de coaching proposés

  // Visibilité et statut
  visibility: boolean('visibility').default(true).notNull(), // Profil actif/inactif
  isVerified: boolean('is_verified').default(false), // Coach vérifié par admin

  // Statistiques
  ratingAvg: numeric('rating_avg', {precision: 3, scale: 2}).default('0'), // Note moyenne
  ratingCount: integer('rating_count').default(0), // Nombre d'avis
  totalSessions: integer('total_sessions').default(0), // Nombre total de sessions

  // Abonnement
  subscriptionPlan: coachSubscriptionPlanEnum('subscription_plan'), // Plan actuel
  subscriptionExpiresAt: timestamp('subscription_expires_at'), // Date d'expiration

  // Métadonnées
  metadata: jsonb('metadata'), // Données additionnelles flexibles

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * Table CoachingSessions
 * Réservations de sessions de coaching entre joueurs et coachs
 */
export const coachingSession = pgTable('coaching_session', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),

  // Relations
  playerId: uuid('player_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
  coachId: uuid('coach_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),

  // Détails de la session
  scheduledAt: timestamp('scheduled_at').notNull(), // Date et heure prévues
  duration: integer('duration').notNull(), // Durée en minutes
  price: numeric('price', {precision: 10, scale: 2}).notNull(), // Prix payé
  status: sessionStatusEnum('status').default('PENDING').notNull(),

  // Communication
  discordChannelId: text('discord_channel_id'), // ID du channel Discord
  notes: text('notes'), // Notes du coach ou du joueur

  // Replay et suivi
  videoReplayUrl: text('video_replay_url'), // Lien vers le replay
  objectives: text('objectives'), // Objectifs de la session
  feedback: text('feedback'), // Retour du coach

  // Métadonnées
  metadata: jsonb('metadata'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * Table Payments
 * Gestion des paiements Stripe pour les sessions
 */
export const payment = pgTable('payment', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),

  // Relations
  sessionId: uuid('session_id')
    .notNull()
    .references(() => coachingSession.id, {onDelete: 'cascade'}),
  playerId: uuid('player_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
  coachId: uuid('coach_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),

  // Stripe
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  stripeChargeId: text('stripe_charge_id'),

  // Montants
  amount: numeric('amount', {precision: 10, scale: 2}).notNull(), // Montant total
  commission: numeric('commission', {precision: 10, scale: 2}).notNull(), // Commission Edgemy
  coachAmount: numeric('coach_amount', {precision: 10, scale: 2}).notNull(), // Montant pour le coach
  currency: text('currency').default('EUR').notNull(),

  // Statut
  status: paymentStatusEnum('status').default('PENDING').notNull(),

  // Métadonnées
  metadata: jsonb('metadata'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * Table Reviews
 * Avis et notations des joueurs sur les coachs
 */
export const review = pgTable('review', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),

  // Relations
  sessionId: uuid('session_id')
    .notNull()
    .references(() => coachingSession.id, {onDelete: 'cascade'})
    .unique(), // Un seul avis par session
  playerId: uuid('player_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
  coachId: uuid('coach_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),

  // Notation
  rating: integer('rating').notNull(), // Note de 1 à 5
  comment: text('comment'), // Commentaire optionnel

  // Modération
  isVisible: boolean('is_visible').default(true), // Visible publiquement
  moderatedAt: timestamp('moderated_at'), // Date de modération si applicable
  moderatedBy: uuid('moderated_by').references(() => user.id), // Admin qui a modéré

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ===== RELATIONS =====

export const coachProfileRelations = relations(coachProfile, ({one, many}) => ({
  user: one(user, {
    fields: [coachProfile.userId],
    references: [user.id],
  }),
  sessionsAsCoach: many(coachingSession, {
    relationName: 'coachSessions',
  }),
  reviews: many(review, {
    relationName: 'coachReviews',
  }),
}))

export const coachingSessionRelations = relations(coachingSession, ({one}) => ({
  player: one(user, {
    fields: [coachingSession.playerId],
    references: [user.id],
    relationName: 'playerSessions',
  }),
  coach: one(user, {
    fields: [coachingSession.coachId],
    references: [user.id],
    relationName: 'coachSessions',
  }),
  payment: one(payment, {
    fields: [coachingSession.id],
    references: [payment.sessionId],
  }),
  review: one(review, {
    fields: [coachingSession.id],
    references: [review.sessionId],
  }),
}))

export const paymentRelations = relations(payment, ({one}) => ({
  session: one(coachingSession, {
    fields: [payment.sessionId],
    references: [coachingSession.id],
  }),
  player: one(user, {
    fields: [payment.playerId],
    references: [user.id],
  }),
  coach: one(user, {
    fields: [payment.coachId],
    references: [user.id],
  }),
}))

export const reviewRelations = relations(review, ({one}) => ({
  session: one(coachingSession, {
    fields: [review.sessionId],
    references: [coachingSession.id],
  }),
  player: one(user, {
    fields: [review.playerId],
    references: [user.id],
  }),
  coach: one(user, {
    fields: [review.coachId],
    references: [user.id],
  }),
  moderator: one(user, {
    fields: [review.moderatedBy],
    references: [user.id],
  }),
}))

// ===== TYPES TYPESCRIPT =====

export type CoachProfileModel = typeof coachProfile.$inferSelect
export type AddCoachProfileModel = typeof coachProfile.$inferInsert
export type UpdateCoachProfileModel = typeof coachProfile.$inferInsert

export type CoachingSessionModel = typeof coachingSession.$inferSelect
export type AddCoachingSessionModel = typeof coachingSession.$inferInsert
export type UpdateCoachingSessionModel = typeof coachingSession.$inferInsert

export type PaymentModel = typeof payment.$inferSelect
export type AddPaymentModel = typeof payment.$inferInsert
export type UpdatePaymentModel = typeof payment.$inferInsert

export type ReviewModel = typeof review.$inferSelect
export type AddReviewModel = typeof review.$inferInsert
export type UpdateReviewModel = typeof review.$inferInsert

// Types pour les enums
export type EdgemyRoleEnumModel = (typeof edgemyRoleEnum.enumValues)[number]
export type PokerFormatEnumModel = (typeof pokerFormatEnum.enumValues)[number]
export type CoachingTypeEnumModel = (typeof coachingTypeEnum.enumValues)[number]
export type SessionStatusEnumModel =
  (typeof sessionStatusEnum.enumValues)[number]
export type PaymentStatusEnumModel =
  (typeof paymentStatusEnum.enumValues)[number]
export type CoachSubscriptionPlanEnumModel =
  (typeof coachSubscriptionPlanEnum.enumValues)[number]
