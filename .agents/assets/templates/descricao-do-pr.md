---
name: descricao-do-pr
description: Formato da parte da descrição de um pull request que conta como a mudança foi feita, com as decisões de implementação e o impacto nos componentes e telas que usam o código alterado.
metadata:
  version: "0.1.0"
---

## Contexto

Use este modelo para escrever a descrição de um pull request. A habilidade `criar-pull-request` lê este modelo ao abrir ou atualizar o PR. Quando o repositório tem modelo de PR, as seções dele valem e as partes abaixo entram na seção que conta o que foi feito, cada uma com título próprio.

## Formato

### Decisões de implementação

- <decisão: o que foi escolhido, o motivo e o que ficou de fora>

Entra cada decisão que a pessoa tomou na conversa, com o que ela escolheu e o motivo que deu.

### Impacto

- <componente ou tela que usa o código alterado: o impacto e a evidência dele>

Sem impacto, diz que não houve e como isso foi conferido.

## Estilo

- O presente conta o que o código faz.
- A descrição guarda o como e o porquê. A tarefa guarda o escopo e os critérios de aceitação.
- Quando uma pergunta de revisão muda uma decisão, a descrição muda junto.
