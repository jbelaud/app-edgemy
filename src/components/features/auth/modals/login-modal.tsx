'use client'

import {LoginForm} from '@/components/features/auth/forms/login'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToRegister?: () => void
}

export function LoginModal({
  open,
  onOpenChange,
  onSwitchToRegister,
}: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Connexion</DialogTitle>
          <DialogDescription>
            Connectez-vous à votre compte Edgemy
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <LoginForm />
          {onSwitchToRegister && (
            <div className="mt-4 text-center text-sm">
              Pas encore de compte ?{' '}
              <button
                onClick={() => {
                  onOpenChange(false)
                  onSwitchToRegister()
                }}
                className="text-primary font-medium hover:underline"
              >
                S&apos;inscrire
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
