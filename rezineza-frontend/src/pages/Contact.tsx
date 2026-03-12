import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import Button from "../components/Button";
import { sendContact } from "../api/contact";

const Contact = () => {
  // States pour stocker les valeurs du formulaire
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [creation, setCreation] = useState("");
  const [description, setDescription] = useState("");
  // State pour afficher un message de succès ou d'erreur
  const [message, setMessage] = useState("");

  // Fonction exécutée lors de l'envoi du formulaire
  const handleSubmit = async () => {
    try {
      // Vérification des champs obligatoires
      if (!prenom || !email || !description) {
        setMessage("Veuillez remplir tous les champs obligatoires");
        return;
      }
      // Appel API pour envoyer le message
      await sendContact({
        name: `${prenom} ${nom}`.trim(), // concatène prénom + nom
        email,
        subject: creation || null, // sujet optionnel
        message: description,
      });
      // Réinitialisation des champs après envoi
      setPrenom("");
      setNom("");
      setEmail("");
      setCreation("");
      setDescription("");
      // Message de confirmation
      setMessage("Votre message a bien été envoyé !");
    } catch (error) {
      // Message d'erreur si problème
      setMessage("Une erreur est survenue, veuillez réessayer");
    }
  };

  return (
    // Conteneur principal de la page
    <div className="flex flex-col justify-center items-center py-16 px-16 gap-10">
          {/* BLOC COMMANDES NON PERSONNALISÉES
          Pour les articles déjà présents sur le site */}
      <div className="bg-[#405882] rounded-[40px] p-10 w-full max-w-4xl flex flex-col items-center gap-4 text-center">
        <h2 className="font-['Playfair_Display'] text-white text-2xl">
          Vous souhaitez commander une création du site ?
        </h2>
        <p className="font-['Lato'] text-white/80 text-sm leading-relaxed max-w-xl">
          Pour toute commande d'une création déjà disponible sur le site,
          contactez-moi directement sur mes réseaux sociaux pour organiser
          la commande et la livraison.
        </p>
        <div className="flex items-center gap-6 mt-2">
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

          {/* FORMULAIRE DE CONTACT
          Pour les commandes personnalisées */}
      <div className="flex flex-col items-center w-full">
        <h1 className="font-['Lato'] text-[#405882] text-2xl text-center mb-10">
          Une création sur mesure ? Envoyez-moi votre message !
        </h1>
        <div className="bg-[#9C9475] rounded-[40px] p-12 w-full max-w-4xl">
          <div className="flex gap-12">
            <div className="flex flex-col gap-5 flex-1">
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

            <div className="flex flex-col gap-5 flex-1">
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
                  className="w-full bg-white rounded-[20px] p-4 font-['Lato'] text-sm outline-none resize-none h-48"
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
          <div className="flex justify-center mt-8">
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