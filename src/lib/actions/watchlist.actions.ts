import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getWatchlistSymbolsByEmail = async (email: string) => {
  try {
    const data = await db.query.user.findFirst({
      with: {
        watchlists: true,
      },
      where: eq(user.email, email),
    });

    return data?.watchlists.map((watchlist) => watchlist.symbol);
  } catch (error) {
    console.log(error);
  }
};
