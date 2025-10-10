#!/usr/bin/env tsx

import * as p from '@clack/prompts'
import {randomBytes} from 'crypto'
import {existsSync} from 'fs'
import {readFile, writeFile} from 'fs/promises'

import {clientSchema, serverSchema} from '../src/env-schemas'

// Types pour l'architecture fonctionnelle
type EnvVariable = {
  name: string
  description: string
  required: boolean
  type: 'string' | 'number' | 'boolean' | 'url' | 'email'
  category: string
  autoGenerate?: boolean
  choices?: string[]
  example?: string
}

type EnvConfig = Record<string, string>

// Extraction des variables depuis les schémas importés
function parseEnvSchema(): EnvVariable[] {
  const variables: EnvVariable[] = []

  // Variables serveur
  for (const varName of Object.keys(serverSchema)) {
    variables.push({
      name: varName,
      description: getVariableDescription(varName),
      required: isVariableRequired(varName),
      type: getVariableType(varName),
      category: 'server',
      autoGenerate: false,
      choices: getVariableChoices(varName),
      example: getVariableExample(varName),
    })
  }

  // Variables client
  for (const varName of Object.keys(clientSchema)) {
    variables.push({
      name: varName,
      description: getVariableDescription(varName),
      required: isVariableRequired(varName),
      type: getVariableType(varName),
      category: 'client',
      autoGenerate: false,
      choices: getVariableChoices(varName),
      example: getVariableExample(varName),
    })
  }

  return variables
}

function isVariableRequired(varName: string): boolean {
  // Variables optionnelles
  const optionalVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
    'STORAGE_TYPE',
  ]
  return !optionalVars.includes(varName)
}

function getVariableDescription(varName: string): string {
  const descriptions: Record<string, string> = {
    DATABASE_URL: 'URL de connexion PostgreSQL',
    BETTER_AUTH_SECRET:
      'Secret pour Better Auth (généré automatiquement si vide)',
    BETTER_AUTH_URL: "URL de base de l'application",
    BETTER_AUTH_TRUSTED_ORIGINS: 'Origines de confiance pour Better Auth',
    RESEND_API_KEY: "Clé API Resend pour l'envoi d'emails",
    EMAIL_FROM: 'Adresse email expéditeur',
    EMAIL_TO: 'Adresse email destinataire par défaut',
    STRIPE_SECRET_KEY: 'Clé secrète Stripe',
    STRIPE_WEBHOOK_SECRET: 'Secret webhook Stripe',
    SUPABASE_URL: 'URL du projet Supabase',
    SUPABASE_ANON_KEY: 'Clé publique Supabase',
    SUPABASE_BUCKET: 'Nom du bucket Supabase',
    GOOGLE_CLIENT_ID: 'ID client Google OAuth',
    GOOGLE_CLIENT_SECRET: 'Secret client Google OAuth',
    NEXT_PUBLIC_ENABLED_PAGES: 'Pages activées (séparées par des virgules)',
    NEXT_PUBLIC_AUTH_METHODS: "Méthodes d'authentification disponibles",
    NEXT_PUBLIC_MAX_FILE_SIZE: 'Taille maximale des fichiers (bytes)',
    NEXT_PUBLIC_BILLING_MODE: 'Mode de facturation (organization/user)',
    NODE_ENV: 'Environnement Node.js (development/production/test)',
    LOG_LEVEL: 'Niveau de logging (debug/info/warn/error)',
    ALLOWED_MIME_TYPES: 'Types MIME autorisés (séparés par virgules)',
    STORAGE_TYPE: 'Type de stockage utilisé',
    CHAT_PROVIDER: 'Fournisseur de chat IA',
    OLLAMA_BASE_URL: 'URL de base pour Ollama',
    OPENAI_API_KEY: 'Clé API OpenAI',
    ANTHROPIC_API_KEY: 'Clé API Anthropic',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'Clé publique Stripe',
    NEXT_PUBLIC_STRIPE_CHECKOUT_TYPE: 'Type de checkout Stripe',
    NEXT_PUBLIC_BETTER_AUTH_CHANGE_PASSWORD: 'Activer changement mot de passe',
    NEXT_PUBLIC_BETTER_AUTH_CHANGE_EMAIL: 'Activer changement email',
    NEXT_PUBLIC_BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION:
      'Vérification email obligatoire',
    NEXT_PUBLIC_BETTER_AUTH_2FA_ENABLE: 'Activer 2FA',
    NEXT_PUBLIC_BETTER_AUTH_2FA_SKIP_VERIFICATION_ON_ENABLE:
      'Ignorer vérification lors activation 2FA',
    NEXT_PUBLIC_BETTER_AUTH_TOKEN_MANAGEMENT: 'Gestion des tokens',
    NEXT_PUBLIC_APP_URL: "URL publique de l'application",
    NEXT_PUBLIC_API_URL: "URL de l'API",
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'ID Google Analytics',
  }
  return descriptions[varName] || `Configuration pour ${varName}`
}

