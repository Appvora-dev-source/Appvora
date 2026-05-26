"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CV {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
  analysisJson: string | null;
}

export default function CvPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchCvs();
  }, []);

  const fetchCvs = async () => {
    try {
      const res = await fetch("/api/cv/list");
      const data = await res.json();
      if (res.ok) setCvs(data.cvs || []);
    } catch (err) {
      console.error("Failed to fetch CVs", err);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("cv") as HTMLInputElement;

    if (!fileInput?.files?.[0]) {
      setError("Please select a file");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("cv", fileInput.files[0]);

    try {
      const res = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setSuccess("CV uploaded successfully!");
        fileInput.value = "";
        fetchCvs();
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

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

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My CVs</h1>

        {!session.user?.hasPaid && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              You need to unlock full access to upload CVs.{' '}
              <button
                onClick={() => router.push("/payment")}
                className="font-semibold text-yellow-600 underline"
              >
                Pay £55 now
              </button>
            </p>
          </div>
        )}

        {/* Upload form */}
        <form
          onSubmit={handleUpload}
          className="mb-8 rounded-lg border bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload New CV
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CV File (PDF or DOCX, max 10MB)
            </label>
            <input
              type="file"
              name="cv"
              accept=".pdf,.docx"
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              disabled={!session.user?.hasPaid}
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !session.user?.hasPaid}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload CV"}
          </button>
        </form>

        {/* CV list */}
        <div className="space-y-4">
          {cvs.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No CVs uploaded yet. Upload your first CV above.
            </p>
          ) : (
            cvs.map((cv) => (
              <div
                key={cv.id}
                className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{cv.originalName}</p>
                  <p className="text-sm text-gray-500">
                    {(cv.fileSize / 1024).toFixed(1)} KB •{" "}
                    {new Date(cv.uploadedAt).toLocaleDateString()}
                    {cv.analysisJson ? " • Analysed ✓" : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}