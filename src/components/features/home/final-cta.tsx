'use client'

import {motion} from 'framer-motion'
import {useTranslations} from 'next-intl'

import {Button} from '@/components/ui/button'

export default function FinalCTA() {
  const t = useTranslations('HomePage.finalCta')

  return (
    <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-16 sm:px-6 md:px-8 lg:py-24 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{opacity: 0, scale: 0.95}}
          whileInView={{opacity: 1, scale: 1}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
        >
          <motion.h2
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, delay: 0.1}}
            className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            {t('title')}
          </motion.h2>

          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, delay: 0.2}}
            className="text-muted-foreground mb-8 text-lg sm:text-xl"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, delay: 0.3}}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" className="text-lg">
              {t('ctaPlayer')} 🎯
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              {t('ctaCoach')} 🧑‍🏫
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true}}
            transition={{duration: 0.6, delay: 0.4}}
            className="text-muted-foreground mt-12 flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>{t('features.free')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>{t('features.secure')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>{t('features.noCard')}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
