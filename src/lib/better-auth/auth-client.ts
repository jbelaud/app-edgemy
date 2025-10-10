import {stripeClient} from '@better-auth/stripe/client'
import {
  adminClient,
  apiKeyClient,
  magicLinkClient,
  organizationClient,
  twoFactorClient,
} from 'better-auth/client/plugins'
import {createAuthClient} from 'better-auth/react'

import {env} from '@/env'

export const AuthClientAppConfig = {
  requireEmailVerification:
    env.NEXT_PUBLIC_BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION,
  skipVerificationOnEnable:
    env.NEXT_PUBLIC_BETTER_AUTH_2FA_SKIP_VERIFICATION_ON_ENABLE,
  enable2FA: env.NEXT_PUBLIC_BETTER_AUTH_2FA_ENABLE,
  enableTokenManagement: env.NEXT_PUBLIC_BETTER_AUTH_TOKEN_MANAGEMENT,
  changePassword: env.NEXT_PUBLIC_BETTER_AUTH_CHANGE_PASSWORD,
  changeEmail: env.NEXT_PUBLIC_BETTER_AUTH_CHANGE_EMAIL,
} as const

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient(),
    organizationClient(),
    magicLinkClient(),
    twoFactorClient(),
    apiKeyClient(),
    stripeClient({
      subscription: true, //if you want to enable subscription management
    }),
  ],
})
