'use client'

import React, {createContext, useContext} from 'react'

import {UserOrganizationRoleConst} from '@/services/types/domain/auth-types'

import {useAuth} from './auth-provider'

// Types pour le contexte d'organisation
interface OrganizationContextType {
  referenceId: string | null
  currentUserOrganization: {
    organization: {
      id: string
      name: string
      slug: string
    } | null
    role: string
  } | null
}

// Création du contexte
const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
)

// Hook pour utiliser le contexte d'organisation
export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider'
    )
  }
  return context
}

// Hook pour obtenir les rôles dans l'organisation
export function useOrganizationRole() {
  const {user} = useAuth()
  const {currentUserOrganization} = useOrganization()

  // Vérifier si l'utilisateur est propriétaire de l'organisation actuelle
  const isOwner =
    currentUserOrganization?.role === UserOrganizationRoleConst.OWNER

  return {
    isOwner,
  }
}

// Provider du contexte d'organisation
interface OrganizationProviderProps {
  children: React.ReactNode
  referenceId?: string | null
  currentUserOrganization?: OrganizationContextType['currentUserOrganization']
}

export default function OrganizationProvider({
  children,
  referenceId = null,
  currentUserOrganization = null,
}: OrganizationProviderProps) {
  const value: OrganizationContextType = {
    referenceId,
    currentUserOrganization,
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}
