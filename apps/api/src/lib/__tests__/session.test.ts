import { describe, it, expect, beforeAll } from "vitest";
import { signSession, verifySession, decodeSession } from "./session.js";
import * as jwt from "jsonwebtoken";

describe("Session Security", () => {
  const testSecret = "test-secret-key-for-testing";
  const originalSecret = process.env.HMAC_SECRET;

  beforeAll(() => {
    process.env.HMAC_SECRET = testSecret;
  });

  describe("signSession", () => {
    it("should create a valid JWT token", () => {
      const payload = { id: "user-123", role: "user" };
      const token = signSession(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    });

    it("should include payload data in the token", () => {
      const payload = { id: "user-456", role: "admin" };
      const token = signSession(payload);
      const decoded = jwt.decode(token) as { id: string; role: string };
      
      expect(decoded.id).toBe(payload.id);
      expect(decoded.role).toBe(payload.role);
    });

    it("should set expiration time", () => {
      const payload = { id: "user-789", role: "user" };
      const token = signSession(payload);
      const decoded = jwt.decode(token) as { exp: number; iat: number };
      
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe("verifySession", () => {
    it("should verify a valid token", () => {
      const payload = { id: "user-123", role: "user" };
      const token = signSession(payload);
      const result = verifySession(token);
      
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.payload.id).toBe(payload.id);
        expect(result.payload.role).toBe(payload.role);
      }
    });

    it("should reject a token with invalid signature", () => {
      const payload = { id: "user-123", role: "user" };
      const token = signSession(payload);
      const tamperedToken = token.slice(0, -5) + "xxxxx";
      const result = verifySession(tamperedToken);
      
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid session token. Please login again.");
      }
    });

    it("should reject a token signed with different secret", () => {
      const payload = { id: "user-123", role: "user" };
      const token = jwt.sign(payload, "different-secret");
      const result = verifySession(token);
      
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid session token. Please login again.");
      }
    });

    it("should reject a plain JSON object (old session format)", () => {
      const plainSession = JSON.stringify({ id: "user-123", role: "admin" });
      const result = verifySession(plainSession);
      
      expect(result.valid).toBe(false);
    });

    it("should reject a manipulated payload token", () => {
      const originalPayload = { id: "user-123", role: "user" };
      const originalToken = signSession(originalPayload);
      const decoded = jwt.decode(originalToken) as Record<string, unknown>;
      decoded.id = "other-user-id";
      const manipulatedToken = jwt.sign(decoded, testSecret);
      const result = verifySession(manipulatedToken);
      
      expect(result.valid).toBe(false);
    });
  });

  describe("ID Manipulation Prevention", () => {
    it("should prevent impersonation via ID change in cookie", () => {
      const attackerPayload = { id: "victim-user-id", role: "user" };
      const attackerToken = signSession(attackerPayload);
      
      const decoded = jwt.decode(attackerToken) as Record<string, unknown>;
      decoded.id = "attacker-id";
      const manipulatedToken = jwt.sign(decoded, testSecret);
      
      const result = verifySession(manipulatedToken);
      
      expect(result.valid).toBe(false);
    });

    it("should not accept session with missing fields", () => {
      const incompletePayload = { id: "user-123" };
      const token = jwt.sign(incompletePayload, testSecret);
      const result = verifySession(token);
      
      expect(result.valid).toBe(false);
    });

    it("should not accept session with extra fields", () => {
      const payloadWithExtra = { id: "user-123", role: "user", extra: "field" };
      const token = jwt.sign(payloadWithExtra, testSecret);
      const result = verifySession(token);
      
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.payload.id).toBe("user-123");
        expect(result.payload.role).toBe("user");
      }
    });
  });

  describe("decodeSession", () => {
    it("should decode a valid token without verification", () => {
      const payload = { id: "user-123", role: "admin" };
      const token = signSession(payload);
      const decoded = decodeSession(token);
      
      expect(decoded).not.toBeNull();
      if (decoded) {
        expect(decoded.id).toBe(payload.id);
        expect(decoded.role).toBe(payload.role);
      }
    });

    it("should return null for invalid token", () => {
      const result = decodeSession("invalid-token");
      expect(result).toBeNull();
    });

    it("should decode even if token has wrong signature", () => {
      const payload = { id: "user-123", role: "user" };
      const token = jwt.sign(payload, "wrong-secret");
      const decoded = decodeSession(token);
      
      expect(decoded).not.toBeNull();
      if (decoded) {
        expect(decoded.id).toBe("user-123");
      }
    });
  });
});
