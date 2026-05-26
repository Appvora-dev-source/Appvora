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
    const [applications, savedJobs, cvs] = await Promise.all([
      prisma.application.count({
        where: { userId: session.user.id },
      }),
      prisma.savedJob.count({
        where: { userId: session.user.id },
      }),
      prisma.cV.count({
        where: { userId: session.user.id, isActive: true },
      }),
    ]);

    return NextResponse.json({ applications, savedJobs, cvs });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}