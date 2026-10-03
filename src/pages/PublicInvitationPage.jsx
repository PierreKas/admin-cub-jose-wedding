import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toPng } from "html-to-image";
import { Check, Download, GlassWater, Heart } from "lucide-react";
import InvitationCard from "../components/InvitationCard";
import { choosePublicDrink, getPublicInvitee } from "../api/inviteesApi";
import { listPublicDrinks } from "../api/drinksApi";
import { wedding } from "../constants/wedding";

/**
 * Deliberately independent from InviteesContext/DrinksContext - those back
 * the admin-only `/api/invitees` and `/api/drinks` endpoints, which a guest
 * (no admin session) can never call. This page only ever talks to the
 * `/api/public/**` endpoints.
 */
const PublicInvitationPage = () => {
  const { id } = useParams();
  const [guest, setGuest] = useState(null);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getPublicInvitee(id), listPublicDrinks()])
      .then(([guestData, drinksData]) => {
        if (cancelled) return;
        setGuest(guestData);
        setDrinks(drinksData);
      })
      .catch(() => {
        if (!cancelled) setGuest(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "invitation-mariage.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const chooseDrink = async (name) => {
    const updated = await choosePublicDrink(guest.id, name);
    setGuest(updated);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-secondary bg-linear-to-br from-secondary to-chocolate flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-6">
        <span className="inline-flex w-12 h-12 rounded-full bg-accent items-center justify-center text-secondary mb-3">
          <Heart className="w-5 h-5 fill-current" />
        </span>
        <h1 className="font-display text-xl font-bold text-cream">
          Mariage de {wedding.groom} &amp; {wedding.bride}
        </h1>
      </div>

      {loading ? (
        <p className="text-cream/70 text-sm">Chargement de votre invitation...</p>
      ) : guest ? (
        <>
          <div className="w-full max-w-2xl">
            <InvitationCard ref={cardRef} guest={guest} />
          </div>

          <button
            onClick={onDownload}
            disabled={downloading}
            className="mt-6 inline-flex items-center gap-2 bg-accent text-chocolate-dark font-semibold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Génération..." : "Télécharger mon invitation"}
          </button>

          {drinks.length > 0 && (
            <div className="w-full max-w-2xl mt-8 bg-cream rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-1">
                <GlassWater className="w-4 h-4 text-chocolate" />
                <h2 className="font-display text-base font-bold text-chocolate-dark">
                  Quelle boisson souhaitez-vous ?
                </h2>
              </div>
              <p className="text-xs text-secondary/60 mb-4">
                Faites votre choix, il pourra être modifié à tout moment.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {drinks.map((d) => {
                  const selected = guest.drink === d.name;
                  return (
                    <button
                      key={d.id}
                      onClick={() => chooseDrink(d.name)}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border-2 transition-colors ${
                        selected
                          ? "bg-chocolate text-cream border-chocolate"
                          : "border-beige-dark text-chocolate-dark hover:bg-beige"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      {d.name}
                    </button>
                  );
                })}
              </div>
              {justSaved && (
                <p className="text-emerald-700 text-xs font-semibold mt-3">
                  Merci, votre choix a été enregistré !
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-cream rounded-2xl px-8 py-10 text-center max-w-sm">
          <p className="font-display text-lg font-bold text-secondary mb-2">
            Invitation introuvable
          </p>
          <p className="text-secondary/60 text-sm">
            Ce lien ne correspond à aucun invité enregistré.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicInvitationPage;
