---
name: fechar-pull-request
description: Fecha um pull request sem merge com o motivo e os links que o comprovam, e faz o que vem depois do fechamento. Usada quando a pessoa pede para fechar um PR, ou quando outra habilidade fecha um PR que foi substituído, mesmo sem dizer fechar. Não serve para mesclar, abrir ou atualizar o PR nem para responder a revisão.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  related:
    - atender-revisao-de-pull-request
    - atualizar-branch-do-pull-request
    - criar-pull-request
    - evoluir-habilidade
    - fatiar-pull-request
    - limpar-copias-de-trabalho
    - mesclar-pull-request
    - sincronizar-status-da-tarefa
---

# Fechar pull request

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. `Repositório` vem do remoto `origin` quando as instruções não dizem.

```yaml
"Repositório": ""
# `Idioma do comentário de fechamento`: `o idioma do PR` segue `Idioma do PR` de `criar-pull-request`.
"Idioma do comentário de fechamento": "o idioma do PR"
# `Apagar a branch ao fechar`: `sim` apaga a branch remota junto com o fechamento.
"Apagar a branch ao fechar": "sim"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Leia o estado do PR agora: aberto, mesclado ou fechado.
Já mesclado: diga isso e siga `mesclar-pull-request` para o que vem depois do merge.
Já fechado: diga isso e vá para o Passo 3.
Feche só com pedido da pessoa ou quando outra habilidade manda, como `atualizar-branch-do-pull-request` ao renomear a branch e `atender-revisao-de-pull-request` ao recriar o PR.
PR de outra pessoa só fecha com pedido explícito dela, naquele PR.

### Passo 2

Antes de escrever, ache um link para cada fato do comentário: o PR que repete ou substitui este, o commit e o arquivo na base, ou a issue, a decisão ou o comentário que mudou o rumo.
Fato sem link: pergunte o motivo à pessoa e não feche.
Quando o comentário diz que nada se perde, compare cada arquivo do PR com a base e diga quais diferem e por quê.
Escreva o comentário no `Idioma do comentário de fechamento`: o motivo na primeira linha, um fato com link por item, e o que acontece com a branch na última linha.
Quando outro PR substitui este, o motivo e o link do substituto vão num alerta `> [!IMPORTANT]` do GitHub, que abre o comentário.
Publique o comentário e feche na mesma operação, com `Apagar a branch ao fechar`, e confirme o estado CLOSED.
Uma thread de revisão aberta vai para o PR que substitui este, como `fatiar-pull-request` faz.

### Passo 3

Depois do fechamento, feito aqui ou avisado pela pessoa, faça tudo isto na mesma resposta, antes de responder:

- [ ] Confirme o estado CLOSED e o link do comentário.
- [ ] Procure as tarefas ligadas ao PR: as issues que ele citava, a chave do card no título ou na branch, e as tarefas que citam o PR.
- [ ] Para cada tarefa achada, siga `sincronizar-status-da-tarefa`.
- [ ] Se não achar nenhuma, escreva na resposta que o PR não tem tarefa ligada e onde você procurou.
- [ ] Siga `limpar-copias-de-trabalho` para a cópia de trabalho e a branch local do PR.

Abra a resposta com o link do PR, `[#123](url)`, e o link do comentário. Cada PR, issue e commit citado vai como link clicável em markdown.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Fechado sem motivo ou sem prova

Se você fechar o PR sem comentário, só com "duplicado", ou afirmar que a mudança já está na base sem conferir, quem abrir o PR depois não sabe por que ele parou, e um arquivo que só existia nele some.

1. Escreva o motivo na primeira linha e um link por fato.
2. Compare cada arquivo do PR com a base antes de dizer que nada se perde.
3. Fato sem link ou diferença sem explicação: pergunte antes de fechar.

### Thread aberta perdida

Se você fechar com uma thread de revisão sem resolver, a pergunta some junto com o PR.

1. Leia as threads antes de fechar.
2. Leve cada uma ao PR que substitui este, como `fatiar-pull-request` faz.
3. Cite no comentário de fechamento para onde ela foi.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Pode fechar o #12, ele repete o #13 que já entrou

Comentei no #12 que ele repete o #13, com o link do commit de merge e da pasta da skill na base. Conferi que 9 dos 11 arquivos eram iguais aos da base e que os outros dois só diferiam por entradas de PRs mesclados depois, cada um com link. Fechei com a branch apagada e a resposta trouxe o link do PR e do comentário.

### Fecha esse PR, não vamos mais seguir com ele

A pessoa não disse por quê, e nenhuma issue ou comentário registrava a decisão. Perguntei o motivo antes de fechar. O PR continuou aberto.

## Casos-limite

- Renomear a branch fecha o PR sem comentário: comente depois, como o Passo 2 manda, com o link do PR novo.
- A pessoa pede para fechar um PR em rascunho: o rascunho não muda nada, feche do mesmo jeito.
- O PR fechado pode ser reaberto depois: diga isso na resposta quando a pessoa ainda estiver em dúvida.

## Pegadinhas

- O "Closed with unmerged commits" do GitHub parece explicar o fechamento. Ele não diz o motivo nem para onde a mudança foi.
- O PR da mesma mudança pode ter título diferente, como um `!` a mais. Compare os arquivos, não só o título.

## Scripts disponíveis

- Nenhum.

1. Estado: `gh pr view <número> --repo <Repositório> --json state,isDraft,headRefOid,closingIssuesReferences`.
2. Arquivos do PR: `gh pr diff <número> --repo <Repositório> --name-only`.
3. Comparação com a base: `git diff --quiet <commit do PR> origin/<base> -- <arquivo>`.
4. Comentário e fechamento: `gh pr comment <número> --repo <Repositório> --body-file <arquivo>` e `gh pr close <número> --repo <Repositório> --delete-branch`.
