import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import Button from "../components/Button";
import { sendContact } from "../api/contact";

const Contact = () => {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [creation, setCreation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      if (!prenom || !email || !description) {
        setMessage("Veuillez remplir tous les champs obligatoires");
        return;
      }
      await sendContact({
        name: `${prenom} ${nom}`.trim(),
        email,
        subject: creation || null,
        message: description,
      });
      setPrenom("");
      setNom("");
      setEmail("");
      setCreation("");
      setDescription("");
      setMessage("Votre message a bien été envoyé !");
    } catch (error) {
      setMessage("Une erreur est survenue, veuillez réessayer");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-10 px-4 sm:px-8 md:px-16 gap-8 md:gap-10">

      {/* BLOC COMMANDES NON PERSONNALISÉES */}
      <div className="bg-[#405882] rounded-[30px] md:rounded-[40px] p-6 md:p-10 w-full max-w-4xl flex flex-col items-center gap-4 text-center">
        <h2 className="font-['Playfair_Display'] text-white text-xl md:text-2xl">
          Vous souhaitez commander une création du site ?
        </h2>
        <p className="font-['Lato'] text-white/80 text-sm leading-relaxed max-w-xl">
          Pour toute commande d'une création déjà disponible sur le site,
          contactez-moi directement sur mes réseaux sociaux pour organiser
          la commande et la livraison.
        </p>
        <div className="flex items-center gap-4 md:gap-6 mt-2 flex-wrap justify-center">
          <a
            href="https://www.instagram.com/rezine_za/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-['Lato'] text-white hover:text-[#9C9475] transition-colors text-sm"
          >
            <Instagram size={22} />
            @rezine_za
          </a>
          <a
            href="https://www.facebook.com/p/Rezine-Za-100083692450133/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-['Lato'] text-white hover:text-[#9C9475] transition-colors text-sm"
          >
            <Facebook size={22} />
            Rezine Za
          </a>
        </div>
      </div>

      {/* FORMULAIRE DE CONTACT */}
      <div className="flex flex-col items-center w-full">
        <h1 className="font-['Lato'] text-[#405882] text-xl md:text-2xl text-center mb-8 md:mb-10 px-2">
          Une création sur mesure ? Envoyez-moi votre message !
        </h1>

        <div className="bg-[#9C9475] rounded-[30px] md:rounded-[40px] p-6 sm:p-8 md:p-12 w-full max-w-4xl">

          {/* Sur mobile : colonne unique / Sur desktop : deux colonnes */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-12">

            {/* Colonne gauche */}
            <div className="flex flex-col gap-4 md:gap-5 flex-1">
              <div className="flex flex-col gap-1">
                <label className="font-['Lato'] text-white text-sm">Prénom</label>
                <input
                  type="text"
                  placeholder="Votre prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full h-11 bg-white rounded-xl px-4 font-['Lato'] text-sm outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-['Lato'] text-white text-sm">Nom de famille</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full h-11 bg-white rounded-xl px-4 font-['Lato'] text-sm outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-['Lato'] text-white text-sm">E-mail</label>
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 bg-white rounded-xl px-4 font-['Lato'] text-sm outline-none"
                />
              </div>
            </div>

            {/* Colonne droite */}
            <div className="flex flex-col gap-4 md:gap-5 flex-1">
              <div className="flex flex-col gap-1">
                <label className="font-['Lato'] text-white text-sm">Création</label>
                <input
                  type="text"
                  placeholder="Votre création"
                  value={creation}
                  onChange={(e) => setCreation(e.target.value)}
                  className="w-full h-11 bg-white rounded-xl px-4 font-['Lato'] text-sm outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-['Lato'] text-white text-sm">Description</label>
                <textarea
                  placeholder="La description de ce que vous souhaitez"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white rounded-[20px] p-4 font-['Lato'] text-sm outline-none resize-none h-36 md:h-48"
                />
              </div>
            </div>

          </div>

          {message && (
            <p
              className={`font-['Lato'] text-center mt-4 text-sm ${
                message.includes("bien") ? "text-white" : "text-red-200"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex justify-center mt-6 md:mt-8">
            <Button text="Envoyer" type="button" onClick={handleSubmit} />
          </div>
        </div>
      </div>

      <Link
        to="/"
        className="font-['Lato'] text-[#405882] text-sm hover:underline"
      >
        ← Retour à l'accueil
      </Link>
    </div>
  );
};

export default Contact;