import { z } from "zod";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, passwordCredentials } from "@db/schema";
import { env } from "./lib/env";
import { TRPCError } from "@trpc/server";

const JWT_ALG = "HS256";

async function signLocalToken(payload: { userId: number; email: string }): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyLocalToken(token: string): Promise<{ userId: number; email: string } | null> {
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    if (!payload.userId || !payload.email) return null;
    return { userId: payload.userId as number, email: payload.email as string };
  } catch {
    return null;
  }
}

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name required").max(100),
        email: z.string().email("Invalid email").max(320),
        password: z.string().min(6, "Min 6 characters").max(100),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if email already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists",
        });
      }

      // Create user with a local_ prefixed unionId
      const unionId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      await db.insert(users).values({
        unionId,
        name: input.name,
        email: input.email,
        role: "user",
        lastSignInAt: new Date(),
      });

      // Get the created user
      const userRows = await db
        .select()
        .from(users)
        .where(eq(users.unionId, unionId))
        .limit(1);
      const user = userRows[0];

      if (!user) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create user" });
      }

      // Hash password and store credentials
      const passwordHash = await bcrypt.hash(input.password, 12);
      await db.insert(passwordCredentials).values({
        userId: user.id,
        passwordHash,
      });

      // Generate token
      const token = await signLocalToken({ userId: user.id, email: input.email });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Find user by email
      const userRows = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);
      const user = userRows[0];

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Get password credentials
      const credRows = await db
        .select()
        .from(passwordCredentials)
        .where(eq(passwordCredentials.userId, user.id))
        .limit(1);
      const cred = credRows[0];

      if (!cred) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Verify password
      const valid = await bcrypt.compare(input.password, cred.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Update last sign in
      await db
        .update(users)
        .set({ lastSignInAt: new Date() })
        .where(eq(users.id, user.id));

      // Generate token
      const token = await signLocalToken({ userId: user.id, email: user.email || "" });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    // Check for local auth token in header
    const authHeader = ctx.req.headers.get("x-local-auth-token");
    if (!authHeader) return null;

    const claim = await verifyLocalToken(authHeader);
    if (!claim) return null;

    const db = getDb();
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, claim.userId))
      .limit(1);

    return rows[0] || null;
  }),
});
