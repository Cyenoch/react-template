import { getTableColumns, relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { v7 } from 'uuid'

export const userRole = ['user', 'admin'] as const
export type UserRole = typeof userRole[number]

export const userTable = pgTable('user', {
  id: text().primaryKey().$default(v7),

  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull(),
  role: text().$type<UserRole>().notNull(),
  banReason: text(),
  banExpiresAt: text(),

  password: text(),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, t => [
  uniqueIndex('email_idx').on(t.email),
  uniqueIndex('name_idx').on(t.name),
])

export const sessionTable = pgTable('session', {
  id: text().primaryKey().$default(v7),
  ipAddress: text(),
  userAgent: text(),
  userId: text().notNull().references(() => userTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
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
