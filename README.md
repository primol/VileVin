# Ville du Vin — novo site

Proposta de site moderno e interativo para a **Ville du Vin** (Grupo Vila Porto), mantendo as cores, a marca, as abas e as informações do site atual ([villeduvin.com.br](https://villeduvin.com.br/)).

## O que tem

- **Verificação de idade** (“Você tem mais de 18 anos?”) em todas as páginas; depois do “Sim, entrar” a abertura é liberada.
- **Abertura animada controlada pelo scroll** (página inicial): uma garrafa realista inclina e derrama vinho; o vinho corre pela base e enche as letras até formar o logo **VILLE DU VIN**. Rolar para cima “desfaz” a animação. Botão “Pular animação”. Respeita `prefers-reduced-motion`.
- **Mesmas abas do site atual**: Início · Sobre a VDV · Catálogo · Conteúdo · Franquias · Contato.
- **Catálogo interativo** com os 235 rótulos do site atual: filtros por tipo e país, busca, “Especial Vinhos Premium”, ficha de cada vinho e compra pelo WhatsApp (Alphaville ou Itaim Bibi). Link para o PDF do catálogo.
- **Mapa das lojas** (Shopping Iguatemi Alphaville, Itaim Bibi, Recife e Teresina) com “Como chegar”.
- **Botão flutuante de WhatsApp** com escolha da loja.
- Portal de Conteúdo com os posts do blog, página de Franquias, rodapé do Grupo Vila Porto.

## Publicar no GitHub Pages

1. No GitHub, abra o repositório → **Settings** → **Pages**.
2. Em **Build and deployment**, escolha **Source: Deploy from a branch**.
3. Selecione a branch com o site (ex.: `main`, depois do merge) e a pasta **/ (root)** → **Save**.
4. Em 1–2 minutos o site fica disponível em `https://<usuario>.github.io/<repositorio>/`.

## Estrutura

```
index.html, sobre.html, catalogo.html, conteudo.html, franquias.html, contato.html
assets/css/style.css        estilos
assets/js/intro.js          animação da garrafa (canvas)
assets/js/site.js           idade, menu, slider, lojas/mapa, WhatsApp, cartões de vinho
assets/js/catalogo.js       filtros do catálogo
assets/data/produtos.js     235 vinhos (nome, tipo, país, uvas, descrição)
assets/data/blog.js         posts do Portal de Conteúdo
assets/img/                 imagens otimizadas (WebP) vindas do site atual
_src/build.py               gerador das páginas (cabeçalho/rodapé/lojas compartilhados)
```

Para editar textos de cabeçalho, rodapé ou páginas: altere `_src/build.py` e rode `python3 _src/build.py`.

## Observações

- Textos, fotos, logos e dados dos vinhos foram extraídos do site atual da Ville du Vin.
- O formulário de newsletter é apenas visual (o GitHub Pages não tem servidor): para coletar e-mails de verdade, conecte a um serviço como RD Station, Mailchimp ou Formspree.
- O formulário de franquias abre o e-mail do visitante com a mensagem pronta para `contato@grupovilaporto.com`.
- Os botões de WhatsApp usam os números exibidos no site atual: Alphaville (11) 99117-8801 e Itaim Bibi (11) 99704-9531.
