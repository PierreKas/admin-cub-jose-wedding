# CLAUDE.md - cub-jose-wedding/frontend

Guidance for Claude Code when working in this repo.

## What this is

Invitation management app for the wedding of **Christian & Joséphine**
("cub-jose-wedding"). It talks to a real backend now (`../backend/`, a
single Spring Boot service - see its README) via `src/api/*.js`; nothing
is read from or written to `localStorage` anymore (auth's bearer token is
the one exception kept in `sessionStorage`, same session-scoped lifetime
as before). The admin creates invitees, the system generates a QR code
per invitee and bakes it into a wedding-styled invitation image, and an
admin-side scanner marks guests present at the door.

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
2. `useInvitees().addInvitee()` calls `POST /api/invitees`
   (`context/InviteesContext.jsx` -> `api/inviteesApi.js`), stores the
   created record in React state, and navigates to `InviteeDetailPage`.
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
   QR, is rejected outright). If valid, it calls `GET
   /api/invitees/{id}` and shows one of four modals (`ScanResultPanel` in
   `ScannerPage.jsx`): confirm ("Marquer la présence de cet invité ?"),
   déjà présent, invalide, or confirmed. Confirming calls `markPresent(id)`
   -> `POST /api/invitees/{id}/checkin`, a single conditional `UPDATE ...
   WHERE status = 'attente'` on the backend
   (`InviteeRepository.markPresentIfPending`) - that's what actually makes
   "the same QR can't check in twice" atomic/server-authoritative now,
   instead of a racy client-side localStorage check.
   There's also a no-camera "Test du scanner" panel that simulates a scan
   for any loaded invitee, useful for demos and devices without a working
   camera.

**Known remaining gap** (unchanged on purpose - see root `CLAUDE.md`'s "QR
code" section): `decodeGuestPayload`'s Base64 encoding is still an
*obfuscation* done entirely client-side, not real security - anyone who
reads the frontend source can decode a QR's `id`/`name`/`type` themselves.
The check-in decision itself is now fully server-authoritative (see
above); only the payload encoding/decoding step was left as-is when the
backend was built, to keep that a pure data-layer swap.

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

## Auth & roles

`context/AuthContext.jsx` calls `POST /api/auth/login` (`api/authApi.js`)
and holds the returned JWT + `role` + `username` via `api/apiClient.js`'s
`setAuthToken` and its own sessionStorage keys (`cj-wedding.admin-token.v1`,
`...-role.v1`, `...-username.v1` - all read synchronously at module/mount
time so they're available before any Provider's effect fires) gating
everything under `/admin` via `components/RequireAuth.jsx`. A 401 from any
API call (expired/invalid token) triggers `apiClient`'s
`unauthorizedHandler`, which logs out everywhere, not just on the request
that happened to fail.

Two roles, `"ADMIN"` and `"PROTOCOL"` (see root `CLAUDE.md`). `RequireAuth`
takes an optional `roles` prop - in `App.jsx`, every admin-only route is
wrapped in one shared `<RequireAuth roles={["ADMIN"]}><Outlet/></RequireAuth>`
layout route rather than repeating the check per-page; a Protocol account
hitting any of them (or typing the URL directly) is redirected to
`/admin/scanner`, not `/login` (they ARE logged in, just the wrong role).
`AdminLayout.jsx`'s `navItems` each carry an optional `roles` array (absent
= every role, which in practice means only "Scanner QR") so the sidebar
itself never shows a link a Protocol account can't use.
`InviteesContext`/`createListStore`'s list-fetch additionally checks
`role === "ADMIN"` client-side before calling the (admin-only,
403-otherwise) list endpoints, so a Protocol session never fires a doomed
request for the full roster/tables/drinks list in the first place -
`ScannerPage.jsx`'s "Test du scanner" panel (which needs that roster to
populate its simulate-a-scan buttons) is hidden entirely for Protocol
rather than rendered empty.

