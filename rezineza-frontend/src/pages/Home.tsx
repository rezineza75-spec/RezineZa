import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Button from "../components/Button";

interface SiteImage {
  id: number;
  url: string;
  publicId: string;
  type: string;
  order: number;
}

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const Home = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [carouselImages, setCarouselImages] = useState<SiteImage[]>([]);

  useEffect(() => {
    const fetchSiteImages = async () => {
      try {
        const res = await fetch(`${API_URL}/site-images`);
        if (res.ok) {
          const images: SiteImage[] = await res.json();
          const hero = images.find((img) => img.type === "hero");
          const carousel = images
            .filter((img) => img.type === "carousel")
            .sort((a, b) => a.order - b.order);
          if (hero) setHeroImage(hero.url);
          setCarouselImages(carousel);
        }
      } catch (error) {
        console.error("Erreur chargement images du site", error);
      }
    };
    fetchSiteImages();
  }, []);

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );

  return (
    <div className="flex flex-col w-full">

      {/* Bannière principale */}
      <section
        className="relative w-full h-[220px] sm:h-[280px] md:h-[350px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: heroImage ? `url(${heroImage})` : "none" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center w-full gap-3 px-5 md:px-8">
          <h1 className="font-['Playfair_Display'] text-white text-xl sm:text-2xl md:text-3xl font-medium text-center">
            Création uniques en résine
          </h1>
          <p className="font-['Playfair_Display'] text-white text-sm md:text-base italic text-center">
            Décoration et Bijoux artisanaux
          </p>
          <Link to="/creations">
            <Button
              text="Découvrez mes créations"
              bgColor="bg-[#9C9475]"
              width="w-44 md:w-48"
              radius="rounded-full"
            />
          </Link>
        </div>
      </section>

      {/* Bloc présentation */}
      <div className="py-8 md:py-12 px-4 md:px-6">
        <div className="bg-[#405882] rounded-[30px] md:rounded-[50px] py-8 md:py-12 px-5 md:px-10">
          <p className="font-['Lato'] text-white text-center text-sm md:text-base mb-4 leading-relaxed">
            Créations en résine époxy - Objets artisanaux uniques et personnalisés.
            Bienvenue dans mon atelier de créations en résine époxy. Découvrez des créations en résine époxy de qualité, fabriquées avec passion, qui allient artisanat, créativité et modernité. Chaque objet en résine est conçu pour être unique, original et durable. Grâce aux effets de transparence, aux couleurs et aux inclusions décoratives, la résine permet de créer des pièces modernes et élégantes.
          </p>
          <p className="font-['Lato'] text-white text-center text-sm md:text-base mb-4 leading-relaxed">
            Dans ma collection, vous trouverez différents objets en résine : objets de décoration, accessoires personnalisés et idées cadeaux originales. Chaque création est fabriquée artisanalement, ce qui garantit des pièces uniques avec des finitions soignées.
          </p>
          <p className="font-['Lato'] text-white text-center text-sm md:text-base mb-4 leading-relaxed">
            Mon objectif est de proposer des objets en résine époxy, parfaits pour apporter une touche de design et d'originalité à votre intérieur. Que vous cherchiez une décoration en résine, un objet personnalisé ou un cadeau fait main, vous trouverez ici des créations uniques adaptées à toutes les occasions.
          </p>
          <p className="font-['Lato'] text-white text-center text-sm md:text-base leading-relaxed">
            J'aime aussi relever des défis, donc n'hésitez pas et contactez-moi si vous recherchez une pièce authentique et unique qui n'apparaît pas sur mon site. Je suis ouverte à vos envies : votre imagination, ma création !
          </p>
        </div>
      </div>

      {/* Section carrousel */}
      <section className="flex flex-col w-full gap-5 md:gap-8 pb-8 md:pb-12">
        <div className="flex items-center gap-3 md:gap-4 w-full px-4 md:px-6">
          <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.6px" }} />
          <h2 className="font-['Playfair_Display'] text-[#9C9475] text-lg md:text-2xl whitespace-nowrap">
            quelques réalisations
          </h2>
          <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.6px" }} />
        </div>

        {carouselImages.length > 0 && (
          <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {[...carouselImages, ...carouselImages].map((image, index) => (
                <div
                  key={index}
                  // Mobile : une image presque plein écran / Desktop : 3 par rangée
                  className="min-w-[85%] sm:min-w-[60%] md:min-w-[30%] flex-shrink-0 pl-3"
                >
                  <img
                    src={image.url}
                    alt={`Réalisation ${index + 1}`}
                    // Hauteur réduite sur mobile pour que l'image soit bien proportionnée
                    className="w-full h-52 sm:h-64 md:h-80 object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {carouselImages.length === 0 && (
          <p className="font-['Lato'] text-gray-400 text-center text-sm py-8">
            Aucune réalisation à afficher pour le moment.
          </p>
        )}
      </section>

      <div className="w-full bg-[#405882]" style={{ height: "1.1px" }} />

      {/* Bloc sur mesure */}
      <div className="py-8 md:py-12 px-4 md:px-6">
        <div className="bg-[#9C9475] rounded-[30px] md:rounded-[50px] py-10 md:py-12 px-5 md:px-16 flex flex-col items-center gap-6">
          <h2 className="font-['Playfair_Display'] text-white text-xl md:text-2xl text-center">
            Des envies sur mesure ?
          </h2>
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