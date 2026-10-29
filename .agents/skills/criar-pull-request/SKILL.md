---
name: criar-pull-request
description: Use essa habilidade sempre que for abrir ou atualizar PR, subir uma correção ou mandar para a branch principal, mesmo sem dizer PR. NÃO use para mesclar (use mesclar-pull-request), responder comentário de revisão nem para só commitar (use criar-commit).
metadata:
  author: jimmyandrade
  version: "0.41.1"
  related:
    - registrar-evidencia-visual
    - registrar-resultados-da-validacao-na-tarefa
    - evoluir-habilidade
    - criar-commit
    - atualizar-branch-do-pull-request
    - fatiar-pull-request
    - mesclar-pull-request
    - sincronizar-status-da-tarefa
---

# Criar pull request

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. `Repositório` vem do remoto `origin` quando as instruções não dizem.

```yaml
"Repositório": ""
"Branch base": "main"
"Idioma do PR": "inglês"
"Comando de testes": ""
"Comando de build": ""
"Timeout do push (ms)": 600000
"Duração do hook de pre-push (min)": 0
# `Pular o hook de pre-push`: `não` espera o hook. `sim` publica sem ele quando o commit já passou no Passo 2.
"Pular o hook de pre-push": "não"
# `Habilidade que pede a revisão`: nome da habilidade que pede a revisão de um PR pronto, ou vazio quando ninguém pede.
"Habilidade que pede a revisão": ""
# `Atribuição da sessão`: `sim` põe a linha da sessão. `não` nunca põe linha de ferramenta.
"Atribuição da sessão": "sim"
# `Atribuir o PR a quem abre`: `sim` quando o PR sai atribuído a quem o abre.
"Atribuir o PR a quem abre": "sim"
# `Rotular o PR`: `sim` quando o PR sai com o rótulo que melhor descreve a mudança.
"Rotular o PR": "sim"
# `Criar rótulo se nenhum servir`: `sim` cria um rótulo novo se nenhum existente descreve a mudança.
"Criar rótulo se nenhum servir": "não"
# `Termos que não podem aparecer`: palavras que não podem estar no PR nem nos arquivos. Vazio, não há busca.
"Termos que não podem aparecer": []
# `Fatiar por subtarefa`: `não` junta a mesma pergunta de revisão. `sim` abre um PR por subtarefa.
"Fatiar por subtarefa": "não"
# `PR que depende de outro`: `empilhar` abre contra a branch do PR anterior. Vazio não empilha outra demanda.
"PR que depende de outro": ""
# `Refatiar PR já aberto`: como mudar o corte de um PR aberto, sem renomear a branch nem fechar e reabrir.
"Refatiar PR já aberto": ""
# `Criar pull request ao terminar`: `rascunho`, `sim` ou `não`. O merge não entra aqui.
"Criar pull request ao terminar": "rascunho"
"Modo de aprendizado": "perguntar"
```

## Instruções

Nada entra na `Branch base` sem pull request. Nunca dê push na `Branch base`, nem com pedido explícito. Nunca substitua a história da `Branch base`. Toda mudança chega por PR mesclado.

### Passo 1

Leia o `CONTRIBUTING.md` e o `AGENTS.md` do repositório e siga o que eles dizem de branch, título, descrição e checks: a convenção documentada vale mais que a preferência pessoal.
Com `Fatiar por subtarefa` em `não`, a mesma pergunta de revisão fica no mesmo pull request. Siga `fatiar-pull-request`.
Com `sim`, abra um PR por subtarefa. Um PR que depende de outro segue `PR que depende de outro`.
Antes de criar a branch, confira se a demanda tem uma tarefa no rastreador do projeto, quando o projeto usa um.
Sem tarefa, sugira criá-la antes do PR e espere a resposta: a chave entra no nome da branch e no título do PR conforme a convenção do repositório.
Se o PR já está aberto sem tarefa, diga isso e proponha criá-la depois.

