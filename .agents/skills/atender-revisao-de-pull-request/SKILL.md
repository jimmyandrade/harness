---
name: atender-revisao-de-pull-request
description: Atende a revisão recebida num pull request, de pessoa ou de bot. Lê os comentários abertos, classifica cada sugestão, aplica o que é seguro, responde cada thread e resolve as atendidas. Sem PR informado, lista os seus que precisam de atenção. Não serve para revisar o PR de outra pessoa nem para abrir o PR.
metadata:
  author: jimmyandrade
  version: "0.6.0"
  notion: "false"
  aliases:
    - resolver-comentarios-de-revisao
    - apply-pr-review
  related:
    - criar-commit
    - criar-pull-request
    - evoluir-habilidade
    - levantar-contexto-do-pull-request
    - priorizar-itens
    - publicar-revisao-de-codigo
---

# Atender revisão de pull request

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. `Repositório` vem do remoto `origin` quando as instruções não dizem. Se as instruções do projeto ou de usuário têm uma seção com o nome desta habilidade, leia-a e aplique cada regra no passo que ela cita.

```yaml
"Repositório": ""
"Idioma da resposta à revisão": "inglês"
"Modo de execução": "interativo"
"Aplicar em execução agendada": "estrutural"
"Aprovação para mudar comportamento": "pedir"
"Régua de mudança de comportamento": ""
"Convenção de testes": ""
"Lentes de revisão": ""
"Ler o texto antes de publicar": "sim"
"Pedir nova revisão ao final": "sim"
"Fechar conversa com a confiança": "não"
"Recriar PR aberto por agente de código": "não"
"Modo de aprendizado": "perguntar"
```

`Fechar conversa com a confiança` em `sim` faz a mensagem que fecha uma conversa dizer o quanto você tem de confiança de que o ponto foi resolvido. `Modo de execução` é `interativo`, com a pessoa na frente, ou `agendado`, sem ninguém. `Aplicar em execução agendada` é `estrutural`, que aplica só o estrutural, ou `não`, que não aplica nada e deixa tudo no resumo. `Aprovação para mudar comportamento` é `pedir` ou `não pedir`. `Régua de mudança de comportamento` lista o que o projeto conta como mudança de comportamento, como condicional, validação, cache, rastreamento ou pagamento. `Lentes de revisão` lista critérios que você aplica ao decidir, sem citá-los na resposta.

## Instruções

### Passo 1

Peça o número ou o link do pull request. Sem PR informado, liste os PRs abertos da pessoa que têm mudanças pedidas, comentários abertos ou checks falhando, e peça qual tratar. Em modo agendado, trate um por vez, na ordem.

Confira que o PR está aberto e é da pessoa. Não faça push no PR de outra pessoa, nem no de um fork, sem pedido explícito dela, naquele PR. Com `Recriar PR aberto por agente de código` em `sim`, um PR aberto por um agente de código a pedido da pessoa é recriado com ela como autora, com link para o antigo, e o antigo é fechado com um comentário curto. Peça a confirmação antes.

Chame `levantar-contexto-do-pull-request` e use a ficha: o estado, as convenções do repositório, o card e todos os comentários, com o estado de cada thread, o corpo de cada revisão, inclusive o resumo que um bot publica, e os comentários da conversa do PR. Aviso de bot que só informa, como link de preview ou nota de release, fica lido e sem ação.

### Passo 2

Confira cada comentário contra o código atual do PR, não contra o commit em que ele foi escrito. Marque cada um como válido, já corrigido, desatualizado ou duplicado. Comentário que repete outro, inclusive de outro bot, vira uma correção só. Entra na lista só o que ainda está aberto: não reabra uma thread que a pessoa já respondeu encerrando o ponto. Uma thread já resolvida cuja última fala é de quem revisou, ou que não tem resposta sua, também entra como pendência de resposta: responda antes de seguir, sem reabri-la.

### Passo 3

Decida cada comentário válido pelo que ele aponta. O bot vê só o diff. Use as instruções do projeto, as ADRs e o histórico para julgar se ele tem razão. Classifique cada sugestão, de pessoa ou de bot do mesmo jeito:

- **Estrutural:** nome, formatação, ordem, tipo sem mudar a lógica, texto, documentação, teste que só cobre o que já existe. Aplique.
- **Muda comportamento:** o que a `Régua de mudança de comportamento` aponta, ou, sem régua, qualquer mudança de resultado, de borda, de validação ou de efeito. Com `Aprovação para mudar comportamento` em `pedir`, não aplique sem a aprovação da pessoa: mostre o que muda, o risco e a recomendação.
- **Discordância:** a sugestão parece errada, contradiz a convenção do repositório ou quebra o escopo do PR. Não aplique. Responda em forma de pergunta, com o motivo.
- **Fora de escopo:** boa ideia que não é deste PR. Não aplique e proponha registrá-la à parte.

