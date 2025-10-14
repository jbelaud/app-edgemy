import {ButtonDevenirCoachModal} from '@/components/features/auth/button-devenir-coach-modal'
import {getAuthUser} from '@/services/authentication/auth-service'
import {RoleConst} from '@/services/types/domain/auth-types'

export default async function ButtonDevenirCoachWrapper() {
  const user = await getAuthUser()

  // Si l'utilisateur est connecté ET qu'il est déjà COACH, on n'affiche pas le bouton
  if (user && user.role === RoleConst.COACH) {
    return null
  }

  // Sinon, on affiche le bouton modal
  return <ButtonDevenirCoachModal />
}
