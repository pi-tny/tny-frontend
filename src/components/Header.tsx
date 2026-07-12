import { useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search } from "lucide-react";
import { useCarrinho } from "../context/useCarrinho";
import logoTNY from "../assets/Ativo 17.png";

const navItems = [
  { label: "Início", to: "/" },
  { label: "Produtos", to: "/produtos" },
  { label: "Promoções", to: "/promocoes" },
  { label: "Institucional", to: "/institucional" },
  { label: "Seja revendedor", to: "/revendedor" },
];

function CartButton({ totalItems }: { totalItems: number }) {
  return (
    <Link
      to="/carrinho"
      aria-label={`Abrir carrinho${totalItems > 0 ? ` com ${totalItems} item(ns)` : ""}`}
      className="relative flex items-center justify-center rounded-full border border-line bg-white/5 p-2.5 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
    >
      <ShoppingBag size={20} className="text-ink" />
      {totalItems > 0 && (
        <span
          key={totalItems}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 animate-bump items-center justify-center rounded-full bg-accent text-[10px] font-bold text-black"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}

function SearchBar({ inputRef, onKeyDown }: { inputRef: React.RefObject<HTMLInputElement | null>; onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-elevated px-3 py-2 text-ink-muted transition-colors duration-200 focus-within:border-accent/60">
      <Search size={15} className="flex-shrink-0" />
      <input
        ref={inputRef}
        onKeyDown={onKeyDown}
        aria-label="Buscar produtos"
        className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
        placeholder="Buscar produtos..."
      />
    </div>
  );
}

export function Header() {
  const { totalItems } = useCarrinho();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const term = searchRef.current?.value.trim();
      navigate(term ? `/produtos?q=${encodeURIComponent(term)}` : "/produtos");
      searchRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* desktop: single row */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link to="/" className="flex-shrink-0">
            <img src={logoTNY} alt="TNY" className="h-8 w-auto object-contain" />
          </Link>

          <nav className="flex items-center gap-5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-200 ${isActive ? "font-semibold text-ink" : "text-ink-muted hover:text-ink"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="w-64 xl:w-80">
            <SearchBar inputRef={searchRef} onKeyDown={handleSearchKeyDown} />
          </div>

          <CartButton totalItems={totalItems} />
        </div>

        {/* mobile/tablet: three compact rows */}
        <div className="flex flex-col gap-2 lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img src={logoTNY} alt="TNY" className="h-7 w-auto object-contain" />
            </Link>
            <CartButton totalItems={totalItems} />
          </div>

          <SearchBar inputRef={searchRef} onKeyDown={handleSearchKeyDown} />

          <nav className="flex items-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex-shrink-0 pb-0.5 text-sm transition-colors duration-200 ${
                    isActive ? "border-b-2 border-accent font-medium text-ink" : "text-ink-muted hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
