import { NavLink, Link } from "react-router-dom";
import logoTNY from "../assets/Ativo 17.png"; 

const navItems = [
  { label: "Início", to: "/" },
  { label: "Promoções", to: "/promocoes" },
  { label: "Institucional", to: "/institucional" },
  { label: "Seja revendedor", to: "/revendedor" },
];

export function Header() {
  return (
    <header className="border-b border-neutral-800 bg-[#111] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="flex items-center justify-between">
          {/* Logo*/}
          <Link to="/" className="flex items-center">
            <img 
              src={logoTNY} 
              alt="Logo TNY" 
              className="h-8 w-auto object-contain" 
            />
          </Link>
          
          <Link to="/carrinho" className="rounded-full border border-white/10 bg-white/5 p-2.5 text-lg">
            🛍️
          </Link>
        </div>

        {/* Barra de busca */}
        <div className="flex items-center rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-neutral-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input className="w-full bg-transparent outline-none placeholder:text-neutral-500" placeholder="O que você procura?" />
        </div>

        <nav className="flex justify-between gap-4 overflow-x-auto text-sm text-neutral-400">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `whitespace-nowrap pb-1 transition-colors ${isActive ? "border-b-2 border-white text-white" : "hover:text-white"}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}