# Página do livro — O Caminho de Volta (site público)

Página de vendas do ebook, separada da área de membros (`brasil/app/`, que é `noindex` e só para compradores). Um arquivo `index.html` com CSS inline e a mesma identidade visual do app (Lora + Nunito, verde e terra), mais quatro fotos ilustrativas em `img/` (geradas por IA no Higgsfield, modelo Z Image, 16/10/2026 — sem pessoas reais; o rodapé diz que são ilustrativas). Copy segue os Blocos 1–11 de `brasil/O Caminho de Volta — ebook, página de vendas e pós-compra.md`.

## Rodar

```bash
cd "brasil/site" && python3 -m http.server 8790
```

Abrir <http://localhost:8790/>.

## Antes de ir ao ar

- `CHECKOUT` no fim do `index.html`: link do checkout da Hotmart. Vazio, os botões levam ao bloco de preço.
- Placeholders: `[Nome]`, `CRP XX/XXXXX`, `[X] anos`, `[abordagem]`, história de origem (após a entrevista), `[Razão social]`, `CNPJ`, `[endereço]`, `[e-mail de contato]`, links de Política de privacidade e Termos de uso. Garantia definida: 30 dias (configurar o mesmo prazo na Hotmart). Falta o arquivo do bônus *O radar em uma página* na área de membros.
- Imagens: foto da autora (4:5, ≥ 800 px, bloco `.foto`). A foto de abertura (`img/abertura.jpg`) pode ser trocada pela foto da autora se ela preferir aparecer no topo. Arte final da capa ainda não existe (o cartão sobre a foto usa um mini-mockup em CSS).
- Rastreamento (Pixel / GA4): só com política de privacidade e banner de consentimento. O evento de compra fica no checkout.
- Hospedagem (desde 18/10/2026): **GitHub Pages**, repositório público <https://github.com/Rdavifelix/o-caminho-de-volta> (conta Rdavifelix), branch `main`, raiz. URL do Pages: <https://rdavifelix.github.io/o-caminho-de-volta/>. Domínio: **paisdeadultos.com.br** (arquivo `CNAME`). Publicar = `git push` na `main`. O projeto do Vercel (`o-caminho-de-volta-teal.vercel.app`) continua no ar como cópia; pode ser apagado quando o domínio estiver funcionando.
- DNS do domínio está na Hostinger (`cosmos`/`nova.dns-parking.com`). Configurado em 18/10/2026: `A @` → 185.199.108.153, .109.153, .110.153, .111.153 · `CNAME www` → `rdavifelix.github.io` (www redireciona para a raiz). E-mail (MX, SPF, DKIM, DMARC da Hostinger) mantido. Certificado Let's Encrypt emitido pelo GitHub e "Enforce HTTPS" ligado: <https://paisdeadultos.com.br> responde 200 e HTTP redireciona para HTTPS.

## Imagens geradas por IA

Toda imagem com texto (capa, mockup, cartão) precisa ser **revisada letra por letra** antes de publicar: em 18/10/2026 o gerador escreveu "filho autista" no subtítulo da capa em `img/pilha.webp` (corrigido em 19/10 com edição manual da imagem). Preferir texto em HTML/CSS por cima da imagem quando possível.

## Compliance conferido (16/10/2026, versão com fotos e copy reforçada)

Nome + psicóloga + CRP só no bloco da autora e no rodapé (mínimo da Res. CFP 07/2023; barra do topo e repetições na abertura e no fechamento removidas a pedido do Davi em 16–17/10) · preço só no bloco de oferta, mesma fonte do texto, sem "de/por", desconto, cronômetro ou "só nesta página" · nenhuma promessa de resultado ou prazo · nenhum depoimento · nenhum caso identificável · fotos ilustrativas sem pessoas reais, declaradas no rodapé · blocos de persuasão só por identificação (conselhos que não ajudaram, radar, 9 mensagens, o que fica nas suas mãos) sem prever desfecho · conversa de admissão não aparece na página · aviso "Conteúdo educativo. Não substitui psicoterapia." e CVV 188 no rodapé e no FAQ · razão social, CNPJ, endereço e contato no rodapé (CDC) · sem Pixel até haver consentimento (LGPD).

## Teste "Qual é o afastamento da sua família?" (`teste/`)

Porta de entrada paralela (funil de quiz, aprovado 18/10/2026). Um arquivo `teste/index.html` com Tailwind pelo CDN, 23 telas, lógica condicional e pontuação por tipo; estrutura, imagens e pendências em `brasil/Funil de quiz — O Caminho de Volta.md` (Parte 3). Abrir em <http://localhost:8790/teste/>. Grava o lead em `/lead-teste` (Supabase) com `origem: 'quiz'` e manda para `../?tipo=` no fim.
