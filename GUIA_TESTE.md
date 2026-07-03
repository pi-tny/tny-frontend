# 🧪 Guia de Teste - Passo a Passo

## 🎬 Teste 1: Toast em Ação (Feedback de Usuário)

### Objetivo
Verificar que a mensagem "Adicionado com sucesso!" aparece por 3 segundos ao adicionar um produto.

### Passos:

#### 1. Abra a página inicial
```
http://localhost:5173/
```

#### 2. Navegue até a seção de produtos
- ✅ Você verá cards de produtos com botão "Adicionar"

#### 3. Clique no botão "Adicionar" de qualquer produto
```
RESULTADO ESPERADO:
✓ Uma mensagem verde aparece no canto inferior direito
✓ Texto: "Adicionado com sucesso!"
✓ Desaparece automaticamente após 3 segundos
```

#### 4. Teste em Múltiplos Cliques
```
Adicione 3 produtos em rápida sucessão

RESULTADO ESPERADO:
✓ Cada toast aparece/desaparece independentemente
✓ Não há sobreposição de mensagens
```

#### 5. Abra DevTools (F12) e verifique
```
Console > localStorage
→ Procure por: "CartItem" ou verifique no contexto
→ Cada item adicionado aparece no carrinho
```

---

## 🎬 Teste 2: Página de Detalhes do Produto

### Objetivo
Testar toast na página de detalhes e verificar múltiplos pontos de adição.

### Passos:

#### 1. Clique em qualquer produto na home
```
http://localhost:5173/produto/1
```

#### 2. Teste o botão "Adicionar ao Carrinho"
```
RESULTADO ESPERADO:
✓ Toast aparece no canto inferior direito
✓ Mensagem: "Adicionado com sucesso!"
✓ Carrinho atualiza (+1 item)
```

#### 3. Teste o botão "Finalizar Pedido"
```
RESULTADO ESPERADO:
✓ Toast aparece
✓ Você é redirecionado para /checkout
✓ Item aparece no carrinho final
```

#### 4. Teste com cores diferentes
```
1. Selecione uma cor
2. Clique "Adicionar"
3. Volte e selecione outra cor
4. Clique "Adicionar" novamente

RESULTADO ESPERADO:
✓ Dois toasts aparecem
✓ Carrinho tem 2 itens com cores diferentes
```

---

## 🎬 Teste 3: Dashboard Administrativo

### Objetivo
Acessar o painel administrativo e visualizar estatísticas.

### Passos:

#### 1. Acesse o dashboard
```
http://localhost:5173/admin/dashboard
```

#### 2. Verifique as estatísticas
```
VOCÊ VERÁ:
📊 Total de Produtos: [número]
📊 Produtos em Promoção: [número]
```

#### 3. Teste os botões de navegação
```
Clique em "Cadastrar Produto"
→ Você vai para /admin/cadastro-produto

Volte e clique em "Gerenciar Estoque"
→ Você vai para /admin/gerenciar-estoque
```

---

## 🎬 Teste 4: Cadastro de Novo Produto

### Objetivo
Criar um novo produto completo com imagem e salvar no localStorage.

### Passos:

#### 1. Acesse a página de cadastro
```
http://localhost:5173/admin/cadastro-produto
```

#### 2. Veja o formulário vazio
```
CAMPOS VISÍVEIS:
□ Código do Produto
□ Nome do Produto
□ Preço (R$)
□ Categoria
□ Descrição
□ Upload de Imagem
□ Habilitar para Promoções (switch OFF)
```

#### 3. Teste validação - deixe campos em branco e clique "Finalizar"
```
RESULTADO ESPERADO:
✓ Erro vermelho em campos obrigatórios
✓ Mensagens: "Código é obrigatório", etc
✓ Não pode enviar
```

#### 4. Preencha corretamente o formulário

**Opção A - Teste rápido:**
```
Código: TNY-001
Nome: Camiseta Premium
Preço: 89.90
Imagem: [Selecione qualquer imagem]
Clique "Finalizar"
```

**Opção B - Teste completo:**
```
Código: TNY-ESTAMPA-AZUL
Nome: Camiseta TNY Estampa Azul
Preço: 99.90
Categoria: Camisetas
Descrição: Camiseta de algodão 100% com estampa em tinta especial
Imagem: [Upload]
Promoção: [Ative o switch]
Clique "Finalizar"
```

