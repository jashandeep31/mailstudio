import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { env } from "../../lib/env.js";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import { createUser } from "./lib/create-user.js";

const payloadSchema = z.object({
  email: z.string(),
  name: z.string().optional(),
  picture: z.string().optional(),
});

const oauthClient = new OAuth2Client(
  env.GOOGLE_AUTH_CLIENT_ID,
  env.GOOGLE_AUTH_SECRET_KEY,
  env.GOOGLE_AUTH_REDIRECT_URI,
);

export const googleAuthController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authUrl = oauthClient.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      prompt: "consent",
    });
    res.status(200).json({
      url: authUrl,
    });
  },
);

export const googleAuthCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;
    if (typeof code !== "string") {
      throw new Error("Code is required");
    }

    const { tokens } = await oauthClient.getToken(code);
    if (!tokens || !tokens.access_token || !tokens.id_token) {
      res.status(400).json({ error: "Invalid code" });
      return;
    }

    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
    });
    const payload = ticket.getPayload();

    const parsedPayload = payloadSchema.parse(payload);

    const user = await createUser({
      ...parsedPayload,
      avatar: parsedPayload.picture,
      provider: "google",
    });
    res.cookie(
      "session",
      JSON.stringify({
        id: user.id,
        role: user.role,
      }),
      {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".mailstudio.dev",
        path: "/",
      },
    );
    res.redirect(`${env.FRONTEND_URL}/dashboard`);
  },
);
