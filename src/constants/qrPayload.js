import { WEDDING_CODE } from "./wedding";

/**
 * Le QR code encode les infos de l'invite en Base64 (pas en clair) pour
 * qu'une appli appareil-photo generique n'affiche qu'un texte opaque -
 * seul le scanner de l'admin sait le decoder.
 *
 * NB: c'est une obfuscation cote client, pas un chiffrement fort - la
 * validation definitive (l'invite existe bien, n'est pas deja marque
 * present) se fera cote backend plus tard. Pour cette simulation, tout
 * est verifie contre le stockage local du navigateur.
 */
export function encodeGuestPayload(guest) {
  const payload = {
    code: WEDDING_CODE,
    id: guest.id,
    n: guest.name,
    t: guest.type, // "single" | "couple"
  };
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeGuestPayload(raw) {
  try {
    const json = decodeURIComponent(escape(atob(raw.trim())));
    const data = JSON.parse(json);
    if (!data || data.code !== WEDDING_CODE || !data.id) return null;
    return data;
  } catch {
    return null;
  }
}
