'use client'

import {motion} from 'framer-motion'
import {Quote} from 'lucide-react'
import {useTranslations} from 'next-intl'

const testimonials = [
  {
    key: 'julien',
    name: 'Julien P.',
    role: 'Joueur MTT',
  },
  {
    key: 'sarah',
    name: 'Coach Sarah G.',
    role: 'Coach mindset',
  },
  {
    key: 'louis',
    name: 'Louis C.',
    role: 'Joueur cash game',
  },
]

export default function Testimonials() {
  const t = useTranslations('HomePage.testimonials')

  return (
    <section className="bg-muted/30 px-4 py-16 sm:px-6 md:px-8 lg:py-24">
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.key}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, delay: index * 0.1}}
              whileHover={{y: -8, scale: 1.02}}
              className="group"
            >
              <div className="bg-card border-border flex h-full flex-col rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                {/* Quote icon */}
                <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full">
                  <Quote className="text-primary h-6 w-6" />
                </div>

                {/* Testimonial text */}
                <p className="text-foreground mb-6 flex-1 text-base leading-relaxed">
                  &ldquo;{t(`items.${testimonial.key}.text`)}&rdquo;
                </p>

                {/* Author info */}
                <div className="border-border flex items-center gap-4 border-t pt-4">
                  <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
                    <span className="text-primary text-lg font-bold">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
