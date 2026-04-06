import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getFavorites, removeFavorite } from "../api/favorite";
import { authClient } from "../lib/auth-client";
import type { Favorite } from "../interfaces/favorites.interface";

const Favoris = () => {
  const { data: session } = authClient.useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  const handleRemoveFavorite = async (e: React.MouseEvent, articleId: number) => {
    e.preventDefault();
    try {
      await removeFavorite(articleId);
      setFavorites((prev) => prev.filter((fav) => fav.articleId !== articleId));
    } catch (error) {
      console.error("Erreur lors de la suppression du favori", error);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 px-4">
        <p className="font-['Lato'] text-[#405882] text-lg text-center">
          Connectez-vous pour voir vos favoris
        </p>
        <Link
          to="/connexion"
          className="font-['Lato'] text-white bg-[#405882] px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-4 md:px-8 py-8 md:py-10 gap-8 md:gap-10">

      {/* Titre avec lignes décoratives */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.5px" }} />
        <h1 className="font-['Playfair_Display'] text-[#9C9475] text-xl md:text-2xl whitespace-nowrap">
          Mes Favoris !
        </h1>
        <div className="flex-1 bg-[#405882] rounded-full" style={{ height: "1.5px" }} />
      </div>

      {/* Liste vide */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <p className="font-['Lato'] text-gray-400 text-center">
            Vous n'avez pas encore de favoris
          </p>
          <Link
            to="/creations"
            className="font-['Lato'] text-[#405882] text-sm hover:underline"
          >
            Découvrir les créations →
          </Link>
        </div>
      ) : (
        /* Grille — 2 colonnes sur mobile, 3 sur desktop */
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {favorites.map((favorite) => (
            <Link
              key={favorite.id}
              to={`/creations/${favorite.articleId}`}
              className="relative rounded-[10px] overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              {favorite.article.images && favorite.article.images.length > 0 ? (
                <img
                  src={
                    favorite.article.images.find((img) => img.isMain)?.url ||
                    favorite.article.images[0].url
                  }
                  alt={favorite.article.title}
                  className="w-full h-40 md:h-52 object-cover"
                />
              ) : (
                <div className="w-full h-40 md:h-52 bg-gray-200 flex items-center justify-center">
                  <span className="font-['Lato'] text-gray-400 text-sm">
                    Pas d'image
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center px-3 py-2">
                <div className="flex flex-col gap-1">
                  <p className="font-['Lato'] text-[#405882] text-xs md:text-sm font-medium truncate max-w-[100px] md:max-w-[150px]">
                    {favorite.article.title}
                  </p>
                  <p className="font-['Lato'] text-[#9C9475] text-xs">
                    {favorite.article.price
                      ? `${favorite.article.price.toFixed(2)}€`
                      : "Sur devis"}
                  </p>
                </div>
                <button
                  onClick={(e) => handleRemoveFavorite(e, favorite.articleId)}
                  className="p-1"
                >
                  <Heart size={20} className="text-red-900 fill-red-900" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoris;