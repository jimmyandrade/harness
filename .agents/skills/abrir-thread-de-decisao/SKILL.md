---
name: abrir-thread-de-decisao
description: Abre uma thread própria no Slack para consultar uma pessoa sobre o comportamento específico de uma tarefa, como o visual, um limite ou um token, e leva a decisão para a tarefa e para o pull request. Usada quando uma dúvida de comportamento precisa de resposta de quem decide, mesmo sem dizer thread. Não serve para status de entrega, dúvida de código nem para escrever o texto da mensagem.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - enviar-mensagem-no-slack
    - preparar-tarefa-do-pull-request
    - criar-pull-request
---

# Abrir thread de decisão

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um parâmetro vazio não impõe regra.
```yaml
# `Título da thread própria` descreve o título do post que abre a thread. Vazio, o título leva a chave da tarefa, a pessoa e o assunto.
"Título da thread própria": ""
```
## Instruções

### Passo 1

Confira o assunto. Uma dúvida sobre o comportamento específico de uma tarefa, como o visual, um limite de texto ou um token, que precisa da resposta de quem decide, entra aqui. Status de entrega, dúvida de código e o texto da mensagem não entram: o código se resolve no pull request, e o texto segue `enviar-mensagem-no-slack`.

### Passo 2

Não use uma thread que já existe para outro assunto, como a de status de uma entrega. Abra um post novo no canal da pessoa ou da equipe, com o título de `Título da thread própria`. Antes, confira se o canal já tem uma thread própria sobre essa tarefa e a pessoa, e use essa.

### Passo 3

Faça as perguntas dentro da thread, em respostas curtas, uma ideia por mensagem, cada caso com a sua imagem. Peça uma resposta só por vez. Quem redige e envia o texto segue `enviar-mensagem-no-slack`.

### Passo 4

Diga na thread, para quem participa, que ela serve para discutir e que a decisão será formalizada na tarefa e no pull request.

### Passo 5

Depois que a pessoa responder, formalize. Atualize os critérios de aceite da tarefa, como manda `preparar-tarefa-do-pull-request`, e a descrição do pull request, como manda `criar-pull-request`, e linke a thread nos dois. A thread nunca é o registro.

## Problemas comuns

### Decisão de comportamento numa thread geral

Se você levar a consulta para a thread de status de uma entrega, a decisão se perde no meio do resto e a thread vira o único registro.

1. Abra um post novo, com a chave da tarefa, a pessoa e o assunto no título.
2. Faça as perguntas ali, com a imagem de cada caso.
3. Depois da resposta, formalize na tarefa e no pull request.

### Thread sem formalização

Se você deixar a resposta só na thread, quem abre a tarefa ou o pull request depois não encontra a decisão.

1. Atualize os critérios de aceite da tarefa e a descrição do pull request.
2. Linke a thread nos dois.
3. Diga a quem participou onde a decisão foi registrada.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a barra de anúncio perde o divisor no tema sazonal, pergunte à Ana

Abri um post novo no canal, com a chave da tarefa, a pessoa e o assunto no título. Fiz a pergunta em respostas curtas, com uma imagem de cada tema, e avisei que a decisão será formalizada na tarefa e no pull request. Não usei a thread de status da entrega.

## Casos-limite

- O canal já tem uma thread própria sobre a tarefa e a pessoa: responda nela, sem post novo.
- A dúvida é de código: ela vai para o pull request, não para o Slack.
- A pessoa responde por mensagem direta: formalize do mesmo jeito, na tarefa e no pull request.
- A tarefa ainda não existe: siga `preparar-tarefa-do-pull-request` antes de formalizar.

## Pegadinhas

- Uma thread geral de status parece o lugar mais rápido para perguntar. A decisão se perde nela.
- A resposta na thread parece registrar a decisão. O registro é a tarefa e o pull request.
- Um post novo parece barulho no canal. Uma thread por assunto mantém cada decisão achável.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
