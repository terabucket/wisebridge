# Deploying WiseBridge to Vercel + GoDaddy (wisebridge.tech)

This takes about 30–45 minutes, plus DNS propagation (usually minutes, at most 48 hours).

> **Important:** the `wisebridge/` folder must be the **root of your Git repository**. The workflows in
> `.github/workflows/` only run from the repository root.

---

## Part 1: Push the code to GitHub

1. Create an **empty** repository on GitHub (for example `wisebridge`). Don't add a README or .gitignore.
2. In a terminal, inside the `wisebridge` folder:

   ```bash
   git init
   git add .
   git commit -m "Initial WiseBridge site"
   git branch -M main
   git remote add origin https://github.com/<your-account>/wisebridge.git
   git push -u origin main
   ```

   `.env.local` is git-ignored, so your keys are never pushed. Run `git status` before committing to double-check.
   The first push runs the CI workflow. The deploy jobs fail until you finish Part 3. That's expected.

---

## Part 2: Create the Vercel project

1. Sign up or log in at <https://vercel.com>. Use **Continue with GitHub**.
2. Inside the `wisebridge` folder, link the project:

   ```bash
   npx vercel login
   npx vercel link
   ```

   Answer: *Set up "…/wisebridge"?* → **Y** · choose your team/account · *Link to existing project?* → **N** ·
   project name → `wisebridge` · directory → `./`.
   This creates `.vercel/project.json` (git-ignored), which contains `orgId` and `projectId`.

3. Add environment variables. Go to **Vercel → wisebridge → Settings → Environment Variables** and add these for
   **Production** and **Preview**:

   | Name | Value |
   | --- | --- |
   | `OPENAI_API_KEY` | your `sk-…` key |
   | `OPENAI_MODEL` | `gpt-5-mini` (optional) |
   | `STRIPE_SECRET_KEY` | `sk_test_…` for testing → `sk_live_…` at launch (leave empty for demo mode) |
   | `NEXT_PUBLIC_SITE_URL` | `https://wisebridge.tech` |
   | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | (add later, see Part 6) |

   Then go to **Settings → Functions** and keep the region close to your users (default `iad1` is fine).

---

## Part 3: Connect the GitHub Actions CI/CD pipeline

1. Create a token at <https://vercel.com/account/tokens> named `github-actions`. Copy it.
2. Open `.vercel/project.json` and copy `orgId` and `projectId`.
3. In GitHub, go to **Repo → Settings → Secrets and variables → Actions → New repository secret** and add:
   - `VERCEL_TOKEN`: the token
   - `VERCEL_ORG_ID`: `orgId`
   - `VERCEL_PROJECT_ID`: `projectId`
4. Trigger the first production deploy:

   ```bash
   git commit --allow-empty -m "Trigger deploy"
   git push
   ```

   Watch it under **GitHub → Actions → Deploy to Vercel**. When it turns green, the site is live at
   `https://wisebridge-<something>.vercel.app`. Open it and test the chat.

**How it works from now on:**
- Pull request: lint, typecheck, then a **preview** URL posted as a comment on the PR
- Push or merge to `main`: lint, typecheck, then **production** deploy

