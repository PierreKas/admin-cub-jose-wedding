import React, { forwardRef } from "react";
import { wedding, WEDDING_CODE } from "../constants/wedding";
import { encodeGuestPayload } from "../constants/qrPayload";
import { useQrDataUrl } from "../hooks/useQrDataUrl";
import Monogram from "./Monogram";

/**
 * Carte d'invitation Christian & Joséphine, avec le QR code de l'invité
 * incrusté directement dedans. C'est ce noeud DOM qui est exporté en PNG
 * (voir html-to-image dans InviteeDetailPage / PublicInvitationPage) - un
 * seul fichier image final, à télécharger et partager tel quel.
 */
const InvitationCard = forwardRef(({ guest }, ref) => {
  const payload = guest ? encodeGuestPayload(guest) : null;
  const qrUrl = useQrDataUrl(payload);

  return (
    <div
      ref={ref}
      className="relative w-full min-h-[600px] bg-cream rounded-[6px] overflow-hidden shadow-2xl grid grid-cols-1 sm:grid-cols-2 text-chocolate-dark"
    >
      {/* décor coins */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full border border-beige-dark/60" />
      <div className="pointer-events-none absolute -bottom-20 left-10 w-56 h-56 rounded-full border border-beige-dark/40" />

      {/* panneau gauche */}
      <div className="relative flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-br from-beige to-cream">
        <div>
          <Monogram size="w-20 h-20 sm:w-24 sm:h-24 mb-2" />
          <p className="font-script text-5xl sm:text-6xl leading-none text-chocolate">
            Invitation
          </p>
        </div>

        <div className="space-y-4">
          {guest && (
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-chocolate/50 mb-1">
                Adressée à
              </p>
              <p className="font-display font-semibold text-base sm:text-xl text-chocolate">
                {guest.civility ? `${guest.civility} ` : ""}
                {guest.name}
              </p>
              {guest.type !== "couple" && (
                <span className="inline-block mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide bg-chocolate/10 text-chocolate px-2.5 py-1 rounded-full">
                  Invitation Singleton
                </span>
              )}
            </div>
          )}
          <p className="text-xs sm:text-sm leading-relaxed text-chocolate-dark/80">
            {wedding.familyIntro}
          </p>
        </div>

        <div>
          <p className="text-[10px] sm:text-xs italic text-chocolate/60 mb-1">
            Qui s&apos;unissent l&apos;un à l&apos;autre
          </p>
          <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
            <p className="font-script text-xl sm:text-3xl text-chocolate">
              {wedding.groom}
            </p>
            <span className="text-chocolate/40">&amp;</span>
            <p className="font-script text-xl sm:text-3xl text-chocolate">
              {wedding.bride}
            </p>
          </div>
        </div>
      </div>

      {/* séparateur - n'a de sens qu'en 2 colonnes cote a cote (sm: et plus) */}
      <div className="hidden sm:block absolute left-1/2 top-6 bottom-6 w-px bg-cream/20" />

      {/* panneau droit */}
      <div className="relative flex flex-col p-6 sm:p-10 bg-chocolate-dark text-cream">
        <div className="border-y border-accent/50 py-2 text-center mb-4 sm:mb-6">
          <p className="font-display font-bold text-sm sm:text-lg">
            {wedding.date}
          </p>
          {wedding.location && (
            <p className="text-[10px] sm:text-xs text-cream/60 mt-0.5">
              {wedding.location}
            </p>
          )}
        </div>

        {wedding.programLabel && (
          <p className="text-center text-[10px] sm:text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3 sm:mb-4">
            {wedding.programLabel}
          </p>
        )}

        <div className="flex-1 space-y-3 sm:space-y-5">
          {wedding.program.map((item) => (
            <div key={item.title} className="text-center">
              <p className="font-display font-bold uppercase text-xs sm:text-base leading-tight">
                {item.title}
              </p>
              <p className="text-[10px] sm:text-xs text-cream/60 px-2 leading-snug">
                {item.place}
              </p>
              <span className="inline-block bg-accent text-chocolate-dark font-bold text-[11px] sm:text-sm px-3 sm:px-4 py-0.5 sm:py-1 rounded mt-1">
                {item.time}
              </span>
            </div>
          ))}
        </div>

        {wedding.dressCode && (
          <div className="flex justify-center mt-3 sm:mt-4">
            <span className="inline-flex items-center gap-1.5 border border-accent text-accent text-[10px] sm:text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
              Dress code : {wedding.dressCode}
            </span>
          </div>
        )}

        {wedding.note && (
          <p className="text-center text-[9px] sm:text-[11px] text-cream/50 leading-snug mt-3">
            {wedding.note}
          </p>
        )}

        <div className="mt-4 sm:mt-6 flex items-end justify-between gap-3">
          <p className="text-[9px] sm:text-xs text-cream/70 leading-relaxed">
            {wedding.contacts.join("\n")}
          </p>
          <div className="shrink-0 bg-cream rounded-lg p-1.5 sm:p-2 flex flex-col items-center gap-1">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="QR code de l'invité"
                className="w-16 h-16 sm:w-24 sm:h-24"
              />
            ) : (
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-beige animate-pulse rounded" />
            )}
            <span className="text-[7px] sm:text-[9px] font-semibold text-chocolate-dark/70 tracking-wide">
              {WEDDING_CODE}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

InvitationCard.displayName = "InvitationCard";

export default InvitationCard;
