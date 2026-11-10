import { verifyPaidSession } from "@/lib/stripe";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  const projectId = url.searchParams.get("project_id");
  if (!sessionId || !projectId) return Response.json({ paid: false }, { status: 400 });
  try {
    const { ok } = await verifyPaidSession(sessionId, projectId);
    return Response.json({ paid: ok });
  } catch {
    return Response.json({ paid: false }, { status: 400 });
  }
}
