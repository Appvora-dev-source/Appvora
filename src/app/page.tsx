import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg gradient-brand flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-neutral-900">
                CVMatch<span className="text-primary-600">AI</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {["Home", "Features", "Pricing"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full bg-primary-50 border border-primary-200 px-4 py-1.5 mb-6">
              <span className="text-sm font-medium text-primary-700">🚀 AI-Powered Job Matching</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-neutral-900 tracking-tight mb-6">
              Stop Scrolling.
              <br />
              <span className="text-gradient">Start Matching.</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
              Upload your CV once and let AI find the perfect jobs for you.
              Get personalised recommendations, resume insights, and career advice — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                  Get Started Free
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {[
                { value: '10,000+', label: 'Jobs Listed' },
                { value: '5,000+', label: 'Active Users' },
                { value: '92%', label: 'Match Accuracy' },
                { value: '3x', label: 'More Interviews' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1">{stat.value}</p>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-neutral-50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Everything you need to land your next role
            </h2>
            <p className="text-lg text-neutral-600">
              From AI-powered CV analysis to smart job matching — we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.name} className="hover:shadow-soft transition-all duration-200">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 text-xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.name}</h3>
                  <p className="text-sm text-neutral-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="default" size="lg" className="mb-4">🎉 Launch Special</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              One payment. Lifetime access.
            </h2>
            <p className="text-lg text-neutral-600">
              No subscriptions. No hidden fees. Pay once and unlock everything.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-white border-2 border-primary-200 rounded-3xl p-8 shadow-elevated relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary-600 to-primary-800 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                  Best Value
                </span>
              </div>

              <div className="text-center mb-8">
                <p className="text-sm font-medium text-neutral-500 mb-2">Lifetime Access</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-neutral-900">£55</span>
                  <span className="text-neutral-500">/once</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'AI-powered CV analysis',
                  'Smart job matching',
                  'Unlimited job searches',
                  'Resume improvement suggestions',
                  'Application tracking dashboard',
                  'Personalised career advice',
                  'Save unlimited jobs',
                  'Priority support',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button variant="gradient" size="xl" className="w-full">
                  Get Started Now
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>

              <p className="text-center text-xs text-neutral-500 mt-4">
                One-time payment via PayPal. 14-day money-back guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-10 sm:p-16 shadow-elevated">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to find your dream job?
            </h2>
            <p className="text-lg text-blue-200 mb-8 max-w-lg mx-auto">
              Join thousands of job seekers who found their perfect match with CVMatch AI.
            </p>
            <Link href="/register">
              <Button variant="secondary" size="xl">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">CVMatch<span className="text-primary-400">AI</span></span>
              </div>
              <p className="text-sm text-neutral-400 max-w-sm">
                AI-powered job matching platform that helps you find the perfect role. Upload your CV and let our AI do the rest.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/search" className="hover:text-white transition-colors">Find Jobs</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-neutral-800 text-center text-sm text-neutral-500">
            <p>© 2024 CVMatch AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    name: "AI CV Analysis",
    description: "Upload your CV and let AI extract your skills, experience, and qualifications in seconds.",
    icon: "🤖",
  },
  {
    name: "Smart Job Matching",
    description: "Get matched with jobs that fit your unique profile. No more endless scrolling.",
    icon: "🎯",
  },
  {
    name: "Resume Improvement",
    description: "Receive AI-powered suggestions to strengthen your CV and stand out from the crowd.",
    icon: "📈",
  },
  {
    name: "Advanced Search",
    description: "Filter jobs by salary, location, job type, and more. Find exactly what you're looking for.",
    icon: "🔍",
  },
  {
    name: "Application Tracker",
    description: "Keep track of every job you apply for. Never lose sight of your opportunities.",
    icon: "📋",
  },
  {
    name: "Career Advice",
    description: "Get personalised career guidance powered by AI based on your unique profile.",
    icon: "💡",
  },
];
