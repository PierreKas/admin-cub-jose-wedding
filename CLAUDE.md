# CLAUDE.md - cub-jose-wedding/frontend

Guidance for Claude Code when working in this repo.

## What this is

Invitation management app for the wedding of **Christian & Joséphine**
("cub-jose-wedding"). This is currently a **frontend-only simulation** - all
data lives in the browser (localStorage), there is no backend yet (see
`../backend/`, empty as of this writing). The admin creates invitees, the
system generates a QR code per invitee and bakes it into a wedding-styled
invitation image, and an admin-side scanner marks guests present at the
door.

Two references drove the design (`../images/`):
- `admin-should-look-like-this.png` - a dashboard ("Inuwa-Admin") whose
  **structure** (dark sidebar nav + user block, light content area, header +
  search + status-filter tabs, card grid with status pill/tags/avatar/arrow)
  was reused as-is, reskinned in chocolate/beige/gold.
- `invitation-image.jpeg` - a real wedding invitation card (different
  couple, used purely as a style reference) whose **layout** (script
  "Invitation" title, family intro text, blank addressed-to line, couple
  names in cursive, gold time badges for the ceremony schedule) was rebuilt
  for Christian & Joséphine in `InvitationCard.jsx`, with a generated QR
  code composited into it.

## Stack

- React 19 + Vite 7
- Tailwind CSS v4 via `@tailwindcss/vite` (config lives in `src/index.css` `@theme`, no `tailwind.config`)
- React Router v7 (`BrowserRouter`)
- `qrcode` (generate), `html5-qrcode` (camera scan), `html-to-image` (export the invitation card as one PNG)
- `lucide-react` for icons

## Commands

```bash
npm run dev      # Vite dev server (localhost:5173)
npm run build    # vite build -> dist/
npm run lint     # eslint
npm run preview  # serve dist/
```

## The invitee flow (what actually happens)

1. Admin fills `InviteeFormPage` (civilité, nom, type `single`/`couple`).
2. `useInvitees().addInvitee()` creates the record in the local store
   (`context/InviteesContext.jsx`, persisted to `localStorage` under
   `cj-wedding.invitees.v1`) and navigates to `InviteeDetailPage`.
3. `InvitationCard.jsx` renders the invitation for that guest; inside it,
   `encodeGuestPayload(guest)` (`constants/qrPayload.js`) Base64-encodes
   `{ code: WEDDING_CODE, id, n: name, t: type }` and `useQrDataUrl` turns
   that string into a QR `<img>` via the `qrcode` package - composited
   directly into the card's DOM.
4. "Télécharger l'image" runs `html-to-image`'s `toPng()` on the card's DOM
   node (`pixelRatio: 3` for print quality) and downloads **one PNG file**
   that already contains the invitation design + the QR code baked in -
   that's the file the admin shares with the guest (WhatsApp, print...).
   There's also a public `/invitation/:id` link showing the same card, as a
   secondary option - the primary distribution path is the downloaded image,
   not the link.
5. At the door: `ScannerPage` runs `html5-qrcode` against the camera. A
   decoded string goes through `resolveScannedCode()` ->
   `decodeGuestPayload()`, which checks the `WEDDING_CODE` matches before
   trusting the payload at all (so a QR from a different event, or a random
   QR, is rejected outright). If valid, it looks the `id` up in the local
   store and shows one of four modals (`ScanResultPanel` in `ScannerPage.jsx`):
   confirm ("Marquer la présence de cet invité ?"), déjà présent, invalide,
   or confirmed. Confirming calls `markPresent(id)`, which flips
   `status: "attente" -> "present"` - from then on that same QR always
   resolves to "déjà présent", it can't be re-used to check in twice.
   There's also a no-camera "Test du scanner" panel that simulates a scan
   for any seeded invitee, useful for demos and devices without a working
   camera.

**Important for the backend integration later**: `decodeGuestPayload`'s
Base64 encoding is an *obfuscation*, not real security - it stops a generic
camera app from reading the guest's name off the QR, but anyone who reads
the frontend source can decode it too. The real authority (does this
invitee exist, is it already checked in) must move server-side; treat
everything in `InviteesContext.jsx` as what the backend API needs to
reproduce.

## Branding

- **Chocolate & beige**, tokens in `src/index.css` `@theme`:
  `--color-chocolate` (`#4A2C1D`, = `primary`), `--color-chocolate-dark`
  (`#2B1810`, = `secondary`, the sidebar/dark-panel colour), `--color-beige`
  (`#F6ECDD`, = `soft-background`), `--color-beige-dark` (borders),
  `--color-cream` (card surfaces), `--color-gold`/`--color-accent`
  (`#C9A227`, the invitation's time-badges + admin's primary buttons/CTAs).
- **Fonts**: `Poppins` (default body/UI), `Playfair Display` (`.font-display`,
  headings across the admin UI), `Great Vibes` (`.font-script`, the cursive
  "Invitation" title and the couple's names on the invitation card only -
  don't use it for UI chrome, it's illegible at small sizes).
- Wedding logistics (date, ceremony schedule, venue, contact numbers,
  family intro text) are **placeholders** in `src/constants/wedding.js` -
  swap them for the real details before this goes anywhere near production.
  `WEDDING_CODE` in the same file is the secret embedded in every QR;
  change it if it ever leaks.

## Auth

`context/AuthContext.jsx` is a **mock**, client-side-only login
(hardcoded `admin` / `mariage2026` in that file, session flag in
`sessionStorage`) gating everything under `/admin` via
`components/RequireAuth.jsx`. This exists purely so the admin flow feels
complete in the simulation - it is not real security and must be replaced
by actual backend authentication.

## Structure & conventions

- Routes: `src/App.jsx`. `/admin/*` is nested under `AdminLayout.jsx`
  (sidebar + `<Outlet/>`); `/login` and `/invitation/:id` are standalone,
  unauthenticated pages.
- Context objects live in their own non-JSX files
  (`context/authContextObject.js`, `context/inviteesContextObject.js`) so
  that the Provider component (`context/*Context.jsx`) and the consumer
  hook (`hooks/useAuth.js`, `hooks/useInvitees.js`) can each live in a
  file that exports *only* one kind of thing - required for
  `react-refresh/only-export-components` to stay clean (do not merge a
  hook back into a Provider file, it'll bring back that lint error).
- `Badges.jsx` exports the two small shared pills (`StatusPill`,
  `TypeTag`) used across the dashboard, list, detail and scanner pages -
  add new shared badges there rather than duplicating markup.

## Lint

`npm run lint` reports **1 pre-existing error** - `'Icon' is defined but
never used` in `DashboardPage.jsx` (the `StatCard` component's
`{ icon: Icon }` prop, referenced as `<Icon />`). Verified as a **false
positive**: this ESLint config has no `eslint-plugin-react`, so the base
`no-unused-vars` rule doesn't track JSX-tag usage of a *function
parameter* (whether renamed or not) - only usage of top-level
imports/bindings. Confirmed by isolated repro; don't "fix" by renaming or
restructuring. New real lint errors should be fixed.

## Deploying

Not wired to Vercel yet (no `vercel.json`) since this is still the frontend
simulation phase - add one (static build, SPA rewrite) once the backend
exists and this is ready to ship.
