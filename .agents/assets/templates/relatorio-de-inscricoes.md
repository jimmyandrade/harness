---
name: relatorio-de-inscricoes
description: Formato do relatório da revisão das inscrições, com o resumo por status, o que avançou, o que falta em cada inscrição e as decisões que cabem à pessoa.
metadata:
  version: "0.2.0"
---

## Contexto

Use este modelo para entregar o resultado de uma revisão das inscrições, na resposta do chat ou na saída de uma rotina. A habilidade `revisar-inscricoes` lê este modelo quando gera a saída.

## Formato

### Inscrições — <data no Formato da data com dia da semana>

Resumo: <quantas inscrições em cada status, antes e depois da revisão>.

### Avançaram

- <título com o link> — <status antes> → <status depois>, pela <prova encontrada>

### Faltam dados

- <título com o link> — <o que falta, como hora do envio, comprovante, participante ou oportunidade>. <Se comentei na página ou se o pedido já estava lá>

### Sem prova para avançar

- <título com o link> — <status atual>. <O que falta para avançar, como fazer a inscrição ou esperar a organização>

### Em erro ou em contestação

- <título com o link> — <status e o que espera decisão>

### Não selecionadas

- <título com o link> — <o que a organização respondeu e se há contestação em andamento>

### Para você decidir

- <decisão que cabe à pessoa, como refazer a inscrição ou responder uma contestação>

## Estilo

Uma linha por inscrição, sempre com o link da página. A seção sem item sai do relatório. Cada inscrição aparece na seção do que mais pesa: avançou, depois faltam dados, depois sem prova. O resumo vem primeiro e usa os nomes dos status da lista. Não repita o dado de uma propriedade que o link já mostra. A seção de decisões sai quando nada espera a pessoa.
