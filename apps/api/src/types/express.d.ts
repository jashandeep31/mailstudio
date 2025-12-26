import type { userRoleEnum } from "@repo/db";
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
        role: (typeof userRoleEnum)[number];
      };
    }
  }
}
