import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toPng } from "html-to-image";
import { Download, Heart } from "lucide-react";
import InvitationCard from "../components/InvitationCard";
import { useInvitees } from "../hooks/useInvitees";
import { wedding } from "../constants/wedding";

const PublicInvitationPage = () => {
  const { id } = useParams();
  const { getInvitee } = useInvitees();
  const guest = getInvitee(id);
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

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

      {guest ? (
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
