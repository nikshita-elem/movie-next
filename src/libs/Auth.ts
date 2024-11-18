// src/utils/isAuth.ts

import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import logger from "@/libs/logger";

/**
 * Verifies the JWT token from HttpOnly cookies and returns the user ID.
 *
 * @param req - The NextRequest object.
 * @returns The user ID if authenticated, otherwise null.
 */
export async function isAuth(req: NextRequest): Promise<string | null> {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            logger.warn("No token found in cookies.");
            return null;
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            logger.error("JWT_SECRET is not defined in environment variables.");
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        return decoded.userId;
    } catch (error) {
        logger.error("Token verification failed:", error);
        return null;
    }
}
