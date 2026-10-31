---
name: publicar-resposta-de-revisao
description: Publica a resposta a uma revisão recebida, de pessoa ou de bot, de preferência num comentário inline. Marca o login e, com a leitura antes de publicar desligada, publica sem pedir confirmação. NÃO serve para aplicar a sugestão no código nem para revisar o PR de outra pessoa.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  related:
    - atender-revisao-de-pull-request
    - escrever-link
    - publicar-revisao-de-codigo
---

# Publicar resposta de revisão

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Idioma da resposta à revisão` nomeia o idioma da resposta. O valor `o idioma do comentário` faz cada resposta sair no idioma daquele comentário. `o de quem revisou` usa o idioma da revisão.
"Idioma da resposta à revisão": "inglês"
# `Idioma da resposta a bot` nomeia o idioma da resposta a um bot.
"Idioma da resposta a bot": "inglês"
# `Ler o texto antes de publicar`: `sim` mostra a resposta a outra pessoa e espera o sim. `não` publica na hora, inclusive um ajuste pedido depois.
"Ler o texto antes de publicar": "sim"
# `Enviar a revisão pendente da pessoa` em `sim` envia, como comentário, a revisão que a pessoa deixou sem enviar no PR, antes de responder, e diz que enviou.
# Em `não`, a resposta para e avisa que a revisão está pendente.
"Enviar a revisão pendente da pessoa": "não"
# `Fechar conversa com a confiança` em `sim` faz a mensagem que fecha uma conversa dizer o quanto você tem de confiança de que o ponto foi resolvido.
"Fechar conversa com a confiança": "não"
# `Número da confiança` é o número que entra na frase de `Fechar conversa com a confiança`. Sem valor, a frase não traz número.
"Número da confiança": ""
"Linkar as fontes da explicação": "sim"
# `Rótulo de prioridade no texto` em `não` mantém o nome da categoria fora das respostas.
"Rótulo de prioridade no texto": "não"
```
Comentário de self review, da mesma pessoa que pediu o atendimento, recebe a resposta na hora, com o que mudou, as linhas alteradas e o commit.
A mensagem do bot é lida, respondida e considerada.
A resposta a ele sai no `Idioma da resposta a bot` e é publicada sem esperar que a pessoa leia esse texto antes.

## Instruções

### Passo 1

Escreva a resposta no idioma de `Idioma da resposta à revisão`.
A resposta preferida é um comentário inline no trecho do diff que a decisão muda, mesmo quando quem revisou só escreveu no corpo da revisão.
Sem thread, abra uma revisão sua com esse comentário na linha.
A conversa do PR fica para o que não tem linha no diff.
Com esse parâmetro em `o idioma do comentário` ou em `o de quem revisou`, a resposta sai no idioma do comentário.
A resposta diz o que mudou.
Quando o texto mudou, ela mostra as linhas alteradas num bloco, com o que saiu e o que entrou.
Ela cita o commit pelo SHA curto linkado, como `[`abc1234`](URL do commit)`, ou diz por que não muda. Toda thread tratada fica com uma resposta registrada, inclusive a de bot e a decidida fora do PR. Comentário desatualizado ganha a explicação do que mudou desde então. Discordância e fora de escopo viram pergunta, nunca veredito. A resposta a outra pessoa abre com o login do GitHub dela em `@login`, trata do ponto que ela escreveu, retoma a ideia dela e diz o que mudou, e nunca é uma fórmula colada. Quem mais entra no ponto também leva `@login`. O primeiro nome sozinho não marca a pessoa. Bot não leva `@`. Self review não marca quem está respondendo. Com `Rótulo de prioridade no texto` em `não`, o nome da categoria nunca aparece.

Com `Linkar as fontes da explicação` em `sim`, a resposta que explica ou defende uma escolha, como uma exceção, uma recusa ou um motivo, linka a fonte de cada afirmação. A fonte do código é o link do trecho no commit atual do PR, com o SHA e as linhas, e a de uma regra é o documento, a decisão de arquitetura ou a conversa onde ela está. Uma afirmação sem fonte que você leu vira inferência, e a resposta diz isso. Não explique de memória.

### Passo 2

