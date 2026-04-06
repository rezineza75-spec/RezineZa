import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { Package, Tag, Mail, Star, LogOut, Plus, Trash2, Edit, X, Check, Images, Star as StarFill, Upload, Home, ShoppingBag, MessageCircle, Menu, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Category { id: number; name: string; }
interface ArticleImage { id: number; url: string; isMain: boolean; }
interface Article {
  id: number;
  title: string;
  description: string;
  price: number | null;
  isAvailable: boolean;
  categoryId: number | null;
  category: Category | null;
  images: ArticleImage[];
}
interface ContactRequest {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: string;
}
interface Review {
  id: number;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}

// Interface pour les images du site (hero + carousel)
interface SiteImage {
  id: number;
  url: string;
  publicId: string;
  type: string;
  order: number;
}

const API_URL = "http://localhost:3000/api";

const Admin = () => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("articles");
  const [menuOpen, setMenuOpen] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: "", description: "", price: "", isAvailable: true, categoryId: "",
  });

  const [imageModalArticle, setImageModalArticle] = useState<Article | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");

  // States pour la gestion des images du site
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingCarousel, setUploadingCarousel] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const carouselInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPending && (!session || session.user.role !== "admin")) {
      navigate("/");
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchContacts();
    fetchReviews();
    fetchSiteImages();
  }, []);

  const fetchArticles = async () => {
    const res = await fetch(`${API_URL}/articles`, { credentials: "include" });
    if (res.ok) setArticles(await res.json());
  };
  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`, { credentials: "include" });
    if (res.ok) setCategories(await res.json());
  };
  const fetchContacts = async () => {
    const res = await fetch(`${API_URL}/contact`, { credentials: "include" });
    if (res.ok) setContacts(await res.json());
  };
  const fetchReviews = async () => {
    const res = await fetch(`${API_URL}/reviews`, { credentials: "include" });
    if (res.ok) setReviews(await res.json());
  };

  // Récupère toutes les images du site (hero + carousel)
  const fetchSiteImages = async () => {
    const res = await fetch(`${API_URL}/site-images`, { credentials: "include" });
    if (res.ok) setSiteImages(await res.json());
  };

  // Upload d'une image du site (hero ou carousel)
  const handleUploadSiteImage = async (file: File, type: "hero" | "carousel") => {
    if (type === "hero") setUploadingHero(true);
    else setUploadingCarousel(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);
      // Pour le carousel, on définit l'ordre en fonction du nombre d'images existantes
      if (type === "carousel") {
        const carouselCount = siteImages.filter(img => img.type === "carousel").length;
        formData.append("order", String(carouselCount));
      }

      const res = await fetch(`${API_URL}/site-images`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        setMessage(type === "hero" ? "Image hero mise à jour !" : "Image ajoutée au carrousel !");
        await fetchSiteImages();
      }
    } catch (error) {
      console.error("Erreur upload image site", error);
    }

    if (type === "hero") setUploadingHero(false);
    else setUploadingCarousel(false);
  };

  // Suppression d'une image du site
  const handleDeleteSiteImage = async (id: number, type: string) => {
    const label = type === "hero" ? "l'image hero" : "cette image du carrousel";
    if (!confirm(`Supprimer ${label} ?`)) return;

    const res = await fetch(`${API_URL}/site-images/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setMessage(type === "hero" ? "Image hero supprimée !" : "Image supprimée du carrousel !");
      await fetchSiteImages();
    }
  };

  const handleArticleSubmit = async () => {
    const method = editingArticle ? "PATCH" : "POST";
    const url = editingArticle ? `${API_URL}/articles/${editingArticle.id}` : `${API_URL}/articles`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: articleForm.title,
        description: articleForm.description,
        price: articleForm.price ? Number(articleForm.price) : null,
        isAvailable: articleForm.isAvailable,
        categoryId: articleForm.categoryId ? Number(articleForm.categoryId) : null,
      }),
    });
    if (res.ok) {
      setMessage(editingArticle ? "Article modifié !" : "Article créé !");
      setShowArticleForm(false);
      setEditingArticle(null);
      setArticleForm({ title: "", description: "", price: "", isAvailable: true, categoryId: "" });
      await fetchArticles();
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm("Supprimer cet article ?")) return;
    const res = await fetch(`${API_URL}/articles/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { setMessage("Article supprimé !"); await fetchArticles(); }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      description: article.description,
      price: article.price?.toString() || "",
      isAvailable: article.isAvailable,
      categoryId: article.categoryId?.toString() || "",
    });
    setShowArticleForm(true);
  };

  const handleUploadImage = async (file: File) => {
    if (!imageModalArticle) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_URL}/articles/${imageModalArticle.id}/images`, {
        method: "POST", credentials: "include", body: formData,
      });
      if (res.ok) {
        setMessage("Image ajoutée !");
        await fetchArticles();
        const updated = await fetch(`${API_URL}/articles/${imageModalArticle.id}`, { credentials: "include" });
        if (updated.ok) setImageModalArticle(await updated.json());
      }
    } catch (error) { console.error("Erreur upload image", error); }
    setUploadingImage(false);
  };

  const handleSetMainImage = async (articleId: number, imageId: number) => {
    const res = await fetch(`${API_URL}/articles/${articleId}/images/${imageId}/main`, { method: "PUT", credentials: "include" });
    if (res.ok) {
      setMessage("Image principale définie !");
      await fetchArticles();
      const updated = await fetch(`${API_URL}/articles/${articleId}`, { credentials: "include" });
      if (updated.ok) setImageModalArticle(await updated.json());
    }
  };

  const handleDeleteImage = async (articleId: number, imageId: number) => {
    if (!confirm("Supprimer cette image ?")) return;
    const res = await fetch(`${API_URL}/articles/${articleId}/images/${imageId}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setMessage("Image supprimée !");
      await fetchArticles();
      const updated = await fetch(`${API_URL}/articles/${articleId}`, { credentials: "include" });
      if (updated.ok) setImageModalArticle(await updated.json());
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ name: newCategoryName.trim() }),
    });
    if (res.ok) { setMessage("Catégorie créée !"); setNewCategoryName(""); await fetchCategories(); }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const res = await fetch(`${API_URL}/categories/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { setMessage("Catégorie supprimée !"); await fetchCategories(); }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm("Supprimer cette demande de contact ?")) return;
    const res = await fetch(`${API_URL}/contact/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { setMessage("Demande supprimée !"); await fetchContacts(); }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Supprimer cet avis ?")) return;
    const res = await fetch(`${API_URL}/reviews/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { setMessage("Avis supprimé !"); await fetchReviews(); }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/");
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setMenuOpen(false);
  };

  // On ajoute "accueil" dans les items du menu
  const menuItems = [
    { id: "accueil", label: "Page d'accueil", icon: ImageIcon },
    { id: "articles", label: "Articles", icon: Package },
    { id: "categories", label: "Catégories", icon: Tag },
    { id: "contacts", label: "Contacts", icon: Mail },
    { id: "avis", label: "Avis", icon: Star },
  ];

  if (isPending) return null;

  const MenuContent = () => (
    <>
      <div className="mb-8 px-2">
        <p className="font-['Lato'] text-[#9C9475] text-sm mt-1">Administrateur</p>
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => handleSectionChange(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm transition-colors ${
              activeSection === item.id
                ? "bg-white text-[#405882] font-bold"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}

      <div className="my-2 h-px bg-white/20" />
      <p className="font-['Lato'] text-[#9C9475] text-xs px-4 uppercase tracking-widest">Site</p>

      <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors">
        <Home size={18} /> Accueil
      </Link>
      <Link to="/creations" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors">
        <ShoppingBag size={18} /> Créations
      </Link>
      <Link to="/avis" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors">
        <MessageCircle size={18} /> Avis
      </Link>
      <Link to="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors">
        <Mail size={18} /> Contact
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors mt-auto"
      >
        <LogOut size={18} />
        Déconnexion
      </button>
    </>
  );

  // Images hero et carousel séparées
  const heroImage = siteImages.find(img => img.type === "hero");
  const carouselImages = siteImages
    .filter(img => img.type === "carousel")
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 bg-[#405882] flex-col py-8 px-4 gap-2 fixed h-screen top-0 left-0">
        <MenuContent />
      </aside>

      {/* HEADER MOBILE */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#405882] px-4 py-3 flex items-center justify-end">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* DRAWER MOBILE */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMenuOpen(false)}>
          <div
            className="bg-[#405882] w-64 h-full flex flex-col py-8 px-4 gap-2 pt-16"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuContent />
          </div>
        </div>
      )}

      <main className="w-full md:ml-64 flex-1 p-4 md:p-10 pt-16 md:pt-10 flex flex-col gap-6">

        {/* Message de succès */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 font-['Lato'] text-sm px-4 py-3 rounded-xl flex justify-between items-center">
            {message}
            <button onClick={() => setMessage("")}><X size={16} /></button>
          </div>
        )}

        {/* ==================
            SECTION PAGE D'ACCUEIL
        ================== */}
        {activeSection === "accueil" && (
          <div className="flex flex-col gap-8">
            <h1 className="font-['Playfair_Display'] text-[#405882] text-xl md:text-2xl">
              Page d'accueil
            </h1>

            {/* --- IMAGE HERO --- */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-['Lato'] text-[#405882] font-bold text-base">
                    Image de fond (bannière)
                  </h2>
                  <p className="font-['Lato'] text-gray-400 text-xs mt-1">
                    C'est l'image affichée en arrière-plan de la première section. Une seule image à la fois.
                  </p>
                </div>
                {/* Input caché déclenché par le bouton */}
                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadSiteImage(file, "hero");
                  }}
                />
                <button
                  onClick={() => heroInputRef.current?.click()}
                  disabled={uploadingHero}
                  className="flex items-center gap-2 bg-[#405882] text-white font-['Lato'] text-sm px-4 py-2 rounded-full hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                >
                  <Upload size={16} />
                  {uploadingHero ? "Upload..." : heroImage ? "Changer" : "Ajouter"}
                </button>
              </div>

              {/* Aperçu de l'image hero */}
              {heroImage ? (
                <div className="relative rounded-xl overflow-hidden group">
                  <img
                    src={heroImage.url}
                    alt="Image hero"
                    className="w-full h-48 object-cover"
                  />
                  {/* Overlay au survol avec bouton supprimer */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteSiteImage(heroImage.id, "hero")}
                      className="p-2 bg-white rounded-full text-red-400 hover:bg-red-400 hover:text-white transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2">
                  <ImageIcon size={32} className="text-gray-300" />
                  <p className="font-['Lato'] text-gray-400 text-sm">Aucune image hero définie</p>
                  <p className="font-['Lato'] text-gray-300 text-xs">L'image par défaut du site sera utilisée</p>
                </div>
              )}
            </div>

            {/* --- IMAGES CARROUSEL --- */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-['Lato'] text-[#405882] font-bold text-base">
                    Images du carrousel
                  </h2>
                  <p className="font-['Lato'] text-gray-400 text-xs mt-1">
                    Ces images défilent automatiquement dans la section « quelques réalisations ».
                  </p>
                </div>
                {/* Input caché pour le carrousel */}
                <input
                  ref={carouselInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadSiteImage(file, "carousel");
                  }}
                />
                <button
                  onClick={() => carouselInputRef.current?.click()}
                  disabled={uploadingCarousel}
                  className="flex items-center gap-2 bg-[#9C9475] text-white font-['Lato'] text-sm px-4 py-2 rounded-full hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                >
                  <Plus size={16} />
                  {uploadingCarousel ? "Upload..." : "Ajouter"}
                </button>
              </div>

              {/* Grille des images du carrousel */}
              {carouselImages.length === 0 ? (
                <div className="w-full h-32 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2">
                  <ImageIcon size={28} className="text-gray-300" />
                  <p className="font-['Lato'] text-gray-400 text-sm">Aucune image dans le carrousel</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {carouselImages.map((image) => (
                    <div key={image.id} className="relative rounded-xl overflow-hidden group">
                      <img
                        src={image.url}
                        alt={`Carousel ${image.order + 1}`}
                        className="w-full h-28 md:h-36 object-cover"
                      />
                      {/* Badge ordre */}
                      <span className="absolute top-2 left-2 bg-[#405882] text-white text-xs px-2 py-0.5 rounded-full font-['Lato']">
                        #{image.order + 1}
                      </span>
                      {/* Overlay avec bouton supprimer au survol */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteSiteImage(image.id, "carousel")}
                          className="p-2 bg-white rounded-full text-red-400 hover:bg-red-400 hover:text-white transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================
            SECTION ARTICLES
        ================== */}
        {activeSection === "articles" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h1 className="font-['Playfair_Display'] text-[#405882] text-xl md:text-2xl">Articles</h1>
              <button
                onClick={() => {
                  setShowArticleForm(true);
                  setEditingArticle(null);
                  setArticleForm({ title: "", description: "", price: "", isAvailable: true, categoryId: "" });
                }}
                className="flex items-center gap-2 bg-[#405882] text-white font-['Lato'] text-xs md:text-sm px-3 md:px-4 py-2 rounded-full hover:opacity-90"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>

            {showArticleForm && (
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
                <h2 className="font-['Playfair_Display'] text-[#405882] text-lg">
                  {editingArticle ? "Modifier l'article" : "Nouvel article"}
                </h2>
                <input
                  type="text" placeholder="Titre" value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882]"
                />
                <textarea
                  placeholder="Description" value={articleForm.description}
                  onChange={(e) => setArticleForm({ ...articleForm, description: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882] resize-none h-24"
                />
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="number" placeholder="Prix (vide = Sur devis)" value={articleForm.price}
                    onChange={(e) => setArticleForm({ ...articleForm, price: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882]"
                  />
                  <select
                    value={articleForm.categoryId}
                    onChange={(e) => setArticleForm({ ...articleForm, categoryId: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882]"
                  >
                    <option value="">Sans catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 font-['Lato'] text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox" checked={articleForm.isAvailable}
                    onChange={(e) => setArticleForm({ ...articleForm, isAvailable: e.target.checked })}
                    className="accent-[#405882]"
                  />
                  Disponible
                </label>
                <div className="flex gap-3">
                  <button onClick={handleArticleSubmit} className="flex items-center gap-2 bg-[#405882] text-white font-['Lato'] text-sm px-4 py-2 rounded-full hover:opacity-90">
                    <Check size={16} />{editingArticle ? "Modifier" : "Créer"}
                  </button>
                  <button onClick={() => { setShowArticleForm(false); setEditingArticle(null); }} className="flex items-center gap-2 border border-gray-200 text-gray-500 font-['Lato'] text-sm px-4 py-2 rounded-full hover:bg-gray-50">
                    <X size={16} /> Annuler
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {articles.length === 0 ? (
                <p className="font-['Lato'] text-gray-400 text-center py-10">Aucun article</p>
              ) : (
                articles.map((article) => (
                  <div key={article.id} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm flex items-center gap-3 md:gap-4">
                    {article.images?.[0] ? (
                      <img src={article.images[0].url} alt={article.title} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-xl flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={20} className="text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-['Lato'] text-[#405882] font-bold text-sm truncate">{article.title}</p>
                      <p className="font-['Lato'] text-[#9C9475] text-xs truncate">
                        {article.price ? `${article.price.toFixed(2)}€` : "Sur devis"} — {article.category?.name || "Sans catégorie"}
                      </p>
                      <span className={`text-xs font-['Lato'] ${article.isAvailable ? "text-green-500" : "text-red-400"}`}>
                        {article.isAvailable ? "Disponible" : "Non disponible"}
                      </span>
                    </div>
                    <div className="flex gap-1 md:gap-2 flex-shrink-0">
                      <button onClick={() => setImageModalArticle(article)} className="p-1.5 md:p-2 rounded-xl hover:bg-blue-50 text-[#9C9475]">
                        <Images size={15} />
                      </button>
                      <button onClick={() => handleEditArticle(article)} className="p-1.5 md:p-2 rounded-xl hover:bg-gray-50 text-[#405882]">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDeleteArticle(article.id)} className="p-1.5 md:p-2 rounded-xl hover:bg-red-50 text-red-400">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================
            SECTION CATÉGORIES
        ================== */}
        {activeSection === "categories" && (
          <div className="flex flex-col gap-6">
            <h1 className="font-['Playfair_Display'] text-[#405882] text-xl md:text-2xl">Catégories</h1>
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm flex gap-3 md:gap-4 items-center">
              <input
                type="text" placeholder="Nom de la catégorie" value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882]"
              />
              <button onClick={handleCreateCategory} className="flex items-center gap-2 bg-[#405882] text-white font-['Lato'] text-sm px-3 md:px-4 py-2 rounded-full hover:opacity-90 whitespace-nowrap">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {categories.length === 0 ? (
                <p className="font-['Lato'] text-gray-400 text-center py-10">Aucune catégorie</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <p className="font-['Lato'] text-[#405882] font-bold text-sm">{cat.name}</p>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================
            SECTION CONTACTS
        ================== */}
        {activeSection === "contacts" && (
          <div className="flex flex-col gap-6">
            <h1 className="font-['Playfair_Display'] text-[#405882] text-xl md:text-2xl">Demandes de contact</h1>
            <div className="flex flex-col gap-3">
              {contacts.length === 0 ? (
                <p className="font-['Lato'] text-gray-400 text-center py-10">Aucune demande</p>
              ) : (
                contacts.map((contact) => (
                  <div key={contact.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-['Lato'] text-[#405882] font-bold text-sm">{contact.name}</p>
                        <p className="font-['Lato'] text-[#9C9475] text-xs">{contact.email}</p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <p className="font-['Lato'] text-gray-300 text-xs hidden sm:block">
                          {new Date(contact.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                        <button onClick={() => handleDeleteContact(contact.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {contact.subject && (
                      <p className="font-['Lato'] text-gray-500 text-sm font-medium">{contact.subject}</p>
                    )}
                    <p className="font-['Lato'] text-gray-500 text-sm">{contact.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================
            SECTION AVIS
        ================== */}
        {activeSection === "avis" && (
          <div className="flex flex-col gap-6">
            <h1 className="font-['Playfair_Display'] text-[#405882] text-xl md:text-2xl">Avis clients</h1>
            <div className="flex flex-col gap-3">
              {reviews.length === 0 ? (
                <p className="font-['Lato'] text-gray-400 text-center py-10">Aucun avis</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <p className="font-['Lato'] text-[#405882] font-bold text-sm">{review.name}</p>
                      <p className="font-['Lato'] text-gray-500 text-sm">{review.comment}</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteReview(review.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400 flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* MODAL GESTION DES IMAGES ARTICLES */}
      {imageModalArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-2xl flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-['Playfair_Display'] text-[#405882] text-lg md:text-xl truncate pr-4">
                Images — {imageModalArticle.title}
              </h2>
              <button onClick={() => setImageModalArticle(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 flex-shrink-0">
                <X size={18} />
              </button>
            </div>
            <div>
              <input
                ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadImage(file);
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex items-center gap-2 bg-[#9C9475] text-white font-['Lato'] text-sm px-4 py-2 rounded-full hover:opacity-90 disabled:opacity-50"
              >
                <Upload size={16} />
                {uploadingImage ? "Upload en cours..." : "Ajouter une image"}
              </button>
            </div>

            {imageModalArticle.images?.length === 0 ? (
              <p className="font-['Lato'] text-gray-400 text-center py-6">Aucune image</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {imageModalArticle.images?.map((image) => (
                  <div key={image.id} className="relative rounded-xl overflow-hidden group">
                    <img src={image.url} alt="" className="w-full h-28 md:h-36 object-cover" />
                    {image.isMain && (
                      <span className="absolute top-2 left-2 bg-[#405882] text-white text-xs px-2 py-0.5 rounded-full font-['Lato']">
                        Principale
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!image.isMain && (
                        <button
                          onClick={() => handleSetMainImage(imageModalArticle.id, image.id)}
                          className="p-2 bg-white rounded-full text-[#405882] hover:bg-[#405882] hover:text-white transition-colors"
                        >
                          <StarFill size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteImage(imageModalArticle.id, image.id)}
                        className="p-2 bg-white rounded-full text-red-400 hover:bg-red-400 hover:text-white transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;