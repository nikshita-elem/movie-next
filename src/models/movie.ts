import mongoose, { Schema } from "mongoose";
import { number, string, z } from "zod";

export const movieSchemaZod = z.object({
    title: string(),
    image: string(),
    year: number(),
});

const movieSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        link: {
            type: String,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;