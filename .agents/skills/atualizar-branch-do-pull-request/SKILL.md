---
name: atualizar-branch-do-pull-request
description: Use essa habilidade sempre que uma branch com pull request estiver atrás da base, tiver conflito ou precisar de rebase, mesmo sem dizer rebase. NÃO use para abrir o PR, fazer o primeiro push nem mesclar (use criar-pull-request).
metadata:
  author: jimmyandrade
  version: "0.2.1"
  related:
    - criar-pull-request
    - atender-revisao-de-pull-request
    - evoluir-habilidade
---

# Atualizar branch do pull request

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. `Repositório` vem do remoto `origin` quando as instruções não dizem.

```yaml
"Repositório": ""
"Branch base": "main"
# `Cópia de trabalho` é `Global` e cada skill pode sobrescrevê-lo. `worktree` trabalha num git worktree novo da `main`, nunca no clone da pessoa. Vazio trabalha onde a pessoa já está.
"Cópia de trabalho": "worktree"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Siga `Cópia de trabalho` antes de mexer na branch.
Se a branch já tem PR, confira o estado dele antes de atualizar.
Se já foi mesclado, a branch remota foi apagada: comece uma branch nova a partir da `Branch base` remota e leve só os commits que ficaram fora do merge.

### Passo 2

Atualize a branch com rebase sobre a `Branch base` remota.
Nunca faça merge da base na branch nem crie commit com assunto `merge:`.
O squash do PR não é motivo para mesclar a base antes.
Resolva conflitos nos commits rebaseados.

### Passo 3

Se a branch já foi publicada, o push comum é recusado, porque a história local e a do GitHub divergiram.
Substitua a branch no GitHub pela história reescrita só depois que a pessoa autorizar, e só nessa branch.
A habilidade que chamou esta pode já trazer a autorização, como `atender-revisao-de-pull-request`.
Na resposta, diga que a branch publicada ganha os commits novos, a `Branch base` não muda, e a substituição só segue se ninguém enviou commit novo nessa branch desde a última leitura.
Não use o nome do comando no lugar dessa explicação.

### Passo 4

Faça o push seguindo `criar-pull-request`, com o teste de acesso e a credencial dela.
Depois do push, a conferência do título e da descrição também segue `criar-pull-request`.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Merge da base na branch

Se você mesclar a base na branch, o PR ganha um commit `merge:` e a história deixa de ser linear.

1. Desfaça o merge local.
2. Atualize com rebase sobre a `Branch base` remota, pelo Passo 2.

### Branch mesclada recriada

Se você rebasear e enviar a branch de um PR já mesclado, o push recria a branch apagada com commits que já estão na base.

1. Confira o estado do PR no Passo 1.
2. Leve só os commits que ficaram fora do merge para uma branch nova.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Mescle a base nesta branch e resolva os conflitos

A branch tinha PR aberto e a base avançou com um PR vizinho. Atualizei com rebase, resolvi o conflito nos commits rebaseados e substituí a branch publicada com a autorização do pedido. A resposta disse que a branch no GitHub ganhou os commits novos e que a base não mudou.

## Casos-limite

- O PR da branch já foi mesclado: não dê rebase nem push nessa branch. Os commits dela já estão na `Branch base` pelo squash, e o push recria a branch apagada.
- A pessoa pede merge da base: atualize com rebase e explique a regra.

## Pegadinhas

- `git pull --rebase` numa branch já publicada rebaseia sobre a própria branch remota, não sobre a `Branch base`. Use o fetch e rebase do Passo 2.

## Scripts disponíveis

- `gh pr list --repo <Repositório> --head <branch> --state all --json number,state`: estado do PR no Passo 1.
- `git fetch origin && git rebase origin/<Branch base>`: Passo 2.
- `git push --force-with-lease origin <branch>`: Passo 3, só com autorização. Não substitui a `Branch base`.

1. Confira o estado do PR, atualize com rebase, resolva os conflitos e substitua a branch publicada com autorização.
