"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SavedJob {
  id: string;
  savedAt: string;
  notes: string | null;
  job: {
    id: string;
    title: string;
    company: string;
    location: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    jobType: string | null;
  };
}

export default function SavedJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saved-jobs");
      const data = await res.json();
      if (res.ok) setSavedJobs(data.savedJobs);
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId: string) => {
    try {
      const res = await fetch("/api/saved-jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        setSavedJobs((prev) => prev.filter((sj) => sj.job.id !== jobId));
      }
    } catch (err) {
      console.error("Failed to unsave job", err);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Application submitted!");
        setSavedJobs((prev) => prev.filter((sj) => sj.job.id !== jobId));
      } else {
        alert(data.error || "Failed to apply");
      }
    } catch {
      alert("Failed to apply");
    }
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Jobs</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No saved jobs yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Save jobs you&apos;re interested in to review later.
            </p>
            <button
              onClick={() => router.push("/dashboard/jobs")}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((saved) => (
              <div
                key={saved.id}
                className="rounded-lg border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {saved.job.title}
                    </h3>
                    <p className="text-sm text-gray-600">{saved.job.company}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                      {saved.job.location && (
                        <span>📍 {saved.job.location}</span>
                      )}
                      {saved.job.jobType && (
                        <span>💼 {saved.job.jobType}</span>
                      )}
                      {saved.job.salaryMin && saved.job.salaryMax && (
                        <span>
                          💰 £{saved.job.salaryMin.toLocaleString()} - £
                          {saved.job.salaryMax.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Saved {new Date(saved.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    {session?.user?.hasPaid && (
                      <button
                        onClick={() => handleApply(saved.job.id)}
                        className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500"
                      >
                        Apply
                      </button>
                    )}
                    <button
                      onClick={() => handleUnsave(saved.job.id)}
                      className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}