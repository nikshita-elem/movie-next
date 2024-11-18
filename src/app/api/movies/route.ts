import { isAuth } from "@/libs/Auth";
import connectMongoDB from "@/libs/dbConnect";
import Movie, { movieSchemaZod } from "@/models/movie";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags:
 *         - Movie
 *     summary: Get all movies
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 *       404:
 *         description: No movies found
 *       500:
 *         description: Something went wrong
 */
export async function GET(req: NextRequest) {
    const userId = await isAuth(req)
    if (!userId) {
        return NextResponse.json({ data: null, message: "Unauthorized You Must Login First", success: false }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        await connectMongoDB();

        const movieCount = await Movie.countDocuments({ userId });
        const movies = await Movie.find({ userId })
            .skip((page - 1) * 8)
            .limit(8)
            .sort({ _id: -1 });

        if (!movies || movies.length === 0) {
            return NextResponse.json({ data: [], message: "No movies found", success: false }, { status: 200 });
        }

        return NextResponse.json({ data: movies, totalData: movieCount, message: "Movies retrieved successfully", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ data: error, message: "Something went wrong", success: false }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/movies:
 *   post:
 *     tags:
 *        - Movie
 *     summary: Create a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie created successfully
 *       404:
 *         description: Invalid inputs
 *       500:
 *         description: Something went wrong
 */
export async function POST(req: NextRequest) {
    const userId = await isAuth(req)

    if (!userId) {
        return NextResponse.json({ data: null, message: "Unauthorized You Must Login First", success: false }, { status: 401 });
    }
    try {
        await connectMongoDB();
        const { title, year, image } = await req.json();
        const movieData = movieSchemaZod.pick({
            title: true,
            year: true,
        });
        const { success, error } = movieData.safeParse({ title, year });
        if (!success) {
            return NextResponse.json({ data: [error], message: "Invalid inputs", success: false }, { status: 404 });
        }

        const movie = await Movie.create({ title, year, image, userId });
        return NextResponse.json({ data: movie, message: "Movie created successfully", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ data: error, message: "Something went wrong", success: false }, { status: 500 });
    }
}