import { Link } from "react-router-dom";

interface NavbarProps {
  fontSize?: string;
  bgColor?: string;
  textColor?: string;
  gap?: string;
  justify?: string;
  direction?: "row" | "col";
  padding?: string;
}

const Navbar = ({
  fontSize = "text-2xl",
  bgColor = "bg-[#9C9475]",
  textColor = "text-white",
  gap = "gap-16",
  justify = "justify-center",
  direction = "row",
  padding = "py-4",
}: NavbarProps) => {

  const linkStyle = `
    font-['Playfair_Display']
    ${fontSize}
    font-normal
    ${textColor}
    inline-block
    px-4
    py-2
    rounded-md
    transition-all
    duration-300
    ease-in-out
    hover:bg-white/10
    hover:shadow-xl
    hover:-translate-y-1
  `;

  return (
    <nav className={`${bgColor} ${padding}`}>
      <ul
        className={`flex ${
          direction === "col" ? "flex-col" : "flex-row"
        } ${justify} items-center ${gap}`}
      >
        <li><Link to="/" className={linkStyle}>Accueil</Link></li>
        <li><Link to="/contact" className={linkStyle}>Contact</Link></li>
        <li><Link to="/creations" className={linkStyle}>Créations</Link></li>
        <li><Link to="/avis" className={linkStyle}>Avis</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;