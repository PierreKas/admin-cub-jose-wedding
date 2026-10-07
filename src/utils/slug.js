/**
 * Matches the invitation-image download filename's existing style exactly
 * (InviteeDetailPage.jsx) - lowercase, whitespace to hyphens, nothing else
 * stripped. Reused to build the human-readable public invitation link too
 * (e.g. /invitation/jean-paul-kambale-<uuid>).
 */
export const slugifyName = (name) => name.replace(/\s+/g, "-").toLowerCase();

/**
 * A v4 UUID is a fixed, unmistakable shape - pull it out of the end of
 * whatever the URL param actually is. Handles both the slug-prefixed links
 * generated from now on AND bare-uuid links already sent out before this
 * existed, so nothing already shared/printed/downloaded breaks.
 */
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const extractUuid = (value) => value.match(UUID_RE)?.[0] ?? value;
