/* Consentimento de cookies (LGPD) e carregamento do Meta Pixel só depois do aceite.
   Uso: <script src="/consentimento.js" data-pixel="1182879485402222"></script> antes de </body>.
   A escolha fica em localStorage ("pfa_consent": "aceito" | "essencial"). O link "Cookies" no rodapé
   reabre o banner: <a href="#" data-cookies>Cookies</a>. Chamadas a fbq() feitas antes do aceite ficam
   na fila e só são enviadas se a pessoa aceitar; se recusar, a fila é descartada.
   O banner é uma faixa discreta no rodapé: não escurece a página nem cobre o conteúdo. Enquanto está
   na tela, publica a própria altura em --pfa-cookies-h (no <html>), para a página afastar o que fica
   fixo embaixo (ex.: o botão "Começar o teste"). Alterado em 21/10/2026: o banner antigo cobria o botão
   do teste no celular e quase ninguém começava. */
(function(){
  var PIXEL = (document.currentScript && document.currentScript.dataset.pixel) || '';
  var KEY = 'pfa_consent';
  var get = function(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } };
  var set = function(v){ try { localStorage.setItem(KEY, v); } catch(e){} };

  /* stub do fbq: enfileira até a decisão */
  if (!window.fbq) {
    var n = window.fbq = function(){ n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
  }
  var ligado = false;
  function ligarPixel(){
    if (ligado || !PIXEL) return; ligado = true;
    var fila = (window.fbq.queue || []).slice(); window.fbq.queue = [];
    var t = document.createElement('script'); t.async = true; t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(t, s);
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
    fila.forEach(function(args){ window.fbq.apply(null, args); });
  }
  function recusar(){ window.fbq.queue = []; }

  /* faixa */
  var css = '#pfa-cookies{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#fffdf8;border-top:1px solid #e7dfcf;box-shadow:0 -4px 14px rgba(31,78,70,.08);padding:10px 14px calc(10px + env(safe-area-inset-bottom));font-family:Nunito,-apple-system,Helvetica,Arial,sans-serif;color:#2b2a27;font-size:14px;line-height:1.35}'
    + '#pfa-cookies .i{max-width:760px;margin:0 auto;display:flex;align-items:center;gap:10px 14px;flex-wrap:wrap}'
    + '#pfa-cookies p{margin:0;flex:1 1 220px}#pfa-cookies a{color:#1f4e46;text-decoration:underline}'
    + '#pfa-cookies .b{display:flex;gap:8px;flex:0 0 auto}'
    + '#pfa-cookies button{border:0;border-radius:999px;padding:8px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap}'
    + '#pfa-cookies .ok{background:#1f4e46;color:#fff}#pfa-cookies .nao{background:transparent;color:#1f4e46;text-decoration:underline;padding-left:6px;padding-right:6px}';
  function altura(){
    var d = document.getElementById('pfa-cookies');
    document.documentElement.style.setProperty('--pfa-cookies-h', d ? d.offsetHeight + 'px' : '0px');
  }
  function fechar(d){ d.remove(); altura(); }
  function mostrar(){
    if (document.getElementById('pfa-cookies')) return;
    if (!document.getElementById('pfa-cookies-css')) { var st = document.createElement('style'); st.id = 'pfa-cookies-css'; st.textContent = css; document.head.appendChild(st); }
    var d = document.createElement('div'); d.id = 'pfa-cookies'; d.setAttribute('role','region'); d.setAttribute('aria-label','Cookies');
    var base = (location.pathname.indexOf('/teste/') === 0 ? (location.pathname.indexOf('/teste/oferta') === 0 ? '../../' : '../') : '');
    d.innerHTML = '<div class="i"><p>Usamos cookies só para medir os anúncios. <a href="' + base + 'privacidade/">Como tratamos os seus dados</a>.</p>'
      + '<div class="b"><button type="button" class="ok">Aceitar</button><button type="button" class="nao">Só o essencial</button></div></div>';
    document.body.appendChild(d);
    altura();
    d.querySelector('.ok').onclick = function(){ set('aceito'); fechar(d); ligarPixel(); };
    d.querySelector('.nao').onclick = function(){ set('essencial'); fechar(d); recusar(); };
    window.addEventListener('resize', altura);
  }

  var escolha = get();
  if (escolha === 'aceito') ligarPixel();
  else if (escolha === 'essencial') recusar();
  else if (document.body) mostrar(); else document.addEventListener('DOMContentLoaded', mostrar);

  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-cookies]');
    if (a) { e.preventDefault(); try { localStorage.removeItem(KEY); } catch(x){} mostrar(); }
  });
})();
