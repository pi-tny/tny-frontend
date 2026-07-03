import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginAdmin() {
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Troque "1234" pela senha que você quiser
    if (senha === "1234") {
      localStorage.setItem("admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Senha incorreta!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060606] text-white">
      <form onSubmit={handleLogin} className="bg-[#141414] p-8 rounded-2xl border border-white/10">
        <h2 className="mb-4 text-xl font-bold">Acesso Administrativo</h2>
        <input 
          type="password" 
          placeholder="Digite a senha" 
          className="w-full bg-[#1A1A1A] p-3 rounded-lg mb-4"
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" className="w-full bg-white text-black font-bold py-2 rounded-lg">Entrar</button>
      </form>
    </div>
  );
}