Accounts themselves are managed from `/admin/utilisateurs`
(`UsersPage.jsx` -> `context/UsersContext.jsx` -> `api/usersApi.js`,
admin-only) - create (username/password/role) and delete, no rename/edit.
The backend-side bootstrap admin from env vars is just the very first
account; see `backend/README.md`.

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

## Tables & Drinks (seating + reception choices)

Two admin-managed named lists, both built on the same generic factory
(`context/createListStore.jsx`'s `createListStore(api)`, taking an
`api/namedListApi.js`-shaped `{ list, create, rename, remove }` and
returning `{ Provider, useStore }`) rather than duplicating CRUD logic -
mirrored on the backend by its own generic `AbstractNamedItemService` /
`AbstractNamedItemController`, same reasoning on both sides.
`context/{drinksStore.js, tablesStore.js}` instantiate it with
`api/{drinksApi.js, tablesApi.js}`, `context/{DrinksContext.jsx,
TablesContext.jsx}` re-export just the `Provider`,
`hooks/{useDrinks.js, useTables.js}` re-export just the hook - same
one-export-per-file split as Auth/Invitees, for the same fast-refresh
reason. `createListStore.jsx` must stay a `.jsx` file (it renders
`<Ctx.Provider>`) - Vite/esbuild won't parse JSX in a plain `.js` file
and the build fails outright if it's renamed back.

Both `DrinksPage.jsx` and `TablesPage.jsx` are thin wrappers around the
shared `components/ManagedListPage.jsx` (add/rename/delete UI) - add new
simple named-list admin pages the same way rather than hand-rolling the
CRUD list UI again.

- **Tables**: seeded by the backend (`SeedDataRunner`) with 10 country
  names (deliberately no "Rwanda" - the client asked for that
  specifically, keep respecting it if reseeding). Assigning an invitee to
  a table is an **admin** action, done from `InviteeFormPage.jsx` (a
  `<select>` sourced from `useTables().items`).
- **Drinks**: seeded by the backend with common reception drinks.
  Choosing a drink is a **guest** action, done from
  `PublicInvitationPage.jsx` (`/invitation/:id`) - a row of pill buttons,
  re-selectable at any time (unlike presence, there's no "locked" state).
  A `"single"` invitee picks exactly one (clicking a pill instantly swaps
  it, radio-style); a `"couple"` picks up to two (clicking toggles that
  pill, the rest disable once both slots are filled) - `maxDrinks`/
  `selectedDrinks`/`toggleDrink` in that file, enforced again server-side
  in `InviteeService.setDrinks` so the limit isn't just a UI nicety.
  Guests have no admin session, so this page doesn't use
  `InviteesContext`/`DrinksContext` at all - it calls
  `api/inviteesApi.js`'s `getPublicInvitee`/`choosePublicDrinks` and
  `api/drinksApi.js`'s `listPublicDrinks` directly (the backend's
  `/api/public/**`, no-auth routes).
- Both are stored as a **plain name string** directly on the invitee
  (`guest.table`, `guest.drink` + `guest.secondDrink` for a couple's
  second choice), not as an id reference to the table/drink record, on
  the backend too (`Invitee.table`/`Invitee.drink`/`Invitee.secondDrink`
  columns). Simpler (no lookup/join needed to render "Table: Kenya" on
  the invitee), at the cost that renaming a table/drink later won't
  retroactively update invitees already assigned to the old name -
  accepted tradeoff, see root `CLAUDE.md` if revisiting for referential
  integrity.
- `InviteeDetailPage.jsx` shows both read-only, `DrinksPage.jsx` /
  `TablesPage.jsx` show a live count of invitees currently on each
  drink/table (filtered from `useInvitees().invitees`, not stored
  redundantly).

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

Deployed to Vercel (`vercel.json`, static build + SPA rewrite) - no Docker
here, that's the backend's job. Set `VITE_API_BASE_URL` as a Vercel
project environment variable (see `.env.example`) pointing at wherever
`backend/` is actually running; it must be HTTPS or the browser blocks it
as mixed content from this HTTPS-served frontend.
