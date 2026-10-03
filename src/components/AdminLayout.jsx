import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  GlassWater,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  Table2,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { wedding } from "../constants/wedding";

// No `roles` = visible to every logged-in role (only the scanner qualifies - a Protocol account can't reach anything else, see RequireAuth in App.jsx).
const navItems = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true, roles: ["ADMIN"] },
  { to: "/admin/invites", label: "Invités", icon: Users, roles: ["ADMIN"] },
  { to: "/admin/tables", label: "Tables", icon: Table2, roles: ["ADMIN"] },
  { to: "/admin/boissons", label: "Boissons", icon: GlassWater, roles: ["ADMIN"] },
  { to: "/admin/utilisateurs", label: "Utilisateurs", icon: UserCog, roles: ["ADMIN"] },
  { to: "/admin/scanner", label: "Scanner QR", icon: QrCode },
];

const ROLE_LABELS = { ADMIN: "Administrateur", PROTOCOL: "Protocole" };

const SidebarContent = ({ onNavigate }) => {
  const { logout, role, username } = useAuth();
  const visibleItems = navItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <div className="h-full flex flex-col bg-secondary text-beige">
      <div className="px-6 py-7 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-secondary shrink-0">
            <Heart className="w-5 h-5 fill-current" />
          </span>
          <span>
            <span className="block font-display text-lg font-bold text-cream leading-tight">
              Mariage Admin
            </span>
            <span className="block text-xs text-beige-dark/80">
              {wedding.groom} &amp; {wedding.bride}
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-white/10 text-accent"
                  : "text-beige/70 hover:bg-white/5 hover:text-cream"
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 mb-3">
          <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-cream font-semibold text-sm shrink-0">
            {username ? username.charAt(0).toUpperCase() : "?"}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-cream truncate">
              {username || "Compte mariage"}
            </span>
            <span className="block text-xs text-beige-dark/70">
              {ROLE_LABELS[role] || "Compte mariage"}
            </span>
          </span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-beige/70 hover:bg-white/5 hover:text-cream transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-soft-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-72 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="lg:hidden sticky top-0 z-20 bg-secondary text-cream flex items-center justify-between px-4 py-3">
          <span className="font-display font-bold">Mariage Admin</span>
          <button onClick={() => setMobileOpen(true)} aria-label="Menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
