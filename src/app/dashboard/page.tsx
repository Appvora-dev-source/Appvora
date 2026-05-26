"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    applications: 0,
    savedJobs: 0,
    cvs: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/dashboard/stats")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(console.error);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                CVMatch AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user?.name || session.user?.email}</span>
              <button
                onClick={() => router.push("/api/auth/signout")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome{session.user?.name ? `, ${session.user.name}` : ""}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your job search from one place
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">
              Applications
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.applications}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.savedJobs}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">CVs Uploaded</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.cvs}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {!session.user?.hasPaid && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
              <h3 className="font-semibold text-yellow-800">Unlock Full Access</h3>
              <p className="mt-2 text-sm text-yellow-700">
                Pay £55 once to unlock AI CV analysis, job matching, and more.
              </p>
              <Link
                href="/payment"
                className="mt-4 inline-block rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-500"
              >
                Pay Now
              </Link>
            </div>
          )}

          <Link
            href="/dashboard/cv"
            className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Upload CV</h3>
            <p className="mt-2 text-sm text-gray-600">
              Upload your CV for AI analysis and job matching
            </p>
          </Link>

          <Link
            href="/dashboard/jobs"
            className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Search Jobs</h3>
            <p className="mt-2 text-sm text-gray-600">
              Find jobs that match your skills and experience
            </p>
          </Link>

          <Link
            href="/dashboard/applications"
            className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">My Applications</h3>
            <p className="mt-2 text-sm text-gray-600">
              Track your job applications
            </p>
          </Link>

          <Link
            href="/dashboard/saved"
            className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Saved Jobs</h3>
            <p className="mt-2 text-sm text-gray-600">
              View your saved job listings
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}