import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  char,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const watchlist = pgTable(
  "watchlist",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    symbol: char("symbol", { length: 2 }).notNull(),
    company: varchar("company").notNull(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_id_symbol_index").on(table.userId, table.symbol),
  ]
);

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(user, {
    fields: [watchlist.userId],
    references: [user.id],
  }),
}));
