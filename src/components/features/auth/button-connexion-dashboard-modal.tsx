import {ButtonConnexionModal} from '@/components/features/auth/button-connexion-modal'
import {getAuthUser} from '@/services/authentication/auth-service'

export default async function ButtonConnexionDashboardModal() {
  const user = await getAuthUser()

  return <ButtonConnexionModal user={user} />
}
