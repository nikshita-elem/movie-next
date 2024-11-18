import mongoose, { Schema } from "mongoose";
import { string, z } from "zod";

export const userSchemaZod = z.object({
    email: string().email(),
    password: string()

});

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;