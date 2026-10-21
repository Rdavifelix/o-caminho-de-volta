/* Consentimento de cookies (LGPD) e carregamento do Meta Pixel só depois do aceite.
   Uso: <script src="/consentimento.js" data-pixel="1182879485402222"></script> antes de </body>.
   A escolha fica em localStorage ("pfa_consent": "aceito" | "essencial"). O link "Cookies" no rodapé
   reabre o banner: <a href="#" data-cookies>Cookies</a>. Chamadas a fbq() feitas antes do aceite ficam
   na fila e só são enviadas se a pessoa aceitar; se recusar, a fila é descartada. */
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

  /* banner */
  var css = '#pfa-cookies{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:620px;margin:0 auto;background:#fff;border:1px solid #e7dfcf;border-radius:18px;box-shadow:0 18px 44px rgba(31,78,70,.22);padding:18px 18px 14px;font-family:Nunito,-apple-system,Helvetica,Arial,sans-serif;color:#2b2a27;font-size:15.5px;line-height:1.45}'
    + '#pfa-cookies p{margin:0 0 12px}#pfa-cookies a{color:#1f4e46}'
    + '#pfa-cookies .b{display:flex;gap:10px;flex-wrap:wrap}'
    + '#pfa-cookies button{flex:1 1 160px;border:0;border-radius:999px;padding:12px 16px;font:inherit;font-weight:700;cursor:pointer}'
    + '#pfa-cookies .ok{background:#1f4e46;color:#fff}#pfa-cookies .nao{background:#f3eee4;color:#1f4e46}'
    + '@media (max-width:480px){#pfa-cookies{left:8px;right:8px;bottom:8px;padding:14px 14px 12px}}';
  function mostrar(){
    if (document.getElementById('pfa-cookies')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'pfa-cookies'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Cookies');
    var base = (location.pathname.indexOf('/teste/') === 0 ? (location.pathname.indexOf('/teste/oferta') === 0 ? '../../' : '../') : '');
    d.innerHTML = '<p>Usamos cookies para medir se os nossos anúncios estão chegando a quem precisa. Nada de saúde, nada vendido a terceiros. <a href="' + base + 'privacidade/">Saiba como tratamos os seus dados</a>.</p>'
      + '<div class="b"><button type="button" class="ok">Aceitar</button><button type="button" class="nao">Só o essencial</button></div>';
    document.body.appendChild(d);
    d.querySelector('.ok').onclick = function(){ set('aceito'); d.remove(); ligarPixel(); };
    d.querySelector('.nao').onclick = function(){ set('essencial'); d.remove(); recusar(); };
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
