---
name: legenda-do-post
description: Formato da resposta que entrega a legenda de um post, com a legenda, a contagem de caracteres, as hashtags, o CTA principal, os créditos e o que ficou pendente.
metadata:
  version: "0.1.0"
  aliases:
    - legenda
---

## Contexto

Use este modelo para montar a resposta que entrega a legenda de um post de qualquer rede. A habilidade `definir-legenda-do-post` lê este modelo quando gera a saída.

## Formato

### Legenda

<legenda proposta>

<contagem: N de M caracteres>

### Hashtags

<uma hashtag por linha>

<contagem: N de M>

### CTA principal

<a ação e o destino>

### Créditos e collab

<quem fez as fotos, os vídeos ou a arte, e quem foi marcado>

### Pendências

<o que falta decidir, como horário, local, objetivo ou limite do formato>

## Estilo

Cada item do formato vira um heading na resposta, nesta ordem. A legenda não traz marcação de tom, ação de cena nem hashtag no meio do texto.
