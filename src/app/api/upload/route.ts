import { isAuth } from "@/libs/Auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const config = {
    aws: {
        bucket: process.env.AWS_BUCKET_NAME || "",
        region: process.env.AWS_REGION || "",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
}

const s3 = new S3Client({
    region: config.aws.region,
    endpoint: `https://s3.${config.aws.region}.amazonaws.com`,
    credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
    },
});

export async function POST(req: NextRequest) {
    const userId = await isAuth(req);
    if (!userId) {
        return NextResponse.json(
            { data: null, message: "Unauthorized: You Must Login First", success: false },
            { status: 401 }
        );
    }

    try {
        const body = await req.formData();
        const file = body.get('file') as File;
        if (!file) {
            return NextResponse.json(
                { data: null, message: "No file uploaded", success: false },
                { status: 400 }
            );
        }

        const filePath = `uploads/${Date.now()}_${file.name}`;
        const buffer = await file.arrayBuffer();
        const fileData = Buffer.from(buffer);

        const command = new PutObjectCommand({
            Bucket: config.aws.bucket,
            Key: filePath,
            Body: fileData,
            ACL: "public-read",
            ContentType: file.type,
        });

        await s3.send(command);

        const fileUrl = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${filePath}`;
        return NextResponse.json(
            { data: fileUrl, message: "Image uploaded successfully", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { data: error, message: "Something went wrong", success: false },
            { status: 500 }
        );
    }
}