import type { Request, Response, NextFunction } from "express";
import { userRoleEnum, db, usersTable, eq } from "@repo/db";
import { z } from "zod";
import { redis } from "../lib/db.js";
const sessionSchema = z.object({
  email: z.string().email(),
  id: z.string().uuid(),
  role: z.enum(userRoleEnum.enumValues),
});

const userCacheSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.enum(userRoleEnum.enumValues),
});

type UserData = z.infer<typeof userCacheSchema>;

const USER_CACHE_TTL = 300;
const CACHE_KEY_PREFIX = "user:auth:";

const ROLES = [...userRoleEnum.enumValues, "all"] as const;
type UserRole = (typeof ROLES)[number];

const getUserFromCache = async (userId: string): Promise<UserData | null> => {
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

const setUserInCache = async (
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

const getUserFromDatabase = async (
  userId: string,
): Promise<UserData | null> => {
  const [user] = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      role: usersTable.role,
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

      if (parsedSession.email !== userData.email) {
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
