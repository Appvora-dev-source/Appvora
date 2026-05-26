import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/saved-jobs - List saved jobs
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: session.user.id },
      include: { job: true },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({ savedJobs });
  } catch (error) {
    console.error("Saved jobs fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/saved-jobs - Save a job
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const schema = z.object({ jobId: z.string().uuid() });
    const { jobId } = schema.parse(body);

    const existing = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId: session.user.id, jobId } },
    });

    if (existing) {
      return NextResponse.json({ error: "Job already saved" }, { status: 409 });
    }

    const savedJob = await prisma.savedJob.create({
      data: { userId: session.user.id, jobId },
      include: { job: true },
    });

    return NextResponse.json(savedJob, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Save job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/saved-jobs - Unsave a job
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const schema = z.object({ jobId: z.string().uuid() });
    const { jobId } = schema.parse(body);

    await prisma.savedJob.delete({
      where: { userId_jobId: { userId: session.user.id, jobId } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Unsave job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}