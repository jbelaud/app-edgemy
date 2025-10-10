import {vi} from 'vitest'

// Mock le module db
vi.mock('@/db/models/db', () => ({
  default: {},
}))

vi.mock('../authentication/auth-service', () => ({
  getAuthUser: vi.fn(),
  getSessionAuth: vi.fn(),
  getSessionReferenceId: vi.fn(),
  getActiveSubscriptions: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/db/repositories/user-repository', () => ({
  getUserByIdDao: vi.fn(() => Promise.resolve()),
}))

// Mock server-only pour éviter les erreurs lors des tests
vi.mock('server-only', () => ({}))

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

// Mock des variables d'environnement
vi.mock('@/env', () => ({
  env: {
    NODE_ENV: 'test',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    BETTER_AUTH_SECRET: 'test-secret-key-minimum-32-characters-long',
    BETTER_AUTH_URL: 'http://localhost:3000',
    STRIPE_SECRET_KEY: 'sk_test_mock_key',
    STRIPE_WEBHOOK_SECRET: 'whsec_mock_secret',
    RESEND_API_KEY: 're_test_mock_key',
  },
}))

// Mock Stripe
vi.mock('@/lib/stripe/stripe-client', () => ({
  stripeClient: {
    customers: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
    subscriptions: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
  },
  stripe: {
    customers: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
    subscriptions: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
  },
}))
