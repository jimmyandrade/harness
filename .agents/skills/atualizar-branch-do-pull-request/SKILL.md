---
name: atualizar-branch-do-pull-request
description: Use essa habilidade sempre que for enviar um commit novo a uma branch que já tem pull request, ou ela estiver atrás da base, tiver conflito ou precisar de rebase, mesmo sem dizer rebase. NÃO use para abrir o PR, fazer o primeiro push nem mesclar (use criar-pull-request).
metadata:
  author: jimmyandrade
  version: "0.10.0"
  related:
    - criar-pull-request
    - atender-revisao-de-pull-request
    - fechar-pull-request
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
# `Conflito no rebase` é `resolver`, `perguntar` ou `automático`.
# `resolver` resolve à mão sem perguntar.
# `perguntar` mostra cada arquivo em conflito e as duas versões e espera a resposta antes de resolver.
# `automático` resolve sozinho quando os dois lados se somam sem perda, como linhas acrescentadas dos dois lados, formatação ou import, e pergunta quando a resolução descarta linha de um dos lados ou muda comportamento, dizendo o que se perderia.
# Sem ninguém para responder, como numa execução agendada, o conflito que `perguntar` ou `automático` mandaria perguntar não é resolvido: o rebase é abortado, a branch fica como estava e os arquivos em conflito são listados.
"Conflito no rebase": "automático"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Siga `Cópia de trabalho` antes de mexer na branch.
Se a branch já tem PR, confira o estado dele antes de atualizar e antes de cada push, mesmo sem rebase: ele pode ter sido mesclado depois do último push, e a branch remota pode continuar lá.
Se já foi mesclado, o commit novo não entra nele: comece uma branch nova a partir da `Branch base` remota e leve só os commits que ficaram fora do merge. A descrição do PR mesclado não muda; a mudança nova vai no PR novo, com o link do anterior.

O rascunho que você abriu há minutos também passa por essa conferência: outra pessoa pode mesclar a qualquer momento. Leia o estado no mesmo comando do push, como em `Scripts disponíveis`, para nenhum push cair entre a leitura e o envio.
Se a branch do PR aberto precisa de outro nome, como a `cursor/…` que a ferramenta criou, renomear fecha o PR.
Abra um PR novo da branch renomeada, com o mesmo título e corpo, e feche o antigo por `fechar-pull-request`, com o link do novo como prova.
O corpo do novo abre com um alerta `> [!NOTE]` do GitHub com o link do antigo, antes do resto do corpo.

### Passo 2

Atualize a branch com rebase sobre a `Branch base` remota.
Nunca faça merge da base na branch nem crie commit com assunto `merge:`.
O squash do PR não é motivo para mesclar a base antes.
Resolva conflitos nos commits rebaseados, conforme `Conflito no rebase`.
Antes de substituir a branch publicada, siga `atender-revisao-de-pull-request`: as revisões, as threads e os comentários abertos do PR são tratados e respondidos.
Quando o rebase acontece dentro dessa habilidade, ela já cumpre este passo.
Depois do rebase, confira o que entrou da base contra o que a revisão do PR pediu, como um padrão que ela mandou trocar.
O que não segue é ajustado no mesmo PR, antes do envio.

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

1. Confira o estado do PR no Passo 1, antes de cada push.
2. Leve só os commits que ficaram fora do merge para uma branch nova.

### Revisão perdida no rebase

Se você rebasear sem olhar a revisão do PR, o código que veio da base pode voltar a um padrão que a revisão mandou trocar, e uma thread aberta fica sem resposta.

1. Siga `atender-revisao-de-pull-request` antes de substituir a branch, pelo Passo 2.
2. Ajuste no mesmo PR o que veio da base fora do padrão pedido.

### Alias de renomeação que ninguém renomeou

Se você receber do CI o erro `metadata.aliases must include <skill>` numa skill que não renomeou, e acrescentar o alias, o nome de uma skill alheia entra na sua e o erro só some.

1. A branch está atrás da `Branch base`: uma skill que entrou depois dela aparece como removida, e um arquivo parecido, como um `evals.json` vazio, como renomeado.
2. Atualize com rebase, pelo Passo 2, e rode a checagem de skills com a base e o cabeça do rebase.
3. Não acrescente o alias.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Mescle a base nesta branch e resolva os conflitos

A branch tinha PR aberto e a base avançou com um PR vizinho. Atualizei com rebase, resolvi o conflito nos commits rebaseados e substituí a branch publicada com a autorização do pedido. A resposta disse que a branch no GitHub ganhou os commits novos e que a base não mudou.

## Casos-limite

- O PR da branch já foi mesclado: não dê rebase nem push nessa branch. Os commits dela já estão na `Branch base` pelo squash, e o push recria a branch apagada.
- A pessoa pede merge da base: atualize com rebase e explique a regra.

## Pegadinhas

- O rascunho aberto há minutos parece aberto. Outra pessoa pode tê-lo mesclado, e o push e a descrição nova não chegam à base.
- `git pull --rebase` numa branch já publicada rebaseia sobre a própria branch remota, não sobre a `Branch base`. Use o fetch e rebase do Passo 2.
- O CI compara a base atual com a ponta da branch, não com o ponto onde ela nasceu. Uma branch atrás da base parece ter removido e renomeado o que a base ganhou depois.

## Scripts disponíveis

- `gh pr list --repo <Repositório> --head <branch> --state all --json number,state`: estado do PR no Passo 1.
- `gh api -X POST repos/<Repositório>/branches/<branch>/rename -f new_name=<tipo>/<descrição>`: renomeia a branch no Passo 1 e fecha o PR.
- `git fetch origin && git rebase origin/<Branch base>`: Passo 2.
- `git push --force-with-lease origin <branch>`: Passo 3, só com autorização. Não substitui a `Branch base`.
- `[ "$(gh pr view <branch> --repo <Repositório> --json state -q .state)" = OPEN ] && <push>`: push numa branch com PR, no Passo 1, que só envia com o PR aberto.

1. Confira o estado do PR, atualize com rebase, resolva os conflitos, atenda a revisão do PR e substitua a branch publicada com autorização.
