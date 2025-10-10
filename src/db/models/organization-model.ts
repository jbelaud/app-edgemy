import {organization} from './auth-model'

export type OrganizationRoleEnumModel = 'owner' | 'admin' | 'member'

export type OrganizationModel = typeof organization.$inferSelect
export type AddOrganizationModel = typeof organization.$inferInsert
export type UpdateOrganizationModel = Partial<AddOrganizationModel> & {
  id: string
}
