import Link from 'next/link'

import UserMenu from '@/components/features/auth/user-menu'
import {Button} from '@/components/ui/button'
import {getAuthUser} from '@/services/authentication/auth-service'

export default async function ButtonConnexionDashboard() {
  const user = await getAuthUser()
  if (user) {
    return (
      <UserMenu
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
        }}
      />
    )
  }
  return (
    <Button asChild>
      <Link href="/login">Connexion</Link>
    </Button>
  )
}
