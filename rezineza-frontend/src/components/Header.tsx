import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Heart, LayoutDashboard, Menu, X } from "lucide-react";
import logo from "../Images/Logo.png";
import { authClient } from "../lib/auth-client";

const Header = () => {
  const { data: session } = authClient.useSession();

  // State pour ouvrir/fermer le menu burger
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white px-6 md:px-16 py-4 relative">
      <div className="flex items-center justify-between">

        {/* GAUCHE — burger sur mobile, espace vide sur desktop */}
        <div className="w-16 flex items-center">
          {/* Bouton burger visible uniquement sur mobile */}
          <button
            className="md:hidden text-[#405882]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* CENTRE — Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Rézine'Za" className="h-28 md:h-48" />
        </Link>

        {/* DROITE — Icônes */}
        <div className="flex items-center gap-4 md:gap-6">
          {session?.user.role === "admin" && (
            <Link to="/admin">
              <LayoutDashboard size={24} className="text-[#405882] hover:text-[#9C9475]" />
            </Link>
          )}
          <Link to="/connexion">
            <User size={24} className="text-[#405882] hover:text-[#9C9475]" />
          </Link>
          <Link to="/favoris">
            <Heart size={24} className="text-[#405882] hover:text-[#9C9475]" />
          </Link>
        </div>
      </div>

      {/* MENU BURGER — visible uniquement sur mobile quand ouvert */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 flex flex-col py-4">

          {[
            { to: "/", label: "Accueil" },
            { to: "/contact", label: "Contact" },
            { to: "/creations", label: "Créations" },
            { to: "/avis", label: "Avis" },
          ].map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={`
                font-['Playfair_Display']
                text-sm
                text-white
                bg-[#9C9475]
                px-8 py-4
                inline-block
                transition-all
                duration-300
                ease-in-out
                hover:shadow-xl
                hover:-translate-y-1
                ${index !== 0 ? "border-t border-white/20" : ""}
              `}
            >
              {item.label}
            </Link>
          ))}

        </div>
      )}
    </header>
  );
};

export default Header;