import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/jobs - List jobs with filtering
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const jobType = searchParams.get("jobType") || "";
  const category = searchParams.get("category") || "";
  const minSalary = searchParams.get("minSalary") ? Number(searchParams.get("minSalary")) : undefined;
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  try {
    const where: any = { isActive: true };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (category) {
      where.category = category;
    }

    if (minSalary) {
      where.salaryMax = { gte: minSalary };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { postedAt: "desc" },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Jobs fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/jobs - Create a job (admin/API)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const schema = z.object({
      title: z.string().min(1).max(200),
      company: z.string().min(1).max(200),
      description: z.string().min(1),
      location: z.string().optional(),
      salaryMin: z.number().optional(),
      salaryMax: z.number().optional(),
      currency: z.string().default("GBP"),
      jobType: z.string().optional(),
      category: z.string().optional(),
      sourceUrl: z.string().url().optional(),
    });

    const parsed = schema.parse(body);

    const job = await prisma.job.create({
      data: parsed,
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Job creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}