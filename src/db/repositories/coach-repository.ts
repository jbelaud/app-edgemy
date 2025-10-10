import {and, eq, gte, lte, sql} from 'drizzle-orm'

import {user} from '@/db/models/auth-model'
import db from '@/db/models/db'
import {
  AddCoachProfileModel,
  coachProfile,
  CoachProfileModel,
  UpdateCoachProfileModel,
} from '@/db/models/edgemy-model'
import {PaginatedResponse, Pagination} from '@/services/types/common-type'
import {
  CoachProfile,
  CoachSearchFilters,
} from '@/services/types/domain/coach-types'

/**
 * Crée un nouveau profil coach
 */
export const createCoachProfileDao = async (
  profile: AddCoachProfileModel
): Promise<CoachProfileModel> => {
  const [row] = await db.insert(coachProfile).values(profile).returning()
  return row
}

/**
 * Récupère un profil coach par son ID
 */
export const getCoachProfileByIdDao = async (
  id: string
): Promise<CoachProfile | undefined> => {
  const row = await db.query.coachProfile.findFirst({
    where: (profile, {eq}) => eq(profile.id, id),
    with: {
      user: true,
    },
  })
  return row
}

/**
 * Récupère un profil coach par l'ID utilisateur
 */
export const getCoachProfileByUserIdDao = async (
  userId: string
): Promise<CoachProfile | undefined> => {
  const row = await db.query.coachProfile.findFirst({
    where: (profile, {eq}) => eq(profile.userId, userId),
    with: {
      user: true,
    },
  })
  return row
}

/**
 * Met à jour un profil coach
 */
export const updateCoachProfileDao = async (
  id: string,
  profile: UpdateCoachProfileModel
): Promise<void> => {
  await db
    .update(coachProfile)
    .set({...profile, updatedAt: new Date()})
    .where(eq(coachProfile.id, id))
}

/**
 * Supprime un profil coach
 */
export const deleteCoachProfileDao = async (id: string): Promise<void> => {
  await db.delete(coachProfile).where(eq(coachProfile.id, id))
}

/**
 * Récupère tous les profils coach avec pagination
 */
export const getAllCoachProfilesWithPaginationDao = async (
  pagination: Pagination
): Promise<PaginatedResponse<CoachProfile>> => {
  const [rows, [{count}]] = await Promise.all([
    db.query.coachProfile.findMany({
      limit: pagination.limit,
      offset: pagination.offset,
      orderBy: (profile, {desc}) => [desc(profile.createdAt)],
      with: {
        user: true,
      },
    }),
    db.select({count: sql<number>`count(*)`}).from(coachProfile),
  ])

  const page = Math.floor(pagination.offset / pagination.limit) + 1
  const totalPages = Math.ceil(count / pagination.limit)

  return {
    data: rows.length === 0 ? [] : rows,
    pagination: {
      total: count,
      page: page,
      limit: pagination.limit,
      totalPages: totalPages,
    },
  }
}

/**
 * Recherche de coachs avec filtres avancés
 */
