/* Métricas do teste — Pais de Filhos Adultos
   Registra, por sessão anônima, em que etapa do teste cada visita está: abriu, começou, chegou a cada
   tela, respondeu, voltou, captura, resultado, oferta e clique no checkout. É o que alimenta a central do
   quiz (brasil/app/quiz.html). Plano em brasil/Central do quiz — O Caminho de Volta.md.

   Privacidade: a sessão é um uuid aleatório guardado no navegador, sem IP, sem cookie de terceiro e sem
   dado pessoal. Só na captura, quando a pessoa pede o resultado, a sessão é ligada ao cadastro.
   Rastreio de primeira parte; não depende do banner de cookies (que só governa o pixel da Meta).

   Uso: <script src="rastreio.js"></script><script src="quiz-metricas.js"></script> e, na página,
     pfaQuiz.evento(tipo, tela, indice, valor)   tipo: abriu|comecou|tela|resposta|voltou|captura|resultado|oferta|checkout
     pfaQuiz.enviar()                             força o envio (antes de sair da página)
     pfaQuiz.sessao                               id da sessão (vai no /lead-teste como sessao_id)
   Os eventos saem em lote (fetch keepalive a cada poucos segundos; sendBeacon ao esconder/fechar a aba),
   como text/plain para não exigir preflight. O que falhar fica guardado e sai na próxima visita. */
(function () {
  var API = 'https://twhasxoshpfootucmkmo.supabase.co/functions/v1/area/quiz-eventos';
  var LS_S = 'pfa_quiz_sessao', LS_F = 'pfa_quiz_fila', VALIDADE = 24 * 3600 * 1000;
  function ler(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function uuid() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    var a = new Uint8Array(16);
    try { crypto.getRandomValues(a); } catch (e) { for (var i = 0; i < 16; i++) a[i] = Math.random() * 256 | 0; }
    a[6] = (a[6] & 15) | 64; a[8] = (a[8] & 63) | 128;
    var h = ''; for (var j = 0; j < 16; j++) h += ('0' + a[j].toString(16)).slice(-2);
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }

  /* sessão: nova se não existe ou se a última atividade foi há mais de 24 h (nova visita = nova sessão) */
  var sess = ler(LS_S, null);
  if (!sess || !sess.id || (Date.now() - (sess.em || 0)) > VALIDADE) { sess = { id: uuid(), em: Date.now() }; gravar(LS_S, sess); }
  var fila = ler(LS_F, []); if (!Array.isArray(fila)) fila = [];
  var timer = null, enviando = false;

  function base() {
    var o = {}; try { o = (window.pfaOrigem ? pfaOrigem() : {}) || {}; } catch (e) {}
    var ref = ''; try { if (document.referrer) ref = new URL(document.referrer).hostname; } catch (e) {}
    var celular = null; try { celular = window.matchMedia('(pointer:coarse)').matches; } catch (e) {}
    var largura; try { largura = screen.width; } catch (e) {}
    return { sessao: sess.id, utm_source: o.utm_source, utm_medium: o.utm_medium, utm_campaign: o.utm_campaign,
      utm_content: o.utm_content, utm_term: o.utm_term, src: o.src, sck: o.sck, ref: ref || undefined,
      celular: celular, largura: largura };
  }
  function devolver(lote) { fila = lote.concat(fila); gravar(LS_F, fila); }
  function enviar(urgente) {
    if (!fila.length || enviando) return;
    var lote = fila.splice(0, 50); gravar(LS_F, fila);
    var corpo = base(); corpo.eventos = lote;
    var txt = JSON.stringify(corpo);
    if (urgente && navigator.sendBeacon) {
      var ok = false;
      try { ok = navigator.sendBeacon(API, new Blob([txt], { type: 'text/plain' })); } catch (e) {}
      if (!ok) devolver(lote);
      return;
    }
    enviando = true;
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: txt, keepalive: true })
      .then(function (r) { if (!r.ok && r.status >= 500) throw new Error(); })
      .catch(function () { devolver(lote); })
      .then(function () { enviando = false; if (fila.length) agendar(4000); });
  }
  function agendar(ms) { if (timer) return; timer = setTimeout(function () { timer = null; enviar(false); }, ms || 3000); }

  window.pfaQuiz = {
    sessao: sess.id,
    evento: function (t, tela, i, v) {
      fila.push({ t: t, tela: tela || undefined, i: (typeof i === 'number') ? i : undefined, v: v || undefined, q: Date.now() });
      if (fila.length > 200) fila = fila.slice(-200);
      sess.em = Date.now(); gravar(LS_S, sess); gravar(LS_F, fila);
      agendar(t === 'tela' || t === 'abriu' ? 2500 : 800);
    },
    enviar: function () { if (timer) { clearTimeout(timer); timer = null; } enviar(true); }
  };
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') window.pfaQuiz.enviar(); });
  window.addEventListener('pagehide', function () { window.pfaQuiz.enviar(); });
  if (fila.length) agendar(1500); /* reenvia o que ficou pendente na visita anterior */
})();
