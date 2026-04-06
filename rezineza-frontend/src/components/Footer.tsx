import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import Navbar from "./Navbar";

const Footer = () => {
  return (
    <footer>
      <div className="bg-[#405882] px-8 md:px-16 py-10">

        {/* Toujours 4 colonnes, même sur mobile */}
        <div className="flex justify-between items-start gap-4 md:gap-8">

          {/* Colonne 1 - Navigation */}
          <div className="min-w-0">
            <Navbar
              direction="col"
              fontSize="text-xs md:text-base"
              bgColor="bg-transparent"
              gap="gap-1 md:gap-2"
              justify="justify-start"
              textColor="text-white"
              padding="p-0"
            />
          </div>

          {/* Colonne 2 - Contact */}
          <div className="flex flex-col gap-1 md:gap-3 min-w-0">
            <h3 className="font-['Playfair_Display'] text-white text-sm md:text-xl">Contact</h3>
            <p className="font-['Lato'] text-white text-xs md:text-sm">rezineza75@gmail.com</p>
            <Link to="/contact" className="font-['Lato'] text-white text-xs md:text-sm hover:underline">
              Contact
            </Link>
          </div>

          {/* Colonne 3 - Adresse */}
          <div className="flex flex-col gap-1 md:gap-3 min-w-0">
            <h3 className="font-['Playfair_Display'] text-white text-sm md:text-xl">Adresse</h3>
            <p className="font-['Lato'] text-white text-xs md:text-sm">1 Avenue de Lisbonne</p>
            <p className="font-['Lato'] text-white text-xs md:text-sm">62400 Béthune</p>
          </div>

          {/* Colonne 4 - Réseaux */}
          <div className="flex flex-col gap-1 md:gap-3 min-w-0">
            <h3 className="font-['Playfair_Display'] text-white text-sm md:text-xl">Réseaux</h3>
            <div className="flex gap-2 md:gap-4">
              <a href="https://www.instagram.com/rezine_za/" target="_blank" rel="noreferrer">
                <Instagram className="text-white hover:text-[#9C9475] w-[18px] h-[18px] md:w-6 md:h-6" />
              </a>
              <a href="https://www.facebook.com/p/Rezine-Za-100083692450133/" target="_blank" rel="noreferrer">
                <Facebook className="text-white hover:text-[#9C9475] w-[18px] h-[18px] md:w-6 md:h-6" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bas du footer */}
      <div className="bg-[#9C9475] py-4 text-center px-4">
        <p className="font-['Lato'] text-[#405882] text-xs md:text-sm">
          © Rezine'Za.com - 2025 - Tous droits réservés.{" "}
          <Link to="/mentions-legales" className="cursor-pointer hover:underline">
            Mentions Légales
          </Link>
        </p>
      </div>

    </footer>
  );
};

export default Footer;