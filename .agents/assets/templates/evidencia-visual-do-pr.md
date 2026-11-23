---
name: evidencia-visual-do-pr
description: Formato da evidência visual na descrição de um pull request, com as capturas agrupadas por tema e por superfície, cada uma com título, imagem e legenda.
metadata:
  version: "0.1.0"
---

## Contexto

Use este modelo para pôr a evidência visual na descrição de um pull request. A habilidade `registrar-evidencia-visual` lê este modelo ao gravar as capturas. A evidência entra na seção de imagens que o modelo do repositório já tem, sem abrir outra seção.

## Formato

### <Tema>

#### <Superfície: computador, telefone, com ou sem link, estado>

<título da captura>

<imagem>

*<legenda: o que a captura prova>*

## Estilo

- Cada captura tem o próprio título, e as três partes ficam separadas por linha em branco. Sem a linha em branco, a imagem encosta no texto de baixo.
- O GitHub remove as tags `figure` e `figcaption` da descrição, então não as use ali. Use-as só onde o destino as mostra.
