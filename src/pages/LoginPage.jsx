import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Monogram from "../components/Monogram";
import { wedding } from "../constants/wedding";

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || "/admin"} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Identifiants incorrects. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary bg-linear-to-br from-secondary to-chocolate px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Monogram size="w-16 h-16 mb-4" textSize="text-2xl" />
          <h1 className="font-display text-2xl font-bold text-cream">
            Mariage Admin
          </h1>
          <p className="text-beige/60 text-sm mt-1">
            {wedding.groom} &amp; {wedding.bride}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-cream rounded-2xl shadow-2xl p-7 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-chocolate/60 mb-1.5">
              Identifiant
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-chocolate/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoFocus
                className="w-full rounded-lg border border-beige-dark bg-beige/40 pl-10 pr-4 py-2.5 text-sm text-chocolate-dark outline-none focus:border-chocolate"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-chocolate/60 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-chocolate/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-beige-dark bg-beige/40 pl-10 pr-10 py-2.5 text-sm text-chocolate-dark outline-none focus:border-chocolate"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-chocolate/40 hover:text-chocolate transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-chocolate text-cream font-semibold py-2.5 rounded-lg hover:bg-chocolate-dark transition-colors duration-200 disabled:opacity-60"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-center text-[11px] text-chocolate/40 pt-1">
            Accès réservé aux administrateurs du mariage.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
