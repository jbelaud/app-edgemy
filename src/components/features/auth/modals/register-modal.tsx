'use client'

import {RegisterForm} from '@/components/features/auth/forms/register-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface RegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin?: () => void
  defaultRole?: 'user' | 'coach'
}

export function RegisterModal({
  open,
  onOpenChange,
  onSwitchToLogin,
  defaultRole,
}: RegisterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {defaultRole === 'coach' ? 'Devenir Coach' : 'Créer un compte'}
          </DialogTitle>
          <DialogDescription>
            {defaultRole === 'coach'
              ? 'Inscrivez-vous en tant que coach sur Edgemy'
              : 'Créez votre compte Edgemy'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <RegisterForm />
          {onSwitchToLogin && (
            <div className="mt-4 text-center text-sm">
              Déjà un compte ?{' '}
              <button
                onClick={() => {
                  onOpenChange(false)
                  onSwitchToLogin()
                }}
                className="text-primary font-medium hover:underline"
              >
                Se connecter
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