Antes de criar a branch, busque a `Branch base` de novo, no mesmo comando que a cria. Um fetch anterior da mesma sessão não conta. Crie a branch a partir dessa base, sem rastrear a base. Se a branch atual já for a `Branch base`, faça isso antes de qualquer commit.

O nome da branch é `<tipo>/<descrição>`.
O tipo é o do Conventional Commits do commit principal: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore` ou `ci`.
A descrição é ASCII em kebab-case.
Branch com outro prefixo, como `claude/` ou `cursor/`, que a ferramenta criou, é renomeada antes do push.
Não abra PR de branch fora desse padrão.
Se ela já tem PR aberto, renomear no GitHub fecha esse PR: abra um PR novo da branch renomeada, com o mesmo título e corpo, e comente no antigo o link do novo.

### Passo 2

Antes do commit, rode o `Comando de testes` e o `Comando de build` quando existirem. Se a mudança corrige um bug, confirme que o teste novo falha sem a correção e passa com ela. Guarde o hash do commit que passou nas duas verificações.

### Passo 3

Commite seguindo `criar-commit`.

### Passo 4

Se a branch já tem PR ou está atrás da `Branch base`, siga `atualizar-branch-do-pull-request` antes do push.

### Passo 5

Com `Criar pull request ao terminar` em `rascunho`, o padrão, a mudança de código já autoriza o push da branch e a abertura do pull request em rascunho.
Com `sim`, o push e o pull request pronto.
Com `não`, só publique com pedido explícito.
Pedir "faça o PR", "sobe isso" ou "coloca na main" autoriza o push da branch, nunca da `Branch base`.
"coloca na main" também pede o merge, que segue `mesclar-pull-request` depois do PR aberto.
O parâmetro não mescla.
Se `Duração do hook de pre-push (min)` for maior que zero, avise antes quanto o hook leva, para a pessoa não achar que travou.
Com `Pular o hook de pre-push` em `não`, o push espera o hook. Com `sim`, e o commit já passou no Passo 2, publique sem o hook e diga isso. A checagem de skill continua no pre-commit. Deixe o hook rodar em segundo plano, com `Timeout do push (ms)`.
Teste antes o acesso ao remoto com a credencial do `gh`. Faça o push com essa credencial.

### Passo 6

Antes de abrir, procure cada termo de `Termos que não podem aparecer` nos arquivos novos e alterados e no texto do PR fora dos endereços `https://`, sem diferenciar maiúsculas.
A busca e a lista de rótulos estão em `Scripts disponíveis`.
Um achado fora do endereço volta para correção e o PR não abre. Run, job, pull request e commit citados levam o endereço `https://`, mesmo com termo da lista no caminho.

Abra o PR contra a `Branch base` no `Repositório`.
Título e corpo em `Idioma do PR`: leia o valor nos parâmetros antes de escrever. O idioma das respostas, da issue ou das instruções não decide o do PR, nem quem propõe a mudança.
O título começa igual ao assunto do commit. Se o assunto saiu noutro idioma, corrija o commit antes do push.
Com issue, o pull request e o merge request citam `#<número>` na descrição, na forma do repositório.
Sem issue, não invente número.
Se o repositório tiver um template de pull request, siga as seções dele e marque as caixas conforme o que foi feito.
Se a mudança altera o que uma pessoa vê, como tela, componente, estilo ou texto da interface, siga `registrar-evidencia-visual` antes de abrir ou de tirar o PR do rascunho. A seção do modelo que mostra o resultado leva a imagem ou o vídeo, e uma tabela de antes e depois só com texto não conta. Sem imagem, o PR fica em rascunho e a resposta diz o que falta. Dependência, documentação e mudança sem diferença na tela ficam de fora.
Se a mudança foi validada fora dos checks do PR, como num teste local, num ambiente de teste ou num teste que só roda depois do merge, e a tarefa não tem o registro dos resultados dessa validação, siga `registrar-resultados-da-validacao-na-tarefa` antes de tirar o PR do rascunho.
Sem o registro, o PR fica em rascunho e a resposta diz o que falta.
Validação que os próprios checks do PR já mostram fica de fora.
Com o preview do PR publicado, o endereço dele entra na descrição do PR e na tarefa, como `registrar-resultados-da-validacao-na-tarefa` manda.
A descrição guarda como a mudança foi feita e por que cada decisão foi tomada: de onde vem o dado, por que aquele nome, aquela condição ou aquela estrutura, e o que ficou de fora. A tarefa guarda o escopo e os critérios de aceitação, não o como. Quando uma pergunta de revisão muda uma decisão, a descrição muda junto.
Depois do push, uma vez, confira o título e a descrição contra o código que subiu e contra `Idioma do PR`. Vários commits no mesmo push são uma conferência só. Se um dos dois deixou de contar o que a branch faz, atualize os dois antes de responder.
Com o PR já aberto, quando a evidência muda (um teste passou ou falhou depois do que a descrição diz, saiu o preview, chegou a imagem), atualize na mesma rodada a descrição e a tarefa, com a mesma informação nos dois. A tarefa segue `registrar-resultados-da-validacao-na-tarefa`: edite o comentário que já existe e não crie outro. Antes de dizer que um dos dois está atualizado, releia-o.

