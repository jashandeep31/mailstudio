import { accountProviderEnum, accountTable, db, usersTable } from "@repo/db";
interface CreateUser {
  email: string;
  name?: string | undefined;
  avatar?: string | undefined;
  provider: (typeof accountProviderEnum.enumValues)[number];
}

export const createUser = async ({
  email,
  name,
  avatar,
  provider,
}: CreateUser) => {
  /* 
1. Check if user exist and with which provider
2. if yes return error
3. if not create the user 

*/

  const firstName: string =
    name && name.trim().length > 0 && name.split(" ")[0]
      ? name.split(" ")[0]!
      : email.split("@")[0]!;

  const lastName = name?.split(" ")[1] ?? null;
  const avatarUrl = avatar ?? "test";
  if (provider === "google") {
    await db.transaction(async (tx) => {
      const [user] = await db
        .insert(usersTable)
        .values({
          email,
          firstName,
          lastName: lastName,
          avatar: avatarUrl,
          role: "user",
        })
        .returning();

      if (!user) throw new Error();
      await db
        .insert(accountTable)
        .values({
          user_id: user.id,
          provider: "google",
        })
        .returning();
    });
  }
};