function getVariableType(varName: string): EnvVariable['type'] {
  if (varName.includes('URL')) return 'url'
  if (varName.includes('EMAIL')) return 'email'
  if (varName.includes('SIZE')) return 'number'
  return 'string'
}

function getVariableChoices(varName: string): string[] | undefined {
  const choices: Record<string, string[]> = {
    NEXT_PUBLIC_STRIPE_CHECKOUT_TYPE: [
      'EmbededForm',
      'ExternalForm',
      'ReactStripeForm',
      'PaymentLink',
    ],
    NEXT_PUBLIC_BILLING_MODE: ['organization', 'user'],
    LOG_LEVEL: ['info', 'debug', 'warn', 'error'],
    CHAT_PROVIDER: ['ollama', 'openai', 'anthropic'],
    STORAGE_TYPE: ['supabase', 'local'],
    NEXT_PUBLIC_BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION: ['true', 'false'],
    NEXT_PUBLIC_BETTER_AUTH_2FA_ENABLE: ['true', 'false'],
    NEXT_PUBLIC_BETTER_AUTH_2FA_SKIP_VERIFICATION_ON_ENABLE: ['true', 'false'],
    NEXT_PUBLIC_BETTER_AUTH_TOKEN_MANAGEMENT: ['true', 'false'],
    NEXT_PUBLIC_BETTER_AUTH_CHANGE_PASSWORD: ['true', 'false'],
    NEXT_PUBLIC_BETTER_AUTH_CHANGE_EMAIL: ['true', 'false'],
    NEXT_PUBLIC_ENABLED_PAGES: [
      'blog',
      'docs',
      'apikey',
      'organization',
      'invitation',
      'account',
      'settings',
      'subscription',
      'notifications',
      'admin',
    ],
  }
  return choices[varName]
}

