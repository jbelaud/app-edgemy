import {relations, sql} from 'drizzle-orm'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import {user} from './auth-model'

// Enums pour les posts
export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'published',
  'archived',
])

// Table des posts
export const posts = pgTable('posts', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  status: postStatusEnum('status').default('draft').notNull(),
  authorId: uuid('authorid').references(() => user.id, {onDelete: 'set null'}),
  categoryId: uuid('categoryid').references(() => categories.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('createdat').defaultNow(),
  updatedAt: timestamp('updatedat').defaultNow(),
  nbView: integer('nbview').default(0),
  nbLike: integer('nblike').default(0),
})

// Table des traductions de posts
export const postsTranslation = pgTable('posts_translation', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  postId: uuid('postid')
    .notNull()
    .references(() => posts.id, {onDelete: 'cascade'}),
  createdAt: timestamp('createdat').defaultNow(),
  updatedAt: timestamp('updatedat').defaultNow(),
  language: text('language').default('fr').notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  description: text('description').notNull(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
})

// Table des catégories
export const categories = pgTable('categories', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  icon: text('icon'),
  image: text('image'),
  createdAt: timestamp('createdat').defaultNow(),
  updatedAt: timestamp('updatedat').defaultNow(),
})

// Table des hashtags
export const hashtags = pgTable('hashtags', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('createdat').defaultNow(),
  updatedAt: timestamp('updatedat').defaultNow(),
})

// Table de liaison posts-hashtags
export const postHashtags = pgTable(
  'post_hashtags',
  {
    postId: uuid('postid')
      .notNull()
      .references(() => posts.id, {onDelete: 'cascade'}),
    hashtagId: uuid('hashtagid')
      .notNull()
      .references(() => hashtags.id, {onDelete: 'cascade'}),
  },
  (table) => ({
    pk: sql`PRIMARY KEY (${table.postId}, ${table.hashtagId})`,
  })
)

// Relations
export const postsRelations = relations(posts, ({one, many}) => ({
  author: one(user, {
    fields: [posts.authorId],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  postTranslations: many(postsTranslation),
  postHashtags: many(postHashtags),
}))

export const postsTranslationRelations = relations(
  postsTranslation,
  ({one}) => ({
    post: one(posts, {
      fields: [postsTranslation.postId],
      references: [posts.id],
    }),
  })
)

export const categoriesRelations = relations(categories, ({many}) => ({
  posts: many(posts),
}))

export const hashtagsRelations = relations(hashtags, ({many}) => ({
  postHashtags: many(postHashtags),
}))

export const postHashtagsRelations = relations(postHashtags, ({one}) => ({
  post: one(posts, {
    fields: [postHashtags.postId],
    references: [posts.id],
  }),
  hashtag: one(hashtags, {
    fields: [postHashtags.hashtagId],
    references: [hashtags.id],
  }),
}))

// Types TypeScript
export type PostModel = typeof posts.$inferSelect
export type AddPostModel = typeof posts.$inferInsert
export type UpdatePostModel = typeof posts.$inferInsert

export type PostsTranslationModel = typeof postsTranslation.$inferSelect
export type AddPostsTranslationModel = typeof postsTranslation.$inferInsert

export type CategoryModel = typeof categories.$inferSelect
export type AddCategoryModel = typeof categories.$inferInsert
export type UpdateCategoryModel = typeof categories.$inferInsert

export type HashtagsModel = typeof hashtags.$inferSelect
export type AddHashtagsModel = typeof hashtags.$inferInsert
export type UpdateHashtagModel = typeof hashtags.$inferInsert

export type PostHashtagsModel = typeof postHashtags.$inferSelect
export type AddPostHashtagsModel = typeof postHashtags.$inferInsert
