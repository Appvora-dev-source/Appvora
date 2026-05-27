"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Email" type="email" placeholder="you@example.com" required />
          <Input label="Password" type="password" placeholder="Enter your password" required />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm text-neutral-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary-600 font-medium hover:text-primary-700">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