function getVariableExample(varName: string): string {
  const examples: Record<string, string> = {
    DATABASE_URL: 'postgres://user:password@localhost:5432/saas_db',
    RESEND_API_KEY: 'your_resend_api_key_here',
    EMAIL_FROM: 'noreply@example.com',
    EMAIL_TO: 'admin@example.com',
    STRIPE_SECRET_KEY: 'your_stripe_secret_key_here',
    STRIPE_WEBHOOK_SECRET: 'your_stripe_webhook_secret_here',
    SUPABASE_URL: 'https://example-project.supabase.co',
    SUPABASE_ANON_KEY: 'your_supabase_anon_key_here',
    SUPABASE_BUCKET: 'example-bucket',
    GOOGLE_CLIENT_ID: 'your-google-client-id.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: 'your_google_client_secret_here',
    NEXT_PUBLIC_ENABLED_PAGES: 'blog,docs,apikey,organization',
    NEXT_PUBLIC_AUTH_METHODS: 'credential,magiclink,google',
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'GA_MEASUREMENT_ID',
    NEXT_PUBLIC_API_URL: 'https://api.example.com',
    OPENAI_API_KEY: 'your_openai_api_key_here',
    ANTHROPIC_API_KEY: 'your_anthropic_api_key_here',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'your_stripe_publishable_key_here',
    NEXT_PUBLIC_STRIPE_CHECKOUT_TYPE: 'EmbededForm',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    BETTER_AUTH_URL: 'http://localhost:3000',
    BETTER_AUTH_TRUSTED_ORIGINS: 'http://localhost:3000',
    NEXT_PUBLIC_BILLING_MODE: 'organization',
    NODE_ENV: 'development',
    LOG_LEVEL: 'info',
    STORAGE_TYPE: 'supabase',
    CHAT_PROVIDER: 'ollama',
    OLLAMA_BASE_URL: 'http://localhost:11434',
    NEXT_PUBLIC_MAX_FILE_SIZE: '5242880',
    ALLOWED_MIME_TYPES: 'image/jpeg,image/png,image/gif,application/pdf',
    NEXT_PUBLIC_BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION: 'true',
    NEXT_PUBLIC_BETTER_AUTH_2FA_ENABLE: 'true',
    NEXT_PUBLIC_BETTER_AUTH_2FA_SKIP_VERIFICATION_ON_ENABLE: 'true',
    NEXT_PUBLIC_BETTER_AUTH_TOKEN_MANAGEMENT: 'true',
    NEXT_PUBLIC_BETTER_AUTH_CHANGE_PASSWORD: 'true',
    NEXT_PUBLIC_BETTER_AUTH_CHANGE_EMAIL: 'true',
  }
  return examples[varName] || `example_${varName.toLowerCase()}_value`
}

function getPageHint(page: string): string {
  const hints: Record<string, string> = {
    blog: 'Articles et contenu',
    docs: 'Documentation',
    apikey: 'Gestion des clés API',
    organization: 'Gestion des organisations',
    invitation: 'Invitations utilisateurs',
    account: 'Paramètres du compte',
    settings: 'Paramètres généraux',
    subscription: 'Abonnements Stripe',
    notifications: 'Centre de notifications',
    admin: 'Panel administrateur',
  }
  return hints[page] || ''
}

// Générateurs de valeurs par défaut intelligentes basées sur les patterns
function generateDefaultValue(varName: string): string {
  // Secrets - génération cryptographique
  if (varName.includes('SECRET')) {
    return randomBytes(32).toString('base64')
  }

  // URLs par défaut
  if (varName.includes('URL') || varName.includes('ORIGINS')) {
    if (varName.includes('APP') || varName.includes('AUTH')) {
      return 'http://localhost:3000'
    }
    if (varName.includes('OLLAMA')) {
      return 'http://localhost:11434'
    }
  }

  // Configuration technique
  if (varName === 'NODE_ENV') return 'development'
  if (varName === 'LOG_LEVEL') return 'info'
  if (varName === 'STORAGE_TYPE') return 'supabase'
  if (varName === 'CHAT_PROVIDER') return 'ollama'

  // Tailles et limites
  if (varName.includes('MAX_FILE_SIZE') || varName.includes('SIZE')) {
    return '5242880'
  }

  // Types MIME
  if (varName.includes('MIME_TYPES')) {
    return 'image/jpeg,image/png,image/gif,application/pdf'
  }

  // Configuration Stripe
  if (varName.includes('STRIPE_CHECKOUT_TYPE')) {
    return 'EmbededForm'
  }

  // Mode de facturation
  if (varName.includes('BILLING_MODE')) {
    return 'organization'
  }

  // Variables booléennes (Better Auth, etc.)
  if (
    varName.includes('ENABLE') ||
    varName.includes('CHANGE_') ||
    varName.includes('REQUIRE_') ||
    varName.includes('SKIP_') ||
    varName.includes('TOKEN_MANAGEMENT')
  ) {
    return 'true'
  }

  // Listes de méthodes
  if (varName.includes('AUTH_METHODS')) {
    return 'credential,magiclink,google'
  }
  if (varName.includes('ENABLED_PAGES')) {
    return 'blog,docs,apikey,organization'
  }

  // Fallback sur l'exemple
  return getVariableExample(varName)
}

