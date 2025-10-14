import '@testing-library/jest-dom/vitest'

import {beforeAll, vi} from 'vitest'

// Configuration des variables d'environnement pour les tests
/* eslint-disable no-restricted-properties */
// Variables serveur
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing-purposes-only'
process.env.BETTER_AUTH_URL = 'http://localhost:3000'
process.env.BETTER_AUTH_TRUSTED_ORIGINS = 'http://localhost:3000'
process.env.RESEND_API_KEY = 'test-resend-key'
process.env.EMAIL_FROM = 'test@example.com'
process.env.EMAIL_TO = 'test@example.com'
process.env.LOG_LEVEL = 'info'
process.env.SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_BUCKET = 'test-bucket'
process.env.ALLOWED_MIME_TYPES = 'image/jpeg,image/png,image/gif'
process.env.STORAGE_TYPE = 'supabase'
process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123456789'

// Variables client
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_MAX_FILE_SIZE = '5242880'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789'
process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_TYPE = 'EmbededForm'
process.env.NEXT_PUBLIC_BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION = 'true'
process.env.NEXT_PUBLIC_BETTER_AUTH_2FA_SKIP_VERIFICATION_ON_ENABLE = 'true'
process.env.NEXT_PUBLIC_BETTER_AUTH_2FA_ENABLE = 'true'
process.env.NEXT_PUBLIC_BETTER_AUTH_TOKEN_MANAGEMENT = 'true'
process.env.NEXT_PUBLIC_BETTER_AUTH_CHANGE_PASSWORD = 'true'
process.env.NEXT_PUBLIC_BETTER_AUTH_CHANGE_EMAIL = 'true'
process.env.NEXT_PUBLIC_BILLING_MODE = 'organization'
process.env.NEXT_PUBLIC_AUTH_METHODS = 'credential,magiclink'
/* eslint-enable no-restricted-properties */

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  })
})
