import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import Navbar from "./Navbar";

const Footer = () => {
  return (
    <footer>
      <div className="bg-[#405882] px-16 py-10">
        <div className="flex justify-between items-start">
          {/* Colonne 1 - On réutilise le composant Navbar mais en version verticale */}
          <Navbar
            direction="col"
            fontSize="text-base"
            bgColor="bg-transparent"
            gap="gap-2"
            justify="justify-start"
            textColor="text-white"
            padding="p-0"
          />
          <div className="flex flex-col gap-3">
            <h3 className="font-['Playfair_Display'] text-white text-xl">Contact</h3>
            <p className="font-['Lato'] text-white text-sm">rezineza75@gmail.com</p>
            <Link to="/contact" className="font-['Lato'] text-white text-sm hover:underline">
              Contact
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-['Playfair_Display'] text-white text-xl">Adresse</h3>
            <p className="font-['Lato'] text-white text-sm">1 Avenue de Lisbonne</p>
            <p className="font-['Lato'] text-white text-sm">62400 Béthune</p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-['Playfair_Display'] text-white text-xl">Réseaux</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/rezine_za/" target="_blank" rel="noreferrer">
                <Instagram className="text-white hover:text-[#9C9475]" size={24} />
              </a>
              <a href="https://www.facebook.com/p/Rezine-Za-100083692450133/" target="_blank" rel="noreferrer">
                <Facebook className="text-white hover:text-[#9C9475]" size={24} />
              </a>
            </div>
          </div>

        </div>
      </div>

     <div className="bg-[#9C9475] py-4 text-center">
  <p className="font-['Lato'] text-[#405882] text-sm">
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