import { getService } from "@/lib/services";
import { getStripe } from "@/lib/stripe";


/** Creates a Stripe Checkout session (card payments). Price is always taken from the server-side catalog. */
export async function POST(req: Request) {
  try {
    const { projectId, serviceSlug, specTitle } = (await req.json()) as {
      projectId: string;
      serviceSlug: string;
      specTitle?: string;
    };
    const service = getService(serviceSlug);
    if (!service || !projectId) return Response.json({ error: "Invalid order" }, { status: 400 });

    const stripe = getStripe();
    if (!stripe) return Response.json({ demo: true });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: service.price * 100,
            product_data: {
              name: `WiseBridge · ${service.title}`,
              description: (specTitle || service.tagline).slice(0, 300),
            },
          },
        },
      ],
      metadata: { projectId, serviceSlug },
      success_url: `${origin}/workspace/${projectId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/workspace/${projectId}?canceled=1`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Checkout failed" }, { status: 500 });
  }
}
