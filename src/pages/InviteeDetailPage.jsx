import React, { useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toPng } from "html-to-image";
import {
  ArrowLeft,
  Copy,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";
import InvitationCard from "../components/InvitationCard";
import { StatusPill, TypeTag } from "../components/Badges";
import { useInvitees } from "../hooks/useInvitees";

const InviteeDetailPage = () => {
  const { id } = useParams();
  const { getInvitee, deleteInvitee, loading } = useInvitees();
  const guest = getInvitee(id);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Le contexte peut encore charger la liste (arrivee directe sur cette URL) - attendre avant de decider que l'invite n'existe pas.
  if (loading) return <p className="text-secondary/50 text-sm">Chargement...</p>;
  if (!guest) return <Navigate to="/admin/invites" replace />;

  const onDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `invitation-${guest.name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const onCopyLink = async () => {
    const url = `${window.location.origin}/invitation/${guest.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copiez le lien :", url);
    }
  };

  const onDelete = async () => {
    if (window.confirm(`Supprimer l'invité "${guest.name}" ?`)) {
      await deleteInvitee(guest.id);
      navigate("/admin/invites");
    }
  };

  return (
    <div>
      <Link
        to="/admin/invites"
        className="inline-flex items-center gap-2 text-sm font-semibold text-chocolate hover:gap-3 transition-all mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Tous les invités
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div>
          <div className="max-w-2xl mx-auto lg:mx-0">
            <InvitationCard ref={cardRef} guest={guest} />
          </div>
          <p className="text-center lg:text-left text-xs text-secondary/40 mt-3">
            Aperçu de l'invitation - le fichier téléchargé reprend exactement
            ce visuel, QR code inclus.
          </p>
        </div>

        <div className="bg-cream rounded-2xl shadow-sm border border-beige-dark/60 p-6 space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold text-secondary">
              {guest.civility ? `${guest.civility} ` : ""}
              {guest.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <StatusPill status={guest.status} />
              <TypeTag type={guest.type} />
            </div>
            {guest.status === "present" && guest.checkedInAt && (
              <p className="text-xs text-secondary/50 mt-2">
                Entrée enregistrée le{" "}
                {new Date(guest.checkedInAt).toLocaleString("fr-FR")}
              </p>
            )}
          </div>

          <div className="h-px bg-beige-dark/60" />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-secondary/50">Table assignée</span>
              <span className="font-semibold text-secondary">
                {guest.table || "Non assignée"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary/50">
                Boisson{guest.type === "couple" ? "(s) choisie(s)" : " choisie"}
              </span>
              <span className="font-semibold text-secondary">
                {[guest.drink, guest.secondDrink].filter(Boolean).join(", ") || "Pas encore choisie"}
              </span>
            </div>
          </div>

          <div className="h-px bg-beige-dark/60" />

          <div className="space-y-2.5">
            <button
              onClick={onDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 bg-chocolate text-cream font-semibold text-sm py-2.5 rounded-full hover:bg-chocolate-dark transition-colors disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Génération..." : "Télécharger l'image"}
            </button>
            <button
              onClick={onCopyLink}
              className="w-full flex items-center justify-center gap-2 border border-beige-dark text-secondary font-semibold text-sm py-2.5 rounded-full hover:bg-beige transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Lien copié !" : "Copier le lien public"}
            </button>
            <button
              onClick={() => navigate(`/admin/invites/${guest.id}/modifier`)}
              className="w-full flex items-center justify-center gap-2 border border-beige-dark text-secondary font-semibold text-sm py-2.5 rounded-full hover:bg-beige transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Modifier
            </button>
            <button
              onClick={onDelete}
              className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold text-sm py-2.5 rounded-full hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer l'invité
            </button>
          </div>

          <p className="text-[11px] text-secondary/40 leading-relaxed">
            L'image téléchargée est le seul support à transmettre à l'invité
            (WhatsApp, impression...). Le lien public n'est qu'un moyen
            alternatif de consulter la même invitation en ligne.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteeDetailPage;
