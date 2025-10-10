import {getUserByIdDao} from '@/db/repositories/user-repository'

/**
 * Récupère les organisations d'un utilisateur
 */
export const getUserOrganizationsService = async (userId: string) => {
  const user = await getUserByIdDao(userId)
  return user?.organizations || []
}

/**
 * Récupère les membres et invitations d'une organisation
 */
export const getMembersAndInvitationsService = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  organizationId: string
) => {
  // TODO: Implémenter la récupération des membres et invitations
  // Pour l'instant, retourne un tableau vide
  return []
}

/**
 * Récupère les membres d'une organisation
 */
export const getOrganizationMembersService = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  organizationId: string
) => {
  // TODO: Implémenter la récupération des membres
  // Pour l'instant, retourne un tableau vide
  return []
}
