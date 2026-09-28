import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** Genere un data-URL PNG pour le texte donne (le payload encode de l'invite). */
export function useQrDataUrl(text) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!text) {
      setUrl(null);
      return;
    }
    QRCode.toDataURL(text, {
      margin: 1,
      width: 320,
      color: { dark: "#2B1810", light: "#FBF5EB" },
    }).then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, [text]);

  return url;
}
