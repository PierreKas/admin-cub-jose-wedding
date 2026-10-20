import { next } from "@vercel/edge";

/**
 * Link-preview bots (WhatsApp, Facebook, Twitter/X, Telegram, Slack,
 * LinkedIn, Discord...) never execute JavaScript - they only read whatever
 * static HTML the server returns for the requested URL. For a client-only
 * React SPA that's always the same index.html regardless of route, so the
 * tab-title swap WeddingInfoPage.jsx does via document.title (see that
 * file) is invisible to them; they'd always see index.html's static
 * "Invitation du..." title no matter which page was actually shared.
 *
 * This intercepts just those bots requesting /information and serves a
 * tiny static page with the right <title>/Open Graph tags instead - real
 * visitors (no matching user-agent) fall through to the normal SPA
 * untouched, so every other route/feature is unaffected.
 */
const BOT_USER_AGENT = /whatsapp|facebookexternalhit|twitterbot|telegrambot|slackbot|linkedinbot|discordbot|vkshare|skypeuripreview|pinterest/i;

const OG_IMAGE_URL = "https://cub-jose-wedding.vercel.app/favicon.png";

const ANNOUNCEMENT_HTML = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Annonce du Mariage Christian &amp; Joséphine</title>
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Annonce du Mariage Christian & Joséphine" />
    <meta property="og:description" content="La famille Jérémie BAFUNYEMBAKA KASANANI a la joie de vous annoncer le mariage de leurs enfants Christian et Joséphine, qui sera célébré le samedi 21 novembre 2026 à Kinshasa." />
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta name="twitter:card" content="summary" />
  </head>
  <body></body>
</html>`;

export const config = {
  matcher: ["/information"],
};

export default function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";
  if (!BOT_USER_AGENT.test(userAgent)) return next();

  return new Response(ANNOUNCEMENT_HTML, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