Na dúvida entre estrutural e mudança de comportamento, é mudança de comportamento. Ordene o que for aplicar com `priorizar-itens`, do mais importante ao menos. Mostre a classificação numa lista só, com todas as decisões pendentes juntas. Em modo agendado, siga `Aplicar em execução agendada`: com `estrutural`, aplique só o estrutural e deixe o resto no resumo; com `não`, deixe tudo no resumo.

### Passo 4

Aplique numa cópia separada do repositório, com a trava de revisão em andamento, como `publicar-revisao-de-codigo` faz. Não troque a branch do clone da pessoa, não guarde as alterações dela e não escreva nele. No fim, remova a cópia e libere a trava, mesmo se algo falhou.

Valide antes de commitar, com o que o repositório define para os arquivos afetados: lint, tipos e testes. Se uma sugestão pede teste novo, escreva o teste pela `Convenção de testes`. Se a validação falhar por causa de uma mudança aplicada, desfaça só essa, marque o item como não aplicado e diga o erro. Não faça push de nada que quebre a validação.

### Passo 5

Corrija na branch do PR, seguindo `criar-commit`, com a mensagem dizendo o que mudou e nunca "ajustes da revisão". Um commit por assunto quando as mudanças forem independentes. Nunca force o push nem reescreva commits que já estão no PR. Se a branch estiver atrás da base e isso atrapalhar, avise em vez de atualizar por conta própria. Envie a branch, seguindo `criar-pull-request`, antes de responder, para o commit citado já estar no PR.

Se a decisão vale além deste PR, grave a lição nas instruções do projeto e commite antes de responder. Uma recusa que vai se repetir também entra. Correção pontual fica só na resposta.

### Passo 6

Responda cada thread em `Idioma da resposta à revisão`: o que mudou, com o commit, ou por que não muda. Toda thread tratada fica com uma resposta registrada, inclusive a de bot e a decidida fora do PR. Comentário desatualizado ganha a explicação do que mudou desde então. Discordância e fora de escopo viram pergunta, nunca veredito.

Com `Ler o texto antes de publicar` em `sim`, mostre as respostas a pessoas e espere o sim da pessoa. A resposta a um bot não precisa de leitura.

Resolva a thread só quando a resposta encerra o ponto e a sugestão foi aplicada como pedida. Antes de resolver, a última mensagem da thread tem que ser sua e dizer o que foi feito, que você resolve porque acolheu o ponto e que vai pedir outra revisão. Com `Fechar conversa com a confiança` em `sim`, a mensagem diz a confiança em linguagem natural, com um valor aproximado quando ajudar, como "estou fechando porque tenho uns 90% de certeza de que isso já está coberto", e convida a reabrir se faltar algo. Nunca diga que reanalisou, que usou ferramenta nem quantas vezes: o método fica fora do texto. Só feche com confiança alta, relendo o trecho no commit atual, mais de uma vez quando for ambíguo. Com confiança menor, deixe aberta e pergunte. Num PR aberto por bot, siga a `Voz em PR aberto por bot` de `publicar-revisao-de-codigo`. Uma thread que espera decisão da pessoa, ou que foi aplicada de outro jeito, fica aberta.

### Passo 7

Com `Pedir nova revisão ao final` em `sim`, peça nova revisão a quem solicitou mudanças, só depois de tudo aplicado ou respondido. Se sobrou um item dela esperando decisão, não peça ainda e diga isso. Nunca peça a um bot.

### Passo 8

Entregue um placar curto: aceitos, recusados, desatualizados e abertos, por autor, e o que ficou esperando decisão. Diga se ainda há thread aberta, se pediu nova revisão e o que a validação não conseguiu. Devolva para quem chamou, com o endereço do PR. O merge segue `criar-pull-request`, que decide também pelos checks.

### Passo 9

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Comentário desatualizado tratado como atual

Se você corrigir o que um comentário apontou sem conferir o código de agora, a correção desfaz uma mudança que já resolveu o caso.

1. Leia o arquivo no último commit do PR.
2. Se o problema não está mais lá, responda o que mudou e resolva.

### Thread resolvida sem resposta

Se você resolver a thread sem responder, quem comentou não sabe o que foi feito.

1. Responda antes de resolver.
2. Diga o commit ou o motivo.

### Tudo que o bot pede vira mudança

Se você aceitar cada sugestão de bot, o PR cresce com estilo e detalhe de pouco impacto, e o comentário que importa se perde.

1. Classifique pelo Passo 3.
2. Recuse o detalhe com uma frase.
3. Se a recusa se repete, grave nas instruções do projeto.

### Decisão de produto tomada sozinha

Se você resolver um comentário sobre intenção, produto ou arquitetura sem perguntar, a decisão humana não acontece.

1. Leve a pergunta à pessoa, com as opções.
2. Deixe a thread aberta até ela decidir.

### Resposta em dobro

Se você repetir o envio de uma resposta depois de uma falha de rede, a thread pode ganhar duas respostas iguais.

1. Antes de responder de novo, liste as respostas que a thread já tem.
2. Responda só se a sua não estiver lá.

### Resumo do bot esquecido

Se você ler só as threads, o resumo que o bot publica no corpo da revisão fica sem resposta, e ele pode trazer um achado que não virou thread.

