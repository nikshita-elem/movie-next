/* eslint-disable @typescript-eslint/no-explicit-any */
import connectMongoDB from "@/libs/dbConnect";
import User, { userSchemaZod } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import logger from "@/libs/logger";
import { getClientIp } from "@/utils/getClientIp";
import { formatResponse } from "@/utils/responseFormatter";
import { validateRequest } from "@/utils/validateRequest";
import { consumeRateLimiter } from "@/utils/rateLimiter";
import { generateToken } from "@/utils/generateToken";

/**
 * @swagger
 * components:
 *   schemas:
 *     SignInRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *     SignInResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

interface SignInResponse {
    message: string;
    success: boolean;
    data?: {
        token: string;
        user: {
            _id: string;
            email: string;
        };
    };
    errors?: any[];
}

export async function POST(
    req: NextRequest
): Promise<NextResponse<SignInResponse>> {
    try {
        // Validate essential environment variables
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            logger.error("JWT_SECRET is not defined in environment variables.");
            return formatResponse(
                { message: "Internal server error.", success: false },
                500
            );
        }

        // Rate limiting based on client IP
        const clientIp = getClientIp(req);
        try {
            await consumeRateLimiter(clientIp);
        } catch (error) {
            logger.warn(error);
            logger.warn(`Rate limit exceeded for IP: ${clientIp}`);
            return formatResponse(
                {
                    message: "Too many requests. Please try again later.",
                    success: false,
                },
                429
            );
        }

        await connectMongoDB();

        // Validate request body using Zod
        const validation = await validateRequest(
            req,
            userSchemaZod.pick({ email: true, password: true })
        );
        if (!validation.success) {
            logger.warn(
                `Validation failed for sign-in: ${JSON.stringify(
                    validation.errors?.errors
                )}`
            );
            return formatResponse(
                {
                    message: "Invalid input.",
                    success: false,
                    errors: validation.errors?.errors,
                },
                400
            );
        }

        const { email, password } = validation.data!;

        // Find user by email
        const user = await User.findOne({ email }); // Exclude password
        if (!user) {
            logger.warn(`Sign-in attempt with invalid email: ${email}`);
            return formatResponse(
                { message: "Invalid email or password.", success: false },
                401
            );
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn(`Invalid password attempt for email: ${email}`);
            return formatResponse(
                { message: "Invalid email or password.", success: false },
                401
            );
        }

        // Generate JWT token with expiration
        const token = generateToken(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            "1h" // Token expires in 1 hour
        );

        // Set JWT token in HttpOnly cookie for security
        const response = formatResponse(
            {
                message: "Sign-in successful.",
                success: true,
                data: { token, user: { _id: user._id, email: user.email } },
            },
            200
        );

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60, // 1 hour in seconds
        });

        logger.info(`User signed in successfully: ${email}`);
        return response;
    } catch (error) {
        logger.error("Sign-In Error:", error);
        return formatResponse(
            { message: "Internal server error.", success: false },
            500
        );
    }
}
