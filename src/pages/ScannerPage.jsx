import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  AlertTriangle,
  CheckCircle2,
  QrCode,
  ScanLine,
  UserCheck,
  Video,
  VideoOff,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { TypeTag } from "../components/Badges";
import { useInvitees } from "../hooks/useInvitees";
import { encodeGuestPayload } from "../constants/qrPayload";

const READER_ID = "qr-reader-viewport";

/** Panneau affiché après un scan : confirmation, déjà présent, ou invalide. */
const ScanResultPanel = ({ result, onConfirm, onClose }) => {
  if (!result) return null;

  const { outcome, guest } = result;

  if (outcome === "invalide" || outcome === "introuvable") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-cream rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center">
          <span className="inline-flex w-14 h-14 rounded-full bg-red-100 text-red-600 items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </span>
          <h3 className="font-display text-lg font-bold text-secondary mb-2">
            QR code invalide
          </h3>
          <p className="text-secondary/60 text-sm mb-6">
            {outcome === "invalide"
              ? "Ce code ne correspond pas au mariage de Christian & Joséphine."
              : "Cet invité est introuvable (peut-être supprimé)."}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-secondary text-cream font-semibold py-2.5 rounded-full hover:bg-chocolate transition-colors"
          >
            Continuer le scan
          </button>
        </div>
      </div>
    );
  }

  if (outcome === "deja_present") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-cream rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center">
          <span className="inline-flex w-14 h-14 rounded-full bg-amber-100 text-amber-600 items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </span>
          <h3 className="font-display text-lg font-bold text-secondary mb-1">
            Déjà enregistré
          </h3>
          <p className="text-secondary font-semibold">{guest.name}</p>
          <p className="text-secondary/60 text-sm mt-1 mb-6">
            Cette personne est déjà entrée
            {guest.checkedInAt &&
              ` (${new Date(guest.checkedInAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })})`}
            .
          </p>
          <button
            onClick={onClose}
            className="w-full bg-secondary text-cream font-semibold py-2.5 rounded-full hover:bg-chocolate transition-colors"
          >
            Continuer le scan
          </button>
        </div>
      </div>
    );
  }

  if (outcome === "confirmed") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-cream rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center">
          <span className="inline-flex w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </span>
          <h3 className="font-display text-lg font-bold text-secondary mb-1">
            Présence enregistrée
          </h3>
          <p className="text-secondary font-semibold">{guest.name}</p>
          <p className="text-secondary/60 text-sm mt-1 mb-6">
            Bienvenue à la cérémonie !
          </p>
          <button
            onClick={onClose}
            className="w-full bg-secondary text-cream font-semibold py-2.5 rounded-full hover:bg-chocolate transition-colors"
          >
            Continuer le scan
          </button>
        </div>
      </div>
    );
  }

  // outcome === "trouve" -> confirmation à faire
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-cream rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center">
        <span className="inline-flex w-14 h-14 rounded-full bg-chocolate/10 text-chocolate items-center justify-center mb-4">
          <UserCheck className="w-6 h-6" />
        </span>
        <p className="font-display text-xl font-bold text-secondary mb-1">
          {guest.civility ? `${guest.civility} ` : ""}
          {guest.name}
        </p>
        <div className="flex justify-center mb-4">
          <TypeTag type={guest.type} />
        </div>
        <p className="text-secondary/70 text-sm mb-6">
          Marquer la présence de cet invité ?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="border border-beige-dark text-secondary font-semibold py-2.5 rounded-full hover:bg-beige transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(guest.id)}
            className="bg-chocolate text-cream font-semibold py-2.5 rounded-full hover:bg-chocolate-dark transition-colors"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

