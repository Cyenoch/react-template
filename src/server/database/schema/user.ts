import { getTableColumns, relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { v7 } from 'uuid'

export const userRole = ['user', 'admin'] as const
export type UserRole = typeof userRole[number]

export const user = sqliteTable('user', {
  id: text().primaryKey().$default(v7),

  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer({ mode: 'boolean' }).notNull(),
  role: text().$type<UserRole>().notNull(),
  banReason: text(),
  banExpiresAt: text(),

  password: text(),

  createdAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, t => [
  uniqueIndex('email_idx').on(t.email),
  uniqueIndex('name_idx').on(t.name),
])

export const session = sqliteTable('session', {
  id: text().primaryKey().$default(v7),
  ipAddress: text(),
  userAgent: text(),
  userId: text().notNull().references(() => user.id, { onDelete: 'cascade' }),

  createdAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
})

export const userRelation = relations(user, ({ many }) => ({
  sessions: many(session),
}))

export const sessionRelation = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export type Session = typeof session.$inferSelect
export type User = typeof user.$inferSelect

const { password: _, ...userWithoutPassword } = getTableColumns(user)
export { userWithoutPassword }
