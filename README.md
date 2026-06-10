# NJ Motors — Used Car Dealership Site

Payload 3 (CMS + admin) running **inside** a Next.js 15 App Router app. One repo, one deploy.
Postgres on Neon, car photos on Vercel Blob, enquiry emails via Resend.

This README is the order to do things in. Don't skip ahead — the #1 cause of "works locally,
breaks on Vercel" is a missing environment variable.

---

## 0. What you need (sign up — ~20 min, do this first)

You can't skip these; they need YOUR logins. Get the keys, paste them into `.env`.

| Service | Sign up at | What you copy out |
| --- | --- | --- |
| **GitHub** | github.com | (just need a repo to push to) |
| **Neon** (Postgres) | neon.tech | the **pooled** connection string |
| **Vercel** | vercel.com | (hosting — connect your GitHub repo) |
| **Vercel Blob** | Vercel dashboard → Storage → Create → Blob | `BLOB_READ_WRITE_TOKEN` |
| **Resend** | resend.com | `RESEND_API_KEY` |

### Neon
1. Create a project → it gives you a connection string.
2. **Use the pooled one** (the host contains `-pooler`). Paste into `DATABASE_URI`.

### Vercel Blob
1. In the Vercel dashboard, create the project first (step 3 below) OR create a Blob store standalone.
2. Storage → Create Database → **Blob**. Copy the `BLOB_READ_WRITE_TOKEN`.

### Resend
1. Create an account, go to **API Keys**, create one → copy into `RESEND_API_KEY`.
2. For a Tuesday demo you can send **from** `onboarding@resend.dev` (Resend's test sender) — keep
   `ENQUIRY_FROM_EMAIL=onboarding@resend.dev`. For production you'd verify a real domain.
3. Set `ENQUIRY_TO_EMAIL` to the inbox where you want leads to land (your own, for the demo).

---

## 1. Local setup

```bash
# from inside this folder
npm install          # if peer-dep errors: npm install --legacy-peer-deps

cp .env.example .env
# now open .env and fill in all 5 values from step 0
# generate a PAYLOAD_SECRET with:  openssl rand -base64 32
```

---

## 2. First run + create your admin login

```bash
npm run dev
```

- Open **http://localhost:3000/admin** — Payload will run its DB migrations against Neon and
  show a "create first user" screen. That's the NJ Motors owner login.
- Public site is at **http://localhost:3000**.

> If `/admin` errors about types, run `npm run generate:types` once, then restart `npm run dev`.
> This regenerates `src/payload-types.ts` from your actual collections (replacing the stub).

---

## 3. Seed sample cars (optional but recommended)

Gives you 3 available + 1 sold car with real photos so you have something to build/demo against.

```bash
npm run seed
```

(It also creates `admin@njmotors.test` / `changeme123` if no user exists yet — change that
password in the admin panel.)

You can also just add cars by hand: **/admin → Vehicles → Create New**.

---

## 4. Fill in the company details

**/admin → Globals → Company Settings.** Add phone, email, address, opening hours, WhatsApp
number. The header phone button, footer, sticky mobile bar and contact page all read from here —
nothing is hardcoded.

---

## 5. Deploy to Vercel

```bash
git init && git add -A && git commit -m "NJ Motors site"
# create an empty repo on GitHub, then:
git remote add origin https://github.com/YOU/njmotors.git
git push -u origin main
```

1. Vercel → **Add New → Project** → import the GitHub repo.
2. Before deploying, add **Environment Variables** (Settings → Environment Variables) — paste the
   SAME five values from your `.env`:
   - `DATABASE_URI`
   - `PAYLOAD_SECRET`
   - `BLOB_READ_WRITE_TOKEN`
   - `RESEND_API_KEY`
   - `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL`
   - (optional) `NEXT_PUBLIC_SITE_URL` = your live URL, for the sitemap.
3. If you created the Blob store inside this Vercel project, `BLOB_READ_WRITE_TOKEN` may already
   be there automatically.
4. Deploy. Visit `your-url.vercel.app/admin`, create the owner user (the prod DB is separate from
   local unless you used the same Neon DB), add a car, check it shows on the site.

---

## 6. Definition of done checklist (from the brief)

- [ ] Owner logs into `/admin`, adds a car with photos → it appears on the site
- [ ] Visitor browses `/stock`, opens a car, sees full specs + price + gallery
- [ ] Visitor sees `/sold`
- [ ] Visitor submits an enquiry → email lands in `ENQUIRY_TO_EMAIL` AND a record appears in
      **/admin → Enquiries**
- [ ] Reads well (real copy) and works on a phone

---

## How it's wired (quick map)

```
src/
  payload.config.ts        ← collections, Neon, Vercel Blob plugin
  collections/
    Vehicles.ts            ← the core data model (status drives Stock vs Sold)
    Media.ts               ← uploads → Vercel Blob, responsive image sizes
    Enquiries.ts           ← form submissions (saved even if email fails)
    Users.ts               ← owner login
  globals/CompanySettings.ts ← site-wide contact details
  app/
    (payload)/             ← admin panel + REST/GraphQL (don't edit — boilerplate)
    (frontend)/            ← the public site
      page.tsx             ← home (hero, trust, featured, sold teaser)
      stock/page.tsx       ← grid + filters (status != Sold)
      stock/[slug]/page.tsx← detail: gallery, specs, sticky enquiry CTA
      sold/page.tsx        ← Recently Sold (status = Sold, by soldDate)
      about / contact / thank-you
    api/enquiry/route.ts   ← saves enquiry → sends Resend email
  components/              ← Header, Footer, VehicleCard, EnquiryForm, etc.
  seed.ts                  ← sample data
```

## Notes / gotchas
- **Images must persist on Vercel** → handled by the Vercel Blob plugin in `payload.config.ts`
  (`clientUploads: true` also dodges Vercel's 4.5MB serverless upload limit).
- **Slugs** auto-generate from the car title (`beforeChange` hook in `Vehicles.ts`).
- **No Relume dependency** — layouts were built directly in Tailwind, so the repo is clean.
- If a deploy build fails on types, run `npm run generate:types` locally, commit the result, push.
