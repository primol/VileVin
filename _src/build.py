#!/usr/bin/env python3
"""
Gera as páginas HTML do site Ville du Vin.

Cabeçalho, rodapé, verificação de idade, lojas e portal de conteúdo são
compartilhados entre as páginas. Para alterar o site, edite este arquivo e
rode:  python3 _src/build.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --------------------------------------------------------------------------
# ícones (inline SVG)
# --------------------------------------------------------------------------
I = {
    'arrow': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    'down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    'left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    'right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    'wa': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01Zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28Z"/></svg>',
    'pin': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    'route': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-8-8 18-2-8-8-2Z"/></svg>',
    'phone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z"/></svg>',
    'mail': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    'download': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></svg>',
    'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    'instagram': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor"/></svg>',
    'facebook': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V6.8c0-.8.5-1 1-1h2.4V2.1L14.1 2C10.8 2 10 4.4 10 6v2.5H7.6v3.8H10V22h4v-9.7h3l.4-3.8H14Z"/></svg>',
    'linkedin': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4V9.75Z"/></svg>',
    # portal
    'pairing': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h6l-.4 4.8a2.6 2.6 0 0 1-5.2 0L6 2Z"/><path d="M9 10v8M6.5 18h5"/><path d="M16 2v7a2 2 0 0 0 2 2v11M20 2v7a2 2 0 0 1-2 2"/></svg>',
    'barrel': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10c1.5 2.5 2.2 5.5 2.2 9S18.5 18.5 17 21H7c-1.5-2.5-2.2-5.5-2.2-9S5.5 5.5 7 3Z"/><path d="M5.4 8h13.2M5.4 16h13.2M12 3v18"/></svg>',
    'spark': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z"/></svg>',
    # sobre
    'people': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.6"/><path d="M16.5 14.6c2.6.2 4.3 1.9 5 4.9"/></svg>',
    'star': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"/></svg>',
    'award': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.5 14.2-1.5 7.3 5-2.7 5 2.7-1.5-7.3"/><path d="m12 6 .9 1.9 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3L12 6Z"/></svg>',
    # franquias (vantagens)
    'crm': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="14" height="11" rx="1.5"/><path d="M2.5 7.5h14M6 11h3M6 13h6"/><path d="M18.5 9.5h3v10h-12v-2.5"/><circle cx="13" cy="11.3" r="1.6"/></svg>',
    'portfolio': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2h3v4.5c1.6.7 2.5 2 2.5 3.8V21a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V10.3c0-1.8.9-3.1 2.5-3.8V2Z"/><path d="M7 13h8v4H7"/><path d="M17.5 8h4l-.3 3a1.7 1.7 0 0 1-3.4 0l-.3-3ZM19.5 13v5M18 18h3"/></svg>',
    'supplier': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 7 5 2.8v5.6L12 18l-5-2.6V9.8L12 7Z"/><path d="m7 9.8 5 2.7 5-2.7M12 12.5V18"/><circle cx="12" cy="3" r="1.4"/><circle cx="20.5" cy="7.5" r="1.4"/><circle cx="20.5" cy="17" r="1.4"/><circle cx="12" cy="21.4" r="1.4"/><circle cx="3.5" cy="17" r="1.4"/><circle cx="3.5" cy="7.5" r="1.4"/></svg>',
    'web': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5S14.6 18.7 12 21.5M12 2.5C9.4 5.3 8.1 8.5 8.1 12s1.3 6.7 3.9 9.5"/></svg>',
    'import': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="13" r="7"/><path d="M2 13h14M9 6c1.9 2 2.8 4.3 2.8 7S10.9 18 9 20M9 6C7.1 8 6.2 10.3 6.2 13S7.1 18 9 20"/><path d="M15 4h7M19 1.5 22 4l-3 2.5M22 9h-5M19.5 6.5 17 9l2.5 2.5"/></svg>',
    'media': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3.5" width="17" height="11" rx="1.5"/><path d="M5 9h1.2M8 9h1.2M11 9h1.2"/><circle cx="16" cy="16" r="3.6"/><path d="m18.6 18.6 3 3"/></svg>',
    'blueprint': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h12v4M3 3v18h8"/><path d="M6 14l4-3.5 4 3.5v4H6v-4Z"/><path d="m14 21 7-7-2.5-2.5-7 7L11 21h3Z"/><path d="M15 21h6"/></svg>',
    'bags': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10l-1 13H4L3 8Z"/><path d="M5.5 8V6.5a2.5 2.5 0 0 1 5 0V8"/><path d="M13 10h7.5l-.8 11H12.6"/><path d="M14.8 10V8.6a2 2 0 0 1 4 0V10"/></svg>',
}

NAV = [
    ('index.html', 'Início'),
    ('sobre.html', 'Sobre a VDV'),
    ('catalogo.html', 'Catálogo'),
    ('conteudo.html', 'Conteúdo'),
    ('franquias.html', 'Franquias'),
    ('contato.html', 'Contato'),
]

WA_ALPHA = '5511991178801'
WA_ITAIM = '5511997049531'
WA_MSG = 'Ol%C3%A1!%20Vim%20pelo%20site%20da%20Ville%20du%20Vin%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.'
PDF = 'https://villeduvin.com.br/catalogo-vinhos-vdv-2023.pdf'
BLOG = 'https://www.villeduvin.com.br/blog'

DESC = 'Referência no mercado de vinhos em função dos profissionais capacitados, atendimento exclusivo e qualidade dos rótulos oferecidos.'

# --------------------------------------------------------------------------
# partials
# --------------------------------------------------------------------------
def head(title, desc=DESC, extra=''):
    t = 'Ville du Vin' if title == 'Ville du Vin' else f'{title} · Ville du Vin'
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{t}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#070707">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/img/lojas/itaim.webp">
<link rel="icon" type="image/png" sizes="32x32" href="assets/img/icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="96x96" href="assets/img/icons/favicon-96.png">
<link rel="apple-touch-icon" href="assets/img/icons/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Barlow:wght@400;500&family=Bebas+Neue&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<script>try{{if(Date.now()-(+localStorage.getItem('vdv_age_ok')||0)<864e5)document.documentElement.classList.add('age-ok')}}catch(e){{}}</script>
{extra}</head>
'''


def header(active):
    cur = ' aria-current="page"'
    links = '\n'.join(
        f'      <a href="{h}"{cur if h == active else ""}>{n}</a>' for h, n in NAV)
    return f'''<header class="site-header">
  <div class="container--wide">
    <a class="brand" href="index.html" aria-label="Ville du Vin — início"><img src="assets/img/logo.svg" alt="Ville du Vin" width="184" height="40"></a>
    <button class="nav-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Menu principal">
{links}
    </nav>
  </div>
</header>
'''


AGE_GATE = '''<div class="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
  <div class="age-gate__card">
    <img class="age-gate__logo" src="assets/img/logo.svg" alt="Ville du Vin" width="210" height="46">
    <h2 id="age-title">Você tem mais de 18 anos?</h2>
    <p>Você precisa ter mais de 18 anos para acessar este site.</p>
    <div class="age-gate__btns">
      <button class="btn" type="button" data-age-yes>Sim, entrar</button>
      <a class="btn btn--ghost" href="https://www.abrabe.org.br/responsabilidade-social/autorregulamentacao-publicitaria/">Não</a>
    </div>
    <small>Aprecie com moderação</small>
  </div>
</div>
'''


def footer(scripts=''):
    menu = '\n'.join(f'          <li><a href="{h}">{n}</a></li>' for h, n in NAV)
    return f'''<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <img src="assets/img/grupo/gvp-branco.webp" alt="Grupo Vila Porto" width="101" height="56" loading="lazy">
      <p>Criado em 2003, o <strong>Grupo Vila Porto</strong> atua em todo território nacional, com empresas especializadas em importação e exportação, consultoria aduaneira, logística e armazenagem.</p>
    </div>
    <div>
      <h3>Menu</h3>
      <ul class="footer-list">
{menu}
      </ul>
    </div>
    <div>
      <h3>Nossas lojas</h3>
      <ul class="footer-list">
        <li><a href="contato.html#lojas">Shopping Iguatemi (Alphaville)</a></li>
        <li><a href="contato.html#lojas">Itaim Bibi</a></li>
        <li><a href="contato.html#lojas">Recife</a></li>
        <li><a href="contato.html#lojas">Teresina</a></li>
      </ul>
    </div>
    <div class="footer-contact">
      <h3>Entre em contato</h3>
      <p><strong>Telefone:</strong> <a href="tel:+552721211400">+55 27 2121-1400</a></p>
      <p><strong>E-mail:</strong> <a href="mailto:contato@grupovilaporto.com">contato@grupovilaporto.com</a></p>
      <div class="socials">
        <a href="https://www.linkedin.com/in/grupo-vila-porto-oficial-14b3b6199/" target="_blank" rel="noopener" aria-label="LinkedIn">{I['linkedin']}</a>
        <a href="https://www.facebook.com/grupovilaporto" target="_blank" rel="noopener" aria-label="Facebook">{I['facebook']}</a>
        <a href="https://www.instagram.com/grupovilaporto/" target="_blank" rel="noopener" aria-label="Instagram">{I['instagram']}</a>
      </div>
    </div>
  </div>
  <div class="group-strip">
    <div class="container">
      <h3>Empresas do Grupo</h3>
      <div class="group-logos">
        <a href="http://vilaporto.com/" target="_blank" rel="noopener"><img src="assets/img/grupo/emp-vilaporto.webp" alt="Vila Porto International Business" loading="lazy"></a>
        <a href="http://oficinadenegocios.srv.br/" target="_blank" rel="noopener"><img src="assets/img/grupo/emp-oficina.webp" alt="Oficina de Negócios" loading="lazy"></a>
        <a href="https://www.cdlsenhoradapenha.com.br/" target="_blank" rel="noopener"><img src="assets/img/grupo/emp-cdl.webp" alt="CDL Senhora da Penha" loading="lazy"></a>
        <a href="https://vilaportovinhos.com.br/" target="_blank" rel="noopener"><img src="assets/img/grupo/emp-vpvinhos.webp" alt="Vila Porto Vinhos" loading="lazy"></a>
        <a href="index.html"><img src="assets/img/grupo/emp-vdv.webp" alt="Ville du Vin" loading="lazy"></a>
        <span><img src="assets/img/grupo/emp-chefswine.webp" alt="Chef's Wine" loading="lazy"></span>
        <span><img src="assets/img/grupo/emp-portodelivery.webp" alt="Porto Delivery" loading="lazy"></span>
      </div>
    </div>
  </div>
  <div class="copyright">© Copyright Grupo Vila Porto - Todos os Direitos Reservados<small>Aprecie com moderação · Venda proibida para menores de 18 anos</small></div>
</footer>

<div class="wa-float">
  <div class="wa-float__panel" role="dialog" aria-label="Compre pelo WhatsApp">
    <h4>Compre pelo WhatsApp</h4>
    <p>Escolha a loja e fale direto com a nossa equipe.</p>
    <a href="https://wa.me/{WA_ALPHA}?text={WA_MSG}" target="_blank" rel="noopener">{I['wa']}<span><strong>Shopping Iguatemi (Alphaville)</strong><small>(11) 99117-8801</small></span></a>
    <a href="https://wa.me/{WA_ITAIM}?text={WA_MSG}" target="_blank" rel="noopener">{I['wa']}<span><strong>Loja Itaim Bibi</strong><small>(11) 99704-9531</small></span></a>
  </div>
  <button class="wa-float__btn" type="button" aria-label="Compre pelo WhatsApp" aria-expanded="false">{I['wa']}</button>
</div>

{scripts}<script src="assets/js/site.js"></script>
</body>
</html>
'''


STORES = [
    dict(id='alphaville', name='Loja Shopping Iguatemi (Alphaville)', img='alphaville',
         addr=['Alameda Rio Negro, 111', 'Alphaville Industrial, Barueri/SP', 'CEP 06454-000'],
         phone='(11) 99117-8801', wa=WA_ALPHA,
         q='Shopping Iguatemi Alphaville, Alameda Rio Negro, 111 - Alphaville Industrial, Barueri - SP, 06454-000'),
    dict(id='itaim', name='Loja Itaim Bibi', img='itaim',
         addr=['R. Leopoldo Couto de Magalhães Júnior, 490', 'Itaim Bibi, São Paulo/SP', 'CEP 04542-000'],
         phone='(11) 99704-9531', wa=WA_ITAIM,
         q='R. Leopoldo Couto de Magalhães Júnior, 490 - Itaim Bibi, São Paulo - SP, 04542-000'),
    dict(id='recife', name='Recife', img='recife',
         addr=['Rua do Espinheiro, 559', 'Espinheiro, Recife/PE', 'CEP 52020-020'],
         q='Rua do Espinheiro, 559 - Espinheiro, Recife - PE, 52020-020'),
    dict(id='teresina', name='Teresina', img='teresina',
         addr=['Rua Tabelião José Basílio, 1443', 'Ininga, Teresina/PI', 'CEP 64048-504'],
         q='Rua Tabelião José Basílio, 1443 - Ininga, Teresina - PI, 64048-504'),
]
TAB_LABEL = {'alphaville': 'Alphaville', 'itaim': 'Itaim Bibi', 'recife': 'Recife', 'teresina': 'Teresina'}


def stores_section(title_html='Nossas <strong>Lojas</strong>', eyebrow='Visite a Ville du Vin',
                   lead='Encante-se por uma experiência singular no universo das vinícolas.', sid='lojas'):
    from urllib.parse import quote
    cards = []
    for i, s in enumerate(STORES):
        addr = '<br>'.join(s['addr'])
        if s.get('phone'):
            addr += f'<br>Contato {s["phone"]}'
        wa = (f'<a class="chip-btn chip-btn--wa" href="https://wa.me/{s["wa"]}?text={WA_MSG}" target="_blank" rel="noopener">{I["wa"]} Compre pelo WhatsApp</a>'
              if s.get('wa') else '')
        cards.append(f'''      <article class="store reveal" style="--d:{(i % 2) * 0.1}s" data-store="{s['id']}" tabindex="0">
        <div class="store__img"><img src="assets/img/lojas/{s['img']}.webp" alt="Fachada da loja Ville du Vin {TAB_LABEL[s['id']]}" loading="lazy" decoding="async"></div>
        <div class="store__body">
          <h3 class="store__name">{s['name']}</h3>
          <p class="store__addr">{addr}</p>
          <div class="store__actions">
            {wa}
            <a class="chip-btn" href="https://www.google.com/maps/dir/?api=1&amp;destination={quote(s['q'])}" target="_blank" rel="noopener">{I['route']} Como chegar</a>
          </div>
        </div>
      </article>''')
    tabs = ''.join(f'<button type="button" role="tab" data-map-tab="{s["id"]}" aria-selected="{"true" if i == 0 else "false"}">{TAB_LABEL[s["id"]]}</button>' for i, s in enumerate(STORES))
    return f'''<section class="section" id="{sid}">
  <div class="container">
    <div class="section-head">
      <div>
        <span class="eyebrow reveal">{eyebrow}</span>
        <h2 class="title reveal" style="--d:.08s">{title_html}</h2>
        <p class="lead reveal mt-0" style="--d:.16s">{lead}</p>
      </div>
    </div>
    <div class="stores-wrap" data-stores>
      <div class="stores">
{chr(10).join(cards)}
      </div>
      <aside class="map-card reveal reveal--right" aria-label="Mapa das lojas">
        <div class="map-card__head"><strong data-map-title>Mapa</strong><span>{I['pin'].replace('<svg', '<svg width="16" height="16" style="vertical-align:-3px;margin-right:4px"')}<span data-map-addr></span></span></div>
        <div class="map-tabs" role="tablist">{tabs}</div>
        <div class="map-frame"><iframe title="Mapa da loja Ville du Vin" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
        <div class="map-card__foot">
          <a class="btn btn--sm" data-map-dir href="#" target="_blank" rel="noopener">{I['route']} Como chegar</a>
          <a class="btn btn--wa btn--sm" data-map-wa href="#" target="_blank" rel="noopener">{I['wa']} WhatsApp da loja</a>
        </div>
      </aside>
    </div>
  </div>
</section>
'''


def portal_section(posts=True, light=True):
    cats = [
        ('pairing', 'Harmonização', 'As melhores dicas de harmonização com todos os tipos de vinho.'),
        ('barrel', 'Vinícolas', 'Conheça a história das principais vinícolas do nosso catálogo.'),
        ('spark', 'Curiosidades', 'Atualidades do mundo da uva e seus mais derivados assuntos.'),
    ]
    cats_html = '\n'.join(
        f'''        <div class="cat reveal" style="--d:{i * 0.08}s">{I[ic]}<h3>{t}</h3><p>{d}</p></div>''' for i, (ic, t, d) in enumerate(cats))
    posts_html = f'''
    <div class="section-head" style="margin-top:clamp(60px,8vw,100px)">
      <h3 class="title title--sm reveal" style="margin:0">Últimos do <strong>blog</strong></h3>
      <a class="link-arrow reveal" href="conteudo.html">Ver todos os conteúdos {I['arrow']}</a>
    </div>
    <div class="posts" data-posts="3"></div>''' if posts else ''
    return f'''<section class="section {'section--light' if light else ''}" id="conteudo">
  <div class="container">
    <div class="portal">
      <div class="portal__img reveal reveal--left"><img src="assets/img/portal.webp" alt="Portal de Conteúdo da Ville du Vin aberto no notebook" loading="lazy" decoding="async" width="900" height="735"></div>
      <div>
        <span class="eyebrow reveal">Blog Ville du Vin</span>
        <h2 class="title reveal" style="--d:.08s">Portal de <strong>Conteúdo</strong></h2>
        <p class="lead reveal mt-0" style="--d:.16s">Conheça mais sobre harmonização, vinícolas e tudo sobre o universo dos vinhos com os especialistas do nosso blog.</p>
        <div class="portal__cats">
{cats_html}
        </div>
        <a class="btn reveal" href="{BLOG}" target="_blank" rel="noopener">Acessar {I['arrow']}</a>
      </div>
    </div>{posts_html}
  </div>
</section>
'''


VINICOLAS = ['romaneira', 'lagarde', 'sobroso', 'valduero', 'baron', 'angelus', 'poggio', 'ravasqueira', 'demartino',
             'antichello', 'vik', 'almaviva', 'kaiken', 'concha', 'mendel', 'henri', 'cuvelier']
VIN_NAMES = {'romaneira': 'Quinta da Romaneira', 'lagarde': 'Lagarde', 'sobroso': 'Herdade do Sobroso', 'valduero': 'Valduero',
             'baron': 'Baron Philippe de Rothschild', 'angelus': 'Château Angélus', 'poggio': 'Poggio', 'ravasqueira': 'Monte da Ravasqueira',
             'demartino': 'De Martino', 'antichello': 'Antichello', 'vik': 'VIK', 'almaviva': 'Almaviva', 'kaiken': 'Kaiken',
             'concha': 'Concha y Toro', 'mendel': 'Mendel', 'henri': 'Henri de Venoy', 'cuvelier': 'Cuvelier Los Andes'}


def marquee(dark=False):
    half = len(VINICOLAS) // 2
    rows = [VINICOLAS, VINICOLAS[half:] + VINICOLAS[:half]]
    out = []
    for r, row in enumerate(rows):
        items = ''.join(f'<div class="marquee__item"><img src="assets/img/vinicolas/{v}.webp" alt="{VIN_NAMES[v]}" loading="lazy"></div>' for v in row)
        dup = ''.join(f'<div class="marquee__item" aria-hidden="true"><img src="assets/img/vinicolas/{v}.webp" alt="" loading="lazy"></div>' for v in row)
        out.append(f'<div class="marquee{" marquee--reverse" if r else ""}{" marquee--dark" if dark else ""}"><div class="marquee__track">{items}{dup}</div></div>')
    return '\n'.join(out)


def write(name, html):
    with open(os.path.join(ROOT, name), 'w', encoding='utf-8') as f:
        f.write(html)
    print('ok', name, len(html))


# --------------------------------------------------------------------------
# INÍCIO
# --------------------------------------------------------------------------
TIPOS = [('branco', 'Branco'), ('espumante', 'Espumante'), ('laranja', 'Laranja'), ('rose', 'Rosé'), ('tinto', 'Tinto')]
PAISES = [('argentina', 'Argentina'), ('chile', 'Chile'), ('espanha', 'Espanha'), ('franca', 'França'), ('italia', 'Itália'), ('portugal', 'Portugal')]

index = head('Ville du Vin') + '<body class="home">\n' + AGE_GATE + header('index.html') + f'''
<main>
<section class="intro" id="intro" aria-label="Abertura: a garrafa derrama o vinho que forma o nome Ville du Vin">
  <div class="intro__sticky">
    <canvas class="intro__canvas" aria-hidden="true"></canvas>
    <h1 class="sr-only">Ville du Vin — loja de vinhos</h1>
    <div class="intro__hint" aria-hidden="true"><span class="mouse"></span>Role para servir</div>
    <p class="intro__caption intro__caption--a">Cada rótulo é como um <em>capítulo</em> de uma história…</p>
    <p class="intro__caption intro__caption--b">…e cada vinícola, um <em>best-seller</em>.</p>
    <div class="intro__final">
      <p>{DESC}</p>
      <div class="btns">
        <a class="btn" href="catalogo.html">Conheça nosso catálogo {I['arrow']}</a>
        <a class="btn btn--ghost" href="#lojas">Visite nossas lojas</a>
      </div>
    </div>
    <button class="intro__skip" type="button">Pular animação {I['down']}</button>
    <div class="intro__progress" aria-hidden="true"><span></span></div>
  </div>
</section>

<section class="slider" aria-label="Destaques">
  <article class="slide is-active">
    <div class="slide__media"><img src="assets/img/banners/franquias-loja.webp" alt="" loading="eager"></div>
    <div class="container--wide"><div class="slide__body">
      <span class="dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <h2 class="slide__title">Faça parte deste <b>novo conceito</b> em <span class="hl">franquia de vinhos!</span></h2>
      <a class="btn" href="franquias.html">Seja um franqueado! {I['arrow']}</a>
    </div></div>
  </article>
  <article class="slide">
    <div class="slide__media"><img src="assets/img/banners/barris.webp" alt="" loading="lazy" style="object-position:right center"></div>
    <div class="slide__float slide__float--bottles hide-sm"><img src="assets/img/sobre-garrafas.webp" alt="" loading="lazy"></div>
    <div class="container--wide"><div class="slide__body">
      <span class="dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <h2 class="slide__title">As melhores vinícolas do mundo <span class="hl">estão aqui.</span></h2>
      <a class="btn" href="catalogo.html">Conheça nosso catálogo! {I['arrow']}</a>
    </div></div>
  </article>
  <article class="slide">
    <div class="slide__media"><img src="assets/img/banners/adega.webp" alt="" loading="lazy" style="object-position:70% center"></div>
    <div class="container--wide"><div class="slide__body">
      <h2 class="slide__title slide__title--display">Fique <span class="hl">por dentro</span></h2>
      <p class="slide__sub">das curiosidades sobre o mundo dos vinhos com nosso <b>Portal de Conteúdo!</b></p>
      <a class="btn" href="conteudo.html">Conheça! {I['arrow']}</a>
    </div></div>
  </article>
  <article class="slide">
    <div class="slide__media"><img src="assets/img/lojas/itaim.webp" alt="" loading="lazy" style="filter:blur(2px) brightness(.7)"></div>
    <div class="slide__polaroids hide-sm" aria-hidden="true">
      <figure><img src="assets/img/lojas/alphaville.webp" alt="" loading="lazy"><figcaption>Shopping Iguatemi · Alphaville</figcaption></figure>
      <figure><img src="assets/img/lojas/itaim.webp" alt="" loading="lazy"><figcaption>Itaim Bibi</figcaption></figure>
    </div>
    <div class="container--wide"><div class="slide__body">
      <span class="dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <h2 class="slide__title">Encante-se por uma <b>experiência singular</b> no universo das vinícolas.</h2>
      <p class="slide__sub">Loja <b>Shopping Iguatemi</b> (Alphaville) · Loja <b>Itaim Bibi</b></p>
      <a class="btn" href="#lojas">Visite nossas lojas! {I['arrow']}</a>
    </div></div>
  </article>
  <div class="slider__ui">
    <div class="container--wide">
      <span class="slider__count">01 / 04</span>
      <div class="slider__bars">
        <button class="slider__bar" type="button" aria-label="Banner 1"><span></span></button>
        <button class="slider__bar" type="button" aria-label="Banner 2"><span></span></button>
        <button class="slider__bar" type="button" aria-label="Banner 3"><span></span></button>
        <button class="slider__bar" type="button" aria-label="Banner 4"><span></span></button>
      </div>
      <div class="slider__arrows">
        <button type="button" data-prev aria-label="Anterior">{I['left']}</button>
        <button type="button" data-next aria-label="Próximo">{I['right']}</button>
      </div>
    </div>
  </div>
</section>

<section class="section section--light" style="padding-block:clamp(70px,9vw,110px)">
  <div class="container">
    <div class="section-head section-head--center">
      <span class="eyebrow reveal">Os produtores mais conceituados do mundo</span>
      <h2 class="title reveal" style="--d:.08s">Vinícolas <strong>renomadas</strong></h2>
    </div>
  </div>
  <div class="reveal" style="--d:.15s">
{marquee()}
  </div>
</section>

<section class="section" id="destaques">
  <div class="container" data-rail>
    <div class="section-head">
      <div>
        <span class="eyebrow reveal">Catálogo Ville du Vin</span>
        <h2 class="title reveal" style="--d:.08s">Produtos em <strong>destaque</strong></h2>
      </div>
      <div class="rail-nav reveal">
        <button type="button" data-rail-prev aria-label="Anterior">{I['left']}</button>
        <button type="button" data-rail-next aria-label="Próximo">{I['right']}</button>
      </div>
    </div>
    <div class="rail reveal" data-featured></div>
    <div class="section-head" style="margin:34px 0 0;align-items:center">
      <div class="filters__group" aria-label="Tipos de vinhos">
        {''.join(f'<a class="pill" href="catalogo.html?tipo={k}">{v}</a>' for k, v in TIPOS)}
        {''.join(f'<a class="pill" href="catalogo.html?pais={k}">{v}</a>' for k, v in PAISES)}
      </div>
      <a class="btn" href="catalogo.html">Todos os produtos {I['arrow']}</a>
    </div>
  </div>
</section>

<section class="section section--wine" style="overflow:hidden">
  <div class="container split">
    <div>
      <span class="eyebrow reveal" style="color:#fff">Sobre a VDV</span>
      <h2 class="title reveal" style="--d:.08s">Vinícolas <span style="color:#fff">selecionadas</span></h2>
      <p class="lead reveal" style="--d:.16s;color:rgba(255,255,255,.9)">A Ville du Vin é reconhecida como referência em seu mercado de atuação, em função dos profissionais capacitados, atendimento exclusivo e qualidade dos rótulos oferecidos.</p>
      <p class="reveal" style="--d:.22s;color:rgba(255,255,255,.85);font-style:italic;font-size:22px;max-width:46ch">“Cada rótulo é como um capítulo de uma história e cada vinícola um best-seller. Somos incansáveis na escolha minuciosa de cada produto levado ao cliente.”</p>
      <a class="btn btn--dark reveal" href="sobre.html">Conheça a Ville du Vin {I['arrow']}</a>
    </div>
    <div class="about-hero__bottles reveal reveal--zoom"><img src="assets/img/sobre-garrafas.webp" alt="Garrafas de vinhos do catálogo Ville du Vin" loading="lazy" width="400" height="424"></div>
  </div>
</section>

{stores_section()}
{portal_section()}
<section class="section" style="padding-top:clamp(60px,8vw,100px)">
  <div class="container">
    <div class="newsletter reveal">
      <div>
        <h2>Receba nossas novidades por e-mail</h2>
        <p>Lançamentos, promoções e conteúdos sobre o universo dos vinhos.</p>
      </div>
      <form class="nl-form" novalidate>
        <label class="sr-only" for="nl-email">Seu e-mail</label>
        <input id="nl-email" type="email" name="email" placeholder="Seu melhor e-mail" autocomplete="email" required>
        <button class="btn" type="submit">Enviar</button>
      </form>
      <p class="nl-msg" role="status"></p>
    </div>
  </div>
</section>
</main>
''' + footer('<script src="assets/data/produtos.js"></script>\n<script src="assets/data/blog.js"></script>\n<script src="assets/js/intro.js"></script>\n')
write('index.html', index)

# --------------------------------------------------------------------------
# SOBRE
# --------------------------------------------------------------------------
sobre = head('Sobre a VDV') + '<body>\n' + AGE_GATE + header('sobre.html') + f'''
<main>
<section class="about-hero">
  <div class="container">
    <div>
      <span class="eyebrow reveal">Sobre a VDV</span>
      <h1 class="title reveal" style="--d:.08s">Sobre a <strong>Ville du Vin</strong></h1>
      <p class="reveal" style="--d:.16s">A Ville du Vin é reconhecida como referência em seu mercado de atuação, em função dos profissionais capacitados, atendimento exclusivo e qualidade dos rótulos oferecidos.</p>
      <p class="reveal" style="--d:.24s">Cada rótulo é como um capítulo de uma história e cada vinícola um best-seller. Somos incansáveis na escolha minuciosa de cada produto levado ao cliente.</p>
      <div class="btn-row reveal" style="--d:.3s;margin-top:28px">
        <a class="btn btn--dark" href="catalogo.html">Ver catálogo {I['arrow']}</a>
        <a class="btn btn--ghost" href="#lojas">Nossas lojas</a>
      </div>
    </div>
    <div class="about-hero__bottles reveal reveal--zoom" style="--d:.2s"><img src="assets/img/sobre-garrafas.webp" alt="Garrafas de vinhos do catálogo" width="400" height="424"></div>
  </div>
</section>

<section class="section" style="padding-top:clamp(40px,6vw,80px)">
  <div class="container">
    <div class="values">
      <div class="value reveal">{I['people']}<h3>Profissionais capacitados</h3><p>Uma equipe preparada para indicar o vinho certo para cada momento e cada paladar.</p></div>
      <div class="value reveal" style="--d:.1s">{I['star']}<h3>Atendimento exclusivo</h3><p>Uma experiência singular no universo das vinícolas, do primeiro contato à escolha do rótulo.</p></div>
      <div class="value reveal" style="--d:.2s">{I['award']}<h3>Vinícolas selecionadas</h3><p>Somos incansáveis na escolha minuciosa de cada produto levado ao cliente.</p></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="section-head">
      <div>
        <span class="eyebrow reveal">Nossa trajetória</span>
        <h2 class="title reveal" style="--d:.08s">Uma história de <strong>excelência</strong></h2>
      </div>
    </div>
    <div class="timeline">
      <span class="timeline__fill"></span>
      <div class="tl-item reveal"><strong>2007</strong><span>Inauguração da Ville du Vin</span></div>
      <div class="tl-item reveal" style="--d:.1s"><strong>2013</strong><span>Expansão para outras regiões</span></div>
      <div class="tl-item reveal" style="--d:.2s"><strong>2018</strong><span>Incorporação pelo Grupo Vila Porto</span></div>
      <div class="tl-item reveal" style="--d:.3s"><strong>2022</strong><span>Lançamento das Franquias VDV</span></div>
    </div>
  </div>
</section>

<section class="section section--light" style="padding-block:clamp(70px,9vw,110px)">
  <div class="container">
    <div class="section-head section-head--center">
      <span class="eyebrow reveal">Os produtores mais conceituados do mundo</span>
      <h2 class="title reveal" style="--d:.08s">Vinícolas <strong>renomadas</strong></h2>
    </div>
  </div>
{marquee()}
</section>

{stores_section()}

<section class="group">
  <div class="group__bg" data-parallax="0.12"></div>
  <div class="container group__grid">
    <div class="reveal">
      <img class="group__logo" src="assets/img/grupo/gvp-branco.webp" alt="Grupo Vila Porto" loading="lazy">
      <h2 class="title" style="margin-top:0">Know-how de <strong>mais de 20 anos</strong></h2>
      <div class="group__logos">
        <img src="assets/img/grupo/small-vila-porto.webp" alt="Vila Porto" loading="lazy">
        <img src="assets/img/grupo/small-oficina.webp" alt="Oficina de Negócios" loading="lazy">
        <img src="assets/img/grupo/small-cdl.webp" alt="CDL Senhora da Penha" loading="lazy" style="height:34px">
        <img src="assets/img/grupo/small-vdv.webp" alt="Ville du Vin" loading="lazy">
      </div>
    </div>
    <p class="reveal" style="--d:.12s">Criado em 2003, o Grupo Vila Porto é reconhecido pela união de competências com que desenvolve seus projetos e executa suas operações de importação e distribuição, otimizando resultados e processos com total segurança nas operações. Está presente nos estados do Espírito Santo, São Paulo e Santa Catarina, onde atua em todo Brasil nas modalidades de importação e distribuição de produtos próprios e de terceiros.</p>
  </div>
</section>

{portal_section(posts=False)}
</main>
''' + footer('<script src="assets/data/blog.js"></script>\n')
write('sobre.html', sobre)

# --------------------------------------------------------------------------
# CATÁLOGO
# --------------------------------------------------------------------------
catalogo = head('Catálogo', 'Catálogo de vinhos Ville du Vin: tintos, brancos, rosés, espumantes e laranja das melhores vinícolas da Argentina, Chile, Espanha, França, Itália e Portugal.') + '<body>\n' + AGE_GATE + header('catalogo.html') + f'''
<main>
<section class="cat-hero">
  <div class="cat-hero__bg" aria-hidden="true"></div>
  <div class="container cat-hero__grid">
    <div>
      <span class="eyebrow reveal">Catálogo Ville du Vin</span>
      <h1 class="title reveal" style="--d:.08s;font-size:clamp(52px,8vw,110px)">As melhores vinícolas do mundo <strong>estão aqui.</strong></h1>
      <p class="lead reveal" style="--d:.16s">Explore nossos rótulos por tipo, país ou uva. Gostou de algum? Compre direto pelo WhatsApp da loja mais perto de você.</p>
      <div class="btn-row reveal" style="--d:.22s;margin-top:26px">
        <a class="btn" href="{PDF}" target="_blank" rel="noopener">{I['download']} Baixar catálogo em PDF</a>
        <a class="btn btn--ghost" href="#vinhos">Explorar rótulos {I['down']}</a>
      </div>
      <div class="cat-stats reveal" style="--d:.3s">
        <div><strong data-count="235">235</strong><span>rótulos</span></div>
        <div><strong data-count="6">6</strong><span>países</span></div>
        <div><strong data-count="5">5</strong><span>tipos de vinho</span></div>
      </div>
    </div>
    <div class="cat-hero__bottles reveal reveal--zoom"><img src="assets/img/sobre-garrafas.webp" alt="" width="400" height="424"></div>
  </div>
</section>

<div class="filters" id="vinhos">
  <div class="container">
    <div class="filters__row">
      <div class="filters__group" data-f-tipo aria-label="Tipos de vinhos"></div>
      <label class="search"><span class="sr-only">Buscar</span>{I['search']}<input type="search" placeholder="Buscar vinho, uva ou país…" data-f-q autocomplete="off"></label>
    </div>
    <div class="filters__sub">
      <div class="filters__group" data-f-pais aria-label="Países"></div>
    </div>
    <div class="filters__sub">
      <button class="pill" type="button" data-f-prem aria-pressed="false">★ Especial Vinhos Premium</button>
      <select class="select" data-f-sort aria-label="Ordenar">
        <option value="destaques">Destaques primeiro</option>
        <option value="az">Nome: A → Z</option>
        <option value="za">Nome: Z → A</option>
      </select>
      <span class="result-count" data-count-result></span>
    </div>
  </div>
</div>

<section class="container">
  <div class="grid-wines" data-wine-grid></div>
  <div class="empty" data-empty hidden><strong>Nenhum rótulo encontrado</strong>Tente outra busca ou <button class="link-arrow" type="button" data-clear style="display:inline-flex">limpar os filtros</button></div>
  <div class="load-more" data-more hidden><button class="btn btn--ghost" type="button">Carregar mais rótulos</button></div>
</section>

<section class="section" style="padding-top:20px">
  <div class="container">
    <div class="cta-band reveal">
      <div class="split" style="gap:30px">
        <div>
          <h2 class="title title--sm" style="margin:0 0 10px">Não encontrou o que procurava?</h2>
          <p class="lead" style="color:rgba(255,255,255,.85);margin:0">Fale com nossas lojas pelo WhatsApp: a equipe ajuda você a escolher o rótulo ideal.</p>
        </div>
        <div class="btn-row" style="justify-content:flex-end">
          <a class="btn btn--wa" href="https://wa.me/{WA_ALPHA}?text={WA_MSG}" target="_blank" rel="noopener">{I['wa']} Alphaville</a>
          <a class="btn btn--wa" href="https://wa.me/{WA_ITAIM}?text={WA_MSG}" target="_blank" rel="noopener">{I['wa']} Itaim Bibi</a>
        </div>
      </div>
    </div>
  </div>
</section>
</main>
''' + footer('<script src="assets/data/produtos.js"></script>\n') .replace('<script src="assets/js/site.js"></script>', '<script src="assets/js/site.js"></script>\n<script src="assets/js/catalogo.js"></script>')
write('catalogo.html', catalogo)

# --------------------------------------------------------------------------
# CONTEÚDO
# --------------------------------------------------------------------------
conteudo = head('Conteúdo', 'Portal de Conteúdo Ville du Vin: harmonização, vinícolas e curiosidades do universo dos vinhos.') + '<body>\n' + AGE_GATE + header('conteudo.html') + f'''
<main>
<section class="page-hero">
  <div class="page-hero__bg" data-parallax="0.15" style="background-image:url('assets/img/banners/adega.webp');background-position:70% center"></div>
  <div class="container">
    <span class="eyebrow reveal">Blog Ville du Vin</span>
    <h1 class="title reveal" style="--d:.08s">Portal de <strong>Conteúdo</strong></h1>
    <p class="lead reveal" style="--d:.16s">Conheça mais sobre harmonização, vinícolas e tudo sobre o universo dos vinhos com os especialistas do nosso blog.</p>
  </div>
</section>

<section class="section" style="padding-top:20px">
  <div class="container">
    <div class="values">
      <div class="value reveal">{I['pairing']}<h3>Harmonização</h3><p>As melhores dicas de harmonização com todos os tipos de vinho.</p></div>
      <div class="value reveal" style="--d:.1s">{I['barrel']}<h3>Vinícolas</h3><p>Conheça a história das principais vinícolas do nosso catálogo.</p></div>
      <div class="value reveal" style="--d:.2s">{I['spark']}<h3>Curiosidades</h3><p>Atualidades do mundo da uva e seus mais derivados assuntos.</p></div>
    </div>
  </div>
</section>

<section class="section section--dark-posts" style="padding-top:0">
  <div class="container">
    <div class="section-head">
      <h2 class="title title--sm reveal" style="margin:0">Publicações <strong>recentes</strong></h2>
      <div class="filters__group" data-blog-filter aria-label="Categorias"></div>
    </div>
    <div class="posts" data-blog-grid></div>
    <div class="center" style="margin-top:50px"><a class="btn" href="{BLOG}" target="_blank" rel="noopener">Acessar o blog completo {I['arrow']}</a></div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="newsletter reveal">
      <div>
        <h2>Receba nossas novidades por e-mail</h2>
        <p>Novos conteúdos, lançamentos e promoções da Ville du Vin.</p>
      </div>
      <form class="nl-form" novalidate>
        <label class="sr-only" for="nl-email">Seu e-mail</label>
        <input id="nl-email" type="email" name="email" placeholder="Seu melhor e-mail" autocomplete="email" required>
        <button class="btn" type="submit">Enviar</button>
      </form>
      <p class="nl-msg" role="status"></p>
    </div>
  </div>
</section>
</main>
''' + footer('<script src="assets/data/blog.js"></script>\n')
write('conteudo.html', conteudo)

# --------------------------------------------------------------------------
# FRANQUIAS
# --------------------------------------------------------------------------
PERKS = [('crm', 'CRM completo e treinamentos'), ('portfolio', 'Portfólio competitivo'), ('supplier', 'Fornecedores exclusivos'),
         ('web', 'Venda em ambiente digital'), ('import', 'Importação própria'), ('media', 'Presença em mídias digitais'),
         ('blueprint', 'Elegante projeto arquitetônico'), ('bags', 'Materiais de PDV')]
perks = '\n'.join(f'      <div class="perk reveal" style="--d:{(i % 4) * 0.08}s"><div class="perk__icon">{I[ic]}</div><h3>{t}</h3></div>' for i, (ic, t) in enumerate(PERKS))

franquias = head('Franquias', 'Seja um franqueado Ville du Vin: leve para a sua cidade uma loja de vinho com as melhores vinícolas do mundo e com retorno financeiro comprovado.') + '<body>\n' + AGE_GATE + header('franquias.html') + f'''
<main>
<section class="fr-hero">
  <div class="fr-hero__bg" data-parallax="0.12"></div>
  <div class="container fr-hero__grid">
    <div>
      <span class="eyebrow reveal">Franquias VDV</span>
      <h1 class="title reveal" style="--d:.08s">Seja um <strong>franqueado</strong> Ville du Vin</h1>
      <p class="lead reveal" style="--d:.16s;color:rgba(255,255,255,.85)">Leve para a sua cidade uma loja de vinho com as melhores vinícolas do mundo e com retorno financeiro comprovado.</p>
      <div class="btn-row reveal" style="--d:.24s;margin-top:30px">
        <a class="btn" href="#fale-conosco">Fale com nosso time! {I['arrow']}</a>
        <a class="btn btn--ghost" href="#mercado">Conheça o mercado</a>
      </div>
    </div>
    <div class="fr-hero__img reveal reveal--zoom" style="--d:.2s"><img src="assets/img/franquias/rolhas.webp" alt="Rolhas de vinho formando um coração" width="800" height="797"></div>
  </div>
</section>

<section class="section" id="mercado">
  <div class="container big-number">
    <div class="reveal">
      <strong class="num"><span data-count="20" data-prefix="+ ">+ 20</span></strong>
      <span class="label">milhões de consumidores<br>nos últimos 2 anos</span>
    </div>
    <p class="lead reveal" style="--d:.12s;font-size:clamp(20px,2vw,26px)">O vinho entrou de vez no gosto do brasileiro! Nos últimos dois anos, o mercado nacional registrou um aumento de mais de <strong style="color:#fff">30% em novos consumidores</strong>, atingindo uma expansão nunca antes vista na história do país.</p>
  </div>
</section>

<section class="section section--light">
  <div class="container">
    <div class="section-head">
      <div>
        <span class="eyebrow reveal">A Ville du Vin</span>
        <h2 class="title reveal" style="--d:.08s">15 anos de <strong>excelência</strong></h2>
      </div>
    </div>
    <div class="timeline">
      <span class="timeline__fill"></span>
      <div class="tl-item reveal"><strong>2007</strong><span>Inauguração da Ville du Vin</span></div>
      <div class="tl-item reveal" style="--d:.1s"><strong>2013</strong><span>Expansão para outras regiões</span></div>
      <div class="tl-item reveal" style="--d:.2s"><strong>2018</strong><span>Incorporação pelo Grupo Vila Porto</span></div>
      <div class="tl-item reveal" style="--d:.3s"><strong>2022</strong><span>Lançamento das Franquias VDV</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div class="reveal reveal--left"><img src="assets/img/franquias/grupo.webp" alt="Know-how de mais de 20 anos do Grupo Vila Porto" loading="lazy" width="800" height="587"></div>
    <div>
      <span class="eyebrow reveal">Grupo Vila Porto</span>
      <h2 class="title reveal" style="--d:.08s">Infraestrutura própria <strong>de importação</strong></h2>
      <p class="lead reveal" style="--d:.16s">A Ville du Vin é uma empresa do Grupo Vila Porto, maior importador de vinhos do Brasil, facilitando o acesso a produtos exclusivos de vinícolas renomadas mundialmente.</p>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="section-head section-head--center">
      <span class="eyebrow reveal">Portfólio</span>
      <h2 class="title reveal" style="--d:.08s">As melhores <strong>vinícolas do mundo</strong></h2>
    </div>
  </div>
{marquee(dark=True)}
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="section-head section-head--center">
      <span class="eyebrow reveal">Para o franqueado</span>
      <h2 class="title reveal" style="--d:.08s">Vantagens exclusivas <strong>e completíssimas</strong></h2>
    </div>
    <div class="perks">
{perks}
    </div>
  </div>
</section>

{stores_section(title_html='Lojas <strong>Ville du Vin</strong>', eyebrow='Franquias', lead='Conheça as lojas da rede e inspire-se para levar a VDV para a sua cidade.')}

<section class="section" id="fale-conosco" style="padding-top:0">
  <div class="container">
    <div class="cta-band reveal">
      <div class="split" style="align-items:start">
        <div>
          <span class="eyebrow" style="color:#fff">Fale com nosso time</span>
          <h2 class="title" style="margin-top:12px">A nossa franquia está em plena expansão! <span style="color:#fff">Leve a VDV para a sua cidade!</span></h2>
          <p style="color:rgba(255,255,255,.85);font-size:20px">A Ville du Vin é reconhecida como referência em seu mercado de atuação, em função dos profissionais capacitados, atendimento exclusivo e qualidade dos rótulos oferecidos.</p>
          <div class="socials">
            <a href="https://www.instagram.com/villeduvin" target="_blank" rel="noopener" aria-label="Instagram da Ville du Vin">{I['instagram']}</a>
            <a href="https://www.facebook.com/villeduvin" target="_blank" rel="noopener" aria-label="Facebook da Ville du Vin">{I['facebook']}</a>
          </div>
        </div>
        <form class="form" data-mailto-form="contato@grupovilaporto.com" data-subject="Quero ser franqueado Ville du Vin">
          <div class="field"><label for="f-nome">Nome</label><input id="f-nome" name="Nome" required autocomplete="name"></div>
          <div class="field"><label for="f-tel">Telefone</label><input id="f-tel" name="Telefone" type="tel" required autocomplete="tel"></div>
          <div class="field"><label for="f-email">E-mail</label><input id="f-email" name="E-mail" type="email" required autocomplete="email"></div>
          <div class="field"><label for="f-cidade">Cidade / UF</label><input id="f-cidade" name="Cidade" required></div>
          <div class="field full"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="Mensagem" rows="4"></textarea></div>
          <button class="btn btn--dark full" type="submit">Enviar mensagem {I['arrow']}</button>
          <p class="form-note">Ao enviar, seu aplicativo de e-mail abrirá com a mensagem pronta.</p>
        </form>
      </div>
    </div>
  </div>
</section>
</main>
''' + footer()
write('franquias.html', franquias)

# --------------------------------------------------------------------------
# CONTATO
# --------------------------------------------------------------------------
contato = head('Contato', 'Fale com a Ville du Vin: lojas no Shopping Iguatemi Alphaville, Itaim Bibi, Recife e Teresina. Compre pelo WhatsApp.') + '<body>\n' + AGE_GATE + header('contato.html') + f'''
<main>
<section class="page-hero" style="min-height:56vh">
  <div class="page-hero__bg" data-parallax="0.15" style="background-image:url('assets/img/lojas/itaim.webp')"></div>
  <div class="container">
    <span class="eyebrow reveal">Contato</span>
    <h1 class="title reveal" style="--d:.08s">Entre em <strong>contato</strong></h1>
    <p class="lead reveal" style="--d:.16s">Visite uma de nossas lojas ou compre pelo WhatsApp com atendimento exclusivo.</p>
  </div>
</section>

<section class="section" style="padding-top:20px;padding-bottom:0">
  <div class="container contact-cards">
    <a class="contact-card reveal" href="https://wa.me/{WA_ALPHA}?text={WA_MSG}" target="_blank" rel="noopener">{I['wa']}<div><h3>Alphaville</h3><p>Compre pelo WhatsApp<br>(11) 99117-8801</p></div></a>
    <a class="contact-card reveal" style="--d:.1s" href="https://wa.me/{WA_ITAIM}?text={WA_MSG}" target="_blank" rel="noopener">{I['wa']}<div><h3>Itaim Bibi</h3><p>Compre pelo WhatsApp<br>(11) 99704-9531</p></div></a>
    <a class="contact-card reveal" style="--d:.2s" href="mailto:contato@grupovilaporto.com">{I['mail']}<div><h3>Grupo Vila Porto</h3><p>+55 27 2121-1400<br>contato@grupovilaporto.com</p></div></a>
  </div>
</section>

{stores_section(eyebrow='Onde estamos')}
{portal_section(posts=False)}
</main>
''' + footer('<script src="assets/data/blog.js"></script>\n')
write('contato.html', contato)
