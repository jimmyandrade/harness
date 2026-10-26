---
name: pedir-revisao-de-pr-no-slack
description: Redige o pedido de revisão de um pull request para o canal do time no Slack e entrega o rascunho com o link da thread, usando enviar-mensagem-no-slack. Usada quando o PR está pronto e a organização pede revisão pelo Slack, ou quando a pessoa pede apoio para revisar. Não serve para revisar o PR nem para outra mensagem.
metadata:
  author: jimmyandrade
  version: "0.3.1"
  related:
    - criar-pull-request
    - enviar-mensagem-no-slack
    - evoluir-habilidade
    - preparar-tarefa-do-pull-request
---

# Pedir revisão de PR no Slack

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um parâmetro vazio não impõe regra.
```yaml
# `Canal dos pedidos de revisão` é o canal em que o time pede revisão, de preferência um canal que outros times leem.
"Canal dos pedidos de revisão": ""
# `Rótulo de pronto para revisão` é o rótulo que o projeto usa para dizer que o PR pode ser revisado, ou vazio quando o projeto usa o estado de rascunho.
"Rótulo de pronto para revisão": ""
# `Linha do PR` e `Linha do card` descrevem como cada link aparece no pedido, como o emoji que abre a linha.
"Linha do PR": ""
# `Linha do PR` e `Linha do card` descrevem como cada link aparece no pedido, como o emoji que abre a linha.
"Linha do card": ""
# `Quem acompanha` lista as pessoas que entram em `cc.` no pedido.
"Quem acompanha": []
# `Exigir card` é `sim` quando o pedido só sai com o link do card do rastreador.
"Exigir card": "sim"
"Autorrevisar o diff antes de pedir": "não"
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Leia o PR: estado, rascunho, rótulos, título, descrição, checks e comentários. Se o PR está fechado ou mesclado, pare e diga isso. Se está em rascunho, ou falta o `Rótulo de pronto para revisão` quando o projeto o usa, não peça revisão: diga o que falta e pare. Um PR que a própria descrição marca como não pronto também não vai a pedido. Com `Autorrevisar o diff antes de pedir` em `sim`, leia o diff na interface do GitHub como se fosse de outra pessoa e procure `console.log` esquecido, comentário residual, código morto e teste redundante. Diga o que achou e peça para a pessoa corrigir antes do pedido.

### Passo 2

Ache o card do PR pela branch, pelo título e pela descrição. Com `Exigir card` em `sim` e sem card, não redija o pedido: siga `preparar-tarefa-do-pull-request` e volte aqui com a chave.

### Passo 3

Confira o canal antes de abrir um post novo. Se já existe uma thread sobre o mesmo problema ou o mesmo PR, o pedido vai nela. Se o PR já foi revisado e os comentários foram ajustados, é uma nova rodada, em resposta na thread, como em `Post novo em canal` de `enviar-mensagem-no-slack`. Pedidos de PRs que se relacionam são mensagens separadas, cada uma com o link do outro no corpo.

### Passo 4

Redija o pedido com `enviar-mensagem-no-slack`, em um dos três formatos:

- Pedido completo, num post novo: título com o contexto, a abertura de pedido de apoio do vocabulário, a linha do PR, a linha do card e `cc.` com as menções de `Quem acompanha`.
- Pedido curto, num post novo: título curto, uma frase de pedido, a linha do PR e a linha do card, sem PS. O contexto vai numa resposta na própria thread, logo depois, num parágrafo: o que é, a causa e o que já foi validado, sem repetir o link.
- Nova rodada, em resposta na thread: sem título e sem PS, na ordem de `enviar-mensagem-no-slack`.

O título carrega o contexto, e o corpo não repete o que o título e o PR já dizem. As frases do pedido vêm do vocabulário. Cada link vai no identificador, e o PR e o card seguem `Linha do PR` e `Linha do card`.

### Passo 5

Entregue o rascunho e o link do canal, ou da thread, como diz `enviar-mensagem-no-slack`. Não envie sem o sim da pessoa. Quem recebe o pedido por mensagem direta é orientado a usar o canal, para o pedido ter mais visibilidade e entrar no rodízio.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Pedido de PR que não está pronto

Se você redigir o pedido de um PR em rascunho ou sem o rótulo de pronto, o time perde tempo com um PR que ainda vai mudar.

1. Leia o estado e os rótulos no Passo 1.
2. Diga o que falta e pare.
3. Redija o pedido só depois de o PR estar pronto.

### Post novo onde já existia thread

Se você abrir um post novo para um PR que já tem thread, a conversa se divide e quem comentou antes não vê o pedido.

1. Procure no canal uma thread sobre o PR ou o problema.
2. Responda nela. Se o PR já foi revisado, é uma nova rodada.

### Vários PRs numa mensagem só

Se você juntar dois PRs num pedido, quem revisa não sabe qual abrir primeiro nem qual aprovou.

1. Escreva uma mensagem por PR.
2. Cite o outro PR com link no corpo, quando eles se relacionam.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### peça revisão do PR 120 no Slack

O PR 120 está aberto, fora do rascunho, com o card PAY-45. O canal não tem thread sobre ele. Redigi um pedido curto num post novo, com o link do PR e do card, e o contexto numa resposta na própria thread. O rascunho está no chat, com o link do canal. Não enviei: espero o seu sim.

### peça revisão do PR 121, que ajustei depois dos comentários da Ana

O PR 121 já tem uma thread no canal. Redigi uma nova rodada em resposta nela, com o link do PR, o que ele corrige, a menção da Ana dizendo que já ajustei e o pedido ao grupo. Sem título e sem PS.

## Casos-limite

- O PR está em rascunho: não redija o pedido. Diga o que falta.
- O card não existe e `Exigir card` é `sim`: siga `preparar-tarefa-do-pull-request` antes.
- Dois PRs do mesmo problema: duas mensagens, cada uma com o link da outra.
- O canal não está configurado: pergunte uma vez em qual canal pedir e pare.
- O canal é compartilhado com outra organização e o Slack recusa o rascunho: entregue o texto pronto, como diz `enviar-mensagem-no-slack`.

## Pegadinhas

- Um pedido por mensagem direta parece resolvido, mas ninguém mais vê. Oriente a usar o canal.
- Um PR sem o rótulo de pronto parece pronto pelo estado. Confira o rótulo quando o projeto o usa.
- A thread de um PR já revisado parece pedir um post novo. É uma nova rodada na thread.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