Com `Ler o texto antes de publicar` em `sim`, mostre a resposta a outra pessoa e espere o sim. Com `não`, publique na hora, inclusive o ajuste que a pessoa pediu num comentário já publicado, e devolva o link. Ela lê depois e pede outro ajuste se quiser.
Comentário de self review, da mesma pessoa que pediu o atendimento, recebe a resposta na hora.
A resposta diz o que mudou, mostra as linhas alteradas e cita o commit.
A mensagem do bot é lida, respondida e considerada.
A resposta a ele é publicada sem esperar que a pessoa leia esse texto antes.
Num PR aberto por bot, siga a `Voz em PR aberto por bot` de `publicar-revisao-de-codigo`.
O GitHub só aceita uma revisão pendente por pessoa.
Se a pessoa tem uma revisão sem enviar no PR, a resposta falha com o erro 422 `user_id can only have one pending review per pull request`.
Antes de publicar, procure as revisões pendentes dela no PR.
Com `Enviar a revisão pendente da pessoa` em `sim`, envie cada uma como comentário e diga na resposta o que enviou.
Com `não`, pare, diga que a revisão está pendente e não mexa nela.

### Passo 3

Resolva a thread só quando a resposta encerra o ponto e a sugestão foi aplicada como pedida.
Antes de resolver, a última mensagem da thread tem que ser sua.
Ela diz se o ponto será resolvido, como será resolvido e onde: neste commit, num commit ainda por fazer, ou num pull request à parte.
Ela também diz que você resolve porque acolheu o ponto.
Quando quem revisou é outra pessoa, a mensagem também diz que vai pedir outra revisão.
Com `Fechar conversa com a confiança` em `sim`, a mensagem diz a confiança em linguagem natural e convida a reabrir se faltar algo.
Quando `Número da confiança` tem valor, a frase inclui esse número.
Sem valor, a frase não traz número.
Quem liga a frase é o parâmetro `Fechar conversa com a confiança`.
O padrão é `não`.
Nunca diga que reanalisou, que usou ferramenta nem quantas vezes: o método fica fora do texto.
Só feche com confiança alta, relendo o trecho no commit atual, mais de uma vez quando for ambíguo.
Com confiança menor, deixe aberta e pergunte.
Uma thread que espera decisão da pessoa, ou que foi aplicada de outro jeito, fica aberta.

### Passo 4

Devolva o link de cada comentário publicado para quem chamou, como manda `escrever-link`. Quem aplica o código continua em `atender-revisao-de-pull-request`.

## Problemas comuns

### Confirmação pedida de novo

Se você mostrar o texto e esperar um sim com `Ler o texto antes de publicar` em `não`, ou depois que a pessoa já pediu o ajuste, a resposta fica parada.

1. Publique na hora.
2. Devolva o link.
3. O próximo ajuste espera ela ler e pedir.

### Self review sem resposta

Se você mostrar a resposta do self review e esperar um sim, o comentário da própria pessoa fica sem resposta.

1. Publique a resposta na hora.
2. Diga o que mudou, mostre as linhas alteradas e cite o commit.
3. Com `Ler o texto antes de publicar` em `não`, a resposta a outra pessoa também sai na hora. Com `sim`, a espera vale só para essa resposta.

### Thread resolvida sem resposta

Se você resolver a thread sem responder, quem comentou não sabe o que foi feito.

1. Responda antes.
2. A última mensagem tem que ser sua.
3. Só então resolva, se a sugestão foi aplicada como pedida.

### Resposta barrada pela revisão pendente

Se você publicar a resposta quando a pessoa tem uma revisão sem enviar no PR, o GitHub devolve o erro 422 e a thread fica sem resposta.

1. Procure a revisão pendente dela antes de publicar.
2. Com `Enviar a revisão pendente da pessoa` em `sim`, envie como comentário e diga que enviou.
3. Com `não`, pare e diga que a revisão está pendente.

### Resposta sem marcar a pessoa

Se você responder uma revisão sem o `@login` de quem escreveu, a pessoa não é avisada.

1. Abra a resposta com o login do GitHub que está na revisão.
2. Quem mais entra no ponto também leva `@login`.
3. O primeiro nome sozinho não marca. Bot não leva `@`. Self review não marca quem está respondendo.

### Resposta só na conversa

Se você responder só na conversa do PR quando o ponto tem linha no diff, a resposta fica fora do trecho.

1. Publique um comentário inline na linha que a decisão muda.
2. Sem thread, abra uma revisão sua com esse comentário.
3. A conversa fica para o que não tem linha no diff.

### Resposta em dobro

Se você responder de novo uma thread que já tem a sua resposta encerrando o ponto, a conversa repete o que já foi dito.

