import "server-only";
import Stripe from "stripe";

let stripe: Stripe | null = null;

/** Returns null when Stripe isn't configured — the app then runs payments in demo mode. */
export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}

export async function verifyPaidSession(sessionId: string, projectId: string) {
  const s = getStripe();
  if (!s) return { ok: true as const, demo: true };
  const session = await s.checkout.sessions.retrieve(sessionId);
  const ok = session.payment_status === "paid" && session.metadata?.projectId === projectId;
  return { ok, demo: false, session };
}
