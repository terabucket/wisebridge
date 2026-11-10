# WiseBridge

**wisebridge.tech** — AI-powered design, development & SEO services by PeachTech LLC.

Clients pick a service, scope it in a chat with **Wise** (an OpenAI-powered consultant), confirm a generated
requirements spec, pay by card through Stripe Checkout, and receive the AI-generated deliverable in the chat.

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components) + **React 19**
- **Tailwind CSS 4** + `@tailwindcss/typography`
- **Motion** for animations, **next-themes** for dark/light mode
- **OpenAI** (Chat Completions, streaming, vision, PDF input, structured outputs)
- **Stripe Checkout** for card payments (optional: demo mode without keys)
- **Zustand + IndexedDB**: projects and chats are stored in the client's browser. No database is needed.

There is no separate backend. The OpenAI/Stripe calls run in Next.js **route handlers** (`src/app/api/*`), which
Vercel deploys as serverless functions automatically. This keeps your secret keys out of the browser.

## Getting started

```bash
cp .env.example .env.local   # then add your OPENAI_API_KEY
npm install
npm run dev                  # http://localhost:3000
```

| Variable | Required | Notes |
| --- | --- | --- |
| `OPENAI_API_KEY` | ✅ | Server-only. Never use a `NEXT_PUBLIC_` prefix. |
| `OPENAI_MODEL` | – | Defaults to `gpt-5-mini`. |
| `STRIPE_SECRET_KEY` | – | If empty, checkout runs in **demo mode** (payment is simulated). |
| `NEXT_PUBLIC_SITE_URL` | – | `https://wisebridge.tech` in production; used for metadata and Stripe redirects. |

### Stripe test payments

Set `STRIPE_SECRET_KEY=sk_test_…`, then pay with card `4242 4242 4242 4242`, any future date and any CVC.
After checkout, the app verifies the session server-side (`/api/checkout/verify`). `/api/generate` refuses to
run unless the Stripe session is `paid` and belongs to that project.

## Client flow

1. `/services` → pick a service → **Start with AI consultant**
2. `/workspace/[id]`: chat with Wise and attach files:
   - images → vision · PDFs (≤ 3 MB) → native PDF input · `.docx`/text → extracted text
   - videos → 3 key frames · other files → attached by name for manual review
3. Wise signals when it has enough information. The client clicks **Prepare requirements summary** and gets a structured spec.
4. **Confirm requirements** → **Pay with card** (Stripe Checkout)
5. The deliverable streams into the chat → copy / download as Markdown

## Project structure

```
src/
  app/
    (marketing)/          home, /services, /services/[slug]
    workspace/            chat app shell + /workspace/[id]
    api/chat              streaming consultant replies
    api/spec              structured requirements spec (JSON schema)
    api/checkout(/verify) Stripe Checkout session + verification
    api/generate          streaming deliverable (payment-gated)
  components/             UI (home sections, workspace chat, brand logo, theme)
  lib/                    service catalog, prompts, OpenAI/Stripe helpers, client store, file processing
```

## CI/CD (GitHub Actions → Vercel)

- `.github/workflows/ci.yml`: lint, typecheck and build on every PR and push to `main`.
- `.github/workflows/deploy.yml`: **preview** deploy for each PR (the URL is posted as a PR comment) and **production**
  deploy on push to `main`. Both run only after lint and typecheck pass.

`vercel.json` turns off Vercel's own Git auto-deploys so each commit deploys only once, via Actions.

**One-time setup**

1. Run `npx vercel link` locally. This creates `.vercel/project.json`, which contains `orgId` and `projectId`.
2. In GitHub → *Settings → Secrets and variables → Actions*, add `VERCEL_TOKEN` (from vercel.com/account/tokens),
   `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.
3. In Vercel → *Project → Settings → Environment Variables*, add `OPENAI_API_KEY`, `STRIPE_SECRET_KEY` (optional),
   `NEXT_PUBLIC_SITE_URL=https://wisebridge.tech`.
4. In Vercel → *Domains*, add `wisebridge.tech` and `www.wisebridge.tech`.

## Notes & limits

- Uploads go to the API as JSON. Images are downscaled and PDFs are capped at 3 MB to stay under Vercel's ~4.5 MB request body limit.
- Projects live in the client's browser (IndexedDB). Clearing site data removes them.
- There's no login or rate limiting yet. Anyone who reaches the site can use your OpenAI key through `/api/chat`.
  Set usage limits in the OpenAI dashboard before launch.
- Images are from [Unsplash](https://unsplash.com) (Unsplash License).
