'use client'

import {LogOut, User} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

import {logoutAction} from '@/app/[locale]/(auth)/action'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type UserMenuProps = {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

export default function UserMenu({user}: UserMenuProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const handleLogout = async () => {
    setPending(true)
    await logoutAction()
    router.push('/')
    setPending(false)
  }

  // Initiales pour l'avatar par défaut
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:ring-primary relative flex h-9 w-9 items-center justify-center rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          <User className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={pending}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{pending ? 'Déconnexion...' : 'Se déconnecter'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
