---
name: atender-revisao-de-pull-request
description: Atende a revisão recebida num pull request, de pessoa ou de bot. Lê os comentários abertos, classifica cada sugestão, aplica o que é seguro e pede a resposta a `publicar-resposta-de-revisao`. Sem PR informado, lista os seus que precisam de atenção. Não serve para revisar o PR de outra pessoa nem para abrir o PR.
metadata:
  author: jimmyandrade
  version: "0.27.0"
  aliases:
    - resolver-comentarios-de-revisao
    - apply-pr-review
  related:
    - atualizar-branch-do-pull-request
    - criar-commit
    - criar-pull-request
    - escrever-link
    - escrever-teste
    - evoluir-habilidade
    - fatiar-pull-request
    - levantar-ambiente-do-repositorio
    - levantar-contexto-do-pull-request
    - encerrar-pull-request
    - preparar-tarefa-do-pull-request
    - priorizar-itens
    - publicar-resposta-de-revisao
    - publicar-revisao-de-codigo
    - registrar-evidencia-visual
---

# Atender revisão de pull request

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Se as instruções do projeto ou de usuário têm uma seção com o nome desta habilidade, leia-a e aplique cada regra no passo que ela cita.
```yaml
# `Repositório` vem do remoto `origin` quando as instruções não dizem.
"Repositório": ""
# `Modo de execução` é `interativo`, com a pessoa na frente, ou `agendado`, sem ninguém.
"Modo de execução": "interativo"
# `Aplicar em execução agendada` é `estrutural`, que aplica só o estrutural, ou `não`, que não aplica nada e deixa tudo no resumo.
"Aplicar em execução agendada": "estrutural"
# `Aprovação para mudar comportamento` é `pedir` ou `não pedir`.
"Aprovação para mudar comportamento": "pedir"
# `Régua de mudança de comportamento` lista o que o projeto conta como mudança de comportamento, como condicional, validação, cache, rastreamento ou pagamento.
"Régua de mudança de comportamento": ""
# `Lentes de revisão` lista critérios que você aplica ao decidir, sem citá-los na resposta.
"Lentes de revisão": ""
"Pedir nova revisão ao final": "sim"
# `Idioma do relatório` e `Agrupar o relatório por prioridade` mandam no relatório final.
"Idioma do relatório": "o idioma da conversa"
# `Idioma do relatório` e `Agrupar o relatório por prioridade` mandam no relatório final.
"Agrupar o relatório por prioridade": "não"
"Recriar PR aberto por agente de código": "não"
# `Cópia de trabalho` é `Global` e cada skill pode sobrescrevê-lo. `worktree` trabalha num git worktree novo da `main`, nunca no clone da pessoa. Vazio trabalha onde a pessoa já está.
"Cópia de trabalho": "worktree"
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Peça o número ou o link do pull request. Sem PR informado, liste os PRs abertos da pessoa que têm mudanças pedidas, comentários abertos ou checks falhando, e peça qual tratar. Em modo agendado, trate um por vez, na ordem.

Confira que o PR está aberto e é da pessoa. Não faça push no PR de outra pessoa, nem no de um fork, sem pedido explícito dela, naquele PR. Com `Recriar PR aberto por agente de código` em `sim`, um PR aberto por um agente de código a pedido da pessoa é recriado com ela como autora, com link para o antigo, e o antigo é fechado por `encerrar-pull-request`, com o link do novo como prova. As threads abertas do PR antigo entram na lista, são aplicadas no PR novo, e a resposta de cada uma é publicada no antigo, apontando o commit do novo. Peça a confirmação antes.

Chame `levantar-contexto-do-pull-request` e use a ficha: o estado, as convenções do repositório, o card e todos os comentários, com o estado de cada thread, o corpo de cada revisão, inclusive o resumo que um bot publica, e os comentários da conversa do PR. Aviso de bot que só informa, como link de preview ou nota de release, fica lido e sem ação.

### Passo 2

Confira cada comentário contra o código atual do PR, não contra o commit em que ele foi escrito. Marque cada um como válido, já corrigido, desatualizado ou duplicado. Comentário que repete outro, inclusive de outro bot, vira uma correção só. Entra na lista só o que ainda está aberto: não reabra uma thread que a pessoa já respondeu encerrando o ponto. Uma thread já resolvida cuja última fala é de quem revisou, ou que não tem resposta sua, também entra como pendência de resposta: responda antes de seguir, sem reabri-la.

### Passo 3

Decida cada comentário válido pelo que ele aponta. O bot vê só o diff. Use as instruções do projeto, as ADRs e o histórico para julgar se ele tem razão. Classifique cada sugestão, de pessoa ou de bot do mesmo jeito:

- **Estrutural:** nome, formatação, ordem, tipo sem mudar a lógica, texto, documentação, teste que só cobre o que já existe. Aplique.
- **Muda comportamento:** o que a `Régua de mudança de comportamento` aponta, ou, sem régua, qualquer mudança de resultado, de borda, de validação ou de efeito. Com `Aprovação para mudar comportamento` em `pedir`, não aplique sem a aprovação da pessoa: mostre o que muda, o risco e a recomendação.
- **Discordância:** a sugestão parece errada, contradiz a convenção do repositório ou quebra o escopo do PR. Não aplique. Responda em forma de pergunta, com o motivo.
- **Fora de escopo:** boa ideia que não é deste PR. Não aplique e proponha registrá-la à parte.
- **Promessa do autor:** o comentário do próprio autor, num self-review ou numa resposta, diz que vai deixar uma evidência visual, testar no navegador ou atualizar a descrição. É tarefa sua, não da pessoa: gere a evidência com `registrar-evidencia-visual` para aquele cenário, inclusive hover, foco e variantes como com e sem link, peça o sim, grave na descrição do PR e responda a thread com o link. Um "atualizar na descrição" ou "isso tem que estar na descrição" vira edição da descrição.

As perguntas do próprio autor num self-review são perguntas de revisão como as de qualquer pessoa. Leia cada uma com a lente de `publicar-revisao-de-codigo/references/lente-de-revisao.md`.

Na dúvida entre estrutural e mudança de comportamento, é mudança de comportamento. Ordene o que for aplicar com `priorizar-itens`, do mais importante ao menos. Mostre a classificação numa lista só, com todas as decisões pendentes juntas. Em modo agendado, siga `Aplicar em execução agendada`: com `estrutural`, aplique só o estrutural e deixe o resto no resumo; com `não`, deixe tudo no resumo.

### Passo 4

Siga `Cópia de trabalho`. Com `worktree`, aplique numa cópia separada do repositório, com a trava de revisão em andamento, como `publicar-revisao-de-codigo` faz. Não troque a branch do clone da pessoa, não guarde as alterações dela e não escreva nele. No fim, remova a cópia e libere a trava, mesmo se algo falhou. Com valor vazio, aplique onde a pessoa já está.

Valide antes de commitar, com o que `levantar-ambiente-do-repositorio` achar para os arquivos afetados: lint, tipos e testes, com o runtime ativado como o repositório manda. Se uma sugestão pede teste novo, escreva o teste com `escrever-teste`. Se a validação falhar por causa de uma mudança aplicada, desfaça só essa, marque o item como não aplicado e diga o erro. Não faça push de nada que quebre a validação.

### Passo 5

Corrija na branch do PR, seguindo `criar-commit`, com a mensagem dizendo o que mudou e nunca "ajustes da revisão". Um commit por assunto quando as mudanças forem independentes. Não reescreva o conteúdo dos commits que já estão no PR por conta própria.
Se a branch estiver atrás da base, atualize antes de aplicar, na cópia separada. Siga `atualizar-branch-do-pull-request`: rebase sobre a base remota, resolva o conflito nos commits rebaseados e substitua a branch publicada. O atendimento já autoriza essa substituição. Não avise e não peça. Se há pull requests abertos empilhados em cima, atualize cada branch de cima na mesma cópia, na ordem, para o diff de cada um continuar só com os arquivos daquela pergunta. A branch aberta no clone da pessoa não é reescrita lá: a publicada anda, e o relatório diz que a pasta ficou no commit antigo. Envie a branch, seguindo `criar-pull-request`, antes de responder, para o commit citado já estar no PR. Depois desse push, uma vez, confira o título e a descrição. Não confira a cada commit. Se um dos dois deixou de contar o que a branch faz, atualize os dois, como `criar-pull-request` manda.

Se a decisão vale além deste PR, grave a lição nas instruções do projeto e commite antes de responder. Uma recusa que vai se repetir também entra. Correção pontual fica só na resposta. Regra de negócio ou de um repositório fica nas skills do projeto ou nas instruções dele, e o harness core nunca a recebe.

### Passo 6

Cada pergunta tratada, de quem for, deixa três rastros antes de a thread ser resolvida: a decisão na descrição do PR, com como foi feito e por quê, um teste quando o comportamento é testável, e a resposta na thread. Se a pergunta muda o comportamento, atualize também o critério de aceite da tarefa, como manda `preparar-tarefa-do-pull-request`.

A resposta segue `publicar-resposta-de-revisao`. Não reescreva aqui o texto, a marcação, a publicação nem a resolução da thread.

### Passo 7

Com `Pedir nova revisão ao final` em `sim`, peça nova revisão a quem solicitou mudanças, só depois de tudo aplicado ou respondido.
Se sobrou um item dela esperando decisão, não peça ainda e diga isso.
No self review, a pessoa é a mesma: não peça revisão de novo.
Nunca peça a um bot.

### Passo 8

Entregue um placar curto: aceitos, recusados, desatualizados e abertos, por autor, e o que ficou esperando decisão. O relatório sai no `Idioma do relatório`, com cada PR como link, como manda `escrever-link`, e com `Agrupar o relatório por prioridade` em `sim` agrupa por Deve ter, Deveria ter, Poderia ter e Não terá agora. Diga se ainda há thread aberta, se pediu nova revisão e o que a validação não conseguiu. Devolva para quem chamou, com o endereço do PR. O merge segue `criar-pull-request`, que decide também pelos checks.

### Passo 9

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Promessa do autor sem entrega

Se você deixar sem tratar um comentário em que o autor diz que vai deixar uma evidência visual ou atualizar a descrição, a promessa fica aberta e quem revisa não vê o resultado.

1. Reconheça a promessa no Passo 3, mesmo escrita como "vou testar no navegador".
2. Gere a evidência de cada cenário com `registrar-evidencia-visual`, ou edite a descrição.
3. Responda a thread com o link do que foi gravado.

### Thread resolvida sem os três rastros

Se você resolver a thread só com a resposta, a decisão fica perdida na conversa e o próximo revisor refaz a pergunta.

1. Escreva a decisão na descrição do PR, com como e por quê.
2. Escreva o teste, quando o comportamento for testável.
3. Responda e só então resolva a thread.

### Conferência a cada commit

Se você conferir o título e a descrição a cada commit, a conferência gasta token antes do push e se repete.

1. Faça os commits sem essa conferência.
2. Depois do push, uma vez, siga a conferência de `criar-pull-request` e atualize o que deixou de contar o que o código faz.
3. Só então responda.

### Comentário desatualizado tratado como atual

Se você corrigir o que um comentário apontou sem conferir o código de agora, a correção desfaz uma mudança que já resolveu o caso.

1. Leia o arquivo no último commit do PR.
2. Se o problema não está mais lá, responda o que mudou e resolva, seguindo `publicar-resposta-de-revisao`.

### Resposta escrita nesta habilidade

Se você reescrever aqui o texto, a marcação ou a publicação, a regra fica em dois lugares e os dois divergem.

1. Siga `publicar-resposta-de-revisao`.
2. Não copie o texto dela para cá.
3. Se a resposta crescer, a folga fica naquela habilidade.

### Tudo que o bot pede vira mudança

Se você aceitar cada sugestão de bot, o PR cresce com estilo e detalhe de pouco impacto, e o comentário que importa se perde.

1. Classifique pelo Passo 3.
2. Recuse o detalhe com uma frase.
3. Se a recusa se repete, grave nas instruções do projeto.

### Decisão de produto tomada sozinha

Se você resolver um comentário sobre intenção, produto ou arquitetura sem perguntar, a decisão humana não acontece.

1. Leve a pergunta à pessoa, com as opções.
2. Deixe a thread aberta até ela decidir.

### Resumo do bot esquecido

Se você ler só as threads, o resumo que o bot publica no corpo da revisão fica sem resposta, e ele pode trazer um achado que não virou thread.

1. Leia o corpo de cada revisão.
2. Trate o achado do resumo como os outros.

### Branch atrás e o atendimento parou

Se você avisar ou pedir antes de atualizar uma branch que está atrás da base, o atendimento trava e a base segue mudando.

1. Atualize antes de aplicar, na cópia separada, com rebase sobre a base remota, como `atualizar-branch-do-pull-request` manda.
2. Resolva o conflito nos commits rebaseados e substitua a branch publicada. O atendimento já autoriza. Não peça.
3. Se há pull requests empilhados em cima, atualize essas branches na mesma cópia, na ordem. O diff de cada um continua só com os arquivos daquela pergunta. A branch aberta no clone da pessoa não é reescrita lá.
4. Uma sugestão que muda comportamento continua esperando a aprovação. Atualizar a branch não é essa aprovação.

### Mudança de comportamento aplicada sem aprovação

Se você aplicar uma sugestão que muda o resultado, a borda ou a validação só porque um bot a pediu, o PR muda de comportamento sem a pessoa decidir.

1. Classifique no Passo 3.
2. Mostre o que muda e o risco, e espere a aprovação.
3. Na dúvida, trate como mudança de comportamento.

### Clone da pessoa alterado

Se você trocar a branch ou guardar as alterações no clone da pessoa, ela perde o que fazia.

1. Trabalhe na cópia separada.
2. Confira no fim que o clone está como estava.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### confira a análise do bot no PR de release, ainda faz sentido?

O bot pedia para segurar a release porque uma skill apontava para outras que ainda não existiam. No commit atual, todas existiam e a checagem passava. Respondi o que mudou desde a revisão e resolvi a thread. No relatório, esse comentário entra como desatualizado.

### o bot comentou no catálogo que a entrada de uma skill contradiz a própria skill.

A entrada dizia que os exemplos usam `dt` e `dd`, e a skill e a checagem pedem heading e parágrafo. Corrigi num PR de documentação, respondi com o link e resolvi. No relatório, esse comentário entra como aceito.

### o bot pede frontmatter num arquivo que o gerador de release reescreve.

Recusei: o gerador reescreve o arquivo a cada release. Gravei a exceção nas instruções do projeto, respondi e resolvi. No relatório, esse comentário entra como recusado, e a lição ficou nas instruções do projeto.

### o comentário de self review já está no commit

A pessoa comentou no próprio pull request, em português, e o projeto pede a resposta no idioma do comentário. A sugestão já estava no commit. A resposta foi publicada na thread, em português, com as linhas alteradas e o SHA curto linkado, e a thread foi resolvida. No relatório, esse comentário entra como aceito: a sugestão já estava no commit.

### A branch está atrás da base e um arquivo comentado conflita

A base avançou e o arquivo de documentação conflita. Atualizei com rebase na cópia separada, resolvi o conflito e substituí a branch publicada, sem perguntar. A sugestão que mudava o resultado da validação continuou esperando aprovação. No relatório, a atualização da branch não entra como decisão pendente.

### A branch de baixo está atrás da base e há rascunhos empilhados em cima

A base avançou. Atualizei a branch de baixo e as de cima, na cópia separada, para cada diff continuar só com os arquivos daquela pergunta. A pasta da pessoa ficou no commit antigo, e o relatório disse isso. A sugestão que mudava o resultado continuou esperando aprovação.

### Aplique a revisão do meu PR

Achei cinco comentários abertos. Dois eram estruturais, um nome e um texto, e apliquei. Um pedia uma validação nova e muda o comportamento: mostrei o risco e esperei a sua aprovação. Um discordava da convenção do repositório e respondi com uma pergunta. Um era boa ideia, mas de outro PR, e propus registrar à parte. Validei, commitei por assunto, enviei a branch, respondi e resolvi as atendidas. Pedi nova revisão a quem solicitou mudanças.

## Casos-limite

- Uma pessoa pergunta algo que só ela pode decidir: pergunte e não resolva.
- Dois bots apontam o mesmo problema: uma correção, uma resposta em cada thread.
- A resposta, a marcação e a resolução seguem `publicar-resposta-de-revisao`.
- Um push novo faz o bot revisar de novo: leia as threads novas antes do merge.
- Um bot comenta por causa de um check que falhou: trate como os outros. A decisão de mesclar com check falhando fica com `encerrar-pull-request`.
- Sem PR informado e sem nenhum PR da pessoa precisando de ação: diga isso e pare.
- Execução agendada: siga `Aplicar em execução agendada` e deixe o resto no resumo, sem responder.
- A branch está atrás da base, com ou sem conflito: atualize com rebase, resolva o conflito e substitua a branch publicada, como `atualizar-branch-do-pull-request` manda, sem avisar e sem pedir. Se há pull requests empilhados em cima, atualize essas branches na mesma cópia, na ordem, para cada diff continuar só com os arquivos daquela pergunta. A branch aberta no clone da pessoa não é reescrita lá.
- A correção mudou o que a branch faz: depois do push, o título e a descrição passam uma vez pela conferência de `criar-pull-request`.

## Pegadinhas

- A consulta de threads traz uma página. Se `pageInfo.hasNextPage` for verdadeiro, peça a próxima com `after`, antes de dizer que não há mais thread.
- Uma sugestão de bot e uma de pessoa se classificam pela mesma régua.
- Aprovar o PR de outra pessoa não é papel desta habilidade.
- A resposta parece caber neste texto. Ela segue `publicar-resposta-de-revisao`.
- A branch atrás da base parece pedir autorização antes do rebase. O atendimento já autoriza atualizar e substituir a branch publicada. A aprovação que ainda se pede é a de mudança de comportamento.
- Atualizar só a branch de baixo parece suficiente. As de cima andam junto, senão o diff delas mistura os arquivos de baixo.
- Conferir a cada commit parece necessário. A conferência é uma vez, depois do push.
- Citar um PR só pelo número é erro. Escreva o link como manda `escrever-link`.

## Scripts disponíveis

- `gh pr view <número> --repo <Repositório> --json reviews,comments`: revisões e conversa do Passo 1.
- `gh api graphql -f query='query{repository(owner:"<dono>",name:"<nome>"){pullRequest(number:<número>){reviewThreads(first:100){pageInfo{hasNextPage endCursor} nodes{id isResolved isOutdated comments(first:100){nodes{databaseId author{login} path body}}}}}}}'`: threads e respostas. A resposta e a resolução estão em `publicar-resposta-de-revisao`.

1. Leia as revisões, a conversa e as threads.
2. Se a branch estiver atrás da base, atualize com rebase e substitua a branch publicada, sem pedir. Se há pull requests empilhados em cima, atualize essas branches na mesma cópia. Corrija e commite, inclusive a lição nas instruções do projeto, se for o caso, e envie a branch. Depois do push, confira o título e a descrição uma vez.
3. Para cada thread, a resposta segue `publicar-resposta-de-revisao`.
4. Entregue o placar do Passo 7.
