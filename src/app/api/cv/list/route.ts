import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cvs = await prisma.cV.findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { uploadedAt: "desc" },
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        fileSize: true,
        uploadedAt: true,
        analysisJson: true,
      },
    });

    return NextResponse.json({ cvs });
  } catch (error) {
    console.error("CV list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}