Com `Atribuição da sessão` em `sim`, termine com a linha de atribuição da sessão.
Com `não`, não ponha linha de ferramenta ou de modelo, e remova a que o PR já tiver na mesma edição.

Com `Atribuir o PR a quem abre` em `sim` e `Rotular o PR` em `sim`, o comando que abre o PR, em `Scripts disponíveis`, já leva a pessoa atribuída e o rótulo.
O rótulo é o do tipo do commit.
`fix` usa o rótulo de bug.
`docs` usa o de documentação.
A extensão do arquivo não escolhe o rótulo.

Não abra o PR para rotular depois.
Se nenhum rótulo serve, só crie um novo com `Criar rótulo se nenhum servir` em `sim`.
Com `não`, diga na resposta que nenhum serviu e não abra o PR sem rótulo.
Um PR que já estava aberto sem pessoa atribuída ou sem rótulo recebe os dois antes de qualquer outra edição.
Mande o link na resposta.

### Passo 7

Depois de abrir, leia o status do PR pelas ferramentas de PR do app e vincule o PR se ele não aparecer. Não fique consultando o CI em loop.

Depois de ligar o PR, renomeie a sessão de conversa com a IA, o nome da conversa na lista do app, para `[CHAVE] título do PR`, com a chave do card e o título do PR como estão (`[ABC-123] fix(login): accept an uppercase email`).
O título do PR e o da issue não mudam: só o nome da conversa muda.
Sem card, use a chave da issue do projeto, e sem nenhuma das duas, só o título do PR. Confira a chave e o título no GitHub e na tarefa antes, e não pergunte.

Com `Habilidade que pede a revisão` preenchida e o PR fora do rascunho, e com a evidência visual registrada quando a mudança altera a tela, siga essa habilidade para o PR aberto e entregue o que ela devolver, como o rascunho do pedido. Um PR em rascunho não pede revisão.

### Passo 8

Com pedido de merge, siga `mesclar-pull-request` para o PR aberto. Sem pedido, entregue o link e pare.

### Passo 9

Na resposta final, abra com o link do PR, `[#123](url)`, e depois informe o nome da branch, se ela está no GitHub e o hash de cada commit, e diga o estado de cada etapa: commit, push, PR, quem foi atribuído, o rótulo e o CI.
Cada PR citado, inclusive na pergunta sobre quem mescla, vai como link clicável em markdown, com o número no texto, como `[#123](url)`. Nunca `#123` solto nem só a URL.
Com `Criar pull request ao terminar` em `rascunho`, o padrão, a branch está no GitHub, o pull request está aberto em rascunho e a resposta leva o link.
Com `sim`, o pull request está aberto pronto e a resposta leva o link.
Com `não` e sem pedido de publicação, o estado do pull request é que ele não está aberto.
Diga se esta habilidade foi chamada.
Não escreva que ela ficou para este pedido, nem para depois.

