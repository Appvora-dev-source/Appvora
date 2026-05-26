import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Create PayPal order
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.hasPaid) {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'GBP',
            value: '55.00',
          },
          description: 'CVMatch AI Lifetime Access',
        }],
      }),
    });

    const order = await orderResponse.json();

    // Store order in database
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        orderId: order.id,
        amount: 55.00,
        currency: 'GBP',
        status: 'created',
        paypalResponse: JSON.stringify(order),
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    return NextResponse.json({ error: 'Payment processing error' }, { status: 500 });
  }
}

// Capture PayPal order (after approval)
export async function PUT(request: Request) {
  const authSession = await getServerSession(authOptions);

  if (!authSession?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId } = z.object({ orderId: z.string() }).parse(body);

    const accessToken = await getPayPalAccessToken();

    const captureResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const capture = await captureResponse.json();

    if (capture.status === 'COMPLETED') {
      // Update payment record
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          paypalResponse: JSON.stringify(capture),
        },
      });

      // Grant user access
      await prisma.user.update({
        where: { id: authSession.user.id },
        data: {
          hasPaid: true,
          paymentDate: new Date(),
          paypalOrderId: orderId,
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({ error: 'Payment verification error' }, { status: 500 });
  }
}