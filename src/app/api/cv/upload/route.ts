import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.CV_ENCRYPTION_KEY || "default-key-change-me-32bytes!";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

function encryptFile(buffer: Buffer): { encrypted: Buffer; iv: string } {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { encrypted, iv: iv.toString("hex") };
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.hasPaid) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("cv") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { encrypted, iv } = encryptFile(buffer);

    const userId = session.user.id;
    const fileId = uuidv4();
    const ext = file.name.split(".").pop();
    const encryptedFilename = `${fileId}.encrypted`;

    const userDir = join(UPLOAD_DIR, userId);
    await mkdir(userDir, { recursive: true });
    const filePath = join(userDir, encryptedFilename);
    await writeFile(filePath, encrypted);

    // Deactivate old CVs
    await prisma.cV.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    const cv = await prisma.cV.create({
      data: {
        userId,
        filename: encryptedFilename,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        encryptedPath: filePath,
        encryptionIv: iv,
      },
    });

    return NextResponse.json(
      { id: cv.id, message: "CV uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("CV upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}