import {beforeEach, describe, expect, it, vi} from 'vitest'

// Mock des repositories
vi.mock('@/db/repositories/coach-repository', () => ({
  createCoachProfileDao: vi.fn(),
  getCoachProfileByIdDao: vi.fn(),
  getCoachProfileByUserIdDao: vi.fn(),
  hasCoachProfileDao: vi.fn(),
  updateCoachProfileDao: vi.fn(),
}))

vi.mock('@/db/repositories/user-repository', () => ({
  getUserByIdDao: vi.fn(),
}))

vi.mock('../authentication/auth-service', () => ({
  getAuthUser: vi.fn(),
}))

import * as coachRepository from '@/db/repositories/coach-repository'

import {getAuthUser} from '../authentication/auth-service'
import {
  createCoachProfileService,
  getCoachProfileByIdService,
  getCoachProfileByUserIdService,
  hasCoachProfileService,
  updateCoachProfileService,
} from '../coach-service'
import {AuthorizationError} from '../errors/authorization-error'
import {ValidationError} from '../errors/validation-error'
import {RoleConst} from '../types/domain/auth-types'
import {CoachProfile} from '../types/domain/coach-types'
import {User} from '../types/domain/user-types'

const coachUserId = 'ae760f8e-4aa6-4d71-a4c8-344429b7ae21'
const userUserId = 'de760f8e-4aa6-4d71-a4c8-344429b7ae28'
const adminUserId = 'fe760f8e-4aa6-4d71-a4c8-344429b7ae29'

const coachUser: User = {
  id: coachUserId,
  name: 'Coach Test',
  email: 'coach@test.com',
  emailVerified: true,
  image: null,
  role: RoleConst.COACH,
  visibility: 'private',
  banned: null,
  banReason: null,
  banExpires: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  stripeCustomerId: null,
  twoFactorEnabled: null,
}

const standardUser: User = {
  id: userUserId,
  name: 'User Test',
  email: 'user@test.com',
  emailVerified: true,
  image: null,
  role: RoleConst.USER,
  visibility: 'private',
  banned: null,
  banReason: null,
  banExpires: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  stripeCustomerId: null,
  twoFactorEnabled: null,
}

const adminUser: User = {
  id: adminUserId,
  name: 'Admin Test',
  email: 'admin@test.com',
  emailVerified: true,
  image: null,
  role: RoleConst.ADMIN,
  visibility: 'private',
  banned: null,
  banReason: null,
  banExpires: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  stripeCustomerId: null,
  twoFactorEnabled: null,
}

const mockCoachProfile: CoachProfile = {
  id: 'profile-123',
  userId: coachUserId,
  bio: 'Coach professionnel MTT',
  experience: '5 ans',
  formats: ['MTT', 'CASH_GAME'],
  abi: '50-200€',
  languages: ['FR', 'EN'],
  achievements: 'Top 10 Winamax',
  hourlyRate: '75.00',
  coachingTypes: ['SESSION_1H', 'PACK_5H'],
  visibility: true,
  isVerified: false,
  ratingAvg: '0',
  ratingCount: 0,
  totalSessions: 0,
  subscriptionPlan: null,
  subscriptionExpiresAt: null,
  metadata: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('[createCoachProfileService]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('[COACH] devrait créer un profil coach pour un utilisateur avec le rôle COACH', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(coachUser)
    vi.mocked(coachRepository.hasCoachProfileDao).mockResolvedValue(false)
    vi.mocked(coachRepository.createCoachProfileDao).mockResolvedValue(
      mockCoachProfile
    )
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue(
      mockCoachProfile
    )

    const result = await createCoachProfileService({
      userId: coachUserId,
      bio: 'Coach professionnel MTT',
      hourlyRate: '75.00',
    })

    expect(result).toEqual(mockCoachProfile)
    expect(coachRepository.createCoachProfileDao).toHaveBeenCalledTimes(1)
  })

  it("[USER] devrait lever une erreur si l'utilisateur n'a pas le rôle COACH", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(standardUser)

    await expect(
      createCoachProfileService({
        userId: userUserId,
        bio: 'Test',
        hourlyRate: '50.00',
      })
    ).rejects.toThrow(AuthorizationError)
  })

  it("[COACH] devrait lever une erreur si l'utilisateur tente de créer un profil pour un autre utilisateur", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(coachUser)

    await expect(
      createCoachProfileService({
        userId: 'autre-user-id',
        bio: 'Test',
        hourlyRate: '50.00',
      })
    ).rejects.toThrow(AuthorizationError)
  })

  it('[COACH] devrait lever une erreur si un profil coach existe déjà', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(coachUser)
    vi.mocked(coachRepository.hasCoachProfileDao).mockResolvedValue(true)

    await expect(
      createCoachProfileService({
        userId: coachUserId,
        bio: 'Test',
        hourlyRate: '50.00',
      })
    ).rejects.toThrow(ValidationError)
  })

  it("[NON_CONNECTE] devrait lever une erreur si l'utilisateur n'est pas connecté", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(undefined)

    await expect(
      createCoachProfileService({
        userId: coachUserId,
        bio: 'Test',
        hourlyRate: '50.00',
      })
    ).rejects.toThrow(AuthorizationError)
  })
})

