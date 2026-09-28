import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Heart, Lock, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { wedding } from "../constants/wedding";

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || "/admin"} replace />;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate(location.state?.from || "/admin", { replace: true });
    } else {
      setError("Identifiants incorrects. Réessayez.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary bg-linear-to-br from-secondary to-chocolate px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="inline-flex w-14 h-14 rounded-full bg-accent items-center justify-center text-secondary mb-4">
            <Heart className="w-6 h-6 fill-current" />
          </span>
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-beige-dark bg-beige/40 pl-10 pr-4 py-2.5 text-sm text-chocolate-dark outline-none focus:border-chocolate"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full bg-chocolate text-cream font-semibold py-2.5 rounded-lg hover:bg-chocolate-dark transition-colors duration-200"
          >
            Se connecter
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