### Passo 10

Ao terminar, siga `sincronizar-status-da-tarefa` e depois `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### PR com a descrição incompleta

Se você descrever só o que mudou, sem a imagem de uma mudança de tela nem o porquê das decisões, quem revisa monta o ambiente para ver o resultado ou pergunta de novo o que o código já respondeu.

1. No Passo 6, ponha a imagem da mudança de tela e o como e o porquê de cada decisão.
2. Sem imagem numa mudança de tela, o PR fica em rascunho e nenhum pedido de revisão sai.
3. Quando a revisão mudar uma decisão, atualize a descrição na mesma rodada.

### Evidência nova só num dos lados

Se você atualizar só a descrição do PR depois de uma validação nova, ou só a tarefa, quem lê o outro lado confia num resultado que já não vale.

1. Atualize a descrição e a tarefa na mesma rodada.
2. Edite o comentário de validação que já existe na tarefa.
3. Releia os dois antes de responder.

### Conferência a cada commit

Se você conferir o título e a descrição a cada commit, a conferência gasta token antes do push e se repete.

1. Faça os commits sem essa conferência.
2. Depois do push, confira uma vez e atualize o que deixou de contar o que a branch faz.

### PR aberto sem rótulo

Se você abrir o pull request e só depois escolher o rótulo, o PR fica sem rótulo.

1. Leia os rótulos do repositório antes de abrir.
2. Com `Atribuir o PR a quem abre` e `Rotular o PR` em `sim`, o comando que abre já leva `--assignee` e `--label`.
3. Não trate o PR como aberto enquanto o rótulo estiver faltando.

### Frase que adia a habilidade

Se você escrever que a habilidade ficou para este pedido, ou para depois, a pessoa não sabe se ela foi chamada.

1. Diga se esta habilidade foi chamada.
2. Com `Criar pull request ao terminar` em `rascunho`, suba a branch e abra o pull request em rascunho. Com `sim`, abra o pull request pronto. Com `não` e sem pedido de publicação, diga o nome da branch e que ele não está aberto.
3. Não use a expressão "ficou para este pedido".

### Push parado sem saída

Se você der push por HTTPS e o comando ficar minutos sem saída, o helper de credencial do sistema está esperando um prompt que nunca aparece.

1. Encerre o push parado.
2. Teste o acesso ao remoto com prompt de terminal desligado e a credencial do `gh`.
3. Refaça o push com a mesma credencial.

### Push estoura o tempo da ferramenta

Se você rodar o push em primeiro plano com o tempo padrão, o hook de pre-push passa do limite e o comando vai para segundo plano sem aviso.

1. Rode o push com `Timeout do push (ms)` ou em segundo plano.
2. Avise a pessoa quanto tempo vai levar.
3. Espere a notificação. Não fique consultando em loop.

### Pessoa sem notícia

Se você esperar o hook ou o CI sem dizer nada, a pessoa entende que você está enrolando.

1. Antes de cada espera longa, diga o que está rodando e quanto tempo leva.
2. Se o passo repete uma verificação já feita no mesmo commit, pule e diga isso.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Faça o PR pra corrigir isso

Branch `fix/…` a partir da base, testes e build no commit, commit em `Idioma da mensagem de commit`, push com a credencial do `gh`, PR aberto e o link na resposta. Sem merge, porque a pessoa não pediu.

### O código mudou e o título ficou no texto antigo

O push levou vários commits. Conferi o título e a descrição uma vez, depois do push, e atualizei os dois antes de responder.

### Só coloca isso na main

O pedido autoriza push e merge. O push espera o hook de pre-push. Com o PR aberto, o merge segue `mesclar-pull-request`.

## Casos-limite

- Já existe PR aberto para a branch: não abra outro. Depois do push, confira título e descrição uma vez, atualize o que deixou de contar o que a branch faz, renomeie a sessão de conversa com a IA se o nome dela não seguir o Passo 7, e dê o link.
- O PR da branch já foi mesclado: siga `atualizar-branch-do-pull-request`, que não dá rebase nem push nessa branch.
- A branch atual tem trabalho de outra tarefa: comece a nova branch da `Branch base` remota, não da branch atual.
- A ferramenta criou a branch com outro prefixo, como `claude/…`: renomeie para `<tipo>/<descrição>` antes do push. Com PR aberto, a renomeação fecha o PR: abra outro e ligue os dois.
- O teste novo passa também sem a correção: o teste não cobre o bug. Reescreva antes do commit.
- A pessoa pede para não commitar: pare antes do Passo 3.
- A pessoa pede para subir direto na `Branch base`: não suba. Abra o PR e explique a regra.
- Sem terminal: a branch e o commit vêm de `criar-commit`, pela integração do GitHub. Pule os Passos 2, 4 e 5, abra o PR do Passo 6 pela mesma integração, entregue o link e pare. Os checks do CI no PR testam a mudança.

## Pegadinhas

- Número ou hash curto, no lugar do endereço do Passo 6, obriga a pessoa a procurar. `#<número>` no commit e na descrição é a issue.
- `git switch -c <branch> origin/<base>` faz a branch rastrear a base. Use `--no-track` e publique com `push -u origin <branch>`.
- Um fetch do começo da sessão parece a base atualizada. Busque de novo no mesmo comando que cria a branch.
- O prefixo que a ferramenta deu parece o nome da branch. Quem manda é o tipo do commit.
- O push por HTTPS pode travar para sempre no helper de credencial do macOS. A credencial do `gh` funciona.
- Não existe `timeout` no macOS. Use o timeout da ferramenta ou rode em segundo plano.
- Um hook de pre-push pode rodar também no push que só apaga uma branch remota.
- Um Markdown parece documentação. O rótulo segue o tipo do commit. Correção de erro é `fix` e o rótulo de bug. `docs` e o rótulo de documentação ficam para a documentação.
- Conferir a cada commit parece necessário. A conferência é uma vez, depois do push.
- As respostas, a issue e as instruções em português parecem pedir o título do PR em português. O título segue `Idioma do PR`, lido nos parâmetros.
- "Sessão" parece o PR ou a issue. É a conversa com a IA no app, e só o nome dela muda. O título do PR e o da issue ficam como estão.

