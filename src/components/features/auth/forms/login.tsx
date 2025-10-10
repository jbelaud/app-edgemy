'use client'
import {Mail} from 'lucide-react'
import Link from 'next/link'
import {useTranslations} from 'next-intl'
import React, {useState} from 'react'
import {toast} from 'sonner'

import {loginProviderAction} from '@/app/[locale]/(auth)/action'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {env} from '@/env'
import {cn} from '@/lib/utils'

import {CredentialForm} from './credential-form'
import {MagicLinkForm} from './magic-link-form'

export function LoginForm({className, ...props}: React.ComponentProps<'div'>) {
  const t = useTranslations('Auth.LoginForm')
  const tMessages = useTranslations('Auth.messages')

  const authMethods = env.NEXT_PUBLIC_AUTH_METHODS
  const hasCredential = authMethods.includes('credential')
  const hasMagicLink = authMethods.includes('magiclink')
  const hasGoogle = authMethods.includes('google')
  const hasApple = authMethods.includes('apple')
  const hasGithub = authMethods.includes('github')

  const [isMagicLink, setIsMagicLink] = useState(false)
  const [isLoadingProvider, setIsLoadingProvider] = useState<string | null>(
    null
  )

  const handleProviderLogin = async (
    provider: 'google' | 'apple' | 'github'
  ) => {
    setIsLoadingProvider(provider)
    try {
      const result = await loginProviderAction(provider)

      if (result.success) {
        toast(tMessages('success'), {
          description: result.message,
        })
      } else {
        toast(tMessages('error'), {
          description: result.message || tMessages('loginError'),
        })
      }
    } catch (error) {
      console.error(`Erreur lors de la connexion ${provider}:`, error)
      toast(tMessages('error'), {
        description: tMessages('providerError', {provider}),
      })
    } finally {
      setIsLoadingProvider(null)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('welcome')}</CardTitle>
          <CardDescription>
            {isMagicLink ? t('descriptionMagicLink') : t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4">
            {!isMagicLink && hasApple && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleProviderLogin('apple')}
                disabled={isLoadingProvider === 'apple'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor"
                  />
                </svg>
                {isLoadingProvider === 'apple'
                  ? t('loading.apple')
                  : t('providers.apple')}
              </Button>
            )}

            {!isMagicLink && hasGoogle && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleProviderLogin('google')}
                disabled={isLoadingProvider === 'google'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                {isLoadingProvider === 'google'
                  ? t('loading.google')
                  : t('providers.google')}
              </Button>
            )}

            {!isMagicLink && hasGithub && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleProviderLogin('github')}
                disabled={isLoadingProvider === 'github'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    fill="currentColor"
                  />
                </svg>
                {isLoadingProvider === 'github'
                  ? t('loading.github')
                  : t('providers.github')}
              </Button>
            )}

            {!isMagicLink && hasMagicLink && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsMagicLink(true)}
              >
                <Mail className="mr-2 h-4 w-4" />
                {t('providers.magicLink')}
              </Button>
            )}
          </div>

          {isMagicLink ? (
            <div>
              <MagicLinkForm />
              {(hasCredential || hasGoogle || hasApple || hasGithub) && (
                <div className="mt-4 text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    onClick={() => setIsMagicLink(false)}
                  >
                    {hasCredential ? t('backToClassic') : t('backToOptions')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            hasCredential && <CredentialForm />
          )}
        </CardContent>
      </Card>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-muted-foreground *:[a]:hover:text-primary text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          {t('terms')} <Link href="/terms">{t('termsLink')}</Link> {t('and')}{' '}
          <Link href="/privacy">{t('privacyLink')}</Link>.
        </div>
      </div>
    </div>
  )
}
