---
name: criar-habilidade
description: Cria, adiciona e escreve skills a partir de uma tarefa real. Usada quando a pessoa quer uma skill nova, mesmo sem dizer skill. NÃO serve para editar código, escrever página que não seja skill, otimizar só a descrição nem gravar a skill no Notion.
metadata:
  author: jimmyandrade
  version: "3.23.0"
  related:
    - criar-commit
    - criar-pull-request
    - definir-arquivos-da-habilidade
    - descrever-habilidade-ou-schema
    - evoluir-habilidade
    - medir-habilidade
    - testar-habilidade
  models:
    - skill-md
---

# Criar habilidade

## Parâmetros de configuração

```yaml
"Tokens do catálogo": 100
"Linhas": 500
"Tokens do corpo": 5000
# `Cópia de trabalho` é `Global` e cada skill pode sobrescrevê-lo. `worktree` trabalha num git worktree novo da `main`, nunca no clone da pessoa. Vazio trabalha onde a pessoa já está.
"Cópia de trabalho": "worktree"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Crie ou atualize a skill a partir de uma tarefa prática que a pessoa está realizando com um agente. Peça o contexto do domínio antes de escrever. Não complete com conhecimento geral do modelo.
Antes de propor uma skill, procure a que já trata do assunto, meça-a com `medir-habilidade` e mostre os números à pessoa.
Com folga, a lição entra nela por `evoluir-habilidade`: o catálogo de cada skill nova pesa em todo turno.
Uma lista de boas práticas não é tarefa: cada prática vai para a skill da tarefa em que ela se aplica.
Skill nova só para a tarefa que nenhuma cobre, com o nome da tarefa, ou quando a que cobre está sem folga abaixo de `Tokens do corpo` e precisa ser dividida.
Extraia e insira na skill as etapas que funcionaram, na sequência que levou ao sucesso. Extraia as correções, como trocar uma biblioteca ou verificar um caso de borda. Extraia o formato da entrada e da saída. Extraia fatos, convenções e restrições do projeto que o agente ainda não sabia.

Siga `Cópia de trabalho` antes de escrever a skill no repositório de origem.

### Passo 2

Sintetize a skill a partir de material específico do projeto. Não use artigo genérico de melhores práticas.
Bons materiais: documentação interna, runbook, POP e guia de estilo. Especificação de API, esquema e configuração. Comentário de revisão e relato de problema, pelo que se repete e pelo que o revisor espera. Histórico de versão, pelo patch e pela correção. Caso real de falha e a resolução.
Leia relatórios reais da equipe. Incorpore o esquema, o modo de falha e o procedimento de recuperação que eles mostram.

### Passo 3

Escreva nome, descrição, metadados e corpo.
Leia o modelo de saída `skill-md` quando for gerar a saída.
O nome e a descrição seguem `descrever-habilidade-ou-schema`, e a versão segue `evoluir-habilidade`.
Pastas, scripts, referências, modelos e `Scripts disponíveis` seguem `definir-arquivos-da-habilidade`.
O comando não entra no passo.

Antes de escrever, leia as skills do mesmo assunto, as instruções do projeto e, ao atualizar, a skill inteira. Uma frase nova não contradiz outra já escrita: quando a regra muda, reescreva a que existe.

### Passo 4

Em `Pegadinhas`, imediatamente antes de `Scripts disponíveis`, liste o fato do ambiente que contraria o que o agente suporia. Não escreva conselho geral.
O fato fica no `SKILL.md`. Um arquivo separado só serve se a frase disser quando abrir. Se o problema não for óbvio, o agente não reconhece o momento de abrir.

### Passo 5

1. Catálogo, em todo turno em que uma skill pode ser escolhida: nome e descrição. No Notion, Usar automaticamente lê a Descrição para decidir se carrega a skill.
2. Corpo, quando a skill roda. No Notion, isso é o corpo da página.
3. Material além do corpo, quando aberto. No Notion, entra em Files. Não acrescente.

### Passo 6

Escreva o nome, a descrição e o corpo no idioma deste texto. O texto exato do usuário entra sem mudança quando já está nesse idioma. Caso contrário, traduza.
Nome e descrição, juntos, não passam de `Tokens do catálogo`. O corpo não passa de `Linhas` nem de `Tokens do corpo`. Se alongar, separe antes.

### Passo 7

Banco, página e workspace do Notion não entram na skill. A pessoa informa o data source na execução. Se ele não estiver no workspace conectado, pare e peça. Não troque por um banco de outro workspace.

### Passo 8

Pare quando a descrição dispara a skill e o corpo não tem mais o que cortar. Separe uma tabela literal do corpo só se ela fizer a skill passar de `Linhas` ou de `Tokens do corpo`, e aponte uma vez.

### Passo 9

A primeira versão não vai para produção. A skill é um documento vivo. Execute em tarefas reais e incorpore todos os resultados, não só as falhas.
Pergunte o que gerou falso positivo, o que passou despercebido e o que pode sair, e repita enquanto o feedback pedir.
Subdisparo e sobredisparo vão para `descrever-habilidade-ou-schema`. Resultado inconsistente, falha de chamada e correção da pessoa ficam em `evoluir-habilidade`.
Leia o registro, não só o resultado. Se o agente gasta tempo em etapa improdutiva, a instrução está vaga, não se aplica, ou oferece opções sem padrão.

### Passo 10

Deixe só o que o agente erraria sem a skill: convenção do projeto, procedimento do domínio, caso de borda não óbvio, ferramenta ou API específica. Não explique o que as coisas são nem o que fazem.
Para cada trecho, pergunte se o agente erraria sem essa instrução. Se a resposta for não, apague. Se estiver em dúvida, teste com `testar-habilidade`. Se o agente já faz a tarefa inteira sem a skill, ela não agrega valor.

### Passo 11

O escopo é uma unidade de trabalho coerente, que se junta a outras skills. Escopo estreito demais obriga a carregar várias skills na mesma tarefa e mistura instruções. Escopo amplo demais dificulta disparar a skill. Consultar uma fonte e formatar o resultado cabe junto. Administrar o armazenamento além disso já é outra skill.
Mantenha o detalhe moderado: passos curtos e um exemplo prático. Se estiver cobrindo todo caso de borda possível, deixe a maioria para o julgamento do agente.
Onde houver várias abordagens válidas, explique o porquê, escolha um padrão e mencione as alternativas por pouco. Onde a operação for sensível, a consistência importar ou a sequência for obrigatória, prescreva os passos. Calibre cada parte. A skill ensina a abordar uma categoria de problemas, não a saída de um caso só.

### Passo 12

Num fluxo de vários passos, principalmente quando um passo depende de outro ou há um portão de validação, dê um checklist explícito para o agente marcar o que já fez e não pular etapa.
Antes de seguir, o agente valida o próprio trabalho: faz, roda um validador, corrige e repete até passar. O validador é um script, um checklist ou uma revisão.
Em operação em lote ou destrutiva, o agente primeiro grava um plano estruturado, valida esse plano contra a fonte de verdade e só então executa.

### Passo 13

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Skill nova para o que uma skill já cobre

Se você criar uma skill para uma lição ou boa prática de um assunto que uma skill existente já trata, o assunto fica dividido em duas skills e a regra se repete.

1. Procure a skill do assunto e meça-a com `medir-habilidade` antes de propor outra.
2. Acrescente a lição nela com `evoluir-habilidade`.
3. Crie uma skill nova só quando nenhuma atende, ou quando a que atende está cheia e precisa ser dividida.

### Descrição sem gatilho

Se você escrever a descrição sem dizer quando usar, ou sem `NÃO serve para` quando há o que ficar de fora, a skill não dispara no momento certo.

1. Siga `descrever-habilidade-ou-schema`: sempre em terceira pessoa. A primeira frase diz o que a skill faz. `Usada quando` vem depois e não abre a descrição. `Use essa habilidade sempre que` é imperativo e não entra.
2. Feche com `NÃO serve para` e o que fica de fora.

### Corpo com prefácio

Se você repetir a descrição no corpo ou abrir com um prefácio, o corpo gasta texto sem acrescentar um passo.

1. Apague o prefácio.
2. Deixe no corpo só o que o agente ainda não sabe.

### Procedimento genérico

Se você escrever a skill só com conhecimento geral, o procedimento fica vago e deixa de fora o padrão da API, o caso de borda e a convenção do projeto.

1. Pare e peça a tarefa prática, com o contexto, as correções e as preferências.
2. Extraia as etapas que funcionaram, as correções, os formatos de entrada e saída e o que o agente ainda não sabia.
3. Insira esse padrão na skill.

### Fonte genérica

Se você sintetizar a skill a partir de um artigo genérico de melhores práticas, ela deixa de fora o esquema, o modo de falha e o procedimento de recuperação do projeto.

1. Peça documentação interna, runbook, playbook, POP, guia de estilo, especificação, revisão, patch ou falha real.
2. Leia relatórios reais da equipe.
3. Sintetize a skill a partir desse material.

### Primeira versão em produção

Se você marcar a primeira versão como produção, a skill ainda não passou por execução real.

1. Mantenha `metadata.version` em `0.x`.
2. Execute a skill em uma tarefa real e leia o registro da execução.
3. Incorpore todos os resultados antes de usar `1.0.0`.

### Etapa improdutiva

Se você vir no registro que o agente tenta várias abordagens, segue instrução que não vale para a tarefa, ou escolhe entre opções sem padrão, a execução se perde.

1. Aperte a instrução vaga até uma sequência.
2. Tire a instrução que não se aplica à tarefa atual.
3. Deixe uma escolha padrão quando houver opções.

### Conteúdo que o agente já sabe

Se você explicar o que uma ferramenta é ou listar todo caso de borda possível, o corpo não muda o que o agente já faria.

1. Apague o trecho que o agente acertaria sem a skill.
2. Se a dúvida permanecer, teste com `testar-habilidade`.
3. Se a tarefa inteira já sai certa sem a skill, não crie a skill.

### Execução sem validação

Se você mandar executar uma operação destrutiva ou em lote sem plano e sem validador, o agente erra sem volta.

1. Exija um plano estruturado.
2. Valide o plano contra a fonte de verdade.
3. Execute só depois que a validação passar. Se falhar, corrija e valide de novo.

### Banco de outro workspace

Se você gravar o endereço de um banco ou usar o banco que a conexão mostrou, a skill cria a página na empresa errada.

1. Não grave endereço de banco, página ou workspace.
2. Peça o data source na execução.
3. Se ele não estiver no workspace conectado, pare.

### Skill gravada fora do repositório de origem

Se você criar ou alterar a habilidade numa cópia, como a página do Notion ou a cópia que outro projeto recebe por dependência ou plugin, a próxima sincronização ou a próxima instalação apaga essa escrita.

1. Antes de gravar, confira de onde a skill vem. Escreva no repositório de origem, seguindo `criar-commit` e `criar-pull-request`, inclusive a conferência do título e da descrição, uma vez e depois do push.
2. Não edite a cópia.

### Pegadinha genérica

Se você escrever um conselho geral, como "trate os erros", o agente continua no erro que já cometeria.

1. Troque pelo fato do ambiente que contraria a suposição.
2. Deixe em `Pegadinhas`, antes de `Scripts disponíveis`.
3. Não mova para `references/` se o agente não reconheceria quando abrir.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

## Casos-limite

- O texto do usuário já está no idioma deste texto: entra sem mudança. Em outro idioma, traduza nome, descrição e corpo.
- Uma tabela literal faria a skill passar de `Linhas` ou de `Tokens do corpo`: separe a tabela e aponte uma vez.
- A skill ainda é experimental: `metadata.version` fica em `0.x`.
- A tarefa ocorreu em outra ferramenta: extraia o mesmo padrão.
- A pessoa corrigiu a abordagem no meio da tarefa: a correção entra na skill e a abordagem anterior sai.
- O material chega colado de outro lugar: sintetize a skill a partir dele do mesmo jeito.
- A operação é sensível ou a sequência é obrigatória: prescreva os passos.
- A operação é destrutiva ou em lote: plano, validação contra a fonte de verdade, e só então a execução.
- O data source muda ou o workspace conectado é outro: a pessoa informa o data source na execução. Se não estiver nessa conexão, pare.
- O fato não óbvio está só em `references/`: traga para `Pegadinhas`.
- A escrita abre ou atualiza o pull request: a conferência do título e da descrição é uma, depois do push.

## Pegadinhas

- Não invente quantidade. Se o número não estiver no material, peça.
- Um nome, uma data ou um alias só entra em `Exemplos de entrada e saída`, depois da frase `Estes exemplos ilustram fatos. Eles podem não estar no data source.` Fora dali, o fato fica no data source. O teste em `features/` e em `evals.json` pode usá-lo.
- O fato que o agente erraria fica em `Pegadinhas`, antes de `Scripts disponíveis`. `references/` só entra se a frase disser quando abrir. Problema não óbvio o agente não reconhece sozinho.
- A primeira versão fica em `0.x`. `1.0.0` pede 3 casos validados com a pessoa.
- Skill sobre escrever skills também sincroniza, e a cópia instalada por dependência ou plugin também é só leitura. A escrita segue `criar-commit` no repositório de origem.
- O workspace conectado pode ser de outra empresa. A skill não carrega banco, página nem workspace. O data source vem na execução. Se não estiver na conexão, pare. Não use o banco que a conexão mostrou no lugar.
- Conferir a cada commit parece necessário. A conferência é uma vez, depois do push.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
