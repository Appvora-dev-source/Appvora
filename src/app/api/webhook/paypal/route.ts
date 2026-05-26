const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || "";
const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers);

    // Verify webhook signature
    const verification = await verifyWebhookSignature(body, headers);

    if (!verification) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
      // Payment was approved - will be captured by frontend
      return new Response("OK", { status: 200 });
    }

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      // Payment captured successfully
      return new Response("OK", { status: 200 });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Error", { status: 500 });
  }
}

async function verifyWebhookSignature(
  body: string,
  headers: Record<string, string>
): Promise<boolean> {
  try {
    const authHeader = headers["authorization"];

    const response = await fetch(
      `${PAYPAL_API}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
        body: JSON.stringify({
          auth_algo: headers["paypal-auth-algo"],
          cert_url: headers["paypal-cert-url"],
          transmission_id: headers["paypal-transmission-id"],
          transmission_sig: headers["paypal-transmission-sig"],
          transmission_time: headers["paypal-transmission-time"],
          webhook_id: PAYPAL_WEBHOOK_ID,
          webhook_event: JSON.parse(body),
        }),
      }
    );

    const result = await response.json();
    return result.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}