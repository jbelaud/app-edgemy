import {eq} from 'drizzle-orm'

import {organization} from '@/db/models/auth-model'
import db from '@/db/models/db'
import {OrganizationModel} from '@/db/models/organization-model'

/**
 * Génère un slug unique basé sur un nom de base
 */
export const generateUniqueSlug = async (baseName: string): Promise<string> => {
  const baseSlug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let slug = baseSlug
  let counter = 1

  // Vérifier si le slug existe déjà
  while (true) {
    const existing = await db.query.organization.findFirst({
      where: eq(organization.slug, slug),
    })

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

/**
 * Récupère une organisation par ID
 */
export const getOrganizationByIdDao = async (
  id: string
): Promise<OrganizationModel | undefined> => {
  return await db.query.organization.findFirst({
    where: eq(organization.id, id),
  })
}

/**
 * Récupère une organisation par slug
 */
export const getOrganizationBySlugDao = async (
  slug: string
): Promise<OrganizationModel | undefined> => {
  return await db.query.organization.findFirst({
    where: eq(organization.slug, slug),
  })
}

/**
 * Crée une nouvelle organisation
 */
export const createOrganizationDao = async (
  data: Omit<OrganizationModel, 'id' | 'createdAt' | 'updatedAt'>
): Promise<OrganizationModel> => {
  const [newOrg] = await db
    .insert(organization)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description,
      logo: data.logo,
    })
    .returning()

  return newOrg
}

/**
 * Met à jour une organisation
 */
export const updateOrganizationDao = async (
  id: string,
  data: Partial<Omit<OrganizationModel, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<OrganizationModel | undefined> => {
  const [updated] = await db
    .update(organization)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(organization.id, id))
    .returning()

  return updated
}

/**
 * Supprime une organisation
 */
export const deleteOrganizationDao = async (id: string): Promise<void> => {
  await db.delete(organization).where(eq(organization.id, id))
}