#### 5. Resultado após "Finalizar"
```
RESULTADO ESPERADO:
✓ Você recebe um alerta: "Produto cadastrado com sucesso!"
✓ Redirecionado para /admin/gerenciar-estoque
✓ Seu produto aparece na tabela!
```

---

## 🎬 Teste 5: Gerenciar Estoque (Tabela de Produtos)

### Objetivo
Visualizar produtos cadastrados em uma tabela e testar funcionalidades.

### Passos:

#### 1. Acesse a página de estoque
```
http://localhost:5173/admin/gerenciar-estoque
```

#### 2. Verifique a tabela
```
COLUNAS VISÍVEIS:
| ID | Imagem | Nome | Categoria | Preço | Status | Ações |
```

#### 3. Teste os dados do seu produto
```
✓ ID: [número único]
✓ Imagem: [preview da foto]
✓ Nome: [seu produto]
✓ Categoria: [se preenchida]
✓ Preço: R$ 89,90 (formatado corretamente)
✓ Status: "Promoção" ou "Normal"
```

#### 4. Teste deletar um produto
```
1. Clique no botão "Deletar" de um produto
2. Confirme no popup: "Tem certeza?"
3. Clique "OK"

RESULTADO ESPERADO:
✓ Produto desaparece da tabela
✓ Contador total diminui
✓ localStorage atualizado
```

#### 5. Teste limpar estoque
```
1. Clique em "Limpar Estoque" (botão vermelho)
2. Confirme no popup
3. Clique "OK"

RESULTADO ESPERADO:
✓ Todos os produtos desaparecem
✓ Mensagem: "Nenhum produto cadastrado ainda"
✓ Botão "Cadastrar Primeiro Produto" aparece
✓ localStorage vazio
```

---

## 🎬 Teste 6: Persistência de Dados (localStorage)

### Objetivo
Verificar que os dados salvos persistem após recarregar a página.

### Passos:

#### 1. Cadastre um produto
```
Siga o Teste 4
```

#### 2. Recarregue a página (F5)
```
http://localhost:5173/admin/gerenciar-estoque
```

#### 3. Verifique os dados
```
RESULTADO ESPERADO:
✓ Seu produto AINDA ESTÁ na tabela
✓ Imagem carregou
✓ Dados intactos
✓ localStorage funcionando!
```

#### 4. Feche e reabra o navegador
```
1. Feche completamente o navegador
2. Reabra
3. Acesse: http://localhost:5173/admin/gerenciar-estoque
```

#### 5. Verifique novamente
```
RESULTADO ESPERADO:
✓ Produto ainda está lá (mesmo após fechar tudo)
```

#### 6. Verifique localStorage no DevTools
```
Abra: DevTools (F12)
→ Application (ou Storage)
→ Local Storage
→ Procure "tny_produtos"

VOCÊ VERÁ:
{
  "id": 1234567890,
  "name": "Seu Produto",
  "price": 89.9,
  "image": "data:image/jpeg;base64,...",
  ...
}
```

---

## 🎬 Teste 7: Validações do Formulário

### Objetivo
Testar todas as validações implementadas.

### Passos:

#### Teste 7.1: Código em branco
```
1. Deixe "Código" vazio
2. Preencha outros campos
3. Clique "Finalizar"

RESULTADO ESPERADO:
✗ Campo fica vermelho
✗ Mensagem: "Código é obrigatório"
```

#### Teste 7.2: Nome em branco
```
1. Preencha "Código"
2. Deixe "Nome" vazio
3. Clique "Finalizar"

RESULTADO ESPERADO:
✗ Campo fica vermelho
✗ Mensagem: "Nome é obrigatório"
```

#### Teste 7.3: Preço inválido
```
Teste A - Preço negativo:
1. Preço: -10
2. Clique "Finalizar"
RESULTADO: ✗ Erro

Teste B - Preço zero:
1. Preço: 0
2. Clique "Finalizar"
RESULTADO: ✗ Erro

Teste C - Preço válido:
1. Preço: 89.90
2. Clique "Finalizar"
RESULTADO: ✓ OK
```

#### Teste 7.4: Imagem obrigatória
```
1. Deixe "Imagem" sem upload
2. Preencha outros campos
3. Clique "Finalizar"

RESULTADO ESPERADO:
✗ Campo fica vermelho
✗ Mensagem: "Imagem é obrigatória"
```

#### Teste 7.5: Upload de imagem
```
1. Clique no campo de arquivo
2. Selecione uma imagem do seu computador
3. Veja o preview aparecer

RESULTADO ESPERADO:
✓ Miniatura da imagem aparece ao lado
✓ Campo de imagem não tem erro
```

