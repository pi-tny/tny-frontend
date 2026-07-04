import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Produto } from "../../types";

const PRODUTOS_STORAGE_KEY = "tny_produtos";

export function CadastroProduto() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: 0,
    code: "",
    name: "",
    price: "",
    image: "",
    promocao: false,
    description: "",
    category: "",
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Código é obrigatório";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Preço deve ser maior que 0";
    }
    if (!formData.image.trim()) {
      newErrors.image = "Imagem é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({
          ...prev,
          image: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const storedProdutos = localStorage.getItem(PRODUTOS_STORAGE_KEY);
      const produtos: Produto[] = storedProdutos ? JSON.parse(storedProdutos) : [];

      // CORREÇÃO: Adicionando campos obrigatórios 'images', 'sizes' e 'colors'
      const newProduct: Produto = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image,
        images: [formData.image], 
        description: formData.description,
        category: formData.category,
        sizes: ["P", "M", "G", "GG"], 
        colors: ["Branco", "Preto"],
        badge: formData.promocao ? "Promoção" : undefined,
      };

      const updatedProdutos = [...produtos, newProduct];
      localStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(updatedProdutos));

      setFormData({
        id: 0,
        code: "",
        name: "",
        price: "",
        image: "",
        promocao: false,
        description: "",
        category: "",
      });
      setPreviewImage("");

      alert("Produto cadastrado com sucesso!");
      navigate("/admin/gerenciar-estoque");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition"
        >
          ← Voltar
        </button>

        <h1 className="text-3xl font-bold mb-8">Cadastrar Novo Produto</h1>

        <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/10 rounded-xl p-8 space-y-6">
          {/* Código */}
          <div>
            <label className="block text-sm font-semibold mb-2">Código do Produto</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="Ex: TNY-001"
              className={`w-full bg-[#0a0a0a] border rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition ${
                errors.code ? "border-red-500" : "border-white/20"
              }`}
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold mb-2">Nome do Produto</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Camiseta TNY Premium"
              className={`w-full bg-[#0a0a0a] border rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition ${
                errors.name ? "border-red-500" : "border-white/20"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-semibold mb-2">Preço (R$)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full bg-[#0a0a0a] border rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition ${
                errors.price ? "border-red-500" : "border-white/20"
              }`}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold mb-2">Categoria</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Ex: Camisetas, Calças, Acessórios"
              className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold mb-2">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva o produto..."
              rows={4}
              className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-semibold mb-2">Upload de Imagem</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`w-full bg-[#0a0a0a] border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer file:cursor-pointer file:bg-emerald-600 file:text-white file:border-0 file:px-3 file:py-1 file:rounded file:mr-4 ${
                    errors.image ? "border-red-500" : "border-white/20"
                  }`}
                />
              </div>
              {previewImage && (
                <img src={previewImage} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
              )}
            </div>
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Switch - Habilitar para Promoções */}
          <div className="flex items-center justify-between bg-[#0a0a0a] border border-white/20 rounded-lg p-4">
            <label className="text-sm font-semibold">Habilitar para Promoções</label>
            <div className="relative">
              <input
                type="checkbox"
                name="promocao"
                checked={formData.promocao}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition ${
                  formData.promocao ? "bg-emerald-500" : "bg-neutral-600"
                }`}
              />
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                  formData.promocao ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id: 0,
                  code: "",
                  name: "",
                  price: "",
                  image: "",
                  promocao: false,
                  description: "",
                  category: "",
                });
                setPreviewImage("");
                setErrors({});
              }}
              className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg font-semibold transition"
            >
              Limpar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-600 rounded-lg font-semibold transition"
            >
              {isSubmitting ? "Salvando..." : "Finalizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}