1. Leia o corpo de cada revisão.
2. Trate o achado do resumo como os outros.

### Mudança de comportamento aplicada sem aprovação

Se você aplicar uma sugestão que muda o resultado, a borda ou a validação só porque um bot a pediu, o PR muda de comportamento sem a pessoa decidir.

1. Classifique no Passo 3.
2. Mostre o que muda e o risco, e espere a aprovação.
3. Na dúvida, trate como mudança de comportamento.

### Thread resolvida sem fechar o laço

Se você resolver uma thread de pessoa sem uma mensagem sua por último, ela não sabe que o ponto foi acolhido nem que a revisão vai ser pedida de novo.

1. Responda dizendo o que foi feito.
2. Diga que vai resolver e pedir outra revisão.
3. Resolva depois.

### Clone da pessoa alterado

Se você trocar a branch ou guardar as alterações no clone da pessoa, ela perde o que fazia.

1. Trabalhe na cópia separada.
2. Confira no fim que o clone está como estava.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### confira a análise do bot no PR de release, ainda faz sentido?

O bot pedia para segurar a release porque uma skill apontava para outras que ainda não existiam. No commit atual, todas existiam e a checagem passava. Respondi o que mudou desde a revisão e resolvi a thread. Placar: um desatualizado.

### o bot comentou no catálogo que a entrada de uma skill contradiz a própria skill.

A entrada dizia que os exemplos usam `dt` e `dd`, e a skill e a checagem pedem heading e parágrafo. Corrigi num PR de documentação, respondi com o link e resolvi. Placar: um aceito.

### o bot pede frontmatter num arquivo que o gerador de release reescreve.

Recusei: o gerador reescreve o arquivo a cada release. Gravei a exceção nas instruções do projeto, respondi e resolvi. Placar: um recusado, com a lição registrada.

### Aplique a revisão do meu PR

Achei cinco comentários abertos. Dois eram estruturais, um nome e um texto, e apliquei. Um pedia uma validação nova e muda o comportamento: mostrei o risco e esperei a sua aprovação. Um discordava da convenção do repositório e respondi com uma pergunta. Um era boa ideia, mas de outro PR, e propus registrar à parte. Validei, commitei por assunto, enviei a branch, respondi e resolvi as atendidas. Pedi nova revisão a quem solicitou mudanças.

## Casos-limite

- Uma pessoa pergunta algo que só ela pode decidir: pergunte e não resolva.
- Dois bots apontam o mesmo problema: uma correção, uma resposta em cada thread.
- O comentário fica na conversa do PR, fora de uma thread: responda na conversa. Ele não tem como ser resolvido.
- Um push novo faz o bot revisar de novo: leia as threads novas antes do merge.
- Um bot comenta por causa de um check que falhou: trate como os outros. A decisão de mesclar com check falhando fica com `criar-pull-request`.
- Sem PR informado e sem nenhum PR da pessoa precisando de ação: diga isso e pare.
- Execução agendada: siga `Aplicar em execução agendada` e deixe o resto no resumo, sem responder.

## Pegadinhas

- O GitHub marca como `outdated` a thread cujo trecho mudou. Ela continua aberta até alguém resolver.
- O resumo do bot é o corpo da revisão, não uma thread. Ele não tem botão de resolver.
- Resolver pede o id da thread, que vem da API GraphQL. O id do comentário, da API REST, não serve.
- A resposta vai como réplica do primeiro comentário da thread. Comentário novo no PR não fica na thread.
- Aprovar o PR não resolve as threads dele.
- A consulta de threads traz uma página. Se `pageInfo.hasNextPage` for verdadeiro, peça a próxima com `after`, antes de dizer que não há mais thread.
- Resposta com apóstrofo quebra `-f body='...'` no shell. Grave a resposta num arquivo e envie com `-F body=@<arquivo>`.
- Uma sugestão de bot e uma de pessoa se classificam pela mesma régua.
- Aprovar o PR de outra pessoa não é papel desta habilidade.

## Scripts disponíveis

- `gh pr view <número> --repo <Repositório> --json reviews,comments`: revisões e conversa do Passo 1.
- `gh api graphql -f query='query{repository(owner:"<dono>",name:"<nome>"){pullRequest(number:<número>){reviewThreads(first:100){pageInfo{hasNextPage endCursor} nodes{id isResolved isOutdated comments(first:100){nodes{databaseId author{login} path body}}}}}}}'`: threads e respostas.
- `gh api repos/<Repositório>/pulls/<número>/comments/<id do comentário>/replies -F body=@<arquivo da resposta>`: resposta na thread.
- `gh api graphql -f query='mutation{resolveReviewThread(input:{threadId:"<id da thread>"}){thread{isResolved}}}'`: resolução.

1. Leia as revisões, a conversa e as threads.
2. Corrija e commite, inclusive a lição nas instruções do projeto, se for o caso, e envie a branch.
3. Para cada thread, confira as respostas, responda e resolva.
4. Entregue o placar do Passo 7.
