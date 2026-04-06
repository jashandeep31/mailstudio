import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  userRoleEnum,
  db,
  usersTable,
  eq,
  plansTable,
  planTypeEnum,
} from "@repo/db";
import { redis } from "../lib/db.js";
import { verifySession } from "../lib/jwt.js";

const userCacheSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  email: z.string(),
  avatar: z.string(),
  role: z.enum(userRoleEnum.enumValues),
  planType: z.enum(planTypeEnum.enumValues),
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
      firstName: usersTable.first_name,
      lastName: usersTable.last_name,
      email: usersTable.email,
      role: usersTable.role,
      avatar: usersTable.avatar,
      planType: plansTable.plan_type,
    })
    .from(usersTable)
    .innerJoin(plansTable, eq(plansTable.user_id, userId))
    .where(eq(usersTable.id, userId));

  if (!user || !user.role) {
    return null;
  }

  return user as UserData;
};
export const checkAuthorization =
  (roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = req.cookies.session;

      if (!sessionToken) {
        res.status(401).json({
          error: "Authentication required. Please login.",
        });
        return;
      }

      const payload = await verifySession(sessionToken);
      if (!payload) {
        res.status(401).json({
          error: "Invalid or expired session. Please login again.",
        });
        return;
      }

      const { userId } = payload;

      let userData = await getUserFromCache(userId);

      if (!userData) {
        userData = await getUserFromDatabase(userId);

        if (!userData) {
          res.status(401).json({
            error: "User not found. Please login again.",
          });
          return;
        }

        await setUserInCache(userId, userData);
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