1. Não reabra essa thread.
2. Uma thread já resolvida cuja última fala é de quem revisou ainda pede resposta.
3. Responda essa, sem reabri-la.

### Thread resolvida sem fechar o laço

Se você resolver sem dizer onde o ponto ficou, quem revisou não sabe se foi neste commit.

1. Diga se será resolvido, como e onde.
2. Diga que você resolve porque acolheu o ponto.
3. Quando quem revisou é outra pessoa, diga que vai pedir outra revisão.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Publique a resposta na revisão, mesmo sem comentário inline de quem revisou.

A revisão só tinha corpo. A resposta saiu num comentário inline na linha que a decisão muda, abrindo com o `@login` de quem revisou, e quem mais entrou no ponto também foi marcado. O link do comentário voltou na resposta.

### Mude o texto do comentário que já está publicado.

`Ler o texto antes de publicar` estava em `não`. O texto novo foi publicado na hora, sem pedir outro sim, e o link voltou na resposta.

## Casos-limite

- Uma pessoa pergunta algo que só ela pode decidir: pergunte e não resolva.
- Quem revisou só no corpo da revisão, ou o comentário está na conversa e não tem thread: a resposta preferida é um comentário inline no trecho que a decisão muda, numa revisão sua. A conversa fica para o que não tem linha no diff, e esse comentário não se resolve.
- O comentário é self review da pessoa que pediu o atendimento: responda na hora, com as linhas alteradas e o commit, no idioma de `Idioma da resposta à revisão`. Não espere o sim de `Ler o texto antes de publicar`.
- `Ler o texto antes de publicar` em `não`: a resposta a outra pessoa e o ajuste pedido depois saem na hora. Devolva o link.

## Pegadinhas

- O GitHub marca como `outdated` a thread cujo trecho mudou. Ela continua aberta até alguém resolver.
- O resumo do bot é o corpo da revisão, não uma thread. Ele não tem botão de resolver.
- Resolver pede o id da thread, que vem da API GraphQL. O id do comentário, da API REST, não serve.
- Uma resposta parece só um comentário, e falha com 422 quando a pessoa tem revisão pendente no PR.
- A resposta de uma thread vai como réplica do primeiro comentário. Sem thread, a resposta preferida é um comentário inline numa revisão sua, no trecho que a decisão muda. Um comentário novo na conversa não fica na thread.
- Aprovar o PR não resolve as threads dele.
- O primeiro nome parece marcar a pessoa. Só `@` mais o login do GitHub que está na revisão avisa.
- Resposta com apóstrofo quebra `-f body='...'` no shell. Grave a resposta num arquivo e envie com `-F body=@<arquivo>`.
- `Ler o texto antes de publicar` em `não` parece ainda pedir o sim. Publique e devolva o link. Um ajuste pedido depois também sai na hora.
- A página aberta parece mostrar que a resposta continua no idioma antigo. O texto que vale é o gravado na thread. Diga a primeira frase dele.
- Citar um PR só pelo número é erro. Escreva o link como manda `escrever-link`.

## Scripts disponíveis

- `gh api graphql -f query='query{repository(owner:"<dono>",name:"<nome>"){pullRequest(number:<número>){reviewThreads(first:100){pageInfo{hasNextPage endCursor} nodes{id isResolved isOutdated comments(first:100){nodes{databaseId author{login} path body}}}}}}}'`: threads e respostas.
- `gh api repos/<Repositório>/pulls/<número>/reviews --jq '.[]|select(.state=="PENDING")|.id'`: revisões pendentes da pessoa no PR.
- `gh api repos/<Repositório>/pulls/<número>/reviews/<id da revisão>/events -f event=COMMENT`: envia a revisão pendente como comentário.
- `gh api repos/<Repositório>/pulls/<número>/comments/<id do comentário>/replies -F body=@<arquivo da resposta>`: resposta na thread.
- `gh api graphql -f query='mutation{resolveReviewThread(input:{threadId:"<id da thread>"}){thread{isResolved}}}'`: resolução.

1. Escreva a resposta no idioma certo, no comentário inline, com o `@login`.
2. Com `Ler o texto antes de publicar` em `não`, publique na hora. Com `sim`, espere o sim só para a resposta a outra pessoa.
3. Resolva só quando a sugestão foi aplicada como pedida e a última mensagem é sua.
4. Devolva o link.
