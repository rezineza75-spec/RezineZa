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
  const { data: session } = authClient.useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [articlesData, categoriesData] = await Promise.all([
        getArticles(),
        getCategories(),
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
    };
    fetchData();
  }, []);

  const filteredArticles = activeCategory
    ? articles.filter((article) => article.categoryId === activeCategory)
    : articles;

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const handleFavorite = async (e: React.MouseEvent, articleId: number) => {
    e.preventDefault();
    if (!session) {
      window.location.href = "/connexion";
      return;
    }
    try {
      if (favorites.includes(articleId)) {
        await removeFavorite(articleId);
        setFavorites((prev) => prev.filter((id) => id !== articleId));
      } else {
        await addFavorite(articleId);
        setFavorites((prev) => [...prev, articleId]);
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris", error);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 md:px-8 py-8 md:py-10 gap-8 md:gap-10">

      {/* FILTRES PAR CATÉGORIE
          Scrollable jusqu'à 1200px, fixe au dessus */}
      <div className="w-full overflow-x-auto px-0 md:px-8">
  <div className="flex items-center justify-center min-w-max mx-auto">
          {categories.map((category, index) => (
            <div key={category.id} className="flex items-center">
              <button
                onClick={() => {
                  setActiveCategory(
                    activeCategory === category.id ? null : category.id
                  );
                  setVisibleCount(9);
                }}
                className={`h-9 px-4 font-['Lato'] text-white text-sm font-medium transition-colors flex items-center justify-center rounded-sm whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-[#9C9475]"
                    : "bg-[#405882]"
                }`}
              >
                {category.name}
              </button>
              {index < categories.length - 1 && (
                <div className="w-8 xl2:w-16 h-[1px] bg-[#405882] flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GRILLE D'ARTICLES
          2 colonnes sur mobile, 3 sur tablette, 5 sur desktop */}
      {visibleArticles.length === 0 ? (
        <p className="font-['Lato'] text-gray-400 text-center py-10">
          Aucun article dans cette catégorie
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 w-full md:px-8">
          {visibleArticles.map((article) => (
            <Link
              key={article.id}
              to={`/creations/${article.id}`}
              className="relative rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {article.images && article.images.length > 0 ? (
                <img
                  src={
                    article.images.find((img) => img.isMain)?.url ||
                    article.images[0].url
                  }
                  alt={article.title}
                  className="w-full h-36 md:h-44 object-cover"
                />
              ) : (
                <div className="w-full h-36 md:h-44 bg-gray-200 flex items-center justify-center">
                  <span className="font-['Lato'] text-gray-400 text-xs">
                    Pas d'image
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center px-2 py-2">
                <div className="flex flex-col gap-0.5">
                  <p className="font-['Lato'] text-[#405882] text-xs font-medium truncate max-w-[90px] md:max-w-[100px]">
                    {article.title}
                  </p>
                  <p className="font-['Lato'] text-[#9C9475] text-xs">
                    {article.price
                      ? `${article.price.toFixed(2)}€`
                      : "Sur devis"}
                  </p>
                </div>
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