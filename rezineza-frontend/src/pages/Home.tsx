import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Button from "../components/Button";
import echecsImg from "../Images/echecs.jpeg";
import bagueImg from "../Images/bague.jpeg";
import cadeauxImg from "../Images/cadeaux.jpg";
import cadreImg from "../Images/cadre.jpeg";
import chevalImg from "../Images/cheval.jpg";
import collierImg from "../Images/collier.jpeg";
import dessousDeVerreImg from "../Images/dessousDeVerre.jpeg";
import penseursImg from "../Images/penseurs.jpeg";
import saladierImg from "../Images/saladier.jpeg";


// Tableau contenant toutes les images du carousel
// Chaque objet contient la source de l'image et son texte alternatif
const carouselImages = [
  { src: bagueImg, alt: "Bague en résine" },
  { src: cadeauxImg, alt: "Cadeaux en résine" },
  { src: cadreImg, alt: "Cadre en résine" },
  { src: chevalImg, alt: "Cheval en résine" },
  { src: collierImg, alt: "Collier en résine" },
  { src: dessousDeVerreImg, alt: "Dessous de verre en résine" },
  { src: penseursImg, alt: "Penseurs en résine" },
  { src: saladierImg, alt: "Saladier en résine" },
];


// Composant principal de la page d'accueil
const Home = () => {

  // Initialisation du carousel Embla
  // loop: true → permet de tourner en boucle
  // align: "start" → aligne les slides au début
  // Autoplay → fait défiler automatiquement les images
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );

  return (

    // Conteneur principal de la page
    <div className="flex flex-col w-full">

      {/* Bannière principale avec une image de fond */}
      <section
        className="relative w-full h-[350px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${echecsImg})` }}
      >

        {/* Overlay sombre pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Contenu principal de la bannière */}
        <div className="relative z-10 flex flex-col items-center w-full gap-3 px-8">

          {/* Titre principal */}
          <h1 className="font-['Playfair_Display'] text-white text-3xl font-medium text-center">
            Création uniques en résine
          </h1>
          <p className="font-['Playfair_Display'] text-white text-base italic text-center">
            Décoration et Bijoux artisanaux
          </p>

          {/* Bouton qui redirige vers la page des créations */}
          <Link to="/creations">
            <Button
              text="Découvrez mes créations"
              bgColor="bg-[#9C9475]"
              width="w-48"
              radius="rounded-full"
            />
          </Link>
        </div>
      </section>


      <div className="py-12 px-6">
        {/* Bloc avec un fond coloré qui présente la marque */}
        <div className="bg-[#405882] rounded-[50px] py-12 px-16">
          <p className="font-['Lato'] text-white text-center text-base leading-relaxed max-w-2xl mx-auto">
            Bienvenue chez Rézine'Za, l'univers où la résine devient art.
            Chaque création est unique, façonnée à la main avec passion et précision.
            Bijoux, accessoires et objets de décoration — laissez-vous séduire par
            l'authenticité de nos pièces artisanales.
          </p>
        </div>

      </div>
      <section className="flex flex-col w-full gap-8 pb-12">
        {/* Titre de la section avec des lignes décoratives */}
        <div className="flex items-center gap-4 w-full px-6">
          <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.5px" }} />
          <h2 className="font-['Playfair_Display'] text-[#9C9475] text-2xl whitespace-nowrap">
            quelques réalisations
          </h2>
          <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.5px" }} />
        </div>

        {/* Carousel Embla */}
        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3">

            {/* On duplique les images pour que le défilement en boucle soit plus fluide visuellement*/}
            {[...carouselImages, ...carouselImages].map((image, index) => (
              <div key={index} className="min-w-[30%] flex-shrink-0">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-72 object-cover"
                />
              </div>
            ))}

          </div>
        </div>
      </section>
      <div className="w-full bg-[#405882]" style={{ height: "1.5px" }} />
      <div className="py-12 px-6">
        {/* Bloc qui incite l'utilisateur à contacter pour une création personnalisée */}
        <div className="bg-[#9C9475] rounded-[50px] py-12 px-16 flex flex-col items-center gap-6">

          <h2 className="font-['Playfair_Display'] text-white text-2xl text-center">
            Des envies sur mesure ?
          </h2>

          {/* Bouton vers la page contact */}
          <Link to="/contact">
            <Button
              text="Contactez-moi"
              bgColor="bg-[#405882]"
              width="w-40"
              radius="rounded-full"
            />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Home;