## Scripts disponíveis

- `Comando de testes` e `Comando de build`: verificações do Passo 2.
- `git fetch origin && git switch --no-track -c <branch> origin/<Branch base>`: Passo 1.
- `git branch -m <tipo>/<descrição>`: renomeia a branch local no Passo 1.
- `gh api -X POST repos/<Repositório>/branches/<branch>/rename -f new_name=<tipo>/<descrição>`: Passo 1. Fecha o PR. Abra outro depois.
- `GIT_TERMINAL_PROMPT=0 git -c credential.helper= -c 'credential.helper=!gh auth git-credential' ls-remote origin HEAD`: teste de acesso do Passo 5.
- `GIT_TERMINAL_PROMPT=0 git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -u origin <branch>`: push do Passo 5. O hook de pre-push roda.
- `LEFTHOOK=0 GIT_TERMINAL_PROMPT=0 git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -u origin <branch>`: só com `Pular o hook de pre-push` em `sim`.
- `git grep -i -E "termo1|termo2"`: Passo 6.
- `gh label list --repo <Repositório>`: rótulos do Passo 6.
- `gh pr create --repo <Repositório> --base <Branch base> --head <branch> --title "<assunto>" --body "<corpo>" --assignee <pessoa> --label <rótulo>`: Passo 6. Sem assignee ou rótulo, tire a flag.
- `gh pr edit <número> --repo <Repositório> --title "<título>" --body "<corpo>"`: atualiza o título e a descrição no Passo 6.

1. Rode as verificações, depois a atualização da branch, o teste de acesso, o push, a conferência do título e da descrição, e a criação ou a atualização do PR.
