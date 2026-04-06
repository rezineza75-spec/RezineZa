import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Creations from "./pages/Creations";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import Avis from "./pages/Avis";
import Favoris from "./pages/Favoris";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Admin from "./pages/Admin";
import Header from "./components/Header";
import MentionsLegales from "./pages/MentionsLegales";

function App() {
  const location = useLocation();

  // Liste des pages où la Navbar et le Footer ne doivent pas apparaître
const pagesWithoutNavbar = ["/connexion", "/inscription", "/admin"];  // true si on est sur une page sans navbar, false sinon
  const hideNavbar = pagesWithoutNavbar.includes(location.pathname);

  return (
    <>
   {!hideNavbar && <Header />}
{!hideNavbar && (
  <div className="hidden md:block">
    <Navbar />
  </div>
)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creations" element={<Creations />} />
        <Route path="/creations/:id" element={<ArticleDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/avis" element={<Avis />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />      </Routes>
      {/* Le Footer s'affiche sur toutes les pages sauf connexion et inscription */}
      {!hideNavbar && <Footer />}
    </>
  );
}

export default App;