export const searchCoachProfilesDao = async (
  filters: CoachSearchFilters,
  pagination: Pagination
): Promise<PaginatedResponse<CoachProfile>> => {
  // Construction des conditions de filtrage
  const conditions = []

  // Filtre par visibilité (par défaut, seulement les profils visibles)
  if (filters.visibility !== undefined) {
    conditions.push(eq(coachProfile.visibility, filters.visibility))
  } else {
    conditions.push(eq(coachProfile.visibility, true))
  }

  // Filtre par vérification
  if (filters.isVerified !== undefined) {
    conditions.push(eq(coachProfile.isVerified, filters.isVerified))
  }

  // Filtre par tarif horaire minimum
  if (filters.minHourlyRate !== undefined) {
    conditions.push(
      gte(coachProfile.hourlyRate, filters.minHourlyRate.toString())
    )
  }

  // Filtre par tarif horaire maximum
  if (filters.maxHourlyRate !== undefined) {
    conditions.push(
      lte(coachProfile.hourlyRate, filters.maxHourlyRate.toString())
    )
  }

  // Filtre par note minimum
  if (filters.minRating !== undefined) {
    conditions.push(gte(coachProfile.ratingAvg, filters.minRating.toString()))
  }

  // Filtre par formats (array overlap)
  if (filters.formats && filters.formats.length > 0) {
    conditions.push(
      sql`${coachProfile.formats} && ARRAY[${sql.join(
        filters.formats.map((f) => sql`${f}`),
        sql`, `
      )}]::text[]`
    )
  }

  // Filtre par langues (array overlap)
  if (filters.languages && filters.languages.length > 0) {
    conditions.push(
      sql`${coachProfile.languages} && ARRAY[${sql.join(
        filters.languages.map((l) => sql`${l}`),
        sql`, `
      )}]::text[]`
    )
  }

  // Filtre par types de coaching (array overlap)
  if (filters.coachingTypes && filters.coachingTypes.length > 0) {
    conditions.push(
      sql`${coachProfile.coachingTypes} && ARRAY[${sql.join(
        filters.coachingTypes.map((ct) => sql`${ct}`),
        sql`, `
      )}]::text[]`
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Requête avec filtres
  const [rows, [{count}]] = await Promise.all([
    db
      .select({
        id: coachProfile.id,
        userId: coachProfile.userId,
        bio: coachProfile.bio,
        experience: coachProfile.experience,
        formats: coachProfile.formats,
        abi: coachProfile.abi,
        languages: coachProfile.languages,
        achievements: coachProfile.achievements,
        hourlyRate: coachProfile.hourlyRate,
        coachingTypes: coachProfile.coachingTypes,
        visibility: coachProfile.visibility,
        isVerified: coachProfile.isVerified,
        ratingAvg: coachProfile.ratingAvg,
        ratingCount: coachProfile.ratingCount,
        totalSessions: coachProfile.totalSessions,
        subscriptionPlan: coachProfile.subscriptionPlan,
        subscriptionExpiresAt: coachProfile.subscriptionExpiresAt,
        metadata: coachProfile.metadata,
        createdAt: coachProfile.createdAt,
        updatedAt: coachProfile.updatedAt,
        user: user,
      })
      .from(coachProfile)
      .leftJoin(user, eq(coachProfile.userId, user.id))
      .where(whereClause)
      .limit(pagination.limit)
      .offset(pagination.offset)
      .orderBy(
        sql`${coachProfile.ratingAvg} DESC NULLS LAST, ${coachProfile.totalSessions} DESC`
      ),
    db
      .select({count: sql<number>`count(*)`})
      .from(coachProfile)
      .where(whereClause),
  ])

  const page = Math.floor(pagination.offset / pagination.limit) + 1
  const totalPages = Math.ceil(count / pagination.limit)

  return {
    data: rows.length === 0 ? [] : rows,
    pagination: {
      total: count,
      page: page,
      limit: pagination.limit,
      totalPages: totalPages,
    },
  }
}

/**
 * Vérifie si un utilisateur a déjà un profil coach
 */
export const hasCoachProfileDao = async (userId: string): Promise<boolean> => {
  const profile = await db.query.coachProfile.findFirst({
    where: (profile, {eq}) => eq(profile.userId, userId),
  })
  return !!profile
}

/**
 * Met à jour les statistiques d'un profil coach (note moyenne, nombre d'avis, sessions)
 */
export const updateCoachProfileStatsDao = async (
  coachId: string,
  stats: {
    ratingAvg?: string
    ratingCount?: number
    totalSessions?: number
  }
): Promise<void> => {
  await db
    .update(coachProfile)
    .set({...stats, updatedAt: new Date()})
    .where(eq(coachProfile.userId, coachId))
}
