'use client'

import {motion} from 'framer-motion'
import Image from 'next/image'
import {useTranslations} from 'next-intl'

import {Button} from '@/components/ui/button'

export default function HeroSection() {
  const t = useTranslations('HomePage.hero')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-20 sm:px-6 md:px-8 lg:py-32">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.1}}
              className="mb-6 text-4xl leading-tight font-bold text-white sm:text-5xl md:text-6xl"
            >
              {t('title')}
            </motion.h1>

            <motion.p
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.2}}
              className="mb-8 text-lg text-purple-100 sm:text-xl"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.3}}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-purple-600 text-lg hover:bg-purple-700"
              >
                {t('ctaPlayer')} 🎯
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-400 text-lg text-white hover:bg-purple-800/50"
              >
                {t('ctaCoach')} 🧑‍🏫
              </Button>
            </motion.div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.8, delay: 0.2}}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/50 to-slate-900/50 shadow-2xl">
              <Image
                src="/images/product-2.avif"
                alt="Edgemy Platform"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating card effect */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
              className="absolute -right-4 -bottom-4 rounded-lg border border-purple-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-sm"
            >
              <p className="text-sm font-semibold text-purple-300">
                +500 sessions
              </p>
              <p className="text-xs text-purple-200">ce mois-ci</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
