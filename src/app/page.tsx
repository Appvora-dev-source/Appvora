import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your AI-Powered
              <span className="text-blue-600"> Job Matchmaker</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Upload your CV once. Let AI analyse your skills, experience, and
              goals — then get matched with the perfect job opportunities.
              Stop scrolling, start matching.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get Started — £55 Lifetime Access
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Everything you need to land your next role
            </h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Simple, one-time payment
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No subscriptions. No hidden fees. Pay once, use forever.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-md">
            <div className="rounded-2xl border border-blue-200 bg-white p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">
                Lifetime Access
              </h3>
              <p className="mt-4">
                <span className="text-5xl font-bold text-gray-900">£55</span>
                <span className="text-gray-500"> one-time</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> AI CV analysis & skill extraction
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Personalised job matching
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Resume improvement suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Advanced job search with filters
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Application tracking dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Save jobs & get alerts
                </li>
              </ul>
              <Link
                href="/register"
                className="mt-8 flex w-full justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          <p>© 2024 CVMatch AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    name: "AI CV Analysis",
    description:
      "Upload your CV and let AI extract your skills, experience, and qualifications in seconds.",
    icon: "🤖",
  },
  {
    name: "Smart Job Matching",
    description:
      "Get matched with jobs that fit your unique profile. No more endless scrolling.",
    icon: "🎯",
  },
  {
    name: "Resume Improvement",
    description:
      "Receive AI-powered suggestions to strengthen your CV and stand out from the crowd.",
    icon: "📈",
  },
  {
    name: "Advanced Search",
    description:
      "Filter jobs by salary, location, job type, and more. Find exactly what you're looking for.",
    icon: "🔍",
  },
  {
    name: "Application Tracker",
    description:
      "Keep track of every job you apply for. Never lose sight of your opportunities.",
    icon: "📋",
  },
  {
    name: "Career Advice",
    description:
      "Get personalised career guidance powered by AI based on your unique profile.",
    icon: "💡",
  },
];