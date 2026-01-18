import type { userRoleEnum } from "@repo/db";
import "express";
import { string } from "zod";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
        role: (typeof userRoleEnum)[number];
        firstName: string;
        lastName: string?;
        avatar: string;
      };
    }
  }
}
