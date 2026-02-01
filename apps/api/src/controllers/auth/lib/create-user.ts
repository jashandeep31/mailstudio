import {
  accountProviderEnum,
  accountsTable,
  brandKitsTable,
  creditWalletsTable,
  db,
  eq,
  plansTable,
  usersTable,
} from "@repo/db";
interface CreateUser {
  email: string;
  name?: string | undefined;
  avatar?: string | undefined;
  password?: string | undefined;
  provider: (typeof accountProviderEnum.enumValues)[number];
}

export const createUser = async ({
  email,
  name,
  avatar,
  provider,
  password,
}: CreateUser): Promise<typeof usersTable.$inferSelect> => {
  const [isUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (isUser) {
    const [isAccount] = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.user_id, isUser.id));

    if (isAccount && isAccount.provider !== "google") {
      throw new Error("please login with the proper way");
    }

    return isUser;
  }

  const getNames = (): [string, string?] => {
    if (!name?.trim()) {
      return [email.split("@")[0]!];
    }
    const parts = name.trim().split(" ");
    const first = parts[0]!;
    const last = parts.length > 1 ? parts[1] : undefined;
    return last ? [first, last] : [first];
  };
  const [firstName, lastName] = getNames();
  const avatarUrl = avatar ?? "test";
  const user = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(usersTable)
      .values({
        email,
        firstName,
        lastName,
        avatar: avatarUrl,
        role: "user",
        ...(password ? { password } : {}),
      })
      .returning();

    if (!user) throw new Error("Unable to create the user");
    // creating the user account
    await tx.insert(accountsTable).values({
      user_id: user.id,
      provider,
      last_login: new Date(),
    });

    // creating the user wallet
    await tx.insert(creditWalletsTable).values({
      user_id: user.id,
      balance: "0",
    });
    const today = new Date();

    await tx.insert(plansTable).values({
      user_id: user.id,
      plan_type: "free",
      subscription_id: null,
      price: "0.00",
      active_from: new Date(),
      renew_at: new Date(today.setMonth(today.getMonth() + 1)),
      ends_at: null,
      cancel_at_next_billing_date: false,
    });
    // creating user plan
    await tx.insert(brandKitsTable).values({
      user_id: user.id,
      ...defaultBrandKitData,
    });
    return user;
  });
  return user;
};

const defaultBrandKitData = {
  name: "Mail Studio",
  brand_summary:
    "Mail Studio is an API-first platform designed for building, managing, and shipping professional email templates quickly using AI-assisted generation and MJML integration.",
  brand_design_style: null,
  website_url: "https://mailstudio.dev",
  copyright: "2026 mailstudio.dev",
  logo_url: "https://public.mailstudio.dev/mailstudio.png",
  primary_color: "#0055FF",
  secondary_color: "#1A1A1A",
} as const;
