-- Migration manuelle : Remplacer PLAYER par USER dans le rôle
-- Cette migration gère la transition en douceur

-- Étape 1: Convertir temporairement la colonne role en text
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE text;

-- Étape 2: Mettre à jour toutes les valeurs PLAYER en USER
UPDATE "user" SET "role" = 'USER' WHERE "role" = 'PLAYER';

-- Étape 3: Supprimer l'ancien type enum (s'il existe)
DROP TYPE IF EXISTS "public"."role_type" CASCADE;

-- Étape 4: Créer le nouveau type enum avec USER, COACH, ADMIN (sans PLAYER ni SUPER_ADMIN)
CREATE TYPE "public"."role_type" AS ENUM('USER', 'COACH', 'ADMIN');

-- Étape 5: Reconvertir la colonne au nouveau type enum
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."role_type" USING "role"::"public"."role_type";

-- Étape 6: Définir la nouvelle valeur par défaut
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER'::"public"."role_type";
