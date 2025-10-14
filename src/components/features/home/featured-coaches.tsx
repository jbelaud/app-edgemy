'use client'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import {motion} from 'framer-motion'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import Image from 'next/image'
import {useTranslations} from 'next-intl'
import {useState} from 'react'
import type {Swiper as SwiperType} from 'swiper'
import {Autoplay, Navigation, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'

import {Button} from '@/components/ui/button'

const coaches = [
  {
    id: 1,
    name: 'AlexMindset',
    format: 'MTT & Mental Game',
    bio: "Coach depuis 5 ans, spécialisé dans l'approche mindset et performance.",
    earnings: '+80k€ de gains',
    image: '/images/coaches/alexmindset.jpg',
  },
  {
    id: 2,
    name: 'LudoGrind',
    format: 'Cash Game',
    bio: 'Expert en GTO et adaptation exploitante en micro et mid stakes.',
    earnings: '+120k€ de gains',
    image: '/images/coaches/ludogrind.jpg',
  },
  {
    id: 3,
    name: 'MarieMTT',
    format: 'MTT High Stakes',
    bio: 'Coach top 1% des tournois online, pédagogie claire et structurée.',
    earnings: '+250k€ de gains',
    image: '/images/coaches/mariemtt.jpg',
  },
  {
    id: 4,
    name: 'PaulCash',
    format: 'Cash Game NL500+',
    bio: 'Spécialiste des hautes limites avec une approche exploitante.',
    earnings: '+300k€ de gains',
    image: '/images/coaches/paulcash.jpg',
  },
]

export default function FeaturedCoaches() {
  const t = useTranslations('HomePage.featuredCoaches')
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)

  return (
    <section className="bg-muted/50 px-4 py-16 sm:px-6 md:px-8 lg:py-24">
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

        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={() => swiperInstance?.slidePrev()}
            className="bg-background/80 hover:bg-background absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 disabled:opacity-50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => swiperInstance?.slideNext()}
            className="bg-background/80 hover:bg-background absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 disabled:opacity-50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            onSwiper={setSwiperInstance}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-primary',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="!pb-12"
          >
            {coaches.map((coach, index) => (
              <SwiperSlide key={coach.id}>
                <motion.div
                  initial={{opacity: 0, y: 30}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{duration: 0.6, delay: index * 0.1}}
                  whileHover={{y: -8}}
                  className="group h-full"
                >
                  <div className="bg-card border-border flex h-full flex-col overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl">
                    {/* Coach image */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                      <div className="flex h-full items-center justify-center">
                        <div className="bg-primary/10 flex h-32 w-32 items-center justify-center rounded-full">
                          <span className="text-primary text-5xl font-bold">
                            {coach.name[0]}
                          </span>
                        </div>
                      </div>
                      {/* Earnings badge */}
                      <div className="absolute top-4 right-4 rounded-full bg-green-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        {coach.earnings}
                      </div>
                    </div>

                    {/* Coach info */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-2 text-xl font-bold">{coach.name}</h3>
                      <p className="text-primary mb-3 text-sm font-semibold">
                        {coach.format}
                      </p>
                      <p className="text-muted-foreground mb-6 flex-1 text-sm">
                        {coach.bio}
                      </p>
                      <Button
                        variant="outline"
                        className="group-hover:bg-primary group-hover:text-primary-foreground w-full transition-colors"
                      >
                        {t('viewProfile')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
