import Link from 'next/link'

import {Button} from '@/components/ui/button'
import {getAuthUser} from '@/services/authentication/auth-service'
import {RoleConst} from '@/services/types/domain/auth-types'

export default async function ButtonDevenirCoach() {
  const user = await getAuthUser()

  // Si l'utilisateur est connecté ET qu'il est déjà COACH, on n'affiche pas le bouton
  if (user && user.role === RoleConst.COACH) {
    return null
  }

  // Sinon, on affiche le bouton (utilisateur non connecté OU utilisateur avec rôle USER)
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-orange-500 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
      asChild
    >
      <Link href="/register?role=coach">Devenir Coach</Link>
    </Button>
  )
}