describe('[getCoachProfileByIdService]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('[PUBLIC] devrait retourner un profil coach visible publiquement', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(undefined)
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue(
      mockCoachProfile
    )

    const result = await getCoachProfileByIdService('profile-123')

    expect(result).toEqual(mockCoachProfile)
  })

  it('[PUBLIC] devrait lever une erreur pour un profil invisible sans authentification', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(undefined)
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue({
      ...mockCoachProfile,
      visibility: false,
    })

    await expect(getCoachProfileByIdService('profile-123')).rejects.toThrow(
      AuthorizationError
    )
  })

  it('[OWNER] devrait permettre au propriétaire de voir son profil invisible', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(coachUser)
    const invisibleProfile = {...mockCoachProfile, visibility: false}
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue(
      invisibleProfile
    )

    const result = await getCoachProfileByIdService('profile-123')

    expect(result).toEqual(invisibleProfile)
  })

  it('[ADMIN] devrait permettre à un admin de voir un profil invisible', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(adminUser)
    const invisibleProfile = {...mockCoachProfile, visibility: false}
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue(
      invisibleProfile
    )

    const result = await getCoachProfileByIdService('profile-123')

    expect(result).toEqual(invisibleProfile)
  })

  it("devrait retourner undefined si le profil n'existe pas", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(undefined)
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue(
      undefined
    )

    const result = await getCoachProfileByIdService('non-existent')

    expect(result).toBeUndefined()
  })
})

describe('[getCoachProfileByUserIdService]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('[PUBLIC] devrait retourner un profil coach visible par userId', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(undefined)
    vi.mocked(coachRepository.getCoachProfileByUserIdDao).mockResolvedValue(
      mockCoachProfile
    )

    const result = await getCoachProfileByUserIdService(coachUserId)

    expect(result).toEqual(mockCoachProfile)
  })

  it('[OWNER] devrait permettre au propriétaire de voir son profil par userId', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(coachUser)
    const invisibleProfile = {...mockCoachProfile, visibility: false}
    vi.mocked(coachRepository.getCoachProfileByUserIdDao).mockResolvedValue(
      invisibleProfile
    )

    const result = await getCoachProfileByUserIdService(coachUserId)

    expect(result).toEqual(invisibleProfile)
  })
})

describe('[updateCoachProfileService]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('[OWNER] devrait permettre au propriétaire de mettre à jour son profil', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(coachUser)
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue(
      mockCoachProfile
    )
    vi.mocked(coachRepository.updateCoachProfileDao).mockResolvedValue()

    await updateCoachProfileService({
      id: 'profile-123',
      bio: 'Nouvelle bio',
    })

    expect(coachRepository.updateCoachProfileDao).toHaveBeenCalledWith(
      'profile-123',
      {id: 'profile-123', bio: 'Nouvelle bio'}
    )
  })

  it('[ADMIN] devrait permettre à un admin de mettre à jour un profil', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(adminUser)
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue(
      mockCoachProfile
    )
    vi.mocked(coachRepository.updateCoachProfileDao).mockResolvedValue()

    await updateCoachProfileService({
      id: 'profile-123',
      isVerified: true,
    })

    expect(coachRepository.updateCoachProfileDao).toHaveBeenCalledTimes(1)
  })

  it('[USER] devrait lever une erreur si un utilisateur tente de modifier un profil coach', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(standardUser)
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue(
      mockCoachProfile
    )

    await expect(
      updateCoachProfileService({
        id: 'profile-123',
        bio: 'Tentative de modification',
      })
    ).rejects.toThrow(AuthorizationError)
  })

  it("devrait lever une erreur si le profil n'existe pas", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(coachUser)
    vi.mocked(coachRepository.getCoachProfileByIdDao).mockResolvedValue(
      undefined
    )

    await expect(
      updateCoachProfileService({
        id: 'non-existent',
        bio: 'Test',
      })
    ).rejects.toThrow(ValidationError)
  })

  it("[NON_CONNECTE] devrait lever une erreur si l'utilisateur n'est pas connecté", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(undefined)

    await expect(
      updateCoachProfileService({
        id: 'profile-123',
        bio: 'Test',
      })
    ).rejects.toThrow(AuthorizationError)
  })
})

describe('[hasCoachProfileService]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("devrait retourner true si l'utilisateur a un profil coach", async () => {
    vi.mocked(coachRepository.hasCoachProfileDao).mockResolvedValue(true)

    const result = await hasCoachProfileService(coachUserId)

    expect(result).toBe(true)
  })

  it("devrait retourner false si l'utilisateur n'a pas de profil coach", async () => {
    vi.mocked(coachRepository.hasCoachProfileDao).mockResolvedValue(false)

    const result = await hasCoachProfileService(userUserId)

    expect(result).toBe(false)
  })
})