const ScannerPage = () => {
  const { invitees, resolveScannedCode, markPresent } = useInvitees();
  const [cameraState, setCameraState] = useState("idle"); // idle | starting | running | error
  const [result, setResult] = useState(null);
  const scannerRef = useRef(null);
  const resultRef = useRef(null);
  resultRef.current = result;
  const resolvingRef = useRef(false);

  const handleDecoded = async (decodedText) => {
    // un panneau est deja ouvert, ou une resolution reseau est deja en vol
    // pour ce scan (le flux camera appelle ce callback a chaque frame, bien
    // plus vite que l'aller-retour API)
    if (resultRef.current || resolvingRef.current) return;
    resolvingRef.current = true;
    try {
      const resolved = await resolveScannedCode(decodedText);
      setResult(resolved);
    } finally {
      resolvingRef.current = false;
    }
  };

  useEffect(() => {
    let cancelled = false;
    const instance = new Html5Qrcode(READER_ID, { verbose: false });
    scannerRef.current = instance;
    setCameraState("starting");

    instance
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => handleDecoded(decodedText),
        () => {
          /* frames sans QR détecté : on ignore */
        },
      )
      .then(() => {
        if (!cancelled) setCameraState("running");
      })
      .catch(() => {
        if (!cancelled) setCameraState("error");
      });

    return () => {
      cancelled = true;
      const el = scannerRef.current;
      if (el) {
        // html5-qrcode's stop() throws *synchronously* (not a rejected
        // promise) if called before start() has resolved into "scanning"
        // state - which happens whenever this effect's cleanup runs fast
        // (React StrictMode's dev double-invoke, or just navigating away
        // before the camera finished initializing). Left unguarded, that
        // crashes the whole page with no error boundary to catch it.
        try {
          el.stop()
            .then(() => el.clear())
            .catch(() => {});
        } catch {
          // le scanner n'avait pas fini de demarrer - rien a arreter
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConfirmPresence = async (id) => {
    const outcome = await markPresent(id);
    setResult({ outcome: "confirmed", guest: outcome.guest });
  };

  const simulateScan = (guest) => {
    if (result) return;
    handleDecoded(encodeGuestPayload(guest));
  };

  return (
    <div>
      <PageHeader
        title="Scanner QR"
        subtitle="Scannez le QR code de l'invitation pour enregistrer l'arrivée de l'invité."
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="bg-chocolate-dark rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-square sm:aspect-video">
            <div id={READER_ID} className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full" />
            {cameraState !== "running" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-cream/70 bg-chocolate-dark px-6 text-center">
                {cameraState === "error" ? (
                  <>
                    <VideoOff className="w-8 h-8" />
                    <p className="text-sm">
                      Caméra indisponible sur cet appareil ou permission
                      refusée. Utilisez le test manuel ci-contre, ou ouvrez
                      cette page sur un appareil avec caméra.
                    </p>
                  </>
                ) : (
                  <>
                    <Video className="w-8 h-8 animate-pulse" />
                    <p className="text-sm">Démarrage de la caméra...</p>
                  </>
                )}
              </div>
            )}
            {cameraState === "running" && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <span className="flex items-center gap-2 bg-black/50 text-cream text-xs font-medium px-3 py-1.5 rounded-full">
                  <ScanLine className="w-3.5 h-3.5" />
                  Recherche d'un QR code...
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-cream rounded-2xl shadow-sm border border-beige-dark/60 p-6">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-4 h-4 text-chocolate" />
            <h2 className="font-display text-base font-bold text-secondary">
              Test du scanner
            </h2>
          </div>
          <p className="text-xs text-secondary/60 mb-4">
            Sans caméra sous la main ? Simulez le scan d'un invité pour tester
            le flux de présence.
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {invitees.map((g) => (
              <button
                key={g.id}
                onClick={() => simulateScan(g)}
                className="w-full flex items-center justify-between gap-2 rounded-xl border border-beige-dark px-3.5 py-2.5 text-left hover:bg-beige transition-colors"
              >
                <span className="text-sm font-medium text-secondary truncate">
                  {g.name}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    g.status === "present"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {g.status === "present" ? "Présent" : "En attente"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ScanResultPanel
        result={result}
        onConfirm={onConfirmPresence}
        onClose={() => setResult(null)}
      />
    </div>
  );
};

export default ScannerPage;
