import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { getArticleById } from "../api/article";
import { addFavorite, removeFavorite, checkFavorite } from "../api/favorite";
import { authClient } from "../lib/auth-client";
import type { Article } from "../interfaces/articles.interface";
import Button from "../components/Button";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      const data = await getArticleById(Number(id));
      setArticle(data);
      const main = data.images?.find((img) => img.isMain) || data.images?.[0];
      if (main) setMainImage(main.url);
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchFavorite = async () => {
      if (!session || !id) return;
      try {
        const data = await checkFavorite(Number(id));
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Erreur lors de la vérification du favori", error);
      }
    };
    fetchFavorite();
  }, [session, id]);

  const handleFavorite = async () => {
    if (!session) {
      navigate("/connexion");
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(Number(id));
        setIsFavorite(false);
      } else {
        await addFavorite(Number(id));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris", error);
    }
  };

  if (!article) {
    return (
      <div className="flex justify-center items-center py-32">
        <p className="font-['Lato'] text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-4 md:px-8 py-8 md:py-10 gap-8">

      <Link
        to="/creations"
        className="font-['Lato'] text-[#405882] text-sm hover:underline w-fit"
      >
        ← Retour aux créations
      </Link>

      {/* CARTE PRINCIPALE
          Sur mobile : image en haut, infos en bas
          Sur desktop : image à gauche, infos à droite */}
      <div className="flex flex-col md:flex-row bg-white rounded-[20px] overflow-hidden shadow-md w-full">

        {/* IMAGE PRINCIPALE */}
        <div className="w-full md:w-1/2 relative">
          {mainImage ? (
            <img
              src={mainImage}
              alt={article.title}
              className="w-full h-[300px] md:h-[700px] object-cover"
            />
          ) : (
            <div className="w-full h-[300px] md:h-[450px] bg-gray-200 flex items-center justify-center">
              <span className="font-['Lato'] text-gray-400">Pas d'image</span>
            </div>
          )}

          {/* Miniatures */}
          {article.images && article.images.length > 1 && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              {article.images.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={article.title}
                  onClick={() => setMainImage(image.url)}
                  className={`w-10 h-10 md:w-14 md:h-14 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    mainImage === image.url
                      ? "border-[#405882]"
                      : "border-white opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* INFORMATIONS ARTICLE */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col gap-5 justify-center">

          {article.category && (
            <span className="inline-block bg-[#9C9475] text-white text-xs tracking-widest uppercase px-3 py-1 rounded-full w-fit">
              {article.category.name}
            </span>
          )}

          <h1 className="font-['Playfair_Display'] text-[#405882] text-2xl md:text-3xl leading-snug">
            {article.title}
          </h1>

          <p className="text-[#9C9475] text-xl md:text-2xl font-bold font-['Lato']">
            {article.price ? `${article.price.toFixed(2)}€` : "Sur devis"}
          </p>

          <div className="h-px bg-[#e8e4d8]" />

          <p className="font-['Lato'] text-gray-500 text-sm leading-relaxed">
            {article.description}
          </p>

          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                article.isAvailable ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <p className="font-['Lato'] text-sm text-gray-500">
              {article.isAvailable ? "Disponible" : "Non disponible"}
            </p>
          </div>

          <div className="h-px bg-[#e8e4d8]" />

          <div className="flex items-center gap-4">
            <Link to="/contact">
              <Button
                text="Contactez-moi"
                bgColor="bg-[#405882]"
                width="w-44"
                radius="rounded-full"
              />
            </Link>
            <button
              onClick={handleFavorite}
              className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors ${
                isFavorite
                  ? "bg-red-900 border-red-900"
                  : "border-red-900 bg-white"
              }`}
            >
              <Heart
                size={18}
                className={isFavorite ? "text-white fill-white" : "text-red-900"}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;