"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    title: string;
    company: string;
    location: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
  };
}

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (res.ok) setApplications(data.applications);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    applied: "bg-blue-100 text-blue-800",
    reviewing: "bg-yellow-100 text-yellow-800",
    interviewed: "bg-purple-100 text-purple-800",
    offered: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
          <span className="text-lg font-bold text-gray-900">CVMatch AI</span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          My Applications
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Start by searching for jobs and applying!
            </p>
            <button
              onClick={() => router.push("/dashboard/jobs")}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Search Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-lg border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.job.title}
                    </h3>
                    <p className="text-sm text-gray-600">{app.job.company}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                      {app.job.location && <span>📍 {app.job.location}</span>}
                      {app.job.salaryMin && app.job.salaryMax && (
                        <span>
                          💰 £{app.job.salaryMin.toLocaleString()} - £
                          {app.job.salaryMax.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusColors[app.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}