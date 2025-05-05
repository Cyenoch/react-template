import { getTableColumns, relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { v7 } from 'uuid'

export const userRole = ['user', 'admin'] as const
export type UserRole = typeof userRole[number]

export const userTable = sqliteTable('user', {
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

export const sessionTable = sqliteTable('session', {
  id: text().primaryKey().$default(v7),
  ipAddress: text(),
  userAgent: text(),
  userId: text().notNull().references(() => userTable.id, { onDelete: 'cascade' }),

  createdAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
})

export const userRelation = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}))

export const sessionRelation = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

export type Session = typeof sessionTable.$inferSelect
export type User = typeof userTable.$inferSelect

const { password: _, ...userWithoutPassword } = getTableColumns(userTable)
export { userWithoutPassword }