// Chargement des variables existantes depuis un fichier .env
async function loadExistingEnv(envFile: string): Promise<EnvConfig> {
  const existingEnv: EnvConfig = {}

  if (existsSync(envFile)) {
    try {
      const envContent = await readFile(envFile, 'utf-8')
      const lines = envContent.split('\n')

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=')
          if (key && valueParts.length > 0) {
            let value = valueParts.join('=')
            if (
              (value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))
            ) {
              value = value.slice(1, -1)
            }
            existingEnv[key] = value
          }
        }
      }
    } catch {
      p.log.warn(`Erreur lors de la lecture du fichier ${envFile} existant`)
    }
  }

  return existingEnv
}

// Génération du contenu .env avec toutes les variables (existantes + nouvelles)
async function generateEnvContent(
  variables: EnvVariable[],
  userConfig: EnvConfig,
  existingEnv: EnvConfig
): Promise<string> {
  const envLines: string[] = []
  const processedVars = new Set<string>()

  // 1. D'abord traiter les variables organisées par catégories (src/env.ts)
  const categories = [...new Set(variables.map((v) => v.category))]

  for (const category of categories) {
    envLines.push(`\n# ${category}`)

    const categoryVars = variables.filter((v) => v.category === category)

    for (const envVar of categoryVars) {
      let value = userConfig[envVar.name] || existingEnv[envVar.name] || ''

      // Auto-génération si pas de valeur
      if (!value) {
        value = generateDefaultValue(envVar.name)
      }

      if (value) {
        const needsQuotes = /[\s"'$`\\]/.test(value) || value.includes('=')
        envLines.push(`${envVar.name}=${needsQuotes ? `"${value}"` : value}`)
      } else {
        envLines.push(`#${envVar.name}=`)
      }

      processedVars.add(envVar.name)
    }
  }

  // 2. Ensuite ajouter les variables existantes non traitées (ADDITIVE ONLY)
  const unprocessedVars = Object.keys(existingEnv).filter(
    (key) => !processedVars.has(key)
  )

  if (unprocessedVars.length > 0) {
    envLines.push('\n# Variables personnalisées (préservées)')
    for (const key of unprocessedVars) {
      const value = existingEnv[key]
      if (value) {
        const needsQuotes = /[\s"'$`\\]/.test(value) || value.includes('=')
        envLines.push(`${key}=${needsQuotes ? `"${value}"` : value}`)
      }
    }
  }

  return envLines.join('\n')
}

async function promptForValue(
  envVar: EnvVariable,
  existingEnv: EnvConfig
): Promise<string> {
  const currentValue = existingEnv[envVar.name] || ''
  const hasCurrentValue = currentValue !== ''

  let message = envVar.description
  if (envVar.required) {
    message += ' (requis)'
  }

  const placeholder = envVar.example || 'Valeur...'
  // Ne pas pré-remplir les secrets pour forcer l'utilisateur à les générer/saisir
  const shouldPreFill =
    !envVar.name.includes('SECRET') && !envVar.name.includes('KEY')
  const initialValue = hasCurrentValue
    ? currentValue
    : shouldPreFill
      ? envVar.example || ''
      : ''

  // Gestion spéciale pour NEXT_PUBLIC_ENABLED_PAGES (sélection multiple)
  if (envVar.name === 'NEXT_PUBLIC_ENABLED_PAGES' && envVar.choices) {
    const currentPages = hasCurrentValue
      ? currentValue.split(',').map((p) => p.trim())
      : envVar.choices // Toutes les pages présélectionnées par défaut

    const selectedPages = await p.multiselect({
      message,
      options: envVar.choices.map((choice) => ({
        value: choice,
        label: choice,
        hint: getPageHint(choice),
      })),
      initialValues: currentPages,
      required: false,
    })

    if (p.isCancel(selectedPages)) {
      p.cancel('Opération annulée')
      process.exit(0)
    }

    return (selectedPages as string[]).join(',')
  }

  if (envVar.choices) {
    const value = await p.select({
      message,
      options: [
        ...(hasCurrentValue
          ? [
              {
                value: currentValue,
                label: `Garder: ${currentValue}`,
                hint: 'valeur actuelle',
              },
            ]
          : []),
        ...envVar.choices.map((choice) => ({
          value: choice,
          label: choice,
        })),
        ...(envVar.required
          ? []
          : [{value: '', label: 'Ignorer', hint: 'laisser vide'}]),
      ],
    })

    if (p.isCancel(value)) {
      p.cancel('Opération annulée')
      process.exit(0)
    }

    return value as string
  }

  const value = await p.text({
    message,
    placeholder,
    initialValue,
    validate: (input) => {
      if (envVar.required && !input.trim()) {
        if (envVar.name.includes('SECRET')) {
          return // OK, on générera automatiquement
        }
        return 'Cette valeur est requise'
      }
    },
  })

  if (p.isCancel(value)) {
    p.cancel('Opération annulée')
    process.exit(0)
  }

  if (!value && envVar.required && envVar.name.includes('SECRET')) {
    p.log.info("Génération automatique d'un secret...")
    return randomBytes(32).toString('base64')
  }

  return value || ''
}

// Fonction principale
async function main(): Promise<void> {
  p.intro('🚀 Initialisation du boilerplate Next.js SaaS')

  // Parse automatique de src/env.ts
  const variables = parseEnvSchema()
  p.log.info(`📋 ${variables.length} variables détectées dans src/env.ts`)

  // Sélection de l'environnement
  const environment = await p.select({
    message: 'Quel environnement souhaitez-vous configurer ?',
    options: [
      {
        value: 'development',
        label: 'Development',
        hint: 'Pour le développement local',
      },
      {
        value: 'production',
        label: 'Production',
        hint: 'Pour le build de production',
      },
      {
        value: 'test',
        label: 'Test',
        hint: 'Pour les tests automatisés',
      },
    ],
  })

  if (p.isCancel(environment)) {
    p.cancel('Opération annulée')
    process.exit(0)
  }

  const envFile = `.env.${environment}`
  p.log.info(`Configuration de l'environnement: ${environment}`)

  // Charger les valeurs existantes
  const existingEnv = await loadExistingEnv(envFile)
  const userConfig: EnvConfig = {}

  // Pour l'environnement de test, génération automatique
  if (environment === 'test') {
    const autoGenerate = await p.confirm({
      message:
        'Générer automatiquement un fichier .env.test avec des valeurs de test ?',
      initialValue: true,
    })

    if (p.isCancel(autoGenerate)) {
      p.cancel('Opération annulée')
      process.exit(0)
    }

    if (autoGenerate) {
      const envContent = await generateEnvContent(variables, {}, {})
      await writeFile(envFile, envContent)
      p.outro('✅ Fichier .env.test généré avec des valeurs de test!')
      return
    }
  }

  // Questions pour les variables importantes avec valeurs pré-remplies
  const interactiveVars = variables.filter((v) => !v.autoGenerate)
  const missingVars = interactiveVars.filter((v) => !existingEnv[v.name])
  const existingVars = interactiveVars.filter((v) => existingEnv[v.name])

  let shouldEditExisting = false

  if (existingVars.length > 0) {
    p.log.info(`📝 ${existingVars.length} variables existantes trouvées`)

    if (missingVars.length > 0) {
      p.log.info(`🔍 ${missingVars.length} nouvelles variables détectées`)
    }

    const editChoice = await p.confirm({
      message: 'Voulez-vous également éditer les variables existantes ?',
      initialValue: false,
    })

    if (p.isCancel(editChoice)) {
      p.cancel('Opération annulée')
      process.exit(0)
    }

    shouldEditExisting = editChoice
  } else if (missingVars.length > 0) {
    p.log.info(`🔍 ${missingVars.length} nouvelles variables détectées`)
  }

  // Organiser par thèmes personnalisés (plus important au moins important)
  const themeOrder = [
    'Base de données',
    'Authentification',
    'Email',
    'Stockage',
    'Stripe',
    'Pages & Fonctionnalités',
    'Chat IA',
    'OAuth',
    'Divers',
  ]

  function getTheme(varName: string): string {
    if (varName.includes('DATABASE')) return 'Base de données'
    if (
      varName.includes('BETTER_AUTH') ||
      varName.includes('2FA') ||
      varName.includes('AUTH_METHODS')
    )
      return 'Authentification'
    if (varName.includes('RESEND') || varName.includes('EMAIL')) return 'Email'
    if (
      varName.includes('SUPABASE') ||
      varName.includes('STORAGE') ||
      varName.includes('MIME')
    )
      return 'Stockage'
    if (varName.includes('STRIPE')) return 'Stripe'
    if (varName.includes('ENABLED_PAGES') || varName.includes('BILLING_MODE'))
      return 'Pages & Fonctionnalités'
    if (
      varName.includes('CHAT') ||
      varName.includes('OLLAMA') ||
      varName.includes('OPENAI') ||
      varName.includes('ANTHROPIC')
    )
      return 'Chat IA'
    if (varName.includes('GOOGLE_CLIENT')) return 'OAuth'
    return 'Divers'
  }

  const categorizedVars = new Map<string, EnvVariable[]>()

  // Initialiser toutes les catégories dans l'ordre
  for (const theme of themeOrder) {
    categorizedVars.set(theme, [])
  }

  for (const envVar of interactiveVars) {
    const currentValue = existingEnv[envVar.name] || ''

    // Ignorer si la variable existe déjà et qu'on ne veut pas l'éditer
    if (currentValue && !shouldEditExisting) {
      continue
    }

    const theme = getTheme(envVar.name)
    const categoryVars = categorizedVars.get(theme)
    if (categoryVars) {
      categoryVars.push(envVar)
    }
  }

  // Emojis pour chaque thème
  const themeEmojis: Record<string, string> = {
    'Base de données': '🗄️',
    Authentification: '🔐',
    Email: '📧',
    Stockage: '💾',
    Stripe: '💳',
    'Pages & Fonctionnalités': '🎨',
    'Chat IA': '🤖',
    OAuth: '🔑',
    Divers: '⚙️',
  }

  for (const [categoryName, categoryVars] of categorizedVars) {
    if (categoryVars.length === 0) continue

    const emoji = themeEmojis[categoryName] || '📋'

    // Titre avec emoji et ligne de séparation
    p.log.message(`\n${emoji} ${categoryName.toUpperCase()}`)
    p.log.message('─'.repeat(50))

    for (const envVar of categoryVars) {
      const value = await promptForValue(envVar, existingEnv)
      if (value) {
        userConfig[envVar.name] = value
      }
    }
  }

  // Génération finale seulement si il y a des nouvelles variables ou si on édite
  if (Object.keys(userConfig).length > 0 || shouldEditExisting) {
    const s = p.spinner()
    s.start(`Mise à jour du fichier ${envFile}...`)

    const envContent = await generateEnvContent(
      variables,
      userConfig,
      existingEnv
    )
    await writeFile(envFile, envContent)

    s.stop(`Fichier ${envFile} créé!`)

    p.outro(
      '✅ Configuration terminée! Vous pouvez relancer ce script à tout moment.'
    )
  } else {
    p.outro('ℹ️ Aucune modification apportée.')
  }
}

// Exécution du script
main().catch((err) => {
  p.log.error(`Erreur: ${err.message}`)
  process.exit(1)
})
