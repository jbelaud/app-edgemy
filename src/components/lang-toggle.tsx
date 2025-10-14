'use client'

import {useParams} from 'next/navigation'
import {useTranslations} from 'next-intl'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {usePathname, useRouter} from '@/i18n/navigation'
import {routing} from '@/i18n/routing'

// Composant drapeau simple SVG
const FlagIcon = ({country}: {country: string}) => {
  const colors = {
    FR: {primary: '#002654', secondary: '#ED2939', accent: '#FFFFFF'},
    EN: {primary: '#012169', secondary: '#012169', accent: '#C8102E'},
    ES: {primary: '#AA151B', secondary: '#F1BF00', accent: '#AA151B'},
  }

  const color = colors[country as keyof typeof colors] || colors.FR

  return (
    <span className="inline-flex items-center justify-center">
      <svg viewBox="0 0 24 18" className="h-4 w-5">
        <rect width="24" height="18" fill={color.primary} />
        {country === 'FR' && (
          <>
            <rect width="8" height="18" x="0" fill="#002654" />
            <rect width="8" height="18" x="8" fill="#FFFFFF" />
            <rect width="8" height="18" x="16" fill="#ED2939" />
          </>
        )}
        {country === 'EN' && (
          <>
            <rect width="24" height="18" fill="#012169" />
            <path d="M0 0L24 18M24 0L0 18" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M12 0V18M0 9H24" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M12 0V18M0 9H24" stroke="#C8102E" strokeWidth="1" />
            <path d="M0 0L24 18M24 0L0 18" stroke="#C8102E" strokeWidth="1" />
          </>
        )}
        {country === 'ES' && (
          <>
            <rect width="24" height="6" y="0" fill="#AA151B" />
            <rect width="24" height="6" y="6" fill="#F1BF00" />
            <rect width="24" height="6" y="12" fill="#AA151B" />
          </>
        )}
      </svg>
    </span>
  )
}

// Mapping des locales aux drapeaux et initiales
const localeConfig = {
  fr: {flag: 'FR', initials: 'FR'},
  en: {flag: 'EN', initials: 'EN'},
  es: {flag: 'ES', initials: 'ES'},
} as const

export function LangToggle() {
  const t = useTranslations('LangToggle')
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = params.locale as string

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale})
  }

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[85px]" aria-label={t('label')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            <span className="flex items-center gap-2">
              <FlagIcon
                country={
                  localeConfig[locale as keyof typeof localeConfig]?.flag
                }
              />
              <span className="text-sm leading-none font-semibold">
                {localeConfig[locale as keyof typeof localeConfig]?.initials}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
