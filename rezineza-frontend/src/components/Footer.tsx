import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer>
      <div className="bg-[#405882] px-5 md:px-16 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-start">

          {/* Colonne 1 — Navigation */}
          <div className="flex flex-col gap-1">
            <h3 className="font-['Playfair_Display'] text-white text-sm md:text-xl mb-1">Navigation</h3>
            <Link to="/" className="font-['Playfair_Display'] text-white text-sm md:text-base hover:underline py-0.5">Accueil</Link>
            <Link to="/contact" className="font-['Playfair_Display'] text-white text-sm md:text-base hover:underline py-0.5">Contact</Link>
            <Link to="/creations" className="font-['Playfair_Display'] text-white text-sm md:text-base hover:underline py-0.5">Créations</Link>
            <Link to="/avis" className="font-['Playfair_Display'] text-white text-sm md:text-base hover:underline py-0.5">Avis</Link>
          </div>

          {/* Colonne 2 — Contact */}
          <div className="flex flex-col gap-1">
            <h3 className="font-['Playfair_Display'] text-white text-sm md:text-xl mb-1">Contact</h3>
            <p className="font-['Lato'] text-white text-sm break-all">rezineza75@gmail.com</p>
            <Link to="/contact" className="font-['Lato'] text-white text-sm hover:underline mt-1">
              Contact
            </Link>
          </div>

          {/* Colonne 3 — Adresse */}
          <div className="flex flex-col gap-1">
            <h3 className="font-['Playfair_Display'] text-white text-sm md:text-xl mb-1">Adresse</h3>
            <p className="font-['Lato'] text-white text-sm">1 Avenue de Lisbonne</p>
            <p className="font-['Lato'] text-white text-sm">62400 Béthune</p>
          </div>

          {/* Colonne 4 — Réseaux */}
          <div className="flex flex-col gap-1">
            <h3 className="font-['Playfair_Display'] text-white text-sm md:text-xl mb-1">Réseaux</h3>
            <div className="flex gap-3 md:gap-4 mt-1">
              <a href="https://www.instagram.com/rezine_za/" target="_blank" rel="noreferrer">
                <Instagram className="text-white hover:text-[#9C9475] w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a href="https://www.facebook.com/p/Rezine-Za-100083692450133/" target="_blank" rel="noreferrer">
                <Facebook className="text-white hover:text-[#9C9475] w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;