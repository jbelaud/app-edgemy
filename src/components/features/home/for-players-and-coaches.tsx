'use client'

import {motion} from 'framer-motion'
import {
  Calendar,
  ChartBar,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {useState} from 'react'

import {Button} from '@/components/ui/button'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

const playerFeatures = [
  {
    icon: Target,
    key: 'customCoaching',
  },
  {
    icon: Calendar,
    key: 'bookSessions',
  },
  {
    icon: ChartBar,
    key: 'trackProgress',
  },
]

const coachFeatures = [
  {
    icon: Sparkles,
    key: 'createProfile',
  },
  {
    icon: Users,
    key: 'manageSchedule',
  },
  {
    icon: TrendingUp,
    key: 'proEnvironment',
  },
]

export default function ForPlayersAndCoaches() {
  const t = useTranslations('HomePage.forPlayersAndCoaches')
  const [activeTab, setActiveTab] = useState('players')

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

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mx-auto max-w-5xl"
        >
          <TabsList className="mb-12 grid w-full grid-cols-2">
            <TabsTrigger value="players" className="text-base">
              🧑‍🎓 {t('tabs.players')}
            </TabsTrigger>
            <TabsTrigger value="coaches" className="text-base">
              🧑‍🏫 {t('tabs.coaches')}
            </TabsTrigger>
          </TabsList>

          {/* Players Tab */}
          <TabsContent value="players">
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5}}
              className="bg-card border-border rounded-2xl border p-8 shadow-lg md:p-12"
            >
              <h3 className="mb-6 text-2xl font-bold md:text-3xl">
                {t('players.title')}
              </h3>

              <div className="mb-8 space-y-6">
                {playerFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.key}
                      initial={{opacity: 0, x: -20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{duration: 0.5, delay: index * 0.1}}
                      className="flex items-start gap-4"
                    >
                      <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                        <Icon className="text-primary h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold">
                          {t(`players.features.${feature.key}.title`)}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {t(`players.features.${feature.key}.description`)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <Button size="lg" className="w-full sm:w-auto">
                {t('players.cta')}
              </Button>
            </motion.div>
          </TabsContent>

          {/* Coaches Tab */}
          <TabsContent value="coaches">
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5}}
              className="bg-card border-border rounded-2xl border p-8 shadow-lg md:p-12"
            >
              <h3 className="mb-6 text-2xl font-bold md:text-3xl">
                {t('coaches.title')}
              </h3>

              <div className="mb-8 space-y-6">
                {coachFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.key}
                      initial={{opacity: 0, x: -20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{duration: 0.5, delay: index * 0.1}}
                      className="flex items-start gap-4"
                    >
                      <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                        <Icon className="text-primary h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold">
                          {t(`coaches.features.${feature.key}.title`)}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {t(`coaches.features.${feature.key}.description`)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <Button size="lg" className="w-full sm:w-auto">
                {t('coaches.cta')}
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
