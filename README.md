# Página do livro — O Caminho de Volta (site público)

Página de vendas do ebook, separada da área de membros (`brasil/app/`, que é `noindex` e só para compradores). Um arquivo `index.html` com CSS inline e a mesma identidade visual do app (Lora + Nunito, verde e terra), mais quatro fotos ilustrativas em `img/` (geradas por IA no Higgsfield, modelo Z Image, 16/10/2026 — sem pessoas reais; o rodapé diz que são ilustrativas). Copy segue os Blocos 1–11 de `brasil/O Caminho de Volta — ebook, página de vendas e pós-compra.md`.

## Rodar

```bash
cd "brasil/site" && python3 -m http.server 8790
```

Abrir <http://localhost:8790/>.

## Antes de ir ao ar

- `CHECKOUT` no fim do `index.html`: link do checkout da Hotmart. Vazio, os botões levam ao bloco de preço.
- Placeholders: `[Nome]`, `CRP XX/XXXXX`, `[X] anos`, `[abordagem]`, história de origem (após a entrevista), `[Razão social]`, `CNPJ`, `[endereço]`, `[e-mail de contato]`, garantia `[7 / 30]`, links de Política de privacidade e Termos de uso.
- Imagens: foto da autora (4:5, ≥ 800 px, bloco `.foto`). A foto de abertura (`img/abertura.jpg`) pode ser trocada pela foto da autora se ela preferir aparecer no topo. Arte final da capa ainda não existe (o cartão sobre a foto usa um mini-mockup em CSS).
- Rastreamento (Pixel / GA4): só com política de privacidade e banner de consentimento. O evento de compra fica no checkout.
- Deploy: projeto próprio no Vercel, `o-caminho-de-volta` (separado do app, que manda `X-Robots-Tag: noindex`). Produção: <https://o-caminho-de-volta-teal.vercel.app>. Publicar de novo com `cd brasil/site && npx vercel deploy --prod`. Domínio .com.br ainda pendente (ver CLAUDE.md, decisões em aberto).

## Compliance conferido (16/10/2026, versão com fotos e copy reforçada)

Nome + psicóloga + CRP só no bloco da autora e no rodapé (mínimo da Res. CFP 07/2023; barra do topo e repetições na abertura e no fechamento removidas a pedido do Davi em 16–17/10) · preço só no bloco de oferta, mesma fonte do texto, sem "de/por", desconto, cronômetro ou "só nesta página" · nenhuma promessa de resultado ou prazo · nenhum depoimento · nenhum caso identificável · fotos ilustrativas sem pessoas reais, declaradas no rodapé · blocos de persuasão só por identificação (conselhos que não ajudaram, radar, 9 mensagens, o que fica nas suas mãos) sem prever desfecho · conversa de admissão não aparece na página · aviso "Conteúdo educativo. Não substitui psicoterapia." e CVV 188 no rodapé e no FAQ · razão social, CNPJ, endereço e contato no rodapé (CDC) · sem Pixel até haver consentimento (LGPD).
