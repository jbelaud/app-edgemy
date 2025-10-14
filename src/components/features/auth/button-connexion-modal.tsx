'use client'

import {useState} from 'react'

import {LoginModal} from '@/components/features/auth/modals/login-modal'
import {RegisterModal} from '@/components/features/auth/modals/register-modal'
import UserMenu from '@/components/features/auth/user-menu'
import {Button} from '@/components/ui/button'

interface ButtonConnexionModalProps {
  user?: {
    name: string
    email: string
    image?: string | null
  } | null
}

export function ButtonConnexionModal({user}: ButtonConnexionModalProps) {
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

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
    <>
      <Button onClick={() => setLoginOpen(true)}>Connexion</Button>
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => setRegisterOpen(true)}
      />
      <RegisterModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </>
  )
}
