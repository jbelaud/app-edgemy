import {
  AddCoachProfileModel,
  CoachingTypeEnumModel,
  CoachProfileModel,
  CoachSubscriptionPlanEnumModel,
  PokerFormatEnumModel,
  UpdateCoachProfileModel,
} from '@/db/models/edgemy-model'
import {UserModel} from '@/db/models/user-model'

// Types de domaine découplés des types Drizzle

/**
 * Profil coach complet avec relation utilisateur
 */
export type CoachProfile = CoachProfileModel & {
  user?: UserModel
}

/**
 * Données pour créer un profil coach
 */
export type CreateCoachProfile = Omit<
  AddCoachProfileModel,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'ratingAvg'
  | 'ratingCount'
  | 'totalSessions'
>

/**
 * Données pour mettre à jour un profil coach
 */
export type UpdateCoachProfile = {
  id: string
} & Partial<
  Omit<
    UpdateCoachProfileModel,
    | 'id'
    | 'userId'
    | 'createdAt'
    | 'updatedAt'
    | 'ratingAvg'
    | 'ratingCount'
    | 'totalSessions'
  >
>

/**
 * DTO pour affichage public du profil coach
 */
export type CoachProfileDTO = {
  id: string
  userId: string
  userName?: string
  userImage?: string
  bio?: string
  experience?: string
  formats?: string[]
  abi?: string
  languages?: string[]
  achievements?: string
  hourlyRate?: string
  coachingTypes?: string[]
  visibility: boolean
  isVerified: boolean
  ratingAvg?: string
  ratingCount: number
  totalSessions: number
  subscriptionPlan?: CoachSubscriptionPlanEnumModel
}

/**
 * Filtres pour la recherche de coachs
 */
export type CoachSearchFilters = {
  formats?: PokerFormatEnumModel[]
  minHourlyRate?: number
  maxHourlyRate?: number
  languages?: string[]
  coachingTypes?: CoachingTypeEnumModel[]
  minRating?: number
  isVerified?: boolean
  visibility?: boolean
}

// Types pour les enums
export type PokerFormat = PokerFormatEnumModel
export type CoachingType = CoachingTypeEnumModel
export type CoachSubscriptionPlan = CoachSubscriptionPlanEnumModel
