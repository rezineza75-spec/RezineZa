import { Link } from "react-router-dom";

const MentionsLegales = () => {
  return (
    <div className="flex flex-col items-center py-16 px-16 gap-10">
      <div className="flex items-center gap-4 w-full max-w-4xl">
        <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.5px" }} />
        <h1 className="font-['Playfair_Display'] text-[#9C9475] text-2xl whitespace-nowrap">
          Mentions Légales
        </h1>
        <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.5px" }} />
      </div>

      <div className="flex flex-col gap-8 w-full max-w-4xl">

        <div className="bg-[#405882] rounded-[30px] p-8 flex flex-col gap-4">
          <h2 className="font-['Playfair_Display'] text-white text-xl">Éditeur du site</h2>
          <div className="h-px bg-white/20" />
          <p className="font-['Lato'] text-white/80 text-sm leading-relaxed">
            Le présent site a été réalisé par :
          </p>
          <div className="flex flex-col gap-2 font-['Lato'] text-sm">
            <p className="text-white"><span className="text-[#9C9475]">Nom —</span> Amina Benayed</p>
          </div>
        </div>

        <div className="bg-[#9C9475] rounded-[30px] p-8 flex flex-col gap-4">
          <h2 className="font-['Playfair_Display'] text-white text-xl">Responsable de la publication</h2>
          <div className="h-px bg-white/20" />
          <div className="flex flex-col gap-2 font-['Lato'] text-sm">
            <p className="text-white"><span className="font-bold">Lhombart Isabelle</span></p>
            <p className="text-white"><span className="font-bold">Entreprise —</span> Rézine'Za</p>
            <p className="text-white"><span className="font-bold">SIRET —</span> 912 110 491 00012</p>
            <p className="text-white"><span className="font-bold">Adresse —</span> 1 Avenue de Lisbonne, 62400 Béthune</p>
            <p className="text-white">
              <span className="font-bold">Email —</span>{" "}
              <a href="mailto:rezineza75@gmail.com" className="hover:underline">
                rezineza75@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="bg-[#405882] rounded-[30px] p-8 flex flex-col gap-4">
          <h2 className="font-['Playfair_Display'] text-white text-xl">Hébergement</h2>
          <div className="h-px bg-white/20" />
          <p className="font-['Lato'] text-white/80 text-sm leading-relaxed">
            À compléter lors de la mise en ligne du site.
          </p>
        </div>

        <div className="bg-[#9C9475] rounded-[30px] p-8 flex flex-col gap-4">
          <h2 className="font-['Playfair_Display'] text-white text-xl">Propriété intellectuelle</h2>
          <div className="h-px bg-white/20" />
          <p className="font-['Lato'] text-white text-sm leading-relaxed">
            L'ensemble du contenu présent sur ce site (textes, images, photographies, créations, logo, etc.) est la propriété exclusive de Rézine'Za. Toute reproduction, modification ou diffusion sans autorisation préalable est strictement interdite.
          </p>
        </div>

        <div className="bg-[#405882] rounded-[30px] p-8 flex flex-col gap-4">
          <h2 className="font-['Playfair_Display'] text-white text-xl">Données personnelles</h2>
          <div className="h-px bg-white/20" />
          <p className="font-['Lato'] text-white text-sm leading-relaxed">
            Les informations collectées via le formulaire de contact (nom, email, message) sont utilisées uniquement pour répondre à vos demandes. Elles ne sont jamais transmises à des tiers.
          </p>
          <p className="font-['Lato'] text-white/80 text-sm leading-relaxed">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à :{" "}
            <a href="mailto:rezineza75@gmail.com" className="text-[#9C9475] hover:underline">
              rezineza75@gmail.com
            </a>
          </p>
        </div>

      </div>

      <Link to="/" className="font-['Lato'] text-[#405882] text-sm hover:underline">
        ← Retour à l'accueil
      </Link>

    </div>
  );
};

export default MentionsLegales;