---

## 🎬 Teste 8: Responsividade

### Objetivo
Verificar que o design fica bom em diferentes tamanhos.

### Passos:

#### Desktop (1920px+)
```
Abra DevTools (F12)
→ Clique no ícone de responsive
→ Selecione ou digite "1920 x 1080"

RESULTADO ESPERADO:
✓ Layout em 2 colunas (Dashboard)
✓ Tabela mostra todas as colunas
✓ Formulário bem espaçado
```

#### Tablet (768px)
```
DevTools responsive
→ iPad (768 x 1024)

RESULTADO ESPERADO:
✓ Layout se adapta
✓ Tabela ainda legível
✓ Botões acessíveis
```

#### Mobile (375px)
```
DevTools responsive
→ iPhone (375 x 667)

RESULTADO ESPERADO:
✓ Layout em coluna única
✓ Tabela com scroll horizontal
✓ Botões stackados
```

---

## 🐛 Testes de Erro (Debugging)

### Se Toast não aparecer:
```
1. Abra DevTools (F12) → Console
2. Procure por erros vermelho
3. Verifique se ToastProvider está em App.tsx
4. Limpe cache (Ctrl+Shift+Delete)
5. Recarregue (Ctrl+Shift+R)
```

### Se localStorage não funciona:
```
1. DevTools → Application → Local Storage
2. Clique com botão direito e "Clear All"
3. Recarregue a página
4. Cadastre um novo produto
5. Verifique localStorage novamente
```

### Se imagem não carrega no preview:
```
1. Verifique o tamanho do arquivo (< 5MB)
2. Verifique o formato (JPG, PNG, WebP, etc)
3. Tente outra imagem
4. Verifique console para erros
```

### Se redirecionamento não funciona:
```
1. Verifique se as rotas estão em AppRoutes.tsx
2. Verifique os paths: /admin/dashboard, etc
3. Verifique react-router está importado
4. Recarregue (Ctrl+Shift+R)
```

---

## ✅ Checklist de Teste Completo

- [ ] Toast aparece ao clicar "Adicionar"
- [ ] Toast desaparece após 3 segundos
- [ ] Toast no canto inferior direito
- [ ] Vários toasts não se sobrepõem
- [ ] Dashboard carrega corretamente
- [ ] Estatísticas mostram números corretos
- [ ] Formulário valida campos obrigatórios
- [ ] Upload de imagem funciona
- [ ] Preview de imagem aparece
- [ ] Switch de promoção funciona
- [ ] Produto é salvo no localStorage
- [ ] Tabela exibe produtos corretamente
- [ ] Deletar produto funciona
- [ ] Limpar estoque funciona
- [ ] Dados persistem após recarregar
- [ ] Dados persistem após fechar navegador
- [ ] Validações mostram erros vermelhos
- [ ] Navegação entre páginas funciona
- [ ] Responsividade em mobile/tablet
- [ ] Sem erros no console (F12)

---

## 🎯 Resumo de URLs para Teste Rápido

```
Página Inicial:
http://localhost:5173/

Exemplo de Produto:
http://localhost:5173/produto/1

Dashboard Admin:
http://localhost:5173/admin/dashboard

Cadastrar Produto:
http://localhost:5173/admin/cadastro-produto

Gerenciar Estoque:
http://localhost:5173/admin/gerenciar-estoque

Carrinho:
http://localhost:5173/carrinho

Checkout:
http://localhost:5173/checkout
```

---

## 💡 Dicas para Testes Eficientes

1. **Use os mesmos dados**: Facilita comparação
2. **Teste em DevTools**: Veja console, network, storage
3. **Teste em navegadores diferentes**: Chrome, Firefox, Safari
4. **Teste com diferentes tipos de arquivo**: JPG, PNG, WebP
5. **Teste com imagens grandes**: Veja se há limitações
6. **Teste multitarefa**: Abra múltiplas abas
7. **Teste velocidade**: Use Chrome DevTools > Throttling
8. **Teste offline**: Simule conexão lenta

---

## 🚀 Pronto para Começar!

1. Inicie seu servidor: `npm run dev`
2. Abra o navegador
3. Comece pelo Teste 1
4. Siga sequencialmente
5. Marque os checkboxes conforme completa

**Bom teste! ✨**

*Guia de teste | 02/07/2026*