(`vercel.json` disables Vercel's own Git auto-deploy, so each commit deploys exactly once.)

---

## Part 4: Add the domain in Vercel

1. Go to **Vercel → wisebridge → Settings → Domains → Add**, then:
   - add `wisebridge.tech`
   - when asked, also add `www.wisebridge.tech` and choose **Redirect www.wisebridge.tech → wisebridge.tech**
2. Vercel shows **Invalid Configuration** and lists the DNS records it needs. **Keep this page open.** You'll copy
   the values into GoDaddy. Usually they are:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

   Vercel sometimes shows a project-specific value instead (for example `216.198.79.1` or `xxxx.vercel-dns-0xx.com`).
   **Always use exactly what your Vercel screen shows.**

---

## Part 5: Point GoDaddy DNS to Vercel

1. Log in at <https://dcc.godaddy.com> and open **Domain Portfolio**. Click **wisebridge.tech**, then **DNS** (the "DNS Records" tab).
2. **Turn off forwarding:** if **Forwarding** is set for the domain, delete it. Forwarding overrides DNS.
3. **Fix the root (`@`) A record:**
   - Find the `A` record with name `@`. It usually says **Parked** or points to a GoDaddy IP. Click **Edit** (pencil).
   - Set **Value** to `76.76.21.21` (or the IP Vercel showed), **TTL** to `600 seconds`, and **Save**.
   - If there are **other** `A` records for `@`, delete them. Leave only Vercel's.
   - Delete any `AAAA` record for `@`.
4. **Fix the `www` CNAME:**
   - Find the `CNAME` record named `www` (by default it points to `@`). Click **Edit**.
   - Set **Value** to `cname.vercel-dns.com` (or the value Vercel showed), **TTL** to `600 seconds`, and **Save**.
5. Don't touch the `NS`, `SOA`, `MX` (email) or `TXT` records.
6. Go back to Vercel → Domains. Within a few minutes both domains show **Valid Configuration**, and Vercel issues
   free **HTTPS certificates** automatically.

   Check propagation from your terminal:

   ```bash
   dig +short wisebridge.tech
   ```

   ```bash
   dig +short www.wisebridge.tech
   ```

   The first command should print Vercel's IP. The second should print `cname.vercel-dns.com.` followed by an IP.

> **Alternative (instead of steps 3–4):** in GoDaddy → DNS → **Nameservers → Change → I'll use my own nameservers**,
> enter `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. Vercel then manages all DNS. If you use GoDaddy email,
> you must re-create your MX/TXT records in Vercel first. Most people should use the A/CNAME method above.

---

## Part 6: Post-launch SEO and AEO checklist

1. **Google Search Console** (<https://search.google.com/search-console>)
   - Add a **Domain** property `wisebridge.tech`. Google gives you a `TXT` record. Add it in GoDaddy DNS
     (Type `TXT`, Name `@`, Value = the `google-site-verification=…` string), then click **Verify**.
     *(Or use a "URL prefix" property with the HTML-tag method: put the code in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploy.)*
   - Go to **Sitemaps** and submit `https://wisebridge.tech/sitemap.xml`.
   - Use **URL Inspection** on `/` and a few `/services/...` pages, then click **Request indexing**.
2. **Bing Webmaster Tools** (<https://www.bing.com/webmasters>): **Import from Google Search Console**. Bing's index
   powers ChatGPT search and Copilot, so this matters for AEO.
3. **Validate structured data:** run <https://search.google.com/test/rich-results> on `/` (FAQ, Organization) and on a
   service page (Service, Breadcrumb, FAQ).
4. **Check share previews:** paste the URL into <https://www.opengraph.xyz> or LinkedIn's Post Inspector.
5. **Check the AI-facing files:** `https://wisebridge.tech/llms.txt`, `/llms-full.txt` and `/robots.txt`.
6. **Stripe go-live:** switch `STRIPE_SECRET_KEY` to the `sk_live_…` key in Vercel and redeploy.
7. **Protect your OpenAI key:** set a monthly budget in the OpenAI dashboard (Settings → Limits). The site has no
   login yet, so anyone can chat.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Vercel says "Invalid Configuration" after 1 hour | GoDaddy still has an extra `A @` record or Forwarding is on. Remove them. |
| `ERR_TOO_MANY_REDIRECTS` | Check the www ↔ apex redirect in Vercel. Only one direction should redirect. |
| Actions job fails with "No existing credentials" | `VERCEL_TOKEN` secret is missing or misspelled. |
| Chat says `OPENAI_API_KEY is not set` | Add the env var in Vercel for **Production**, then redeploy (push a commit). |
| Stripe redirects to `localhost` | `NEXT_PUBLIC_SITE_URL` is not set to `https://wisebridge.tech` in Vercel. |
