import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid().primaryKey().defaultRandom();

export const timestamps = {
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
};
