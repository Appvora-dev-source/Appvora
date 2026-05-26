import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/applications - List user's applications
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  try {
    const where: any = { userId: session.user.id };

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: true,
          cv: { select: { originalName: true, uploadedAt: true } },
        },
        skip,
        take: limit,
        orderBy: { appliedAt: "desc" },
      }),
      prisma.application.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Applications fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/applications - Apply to a job
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.hasPaid) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  try {
    const body = await request.json();
    const schema = z.object({
      jobId: z.string().uuid(),
      cvId: z.string().uuid().optional(),
      notes: z.string().max(1000).optional(),
    });

    const parsed = schema.parse(body);

    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        jobId: parsed.jobId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already applied to this job" },
        { status: 409 }
      );
    }

    // Check job exists
    const job = await prisma.job.findUnique({
      where: { id: parsed.jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        jobId: parsed.jobId,
        cvId: parsed.cvId,
        notes: parsed.notes,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}