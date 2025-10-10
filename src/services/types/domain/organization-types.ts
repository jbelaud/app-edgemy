export type OrganizationRole = 'owner' | 'admin' | 'member'

export const OrganizationRoleConst = {
  OWNER: 'owner' as OrganizationRole,
  ADMIN: 'admin' as OrganizationRole,
  MEMBER: 'member' as OrganizationRole,
} as const

export interface CreateOrganization {
  name: string
  slug: string
  description?: string | null
  logo?: string | null
}

export interface UpdateOrganization {
  id: string
  name?: string
  slug?: string
  description?: string | null
  logo?: string | null
}

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string | null
  logo?: string | null
  createdAt: Date
  updatedAt: Date
}
