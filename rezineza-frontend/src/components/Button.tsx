interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  bgColor?: string;
  textColor?: string;
  width?: string;       
  height?: string;     
  radius?: string;      
}

const Button = ({
  text,
  onClick,
  type = "button",
  bgColor = "bg-[#405882]",
  textColor = "text-white",
  width = "w-48",       
  height = "h-12",      
  radius = "rounded-full", 
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${width} ${height} ${bgColor} ${textColor} ${radius} font-['Lato'] hover:opacity-90 transition-opacity`}
    >
      {text}
    </button>
  );
};

export default Button;