import {
  createCoachProfileDao,
  getCoachProfileByIdDao,
  getCoachProfileByUserIdDao,
  hasCoachProfileDao,
  updateCoachProfileDao,
} from '@/db/repositories/coach-repository'
import {logger} from '@/lib/logger'

import {getAuthUser} from './authentication/auth-service'
import {AuthorizationError} from './errors/authorization-error'
import {ValidationError} from './errors/validation-error'
import {RoleConst} from './types/domain/auth-types'
import {
  CoachProfile,
  CreateCoachProfile,
  UpdateCoachProfile,
} from './types/domain/coach-types'

/**
 * Crée un profil coach pour un utilisateur
 * Seuls les utilisateurs avec le rôle COACH peuvent créer un profil
 */
export const createCoachProfileService = async (
  profileData: CreateCoachProfile
): Promise<CoachProfile> => {
  const authUser = await getAuthUser()

  if (!authUser) {
    throw new AuthorizationError('Vous devez être connecté')
  }

  // Vérifier que l'utilisateur a le rôle COACH
  if (authUser.role !== RoleConst.COACH) {
    throw new AuthorizationError(
      'Seuls les utilisateurs avec le rôle COACH peuvent créer un profil coach'
    )
  }

  // Vérifier que l'utilisateur crée son propre profil
  if (profileData.userId !== authUser.id) {
    throw new AuthorizationError(
      'Vous ne pouvez créer un profil coach que pour vous-même'
    )
  }

  // Vérifier que l'utilisateur n'a pas déjà un profil coach
  const existingProfile = await hasCoachProfileDao(profileData.userId)
  if (existingProfile) {
    throw new ValidationError(
      'Un profil coach existe déjà pour cet utilisateur'
    )
  }

  logger.info('Creating coach profile', {userId: profileData.userId})

  const profile = await createCoachProfileDao(profileData)
  return (await getCoachProfileByIdDao(profile.id)) as CoachProfile
}

/**
 * Récupère un profil coach par son ID
 * Accessible publiquement si le profil est visible
 */
export const getCoachProfileByIdService = async (
  id: string
): Promise<CoachProfile | undefined> => {
  const profile = await getCoachProfileByIdDao(id)

  if (!profile) {
    return undefined
  }

  // Si le profil n'est pas visible, seul le propriétaire ou un admin peut le voir
  if (!profile.visibility) {
    const authUser = await getAuthUser()

    const isOwner = authUser?.id === profile.userId
    const isAdmin = authUser?.role === RoleConst.ADMIN

    if (!isOwner && !isAdmin) {
      throw new AuthorizationError(
        "Ce profil coach n'est pas accessible publiquement"
      )
    }
  }

  return profile
}

/**
 * Récupère le profil coach d'un utilisateur
 */
export const getCoachProfileByUserIdService = async (
  userId: string
): Promise<CoachProfile | undefined> => {
  const profile = await getCoachProfileByUserIdDao(userId)

  if (!profile) {
    return undefined
  }

  // Si le profil n'est pas visible, seul le propriétaire ou un admin peut le voir
  if (!profile.visibility) {
    const authUser = await getAuthUser()

    const isOwner = authUser?.id === profile.userId
    const isAdmin = authUser?.role === RoleConst.ADMIN

    if (!isOwner && !isAdmin) {
      throw new AuthorizationError(
        "Ce profil coach n'est pas accessible publiquement"
      )
    }
  }

  return profile
}

/**
 * Met à jour un profil coach
 * Seul le propriétaire du profil ou un admin peut le modifier
 */
export const updateCoachProfileService = async (
  profileData: UpdateCoachProfile
): Promise<void> => {
  const authUser = await getAuthUser()

  if (!authUser) {
    throw new AuthorizationError('Vous devez être connecté')
  }

  // Récupérer le profil existant
  const existingProfile = await getCoachProfileByIdDao(profileData.id)

  if (!existingProfile) {
    throw new ValidationError('Profil coach introuvable')
  }

  // Vérifier les permissions
  const isOwner = authUser.id === existingProfile.userId
  const isAdmin = authUser.role === RoleConst.ADMIN

  if (!isOwner && !isAdmin) {
    throw new AuthorizationError(
      "Vous n'avez pas la permission de modifier ce profil coach"
    )
  }

  logger.info('Updating coach profile', {
    profileId: profileData.id,
    userId: authUser.id,
  })

  await updateCoachProfileDao(profileData.id, profileData)
}

/**
 * Vérifie si un utilisateur a un profil coach
 */
export const hasCoachProfileService = async (
  userId: string
): Promise<boolean> => {
  return await hasCoachProfileDao(userId)
}
