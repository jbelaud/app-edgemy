'use client'

import {motion} from 'framer-motion'
import {Calendar, Search, TrendingUp} from 'lucide-react'
import {useTranslations} from 'next-intl'

const steps = [
  {
    icon: Search,
    key: 'findCoach',
  },
  {
    icon: Calendar,
    key: 'bookSession',
  },
  {
    icon: TrendingUp,
    key: 'trackProgress',
  },
]

export default function HowItWorks() {
  const t = useTranslations('HomePage.howItWorks')

  return (
    <section className="bg-background px-4 py-16 sm:px-6 md:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            {t('title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.key}
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, delay: index * 0.2}}
                className="group relative"
              >
                <div className="bg-card border-border hover:border-primary flex flex-col items-center rounded-2xl border p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg">
                  {/* Step number */}
                  <div className="bg-primary/10 text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="bg-primary/5 group-hover:bg-primary/10 mb-6 rounded-full p-4 transition-colors">
                    <Icon className="text-primary h-10 w-10" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold">
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(`steps.${step.key}.description`)}
                  </p>
                </div>

                {/* Connector line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 left-full hidden h-0.5 w-full -translate-y-1/2 md:block">
                    <div className="bg-border h-full w-full" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
