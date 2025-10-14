'use client'

import {useState} from 'react'

import {RegisterModal} from '@/components/features/auth/modals/register-modal'
import {Button} from '@/components/ui/button'

export function ButtonDevenirCoachModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-orange-500 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
        onClick={() => setOpen(true)}
      >
        Devenir Coach
      </Button>
      <RegisterModal open={open} onOpenChange={setOpen} defaultRole="coach" />
    </>
  )
}
