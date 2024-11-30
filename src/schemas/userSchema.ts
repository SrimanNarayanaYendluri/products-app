import { pgTable, text, varchar, timestamp, index, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    user_name: varchar("user_name").notNull().unique(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    user_type: varchar("user_type").notNull().default('user'),
    first_name: varchar("first_name").notNull(),
    middle_name: varchar("middle_name"),
    last_name: varchar("last_name").notNull(),
    address: text("address").notNull(),
    phone_number: varchar("phone_number"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at"),
    deleted_at: timestamp("deleted_at"),
}, (table) => ({
    usernameIndex: index("username_idx").on(table.user_name),
    emailIndex: index("email_idx").on(table.email),
    phoneNumberIndex: index("phone_number_idx").on(table.phone_number),
    usersCreatedAtIdx: index("users_created_at_idx").on(table.created_at),
})
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UsersTable = typeof users;
