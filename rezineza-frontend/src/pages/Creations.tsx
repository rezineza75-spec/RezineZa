import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getArticles } from "../api/article";
import { getCategories } from "../api/categorie";
import { addFavorite, removeFavorite } from "../api/favorite";
import { authClient } from "../lib/auth-client";
import type { Article } from "../interfaces/articles.interface";
import type { Category } from "../interfaces/categories.interface";

const Creations = () => {
  // Récupération de la session utilisateur
  const { data: session } = authClient.useSession();
  // State contenant tous les articles
  const [articles, setArticles] = useState<Article[]>([]);
  // State contenant les catégories
  const [categories, setCategories] = useState<Category[]>([]);
  // Catégorie actuellement sélectionnée
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  // Nombre d'articles visibles (pagination simple)
  const [visibleCount, setVisibleCount] = useState(9);
  // Liste des articles favoris (stocke les id)
  const [favorites, setFavorites] = useState<number[]>([]);

  // Chargement initial des articles et catégories
  useEffect(() => {
    const fetchData = async () => {
      // On récupère les articles et les catégories en parallèle
      const [articlesData, categoriesData] = await Promise.all([
        getArticles(),
        getCategories(),
      ]);
      // Mise à jour des states
      setArticles(articlesData);
      setCategories(categoriesData);
    };
    fetchData();
  }, []);

  // Filtre des articles selon la catégorie sélectionnée
  const filteredArticles = activeCategory
    ? articles.filter((article) => article.categoryId === activeCategory)
    : articles;
  // Articles affichés selon la pagination
  const visibleArticles = filteredArticles.slice(0, visibleCount);
  // Fonction pour afficher plus d'articles
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  // Gestion de l'ajout ou suppression d'un favori
  const handleFavorite = async (e: React.MouseEvent, articleId: number) => {
    // Empêche le clic de rediriger vers la page article
    e.preventDefault();
    // Si l'utilisateur n'est pas connecté on le redirige
    if (!session) {
      window.location.href = "/connexion";
      return;
    }
    try {
      // Si l'article est déjà en favori → on le retire
      if (favorites.includes(articleId)) {
        await removeFavorite(articleId);
        setFavorites((prev) =>
          prev.filter((id) => id !== articleId)
        );
      } else {
        // Sinon on l'ajoute aux favoris
        await addFavorite(articleId);
        setFavorites((prev) => [...prev, articleId]);
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris", error);
    }
  };
  return (

    // Conteneur principal de la page
    <div className="flex flex-col w-full px-8 py-10 gap-10">
          {/* FILTRES PAR CATÉGORIE */}
      <div className="flex items-center w-full px-8">
        {/* On parcourt les catégories */}
        {categories.map((category, index) => (
          <div key={category.id} className="flex items-center flex-1">
            <button
              onClick={() => {
                // Active ou désactive la catégorie
                setActiveCategory(
                  activeCategory === category.id ? null : category.id
                );
                // Réinitialise le nombre d'articles visibles
                setVisibleCount(9);
              }}
              className={`w-full h-9 font-['Lato'] text-white text-sm font-medium transition-colors flex items-center justify-center rounded-sm ${
                activeCategory === category.id
                  ? "bg-[#9C9475]"
                  : "bg-[#405882]"
              }`}
            >
              {category.name}
            </button>
            {/* Ligne séparatrice entre catégories */}
            {index < categories.length - 1 && (
              <div className="w-16 h-[1px] bg-[#405882]" />
            )}
          </div>
        ))}
      </div>

          {/* GRILLE D'ARTICLES */}
      {visibleArticles.length === 0 ? (
        // Message si aucun article dans la catégorie
        <p className="font-['Lato'] text-gray-400 text-center py-10">
          Aucun article dans cette catégorie
        </p>
      ) : (
        // Grille des articles
        <div className="grid grid-cols-5 gap-4 px-8 w-full">
          {visibleArticles.map((article) => (
            // Carte article qui redirige vers la page détail
            <Link
              key={article.id}
              to={`/creations/${article.id}`}
              className="relative rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Image de l'article */}
              {article.images && article.images.length > 0 ? (
                <img
                  src={
                    article.images.find((img) => img.isMain)?.url ||
                    article.images[0].url
                  }
                  alt={article.title}
                  className="w-full h-44 object-cover"
                />
              ) : (
                // Placeholder si aucune image
                <div className="w-full h-44 bg-gray-200 flex items-center justify-center">
                  <span className="font-['Lato'] text-gray-400 text-xs">
                    Pas d'image
                  </span>
                </div>
              )}

              {/* Informations de l'article */}
              <div className="flex justify-between items-center px-2 py-2">
                {/* Titre + prix */}
                <div className="flex flex-col gap-0.5">
                  <p className="font-['Lato'] text-[#405882] text-xs font-medium truncate max-w-[100px]">
                    {article.title}
                  </p>
                  <p className="font-['Lato'] text-[#9C9475] text-xs">
                    {article.price
                      ? `${article.price.toFixed(2)}€`
                      : "Sur devis"}
                  </p>
                </div>
                {/* Bouton favori */}
                <button
                  onClick={(e) => handleFavorite(e, article.id)}
                  className="p-1"
                >
                  <Heart
                    size={16}
                    className={
                      favorites.includes(article.id)
                        ? "text-red-900 fill-red-900"
                        : "text-red-900"
                    }
                  />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

          {/* BOUTON VOIR PLUS */}
      {/* Permet d'afficher plus d'articles */}
      {visibleCount < filteredArticles.length && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="font-['Lato'] text-[#405882] text-sm hover:underline"
          >
            Voir plus
          </button>
        </div>
      )}
    </div>
  );
};

export default Creations;