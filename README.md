# tny-frontend

Storefront e painel administrativo do catálogo TNY. React 19 · Vite · Tailwind CSS 4.

Consome a API do [tny-backend](https://github.com/pi-tny/tny-backend).

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- TanStack Query 5
- Axios
- Zod 4
- Lucide React

## Quickstart

Requer o backend rodando (padrão: `http://localhost:3000`).

```bash
cp .env.example .env
npm install
npm run dev          # http://localhost:5173
```

## Estrutura

```
src/
├── components/   componentes reutilizáveis (Header, Footer, Toast, SafeImage…)
├── context/      CarrinhoContext, ToastContext, AuthContext
├── hooks/        useCarrinho, useToast, useAuth
├── pages/        páginas por rota; admin/ com páginas do painel
├── routes/       AppRoutes.tsx
├── services/     cliente Axios e chamadas de API
├── types/        tipos TypeScript compartilhados
└── lib/          utilitários, React Query client
```

## Rotas

| Rota | Página | Auth |
|---|---|---|
| `/` | Home — hero + listagem de produtos | — |
| `/produtos` | Listagem completa | — |
| `/produto/:id` | Detalhe do produto + seletor de variante | — |
| `/promocoes` | Produtos em promoção | — |
| `/carrinho` | Revisão do carrinho | — |
| `/checkout` | Formulário de pedido | — |
| `/pedido-confirmado` | Confirmação pós-checkout | — |
| `/institucional` | Sobre a loja | — |
| `/revendedor` | Página de revendedor | — |
| `/faq` | Perguntas frequentes | — |
| `/admin/login` | Login do painel admin | — |
| `/admin/dashboard` | Dashboard | JWT |
| `/admin/cadastro-produto` | Cadastro de produto | JWT |
| `/admin/produtos/:id/editar` | Edição de produto | JWT |
| `/admin/gerenciar-estoque` | Gestão de estoque | JWT |
| `/admin/pedidos` | Lista de pedidos | JWT |
| `/admin/pedidos/:id` | Detalhe do pedido | JWT |
| `/admin/categorias` | Categorias | JWT |
| `/admin/leads` | Leads | JWT |
| `/admin/admins` | Administradores | JWT |

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | URL base do backend, sem barra final |

## Scripts

| Script | Descrição |
|---|---|
| `dev` | Dev server (Vite) |
| `build` | Build de produção (`tsc -b && vite build`) |
| `preview` | Serve o build localmente |
| `lint` | ESLint |

## Deploy

**Vercel** — `vercel.json` já configura as rewrites para SPA. Defina `VITE_API_URL` como variável de ambiente no painel do projeto.

**Docker** — imagem multi-stage com Node 24 (build) e Nginx (serve estático):

```bash
docker build -t tny-frontend .
docker run -p 80:80 tny-frontend
```

## Licença

[MIT](LICENSE)
