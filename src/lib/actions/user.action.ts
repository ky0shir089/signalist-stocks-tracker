import { db } from "@/drizzle/db";

export const getAllUsersForNewsEmail = async () => {
  try {
    const users = await db.query.user.findMany({
      columns: {
        id: true,
        email: true,
        name: true,
      },
    });
    return users;
  } catch (error) {
    console.log("Error getting all users for news email", error);
    return [];
  }
};
