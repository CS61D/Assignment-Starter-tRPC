import { relations, sql } from "drizzle-orm";
import {
    index,
    int,
    primaryKey,
    sqliteTableCreator,
    text,
    uniqueIndex,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "next-auth/adapters";

export const createTable = sqliteTableCreator((name) => `${name}`);

export const users = createTable("user", {
    id: text("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 255 }),
    email: text("email", { length: 255 }).notNull(),
    emailVerified: text("email_verified").default(sql`(datetime('now'))`),
    image: text("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    votes: many(vote),
}));

export const votingItem = createTable("voting_item", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: int("created_at", { mode: "number" })
        .notNull()
        .default(sql`(unixepoch())`),
    roomId: text("room_id")
        .notNull()
        .references(() => room.id),
});

export const votingItemRelations = relations(votingItem, ({ one, many }) => ({
    room: one(room, { fields: [votingItem.roomId], references: [room.id] }),
    votes: many(vote),
}));

export const vote = createTable(
    "vote",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        votingItemId: text("voting_item_id")
            .notNull()
            .references(() => votingItem.id),
        userId: text("user_id", { length: 255 })
            .notNull()
            .references(() => users.id),
        roomId: text("room_id")
            .notNull()
            .references(() => room.id),
        position: int("position").notNull(), // indexing at 1
    },
    (table) => ({
        userVotingItemUnique: uniqueIndex("user_voting_item_unique").on(
            table.userId,
            table.votingItemId,
        ),
    }),
);

export const voteRelations = relations(vote, ({ one }) => ({
    user: one(users, { fields: [vote.userId], references: [users.id] }),
    room: one(room, { fields: [vote.roomId], references: [room.id] }),
    votingItem: one(votingItem, {
        fields: [vote.votingItemId],
        references: [votingItem.id],
    }),
}));

export const room = createTable("room", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 255 }).notNull(),
    allowedEmails: text("allowed_emails").notNull(),
    status: text("status", {
        enum: ["open", "voting", "complete"],
    }).notNull(),
});

export const roomRelations = relations(room, ({ many }) => ({
    votingItems: many(votingItem),
    votes: many(vote),
}));

//* NextAuth Tables

export const accounts = createTable(
    "account",
    {
        userId: text("user_id", { length: 255 })
            .notNull()
            .references(() => users.id),
        type: text("type", { length: 255 })
            .$type<AdapterAccount["type"]>()
            .notNull(),
        provider: text("provider", { length: 255 }).notNull(),
        providerAccountId: text("provider_account_id", {
            length: 255,
        }).notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: int("expires_at"),
        token_type: text("token_type", { length: 255 }),
        scope: text("scope", { length: 255 }),
        id_token: text("id_token"),
        session_state: text("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
        userIdIdx: index("account_user_id_idx").on(account.userId),
    }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
    "session",
    {
        sessionToken: text("session_token", { length: 255 })
            .notNull()
            .primaryKey(),
        userId: text("userId", { length: 255 })
            .notNull()
            .references(() => users.id),
        expires: int("expires", { mode: "timestamp" }).notNull(),
    },
    (session) => ({
        userIdIdx: index("session_userId_idx").on(session.userId),
    }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
    "verification_token",
    {
        identifier: text("identifier", { length: 255 }).notNull(),
        token: text("token", { length: 255 }).notNull(),
        expires: int("expires", { mode: "timestamp" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    }),
);
