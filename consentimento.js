/* Meta Pixel + aviso de cookies.
   Decisão do Davi (21/10/2026): o pixel carrega ao abrir a página e todo evento (PageView, IniciouQuiz, Lead,
   FinalizouQuiz, InitiateCheckout) vai direto, sem depender de clique em banner. O aviso no rodapé só informa e
   tem o botão "Entendi"; o link "Cookies" no rodapé reabre o aviso. Isso contraria a orientação da ANPD para
   cookies não essenciais: o advogado precisa validar. A versão opt-in (20/10) está no histórico do git.
   Uso: <script src="/consentimento.js" data-pixel="1182879485402222"></script> antes de </body>. */
(function(){
  var PIXEL = (document.currentScript && document.currentScript.dataset.pixel) || '';
  var KEY = 'pfa_consent';
  var get = function(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } };
  var set = function(v){ try { localStorage.setItem(KEY, v); } catch(e){} };

  /* pixel: carrega já */
  if (!window.fbq) {
    var n = window.fbq = function(){ n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
  }
  if (PIXEL && !document.querySelector('script[src*="fbevents.js"]')) {
    var t = document.createElement('script'); t.async = true; t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(t, s);
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
  }

  /* aviso */
  var css = '#pfa-cookies{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#fffdf8;border-top:1px solid #e7dfcf;box-shadow:0 -4px 14px rgba(31,78,70,.08);padding:10px 14px calc(10px + env(safe-area-inset-bottom));font-family:Nunito,-apple-system,Helvetica,Arial,sans-serif;color:#2b2a27;font-size:14px;line-height:1.35}'
    + '#pfa-cookies .i{max-width:760px;margin:0 auto;display:flex;align-items:center;gap:10px 14px;flex-wrap:wrap}'
    + '#pfa-cookies p{margin:0;flex:1 1 220px}#pfa-cookies a{color:#1f4e46;text-decoration:underline}'
    + '#pfa-cookies button{border:0;border-radius:999px;padding:8px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap;background:#1f4e46;color:#fff}';
  function altura(){ var d = document.getElementById('pfa-cookies'); document.documentElement.style.setProperty('--pfa-cookies-h', d ? d.offsetHeight + 'px' : '0px'); }
  function mostrar(){
    if (document.getElementById('pfa-cookies')) return;
    if (!document.getElementById('pfa-cookies-css')) { var st = document.createElement('style'); st.id = 'pfa-cookies-css'; st.textContent = css; document.head.appendChild(st); }
    var d = document.createElement('div'); d.id = 'pfa-cookies'; d.setAttribute('role','region'); d.setAttribute('aria-label','Cookies');
    var base = (location.pathname.indexOf('/teste/') === 0 ? (location.pathname.indexOf('/teste/oferta') === 0 ? '../../' : '../') : '');
    d.innerHTML = '<div class="i"><p>Este site usa cookies para medir os anúncios. <a href="' + base + 'privacidade/">Como tratamos os seus dados</a>.</p><button type="button">Entendi</button></div>';
    document.body.appendChild(d); altura();
    d.querySelector('button').onclick = function(){ set('ciente'); d.remove(); altura(); };
    window.addEventListener('resize', altura);
  }
  if (!get()) { if (document.body) mostrar(); else document.addEventListener('DOMContentLoaded', mostrar); }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-cookies]');
    if (a) { e.preventDefault(); try { localStorage.removeItem(KEY); } catch(x){} mostrar(); }
  });
})();
