🧠 Edgemy — Plateforme de Coaching Poker

1. Vision et Mission

Edgemy est une plateforme francophone innovante dédiée au coaching poker, conçue pour mettre en relation les joueurs et les coachs dans un environnement professionnel, transparent et rentable.
L’objectif est de permettre aux joueurs d’améliorer leur niveau grâce à des sessions de coaching personnalisées, tout en offrant aux coach professionnels un espace optimisé pour développer leur activité.

À moyen terme, Edgemy ambitionne d’élargir son offre à d’autres domaines compétitifs comme les échecs ou les jeux vidéo e-sport.

2. Objectifs principaux
   Pour les joueurs :

Accéder facilement à des coachs qualifiés selon leur format préféré (MTT, Cash Game, Spin & Go, etc.).

Réserver des sessions individuelles avec paiement sécurisé via Stripe.

Bénéficier d’un suivi de progression (objectifs, statistiques, replay des sessions).

Discuter et planifier les sessions directement depuis la plateforme (via API Discord).

Avoir un accès gratuit à la plateforme (modèle freemium), avec commission sur les réservations.

À terme : accès à un abonnement premium incluant gestion de bankroll et historique de performances.

Pour les coachs :

Créer et personnaliser leur profil professionnel (description, formats, limites, gains, expérience, disponibilité, tarifs).

Gérer leurs créneaux de réservation via un calendrier interactif (drag & drop).

Recevoir les paiements de leurs sessions directement (moins la commission Edgemy).

Mettre en avant leurs services et packs d’heures.

Accéder à un tableau de bord complet (revenus, évaluations, sessions, élèves actifs).

Bénéficier d’un système d’abonnement pour débloquer les fonctionnalités premium (voir section 5).

Pour l’administrateur (admin) :

Gérer les utilisateurs, coachs et sessions.

Modérer les contenus (profils, descriptions, avis, messages).

Suivre les paiements, commissions et statistiques globales.

Superviser la qualité des services proposés sur la plateforme.

3. Modèle économique
   Phase 1 (MVP – 2025)

Gratuit pour les joueurs.

Commission Edgemy sur chaque réservation (ex. 10 à 15%).

Abonnement pour les coachs, leur donnant accès à :

La création et personnalisation du profil coach.

La possibilité de proposer plusieurs types de coaching (1h, packs, review MTT, etc.).

L’accès à leurs statistiques et revenus.

Une meilleure visibilité sur la plateforme.

Phase 2 (2026)

Abonnement payant pour les joueurs, supprimant la commission sur les sessions.

Accès à une gestion de bankroll intégrée, avec :

Suivi automatique des gains/pertes.

Historique des sessions jouées et coachées.

Statistiques de performance.

Export comptable simplifié pour les coachs.

Phase 3 (2026 fin)

Marketplace de contenu : vente de vidéos, masterclasses, documents stratégiques, etc.

Phase 4 (2027)

Application mobile complète (iOS + Android) pour gérer les sessions, le chat, et le suivi depuis le téléphone.

4. Structure de la base de données (Vue conceptuelle)
   Tables principales
   Users

id

first_name

last_name

email

password_hash

role → PLAYER / COACH / ADMIN

avatar_url

created_at

updated_at

CoachProfiles

id

user_id → (FK vers Users)

bio

experience

formats (MTT, Cash Game, Spin & Go…)

abi (Average Buy-In)

hourly_rate

coaching_types (1h, pack, review…)

languages

achievements

visibility (active/inactive)

rating_avg

rating_count

subscription_plan_id (FK vers CoachSubscriptions)

created_at

updated_at

CoachSubscriptions

id

name (Basic, Pro, Premium)

price

features (JSON ou relation secondaire)

duration_months

created_at

Sessions

id

player_id (FK vers Users)

coach_id (FK vers Users)

date

duration (en minutes)

price

status (PENDING, CONFIRMED, COMPLETED, CANCELLED)

discord_channel_id

video_replay_url

created_at

updated_at

Payments

id

session_id

stripe_payment_id

amount

commission

status

created_at

Reviews

id

session_id

player_id

coach_id

rating (1–5)

comment

created_at

Bankrolls (Phase 2)

id

user_id

balance

currency

transactions (JSON ou table liée)

created_at

updated_at

5. Rôles et permissions
   Rôle Description Permissions principales
   Joueur (User) Client de la plateforme Réserver un coaching, payer en ligne, laisser un avis, consulter son historique, gérer son profil.
   Coach Prestataire validé Créer un profil, définir ses tarifs, gérer ses disponibilités, recevoir les paiements, chatter avec ses élèves, consulter ses stats.
   Admin Superviseur Gérer les comptes, valider les coachs, voir les paiements, modérer les contenus, consulter les statistiques globales.
6. Fonctionnalités principales (Phase 1 → 4)
   Phase 1 — MVP (lancement)

Authentification et rôles (Joueur, Coach, Admin)

Création de profil joueur et coach

Système d’abonnement pour les coachs

Recherche et filtre de coachs

Réservation en ligne avec Stripe

Gestion des sessions (calendrier, statuts)

Intégration du chat via API Discord

Envoi d’emails de confirmation (Brevo)

Tableau de bord basique (sessions, revenus, réservations)

Système d’avis et notation

Interface responsive (React + Tailwind)

Backend NestJS + drizzle + Neon PostgreSQL

Phase 2 — Abonnement & Bankroll

Abonnement joueur sans commission

Gestion de bankroll et suivi de performance

Export comptable pour les coachs

Historique avancé de coaching et gains

Notifications en temps réel

Phase 3 — Marketplace de contenu

Vente de vidéos et masterclasses

Système d’achat intégré

Classement et recommandation de contenus

Phase 4 — Application mobile

Application iOS et Android

Notifications push

Messagerie intégrée

Gestion complète du compte depuis mobile

7. Positionnement & Différenciation

Contrairement à des outils d’analyse automatisés comme GTO Wizard ou Hold’em Manager, Edgemy ne cherche pas à remplacer le travail du coach, mais à le valoriser.
La plateforme met en avant l’humain, la pédagogie et le suivi personnalisé.

Les joueurs profitent d’un accompagnement sur mesure, tandis que les coachs disposent d’un écosystème rentable et digitalisé pour développer leur activité de manière professionnelle.
