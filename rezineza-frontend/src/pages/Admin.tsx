import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { Package, Tag, Mail, Star, LogOut, Plus, Trash2, Edit, X, Check, Images, Star as StarFill, Upload, Home, ShoppingBag, MessageCircle } from "lucide-react";
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

const API_URL = "http://localhost:3000";

// COMPOSANT ADMIN
const Admin = () => {
  // On récupère la session de l'utilisateur connecté
  // session = les infos de l'utilisateur (nom, email, rôle...)
  // isPending = true pendant que Better Auth vérifie la session
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  // La section actuellement affichée dans le contenu principal
  // Par défaut on affiche "articles"
  const [activeSection, setActiveSection] = useState("articles");

  // STATES ARTICLES
  // La liste de tous les articles récupérés depuis l'API
  const [articles, setArticles] = useState<Article[]>([]);
  // La liste de toutes les catégories (pour le select dans le formulaire)
  const [categories, setCategories] = useState<Category[]>([]);
  // true = on affiche le formulaire de création/modification d'article
  const [showArticleForm, setShowArticleForm] = useState(false);
  // L'article qu'on est en train de modifier (null = on crée un nouvel article)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  // Les valeurs des champs du formulaire article
  const [articleForm, setArticleForm] = useState({
    title: "",
    description: "",
    price: "",
    isAvailable: true,
    categoryId: "",
  });

  // STATES IMAGES
  // L'article dont on gère les images dans le modal (null = modal fermé)
  const [imageModalArticle, setImageModalArticle] = useState<Article | null>(null);
  // true = une image est en cours d'upload (pour désactiver le bouton)
  const [uploadingImage, setUploadingImage] = useState(false);
  // Référence vers l'input file caché — on l'utilise pour déclencher
  // le sélecteur de fichiers quand on clique sur le bouton "Ajouter une image"
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STATES CATÉGORIES
  // La valeur du champ "nom" pour créer une nouvelle catégorie
  const [newCategoryName, setNewCategoryName] = useState("");

  // STATES CONTACTS & AVIS
  // La liste de toutes les demandes de contact
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  // La liste de tous les avis clients
  const [reviews, setReviews] = useState<Review[]>([]);
  // Le message de succès ou d'erreur affiché en haut de la page (ex: "Article créé !")
  const [message, setMessage] = useState("");

  // PROTECTION — redirige si pas admin
  // Ce useEffect s'exécute à chaque fois que session ou isPending change
  // Si la session est chargée (isPending = false) et que l'utilisateur
  // n'est pas connecté ou n'est pas admin → on le redirige vers l'accueil
  useEffect(() => {
    if (!isPending && (!session || session.user.role !== "admin")) {
      navigate("/");
    }
  }, [session, isPending, navigate]);

  // FETCH DATA — on charge les données au démarrage
  // Ce useEffect s'exécute une seule fois au chargement du composant
  // Le tableau vide [] signifie "exécute-moi seulement au montage"
  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchContacts();
    fetchReviews();
  }, []);

  // Récupère tous les articles depuis l'API et les stocke dans le state
  const fetchArticles = async () => {
    const res = await fetch(`${API_URL}/articles`, { credentials: "include" });
    // credentials: "include" = envoie les cookies de session avec la requête
    if (res.ok) setArticles(await res.json());
  };

  // Récupère toutes les catégories
  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`, { credentials: "include" });
    if (res.ok) setCategories(await res.json());
  };

  // Récupère toutes les demandes de contact
  const fetchContacts = async () => {
    const res = await fetch(`${API_URL}/contact`, { credentials: "include" });
    if (res.ok) setContacts(await res.json());
  };

  // Récupère tous les avis
  const fetchReviews = async () => {
    const res = await fetch(`${API_URL}/reviews`, { credentials: "include" });
    if (res.ok) setReviews(await res.json());
  };

  // ARTICLES — CRUD (Create Read Update Delete)
  // Crée un nouvel article OU modifie un article existant
  const handleArticleSubmit = async () => {
    // Si editingArticle est défini → on modifie (PATCH), sinon → on crée (POST)
    const method = editingArticle ? "PATCH" : "POST";

    // L'URL change selon qu'on crée ou modifie
    const url = editingArticle
      ? `${API_URL}/articles/${editingArticle.id}` // modifier : on passe l'id
      : `${API_URL}/articles`;                     // créer : pas d'id

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" }, // on envoie du JSON
      credentials: "include",
      body: JSON.stringify({
        title: articleForm.title,
        description: articleForm.description,
        // Si le prix est vide on envoie null (= "Sur devis")
        price: articleForm.price ? Number(articleForm.price) : null,
        isAvailable: articleForm.isAvailable,
        // Si pas de catégorie on envoie null
        categoryId: articleForm.categoryId ? Number(articleForm.categoryId) : null,
      }),
    });

    if (res.ok) {
      // On affiche un message de succès
      setMessage(editingArticle ? "Article modifié !" : "Article créé !");
      // On ferme le formulaire et on remet les champs à vide
      setShowArticleForm(false);
      setEditingArticle(null);
      setArticleForm({ title: "", description: "", price: "", isAvailable: true, categoryId: "" });
      // On recharge la liste des articles pour afficher le nouvel article
      await fetchArticles();
    }
  };

  // Supprime un article après confirmation
  const handleDeleteArticle = async (id: number) => {
    // confirm() affiche une boîte de dialogue de confirmation native du navigateur
    if (!confirm("Supprimer cet article ?")) return;
    const res = await fetch(`${API_URL}/articles/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setMessage("Article supprimé !");
      await fetchArticles(); // on recharge la liste
    }
  };

  // Prépare le formulaire pour modifier un article existant
  const handleEditArticle = (article: Article) => {
    // On stocke l'article qu'on modifie
    setEditingArticle(article);
    // On préremplie les champs du formulaire avec les valeurs actuelles de l'article
    setArticleForm({
      title: article.title,
      description: article.description,
      price: article.price?.toString() || "", // on convertit le number en string pour l'input
      isAvailable: article.isAvailable,
      categoryId: article.categoryId?.toString() || "",
    });
    // On affiche le formulaire
    setShowArticleForm(true);
  };

  // ============================================
  // IMAGES — UPLOAD / SUPPRIMER / PRINCIPALE
  // ============================================

  // Upload une nouvelle image pour un article via Cloudinary
  const handleUploadImage = async (file: File) => {
    if (!imageModalArticle) return; // sécurité : si pas d'article ouvert, on arrête
    setUploadingImage(true); // on désactive le bouton pendant l'upload

    try {
      // FormData permet d'envoyer un fichier dans une requête HTTP
      const formData = new FormData();
      formData.append("image", file); // on ajoute le fichier avec la clé "image"

      const res = await fetch(`${API_URL}/articles/${imageModalArticle.id}/images`, {
        method: "POST",
        credentials: "include",
        body: formData, // pas de Content-Type ici, le navigateur le gère automatiquement
      });

      if (res.ok) {
        setMessage("Image ajoutée !");
        await fetchArticles(); // on recharge les articles
        // On recharge aussi l'article dans le modal pour afficher la nouvelle image immédiatement
        const updated = await fetch(`${API_URL}/articles/${imageModalArticle.id}`, { credentials: "include" });
        if (updated.ok) setImageModalArticle(await updated.json());
      }
    } catch (error) {
      console.error("Erreur upload image", error);
    }

    setUploadingImage(false); // on réactive le bouton
  };

  // Définit une image comme image principale de l'article
  const handleSetMainImage = async (articleId: number, imageId: number) => {
    const res = await fetch(`${API_URL}/articles/${articleId}/images/${imageId}/main`, {
      method: "PUT", // PUT = mettre à jour
      credentials: "include",
    });
    if (res.ok) {
      setMessage("Image principale définie !");
      await fetchArticles();
      // On recharge l'article dans le modal pour mettre à jour le badge "Principale"
      const updated = await fetch(`${API_URL}/articles/${articleId}`, { credentials: "include" });
      if (updated.ok) setImageModalArticle(await updated.json());
    }
  };

  // Supprime une image d'un article (aussi sur Cloudinary côté back)
  const handleDeleteImage = async (articleId: number, imageId: number) => {
    if (!confirm("Supprimer cette image ?")) return;
    const res = await fetch(`${API_URL}/articles/${articleId}/images/${imageId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setMessage("Image supprimée !");
      await fetchArticles();
      // On recharge l'article dans le modal pour retirer l'image supprimée
      const updated = await fetch(`${API_URL}/articles/${articleId}`, { credentials: "include" });
      if (updated.ok) setImageModalArticle(await updated.json());
    }
  };

  // ============================================
  // CATÉGORIES — CRUD
  // ============================================

  // Crée une nouvelle catégorie
  const handleCreateCategory = async () => {
    // .trim() supprime les espaces en début et fin de chaîne
    if (!newCategoryName.trim()) return; // on vérifie que le champ n'est pas vide
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newCategoryName.trim() }),
    });
    if (res.ok) {
      setMessage("Catégorie créée !");
      setNewCategoryName(""); // on vide le champ
      await fetchCategories(); // on recharge la liste
    }
  };

  // Supprime une catégorie
  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setMessage("Catégorie supprimée !");
      await fetchCategories();
    }
  };

  // ============================================
  // CONTACTS — SUPPRIMER
  // ============================================

  // Supprime une demande de contact
  const handleDeleteContact = async (id: number) => {
    if (!confirm("Supprimer cette demande de contact ?")) return;
    const res = await fetch(`${API_URL}/contact/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setMessage("Demande supprimée !");
      await fetchContacts();
    }
  };

  // ============================================
  // AVIS — SUPPRIMER
  // ============================================

  // Supprime un avis client
  const handleDeleteReview = async (id: number) => {
    if (!confirm("Supprimer cet avis ?")) return;
    const res = await fetch(`${API_URL}/reviews/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setMessage("Avis supprimé !");
      await fetchReviews();
    }
  };

  // ============================================
  // DÉCONNEXION
  // ============================================

  const handleLogout = async () => {
    await authClient.signOut(); // on déconnecte l'utilisateur via Better Auth
    navigate("/"); // on redirige vers l'accueil
  };

  // ============================================
  // MENU LATÉRAL — configuration des onglets
  // On stocke les infos des boutons dans un tableau pour éviter de répéter du code
  // ============================================
  const menuItems = [
    { id: "articles", label: "Articles", icon: Package },
    { id: "categories", label: "Catégories", icon: Tag },
    { id: "contacts", label: "Contacts", icon: Mail },
    { id: "avis", label: "Avis", icon: Star },
  ];

  // Pendant que Better Auth vérifie la session on n'affiche rien
  // (évite un flash de contenu avant la redirection)
  if (isPending) return null;

  // ============================================
  // RENDU JSX
  // ============================================
  return (
    // Le wrapper principal prend toute la hauteur de l'écran
    // flex = les enfants (aside + main) sont côte à côte
    <div className="flex min-h-screen bg-gray-50">

      {/* ============================================
          MENU LATÉRAL FIXE
          fixed = reste en place même quand on scrolle
          h-screen = prend toute la hauteur de l'écran
          top-0 left-0 = collé en haut à gauche
      ============================================ */}
      <aside className="w-64 bg-[#405882] flex flex-col py-8 px-4 gap-2 fixed h-screen top-0 left-0">

        {/* Titre du dashboard */}
        <div className="mb-8 px-2">
          <p className="font-['Lato'] text-[#9C9475] text-s mt-1">Administrateur</p>
        </div>

        {/* On boucle sur menuItems pour créer les boutons du dashboard */}
        {menuItems.map((item) => {
          const Icon = item.icon; // on stocke l'icône dans une variable (obligatoire en JSX)
          return (
            <button
              key={item.id} // key obligatoire dans les listes React
              onClick={() => setActiveSection(item.id)} // on change la section active
              // Style conditionnel : fond blanc si actif, transparent sinon
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm transition-colors ${
                activeSection === item.id
                  ? "bg-white text-[#405882] font-bold" // bouton actif
                  : "text-white hover:bg-white/10"       // bouton inactif
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}

        {/* Séparateur visuel entre dashboard et liens du site */}
        <div className="my-2 h-px bg-white/20" />

        {/* Titre de la section liens */}
        <p className="font-['Lato'] text-[#9C9475] text-xs px-4 uppercase tracking-widest">Site</p>

        {/* Liens vers les pages du site — permettent à l'admin de naviguer sans quitter le dashboard */}
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors">
          <Home size={18} /> Accueil
        </Link>
        <Link to="/creations" className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors">
          <ShoppingBag size={18} /> Créations
        </Link>
        <Link to="/avis" className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors">
          <MessageCircle size={18} /> Avis
        </Link>
        <Link to="/contact" className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors">
          <Mail size={18} /> Contact
        </Link>

        {/* Bouton déconnexion poussé en bas avec mt-auto */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-['Lato'] text-sm text-white hover:bg-white/10 transition-colors mt-auto"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </aside>

      {/* ============================================
          CONTENU PRINCIPAL
          ml-64 = marge gauche égale à la largeur du menu (w-64)
          pour que le contenu ne soit pas caché derrière le menu fixe
      ============================================ */}
      <main className="ml-64 flex-1 p-10 flex flex-col gap-6">

        {/* Message de succès — affiché uniquement si message est non vide */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 font-['Lato'] text-sm px-4 py-3 rounded-xl flex justify-between items-center">
            {message}
            {/* Croix pour fermer le message */}
            <button onClick={() => setMessage("")}><X size={16} /></button>
          </div>
        )}

        {/* ==================
            SECTION ARTICLES
            Affichée seulement si activeSection === "articles"
        ================== */}
        {activeSection === "articles" && (
          <div className="flex flex-col gap-6">

            {/* En-tête avec titre et bouton ajouter */}
            <div className="flex justify-between items-center">
              <h1 className="font-['Playfair_Display'] text-[#405882] text-2xl">Articles</h1>
              <button
                onClick={() => {
                  setShowArticleForm(true);
                  setEditingArticle(null); // on s'assure qu'on est en mode création
                  setArticleForm({ title: "", description: "", price: "", isAvailable: true, categoryId: "" });
                }}
                className="flex items-center gap-2 bg-[#405882] text-white font-['Lato'] text-sm px-4 py-2 rounded-full hover:opacity-90"
              >
                <Plus size={16} /> Ajouter un article
              </button>
            </div>

            {/* Formulaire — affiché seulement si showArticleForm est true */}
            {showArticleForm && (
              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <h2 className="font-['Playfair_Display'] text-[#405882] text-lg">
                  {/* Titre différent selon création ou modification */}
                  {editingArticle ? "Modifier l'article" : "Nouvel article"}
                </h2>

                {/* Champ titre */}
                <input
                  type="text"
                  placeholder="Titre"
                  value={articleForm.title}
                  // À chaque frappe on met à jour le state avec le spread operator ...
                  // ... articleForm copie tous les champs existants, puis on écrase juste "title"
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882]"
                />

                {/* Champ description — textarea = zone de texte multiligne */}
                <textarea
                  placeholder="Description"
                  value={articleForm.description}
                  onChange={(e) => setArticleForm({ ...articleForm, description: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882] resize-none h-24"
                />

                {/* Ligne avec prix et catégorie côte à côte */}
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Prix (laisser vide = Sur devis)"
                    value={articleForm.price}
                    onChange={(e) => setArticleForm({ ...articleForm, price: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882]"
                  />

                  {/* Select = liste déroulante pour choisir la catégorie */}
                  <select
                    value={articleForm.categoryId}
                    onChange={(e) => setArticleForm({ ...articleForm, categoryId: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882]"
                  >
                    <option value="">Sans catégorie</option>
                    {/* On génère une option par catégorie */}
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Checkbox disponibilité */}
                <label className="flex items-center gap-2 font-['Lato'] text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.isAvailable}
                    onChange={(e) => setArticleForm({ ...articleForm, isAvailable: e.target.checked })}
                    className="accent-[#405882]" // accent = couleur de la checkbox
                  />
                  Disponible
                </label>

                {/* Boutons valider / annuler */}
                <div className="flex gap-3">
                  <button
                    onClick={handleArticleSubmit}
                    className="flex items-center gap-2 bg-[#405882] text-white font-['Lato'] text-sm px-4 py-2 rounded-full hover:opacity-90"
                  >
                    <Check size={16} />
                    {editingArticle ? "Modifier" : "Créer"}
                  </button>
                  <button
                    onClick={() => { setShowArticleForm(false); setEditingArticle(null); }}
                    className="flex items-center gap-2 border border-gray-200 text-gray-500 font-['Lato'] text-sm px-4 py-2 rounded-full hover:bg-gray-50"
                  >
                    <X size={16} /> Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Liste des articles */}
            <div className="flex flex-col gap-3">
              {articles.length === 0 ? (
                <p className="font-['Lato'] text-gray-400 text-center py-10">Aucun article</p>
              ) : (
                articles.map((article) => (
                  <div key={article.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">

                    {/* Miniature de la première image, ou icône si pas d'image */}
                    {article.images?.[0] ? (
                      <img src={article.images[0].url} alt={article.title} className="w-16 h-16 object-cover rounded-xl" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Package size={20} className="text-gray-300" />
                      </div>
                    )}

                    {/* Infos de l'article */}
                    <div className="flex-1">
                      <p className="font-['Lato'] text-[#405882] font-bold text-sm">{article.title}</p>
                      <p className="font-['Lato'] text-[#9C9475] text-xs">
                        {/* Affiche le prix ou "Sur devis" + la catégorie ou "Sans catégorie" */}
                        {article.price ? `${article.price.toFixed(2)}€` : "Sur devis"} — {article.category?.name || "Sans catégorie"}
                      </p>
                      {/* Disponibilité en vert ou rouge selon la valeur */}
                      <span className={`text-xs font-['Lato'] ${article.isAvailable ? "text-green-500" : "text-red-400"}`}>
                        {article.isAvailable ? "Disponible" : "Non disponible"}
                      </span>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-2">
                      {/* Ouvre le modal de gestion des images */}
                      <button onClick={() => setImageModalArticle(article)} className="p-2 rounded-xl hover:bg-blue-50 text-[#9C9475]" title="Gérer les images">
                        <Images size={16} />
                      </button>
                      {/* Ouvre le formulaire de modification */}
                      <button onClick={() => handleEditArticle(article)} className="p-2 rounded-xl hover:bg-gray-50 text-[#405882]">
                        <Edit size={16} />
                      </button>
                      {/* Supprime l'article */}
                      <button onClick={() => handleDeleteArticle(article.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400">
                        <Trash2 size={16} />
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
            <h1 className="font-['Playfair_Display'] text-[#405882] text-2xl">Catégories</h1>

            <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-center">
              <input
                type="text"
                placeholder="Nom de la catégorie"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 font-['Lato'] text-sm outline-none focus:border-[#405882]"
              />
              <button
                onClick={handleCreateCategory}
                className="flex items-center gap-2 bg-[#405882] text-white font-['Lato'] text-sm px-4 py-2 rounded-full hover:opacity-90"
              >
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
            <h1 className="font-['Playfair_Display'] text-[#405882] text-2xl">Demandes de contact</h1>

            <div className="flex flex-col gap-3">
              {contacts.length === 0 ? (
                <p className="font-['Lato'] text-gray-400 text-center py-10">Aucune demande</p>
              ) : (
                contacts.map((contact) => (
                  <div key={contact.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-['Lato'] text-[#405882] font-bold text-sm">{contact.name}</p>
                        <p className="font-['Lato'] text-[#9C9475] text-xs">{contact.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* toLocaleDateString("fr-FR") formate la date en français */}
                        <p className="font-['Lato'] text-gray-300 text-xs">
                          {new Date(contact.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                        <button onClick={() => handleDeleteContact(contact.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {/* Le sujet est optionnel, on l'affiche seulement s'il existe */}
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
            <h1 className="font-['Playfair_Display'] text-[#405882] text-2xl">Avis clients</h1>

            <div className="flex flex-col gap-3">
              {reviews.length === 0 ? (
                <p className="font-['Lato'] text-gray-400 text-center py-10">Aucun avis</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <p className="font-['Lato'] text-[#405882] font-bold text-sm">{review.name}</p>
                      <p className="font-['Lato'] text-gray-500 text-sm">{review.comment}</p>
                      {/* On génère 5 étoiles et on colorie celles jusqu'à la note */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteReview(review.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* ============================================
          MODAL GESTION DES IMAGES
          fixed inset-0 = couvre tout l'écran
          bg-black/50 = fond semi-transparent noir
          z-50 = par dessus tout le reste
          Affiché seulement si imageModalArticle est défini
      ============================================ */}
      {imageModalArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl flex flex-col gap-5 max-h-[80vh] overflow-y-auto">

            {/* En-tête du modal avec titre et bouton fermer */}
            <div className="flex justify-between items-center">
              <h2 className="font-['Playfair_Display'] text-[#405882] text-xl">
                Images — {imageModalArticle.title}
              </h2>
              {/* Ferme le modal en remettant imageModalArticle à null */}
              <button onClick={() => setImageModalArticle(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                <X size={18} />
              </button>
            </div>

            {/* Input file caché — on le déclenche via fileInputRef.current?.click() */}
            <div>
              <input
                ref={fileInputRef}     // on associe la référence à cet élément
                type="file"
                accept="image/*"       // on accepte seulement les images
                className="hidden"     // on cache l'input natif (pas joli)
                onChange={(e) => {
                  const file = e.target.files?.[0]; // on récupère le premier fichier sélectionné
                  if (file) handleUploadImage(file); // on l'envoie si il existe
                }}
              />
              {/* Ce bouton visible déclenche le clic sur l'input caché */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage} // désactivé pendant l'upload
                className="flex items-center gap-2 bg-[#9C9475] text-white font-['Lato'] text-sm px-4 py-2 rounded-full hover:opacity-90 disabled:opacity-50"
              >
                <Upload size={16} />
                {/* Le texte change pendant l'upload */}
                {uploadingImage ? "Upload en cours..." : "Ajouter une image"}
              </button>
            </div>

            {/* Grille des images existantes */}
            {imageModalArticle.images?.length === 0 ? (
              <p className="font-['Lato'] text-gray-400 text-center py-6">Aucune image</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {imageModalArticle.images?.map((image) => (
                  // group = permet d'utiliser group-hover sur les enfants
                  <div key={image.id} className="relative rounded-xl overflow-hidden group">
                    <img src={image.url} alt="" className="w-full h-36 object-cover" />

                    {/* Badge "Principale" affiché sur l'image principale */}
                    {image.isMain && (
                      <span className="absolute top-2 left-2 bg-[#405882] text-white text-xs px-2 py-0.5 rounded-full font-['Lato']">
                        Principale
                      </span>
                    )}

                    {/* Overlay avec boutons — visible au survol grâce à group-hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {/* Bouton étoile — visible seulement si ce n'est pas déjà l'image principale */}
                      {!image.isMain && (
                        <button
                          onClick={() => handleSetMainImage(imageModalArticle.id, image.id)}
                          className="p-2 bg-white rounded-full text-[#405882] hover:bg-[#405882] hover:text-white transition-colors"
                          title="Définir comme principale"
                        >
                          <StarFill size={14} />
                        </button>
                      )}
                      {/* Bouton supprimer */}
                      <button
                        onClick={() => handleDeleteImage(imageModalArticle.id, image.id)}
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

    </div>
  );
};

export default Admin;