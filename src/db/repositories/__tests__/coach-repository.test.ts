import {beforeEach, describe, expect, it} from 'vitest'

import {user} from '@/db/models/auth-model'
import db from '@/db/models/db'
import {coachProfile} from '@/db/models/edgemy-model'

import {
  createCoachProfileDao,
  deleteCoachProfileDao,
  getAllCoachProfilesWithPaginationDao,
  getCoachProfileByIdDao,
  getCoachProfileByUserIdDao,
  hasCoachProfileDao,
  searchCoachProfilesDao,
  updateCoachProfileDao,
  updateCoachProfileStatsDao,
} from '../coach-repository'

// TODO: Configurer une base de données de test Neon pour les tests d'intégration
// Pour activer ces tests :
// 1. Créer une branche de test sur Neon ou utiliser une base de données de test
// 2. Ajouter TEST_DATABASE_URL dans .env.test
// 3. Modifier setup-test.ts pour utiliser TEST_DATABASE_URL
describe.skip('[CoachRepository] CRUD Operations', () => {
  let testUserId: string
  let testCoachProfileId: string

  beforeEach(async () => {
    // Nettoyer les données de test
    await db.delete(coachProfile)
    await db.delete(user)

    // Créer un utilisateur de test avec le rôle COACH
    const [testUser] = await db
      .insert(user)
      .values({
        name: 'Coach Test',
        email: 'coach@test.com',
        emailVerified: true,
        role: 'COACH',
      })
      .returning()

    testUserId = testUser.id
  })

  describe('[createCoachProfileDao]', () => {
    it('devrait créer un profil coach', async () => {
      const profile = await createCoachProfileDao({
        userId: testUserId,
        bio: 'Coach professionnel de poker MTT',
        experience: "5 ans d'expérience",
        formats: ['MTT', 'CASH_GAME'],
        abi: '50-200€',
        languages: ['FR', 'EN'],
        achievements: 'Top 10 Winamax Series',
        hourlyRate: '75.00',
        coachingTypes: ['SESSION_1H', 'PACK_5H'],
        visibility: true,
        isVerified: false,
      })

      expect(profile).toBeDefined()
      expect(profile.userId).toBe(testUserId)
      expect(profile.bio).toBe('Coach professionnel de poker MTT')
      expect(profile.formats).toEqual(['MTT', 'CASH_GAME'])
      expect(profile.hourlyRate).toBe('75.00')
      expect(profile.ratingAvg).toBe('0')
      expect(profile.ratingCount).toBe(0)
      expect(profile.totalSessions).toBe(0)

      testCoachProfileId = profile.id
    })

    it('devrait créer un profil coach avec valeurs par défaut', async () => {
      const profile = await createCoachProfileDao({
        userId: testUserId,
        hourlyRate: '50.00',
      })

      expect(profile).toBeDefined()
      expect(profile.visibility).toBe(true)
      expect(profile.isVerified).toBe(false)
      expect(profile.languages).toEqual(['FR'])
    })
  })

  describe('[getCoachProfileByIdDao]', () => {
    beforeEach(async () => {
      const profile = await createCoachProfileDao({
        userId: testUserId,
        bio: 'Test bio',
        hourlyRate: '60.00',
      })
      testCoachProfileId = profile.id
    })

    it('devrait récupérer un profil coach par ID avec relation user', async () => {
      const profile = await getCoachProfileByIdDao(testCoachProfileId)

      expect(profile).toBeDefined()
      expect(profile?.id).toBe(testCoachProfileId)
      expect(profile?.user).toBeDefined()
      expect(profile?.user?.email).toBe('coach@test.com')
    })

    it("devrait retourner undefined si le profil n'existe pas", async () => {
      const profile = await getCoachProfileByIdDao('non-existent-id')
      expect(profile).toBeUndefined()
    })
  })

  describe('[getCoachProfileByUserIdDao]', () => {
    beforeEach(async () => {
      await createCoachProfileDao({
        userId: testUserId,
        bio: 'Test bio',
        hourlyRate: '60.00',
      })
    })

    it('devrait récupérer un profil coach par userId', async () => {
      const profile = await getCoachProfileByUserIdDao(testUserId)

      expect(profile).toBeDefined()
      expect(profile?.userId).toBe(testUserId)
      expect(profile?.user).toBeDefined()
    })

    it("devrait retourner undefined si l'utilisateur n'a pas de profil coach", async () => {
      const profile = await getCoachProfileByUserIdDao('non-existent-user-id')
      expect(profile).toBeUndefined()
    })
  })

  describe('[updateCoachProfileDao]', () => {
    beforeEach(async () => {
      const profile = await createCoachProfileDao({
        userId: testUserId,
        bio: 'Bio initiale',
        hourlyRate: '60.00',
      })
      testCoachProfileId = profile.id
    })

    it('devrait mettre à jour un profil coach', async () => {
      await updateCoachProfileDao(testCoachProfileId, {
        bio: 'Bio mise à jour',
        hourlyRate: '80.00',
        isVerified: true,
      })

      const updatedProfile = await getCoachProfileByIdDao(testCoachProfileId)
      expect(updatedProfile?.bio).toBe('Bio mise à jour')
      expect(updatedProfile?.hourlyRate).toBe('80.00')
      expect(updatedProfile?.isVerified).toBe(true)
    })
  })

  describe('[deleteCoachProfileDao]', () => {
    beforeEach(async () => {
      const profile = await createCoachProfileDao({
        userId: testUserId,
        bio: 'Test bio',
        hourlyRate: '60.00',
      })
      testCoachProfileId = profile.id
    })

    it('devrait supprimer un profil coach', async () => {
      await deleteCoachProfileDao(testCoachProfileId)
      const deletedProfile = await getCoachProfileByIdDao(testCoachProfileId)
      expect(deletedProfile).toBeUndefined()
    })
  })

  describe('[getAllCoachProfilesWithPaginationDao]', () => {
    beforeEach(async () => {
      // Créer plusieurs profils coach
      for (let i = 0; i < 5; i++) {
        const [newUser] = await db
          .insert(user)
          .values({
            name: `Coach ${i}`,
            email: `coach${i}@test.com`,
            emailVerified: true,
            role: 'COACH',
          })
          .returning()

        await createCoachProfileDao({
          userId: newUser.id,
          bio: `Bio du coach ${i}`,
          hourlyRate: `${50 + i * 10}.00`,
        })
      }
    })

    it('devrait récupérer les profils avec pagination', async () => {
      const result = await getAllCoachProfilesWithPaginationDao({
        limit: 3,
        offset: 0,
      })

      expect(result.data).toHaveLength(3)
      expect(result.pagination.total).toBe(5)
      expect(result.pagination.page).toBe(1)
      expect(result.pagination.totalPages).toBe(2)
    })

    it('devrait récupérer la deuxième page', async () => {
      const result = await getAllCoachProfilesWithPaginationDao({
        limit: 3,
        offset: 3,
      })

      expect(result.data).toHaveLength(2)
      expect(result.pagination.page).toBe(2)
    })
  })

  describe('[searchCoachProfilesDao]', () => {
    beforeEach(async () => {
      // Coach MTT FR vérifié
      const [user1] = await db
        .insert(user)
        .values({
          name: 'Coach MTT',
          email: 'mtt@test.com',
          emailVerified: true,
          role: 'COACH',
        })
        .returning()

      await createCoachProfileDao({
        userId: user1.id,
        bio: 'Spécialiste MTT',
        formats: ['MTT'],
        languages: ['FR'],
        hourlyRate: '100.00',
        isVerified: true,
        visibility: true,
      })

      // Coach Cash Game EN non vérifié
      const [user2] = await db
        .insert(user)
        .values({
          name: 'Coach Cash',
          email: 'cash@test.com',
          emailVerified: true,
          role: 'COACH',
        })
        .returning()

      await createCoachProfileDao({
        userId: user2.id,
        bio: 'Spécialiste Cash Game',
        formats: ['CASH_GAME'],
        languages: ['EN'],
        hourlyRate: '60.00',
        isVerified: false,
        visibility: true,
      })

      // Coach invisible
      const [user3] = await db
        .insert(user)
        .values({
          name: 'Coach Invisible',
          email: 'invisible@test.com',
          emailVerified: true,
          role: 'COACH',
        })
        .returning()

      await createCoachProfileDao({
        userId: user3.id,
        bio: 'Coach invisible',
        formats: ['MTT'],
        hourlyRate: '50.00',
        visibility: false,
      })
    })

    it('devrait filtrer par format', async () => {
      const result = await searchCoachProfilesDao(
        {
          formats: ['MTT'],
        },
        {limit: 10, offset: 0}
      )

      expect(result.data).toHaveLength(1)
      expect(result.data[0].bio).toBe('Spécialiste MTT')
    })

    it('devrait filtrer par langue', async () => {
      const result = await searchCoachProfilesDao(
        {
          languages: ['EN'],
        },
        {limit: 10, offset: 0}
      )

      expect(result.data).toHaveLength(1)
      expect(result.data[0].bio).toBe('Spécialiste Cash Game')
    })

    it('devrait filtrer par tarif horaire', async () => {
      const result = await searchCoachProfilesDao(
        {
          minHourlyRate: 70,
          maxHourlyRate: 120,
        },
        {limit: 10, offset: 0}
      )

      expect(result.data).toHaveLength(1)
      expect(result.data[0].hourlyRate).toBe('100.00')
    })

    it('devrait filtrer par vérification', async () => {
      const result = await searchCoachProfilesDao(
        {
          isVerified: true,
        },
        {limit: 10, offset: 0}
      )

      expect(result.data).toHaveLength(1)
      expect(result.data[0].isVerified).toBe(true)
    })

    it('devrait exclure les profils invisibles par défaut', async () => {
      const result = await searchCoachProfilesDao({}, {limit: 10, offset: 0})

      expect(result.data).toHaveLength(2)
      expect(result.data.every((p) => p.visibility === true)).toBe(true)
    })

    it('devrait combiner plusieurs filtres', async () => {
      const result = await searchCoachProfilesDao(
        {
          formats: ['MTT'],
          languages: ['FR'],
          isVerified: true,
        },
        {limit: 10, offset: 0}
      )

      expect(result.data).toHaveLength(1)
      expect(result.data[0].bio).toBe('Spécialiste MTT')
    })
  })

  describe('[hasCoachProfileDao]', () => {
    it("devrait retourner true si l'utilisateur a un profil coach", async () => {
      await createCoachProfileDao({
        userId: testUserId,
        hourlyRate: '60.00',
      })

      const hasProfile = await hasCoachProfileDao(testUserId)
      expect(hasProfile).toBe(true)
    })

    it("devrait retourner false si l'utilisateur n'a pas de profil coach", async () => {
      const hasProfile = await hasCoachProfileDao('non-existent-user-id')
      expect(hasProfile).toBe(false)
    })
  })

  describe('[updateCoachProfileStatsDao]', () => {
    beforeEach(async () => {
      await createCoachProfileDao({
        userId: testUserId,
        bio: 'Test bio',
        hourlyRate: '60.00',
      })
    })

    it('devrait mettre à jour les statistiques du coach', async () => {
      await updateCoachProfileStatsDao(testUserId, {
        ratingAvg: '4.5',
        ratingCount: 10,
        totalSessions: 25,
      })

      const profile = await getCoachProfileByUserIdDao(testUserId)
      expect(profile?.ratingAvg).toBe('4.5')
      expect(profile?.ratingCount).toBe(10)
      expect(profile?.totalSessions).toBe(25)
    })
  })
})
