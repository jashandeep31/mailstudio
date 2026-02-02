import type { Request, Response, NextFunction } from "express";
import { userRoleEnum, db, usersTable, eq } from "@repo/db";
import { z } from "zod";
import { redis } from "../lib/db.js";

export const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoleEnum.enumValues),
});

const userCacheSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  email: z.string(),
  avatar: z.string(),
  role: z.enum(userRoleEnum.enumValues),
});

type UserData = z.infer<typeof userCacheSchema>;

const USER_CACHE_TTL = 300;
const CACHE_KEY_PREFIX = "user:auth:";

const ROLES = [...userRoleEnum.enumValues, "all"] as const;
type UserRole = (typeof ROLES)[number];

// @returns the cached user from the redis or either returns nul
export const getUserFromCache = async (
  userId: string,
): Promise<UserData | null> => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      const parsed = JSON.parse(cachedUser);
      return userCacheSchema.parse(parsed);
    }
    return null;
  } catch (error) {
    console.error("Redis cache retrieval error:", error);
    return null;
  }
};

// set the user in the cache of the redis
export const setUserInCache = async (
  userId: string,
  userData: UserData,
): Promise<void> => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    await redis.setex(cacheKey, USER_CACHE_TTL, JSON.stringify(userData));
  } catch (error) {
    console.error("Redis cache storage error:", error);
  }
};
// Getting the user from the database
export const getUserFromDatabase = async (
  userId: string,
): Promise<UserData | null> => {
  const [user] = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      role: usersTable.role,
      avatar: usersTable.avatar,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user || !user.role) {
    return null;
  }

  return user as UserData;
};
export const checkAuthorization =
  (roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = req.cookies.session;

      if (!session) {
        res.status(401).json({
          error: "Authentication required. Please login.",
        });
        return;
      }

      let parsedSession;
      try {
        parsedSession = sessionSchema.parse(JSON.parse(session));
      } catch (error) {
        res.status(401).json({
          error: "Invalid session format. Please login again.",
        });
        return;
      }

      let userData = await getUserFromCache(parsedSession.id);

      if (!userData) {
        userData = await getUserFromDatabase(parsedSession.id);

        if (!userData) {
          res.status(401).json({
            error: "User not found. Please login again.",
          });
          return;
        }

        await setUserInCache(parsedSession.id, userData);
      }

      if (parsedSession.id !== userData.id) {
        res.status(401).json({
          error: "Session mismatch. Please login again.",
        });
        return;
      }

      req["user"] = userData;

      if (roles.includes("all") || roles.includes(userData.role)) {
        next();
        return;
      }

      res.status(403).json({
        error: "Insufficient permissions to access this resource.",
      });
    } catch (error) {
      console.error("Authorization middleware error:", error);
      res.status(500).json({
        error: "Internal server error during authorization.",
      });
    }
  };
