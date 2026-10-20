import React, { useEffect } from "react";
import Monogram from "../components/Monogram";
import FlowerRain from "../components/FlowerRain";
import { wedding } from "../constants/wedding";

/**
 * Public, no-auth announcement page (/information) - not an invitation
 * (no name, no QR code, nothing invitee-specific): a generic "save the
 * date" meant to be shared with non-guests too. Reuses the invitation's
 * chocolate/beige/gold look (Monogram, FlowerRain, script title) so it
 * reads as the same event, just without any personal data baked in.
 */
const WeddingInfoPage = () => {
  // index.html's <title> says "Invitation du..." (the right default for
  // every other route) - this is the one page that isn't an invitation,
  // so it overrides the tab title while mounted and restores the default
  // on unmount (React Router doesn't touch document.title on its own).
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Annonce du Mariage Christian & Joséphine";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-secondary bg-linear-to-br from-secondary to-chocolate flex flex-col items-center justify-center px-4 py-12">
      <FlowerRain />

      <div className="relative w-full max-w-xl bg-cream rounded-2xl shadow-2xl overflow-hidden text-chocolate-dark">
        <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full border border-beige-dark/60" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 w-56 h-56 rounded-full border border-beige-dark/40" />

        <div className="relative flex flex-col items-center text-center p-8 sm:p-12 bg-gradient-to-br from-beige to-cream">
          <Monogram size="w-24 h-24 sm:w-28 sm:h-28 mb-3" />

          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-chocolate/50 mb-2">
            Annonce du mariage de
          </p>

          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 mb-6">
            <p className="font-script text-4xl sm:text-5xl text-chocolate">
              {wedding.groom}
            </p>
            <span className="text-chocolate/40 font-script text-3xl sm:text-4xl">
              &amp;
            </span>
            <p className="font-script text-4xl sm:text-5xl text-chocolate">
              {wedding.bride}
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-chocolate-dark/85 max-w-md">
            {wedding.announcement.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 border-y border-accent/50 py-3 px-6 w-full max-w-xs">
            <p className="font-display font-bold text-sm sm:text-lg text-chocolate">
              {wedding.date}
            </p>
            {wedding.location && (
              <p className="text-[11px] sm:text-xs text-chocolate-dark/60 mt-0.5">
                {wedding.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingInfoPage;
