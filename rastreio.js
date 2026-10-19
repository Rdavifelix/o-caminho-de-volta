/* Rastreio de origem — Pais de Filhos Adultos
   Guarda, no primeiro clique vindo do anúncio, os parâmetros da URL (utm_*, src, sck, fbclid…)
   e os repassa ao checkout da Kiwify, que os devolve no webhook. Assim cada compra fica ligada à
   campanha, ao conjunto e ao anúncio no painel (brasil/app/painel.html).

   Convenção para a URL dos anúncios no Meta (campo "Parâmetros de URL"):
     utm_source={{site_source_name}}&utm_medium={{placement}}
     &utm_campaign={{campaign.name}}|{{campaign.id}}
     &utm_content={{adset.name}}|{{adset.id}}
     &utm_term={{ad.name}}|{{ad.id}}
   O painel separa nome e id pelo "|".

   Uso: <script src="rastreio.js"></script> e, nos botões, pfaCheckout(URL_DO_CHECKOUT, {sck:'…'}).
   Sem parâmetros na URL e sem nada guardado, pfaCheckout devolve a URL limpa. */
(function () {
  var CHAVES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck', 'fbclid', 'gclid', 'ttclid'];
  var LS = 'pfa_origem';
  function ler() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }
  function gravar(o) { try { localStorage.setItem(LS, JSON.stringify(o)); } catch (e) {} }

  var q = new URLSearchParams(location.search), novo = {}, tem = false;
  CHAVES.forEach(function (k) { var v = q.get(k); if (v) { novo[k] = v.slice(0, 200); tem = true; } });
  var atual = ler();
  if (tem) {
    // novo clique de anúncio: substitui (último toque), guardando a primeira origem para referência
    var primeiro = atual.primeiro || atual;
    delete primeiro.primeiro; delete primeiro.quando;
    atual = novo;
    if (Object.keys(primeiro).length) atual.primeiro = primeiro;
    atual.quando = new Date().toISOString();
    if (document.referrer) atual.ref = document.referrer.slice(0, 200);
    gravar(atual);
  } else if (!atual.quando && document.referrer && !/paisdeadultos\.com\.br|rdavifelix\.github\.io|localhost/.test(document.referrer)) {
    atual = { ref: document.referrer.slice(0, 200), quando: new Date().toISOString() };
    gravar(atual);
  }

  /* Parâmetros guardados (sem os internos) */
  window.pfaOrigem = function () {
    var o = ler(), r = {};
    CHAVES.forEach(function (k) { if (o[k]) r[k] = o[k]; });
    return r;
  };

  /* Monta a URL do checkout com os parâmetros guardados. extra sobrepõe (ex.: {sck:'quiz_briga_espera'}). */
  window.pfaCheckout = function (base, extra) {
    if (!base) return '#oferta';
    var o = window.pfaOrigem();
    if (extra) Object.keys(extra).forEach(function (k) { if (extra[k]) o[k] = extra[k]; });
    var u = new URL(base, location.href);
    Object.keys(o).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, o[k]); });
    return u.toString();
  };
})();
