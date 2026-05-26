"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.hasPaid) {
      setSuccess(true);
    }
  }, [session]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=GBP`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: async () => {
            try {
              const res = await fetch("/api/payment", { method: "POST" });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error);
              return data.orderId;
            } catch (err: any) {
              setError(err.message);
              throw err;
            }
          },
          onApprove: async (data: any) => {
            setLoading(true);
            try {
              const res = await fetch("/api/payment", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID }),
              });
              const result = await res.json();
              if (!res.ok) throw new Error(result.error);
              setSuccess(true);
              setTimeout(() => router.push("/dashboard"), 2000);
            } catch (err: any) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          },
          onError: (err: any) => {
            setError("Payment failed. Please try again.");
            console.error(err);
          },
        }).render("#paypal-button-container");
      }
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        `script[src*="paypal.com/sdk/js"]`
      );
      if (existingScript) existingScript.remove();
    };
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-2 text-gray-600">
            You now have full access to all CVMatch AI features.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-white p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Unlock CVMatch AI
            </h1>
            <p className="mt-2 text-gray-600">
              One-time payment for lifetime access
            </p>
          </div>

          <div className="text-center mb-6">
            <span className="text-5xl font-bold text-gray-900">£55</span>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading && (
            <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-600">
              Processing your payment...
            </div>
          )}

          <div id="paypal-button-container" className="mt-4"></div>

          <p className="mt-4 text-center text-xs text-gray-500">
            Secure payment processed by PayPal. Your data is protected.
          </p>
        </div>
      </div>
    </div>
  );
}