---
name: evoluir-habilidade
description: Use essa habilidade sempre que for testar uma skill, mesmo sem dizer evoluir, inclusive o Gherkin e a comparação com e sem skill, resultado inconsistente, falha de chamada ou correção da pessoa. O teste sempre edita a skill validada. NÃO use para criar a primeira versão, só ver se a descrição dispara, só revisar sem executar, nem gravar a página no Notion. Pedido vindo do Notion segue publicar-habilidade.
metadata:
  author: jimmyandrade
  version: "0.15.5"
  related:
    - descrever-habilidade-ou-schema
    - revisar-habilidade
---

# Evoluir habilidade

## Parâmetros de configuração

```yaml
"Tokens do corpo": 5000
```

## Instruções

### Passo 1

Exija o nome ou o caminho da skill, a tarefa, os arquivos ou links de entrada e as saídas. Se faltar algum, peça antes de avaliar. Um pedido para testar uma skill entra aqui, mesmo sem dizer evoluir.

### Passo 2

O `evals/evals.json` já existe e começa com `evals` vazio. Acrescente um caso só depois que a pessoa executar o prompt com você. Nunca invente um caso.
Cada caso gravado tem `id`, `prompt`, `expected_output` e `files`. `files` fica vazio quando não há arquivo de entrada. O prompt é a mensagem que a pessoa escreveu. O resultado esperado descreve, para uma pessoa, o que foi sucesso nessa execução.
Quando houver mais de um caso, varie a redação, o detalhe e a formalidade. Pelo menos um caso testa um limite. Use o contexto real da execução. A skill só sai de `0.x` depois de 3 casos validados com a pessoa.
Saber se um prompt dispara a skill fica em `descrever-habilidade-ou-schema`. Esse teste entra no mesmo `evals/evals.json`, com `should_trigger` e `split`. Não crie outro arquivo de eval. Para a qualidade da saída, use o caso cujo `expected_output` descreve o resultado da tarefa.
O teste funcional é um arquivo Gherkin em `features/`, um arquivo por funcionalidade. O Gherkin testa o que a pessoa usa. Passo interno, formato do texto e diff não são funcionalidade. Não crie um arquivo por passo. A primeira linha é `# language: pt`. O texto fica em português. As palavras são `Funcionalidade`, `Regra`, `Exemplo`, `Contexto`, `Esquema do Cenário`, `Exemplos`, `Dado`, `Quando`, `Então`, `E` e `Mas`. `Funcionalidade`, `Regra`, `Exemplo`, `Contexto`, `Esquema do Cenário` e `Exemplos` levam dois-pontos. O passo não leva.
Cada critério de aceite que a pessoa enviou vira um `Exemplo`. Grave quando ela enviar. Não invente critério. Ele só conta como validado depois da execução com você.
O `Exemplo` tem de 3 a 5 passos. `Dado` é o contexto já ocorrido. `Quando` é a ação. `Então` é a saída observável. `E` e `Mas` continuam o passo anterior. Saída válida, chamada que sucede, erro tratado e limite entram quando o critério falar disso.
Uma `Regra` agrupa os exemplos da mesma regra. O `Contexto` só repete um `Dado` curto em todos os exemplos da funcionalidade ou da regra. Valores que variam usam `Esquema do Cenário` e `Exemplos`.

```json
{
  "skill_name": "nome-da-skill",
  "evals": []
}
```

### Passo 3

Cada execução começa limpa, sem resto de execução anterior nem do desenvolvimento da skill. O agente segue só as instruções da skill.
Com subagente, cada caso é uma tarefa filha. Sem subagente, use uma sessão separada.
Para cada execução, entregue o caminho da skill, o prompt, os arquivos de entrada e o diretório de saída. Na execução sem skill, não entregue o caminho da skill.

### Passo 4

Rode o caso com a versão atual, com a versão anterior quando ela existir, e sem skill.
Compare sem skill e com skill. Sem skill, a pessoa repete a instrução a cada vez: conte idas e vindas, chamadas que falharam e pediram nova tentativa, e tokens. Com skill, o fluxo executa: conte só as perguntas que ainda faltaram. Os números saem do registro. Não os invente.
Grave o resultado em `workspace/iteration-N/` dentro da skill. Cada caso fica em `eval-{nome}/`. A versão atual e a anterior ficam em `with_skill/{semver}/`. A execução sem skill fica em `without_skill/`.
Dentro de cada uma: `outputs/`, `timing.json` e `grading.json`. O `benchmark.json` fica em `iteration-N/`. Esses JSON nascem nessa comparação. Não os escreva à mão.

### Passo 5

A skill é um documento vivo. A iteração parte do feedback.
Resultado inconsistente, falha de chamada e correção da pessoa: melhore a instrução e acrescente o tratamento do erro.
Subdisparo e sobredisparo vão para `descrever-habilidade-ou-schema`.
O teste sempre edita a skill validada, nesta mesma conversa. Sem essa edição, o teste não vale.
Incorpore todos os resultados, não só as falhas. A edição vem do que a execução mostrou.
Pergunte o que gerou falso positivo, o que passou despercebido e o que pode sair. Se a execução já mostrou a resposta, edite com ela. Quando a pessoa responder o que ainda faltava, edite de novo na mesma conversa.
Leia o registro da execução, não só o resultado final. Se o agente gasta tempo em etapa improdutiva, a instrução está vaga, não se aplica à tarefa, ou oferece opções sem escolha padrão. Se o próximo trecho deixar o corpo sem folga abaixo de `Tokens do corpo`, proponha separar a responsabilidade em outra habilidade antes de escrever. O tamanho e o profiling seguem `medir-habilidade`. O teste e a edição continuam aqui.

### Passo 6

Sempre que a skill for executada, compare os rastros do agente entre os casos. Se ele reinventar sozinho a mesma lógica em cada execução, como gerar um gráfico, analisar um formato ou validar a saída, avise a pessoa.
Proponha um script testado uma vez. Com o aceite, grave em `scripts/` quando só esta skill usa, ou em `.agents/scripts/<nome>/` quando várias usam. Passe a chamá-lo. A lógica deixa de ser reescrita a cada execução. O script que valida as próprias skills é o caso global: a checagem roda igual, em vez de o agente rederivar as regras.

## Problemas comuns

### Falha de execução anotada

Se você vir resultado inconsistente, falha de chamada ou correção da pessoa, e só anotar, a próxima execução repete o erro.

1. Melhore a instrução.
2. Acrescente o tratamento do erro.
3. Subdisparo e sobredisparo vão para `descrever-habilidade-ou-schema`.

### Feedback sem edição

Se você só anotar o teste, ou só anotar o que a pessoa respondeu, e não editar a skill validada, a próxima execução repete o mesmo resultado.

1. Edite a skill validada na mesma conversa do teste.
2. Se a pessoa responder o que ainda faltava, edite de novo.
3. Suba a versão.

### Caso inventado

Se você gravar um caso que a pessoa não enviou e não executou, a skill finge uma validação.

1. Apague o caso.
2. Critério de aceite que a pessoa enviou entra em BDD. Outro caso espera a execução.
3. Ele só conta como validado depois que a pessoa executar o prompt com você. Mantenha a versão em `0.x` até haver 3 casos validados com ela.

### Passo virando feature

Se você gravar um Gherkin para um passo, o formato do texto ou o diff, a skill ganha um teste da escrita e não do que a pessoa usa.

1. Apague o arquivo.
2. Deixe o Gherkin para o que a pessoa usa.
3. Não crie um arquivo por passo.

### Critério fora do Gherkin

Se você deixar o critério de aceite só no passo da skill, ou escrever o teste sem arquivo Gherkin, a execução não tem o que conferir.

1. Grave o critério que a pessoa enviou em `features/`, um arquivo por funcionalidade.
2. Comece com `# language: pt` e use `Funcionalidade`, `Regra`, `Exemplo`, `Dado`, `Quando` e `Então`.
3. Cubra saída válida, chamada que sucede, erro tratado e limite, quando o critério falar disso.

### Gherkin inválido

Se você começar com `# language: pt-br`, escrever as palavras em inglês, ou puser dois-pontos no passo, o arquivo deixa de ser Gherkin.

1. A primeira linha é `# language: pt`.
2. O passo não leva dois-pontos.
3. Mantenha de 3 a 5 passos, com `Então` observável.

### Comparação sem registro

Se você estimar idas e vindas, falhas ou tokens, a comparação não serve.

1. Leia o registro da execução sem skill e com skill.
2. Conte só o que o registro mostra.
3. Se o número não estiver lá, diga que falta.

### Prompt vago

Se você usar um prompt como "processe estes dados", o caso não testa a skill.

1. Reescreva com caminho, coluna ou contexto que a pessoa usaria.
2. Diga no `expected_output` o que é sucesso.
3. Mantenha pelo menos um caso de limite.

### Contexto sujo

Se você reaproveitar a sessão em que a skill foi escrita, o agente não segue só as instruções da skill.

1. Abra uma tarefa filha ou uma sessão nova.
2. Entregue só o caminho da skill, o prompt, os arquivos e o diretório de saída.
3. Na execução sem skill, omita o caminho da skill.

### Só o resultado final

Se você ler só o arquivo gerado e ignorar o registro, a etapa improdutiva fica na skill.

1. Leia o registro da execução.
2. Tire a instrução vaga, a que não se aplica, ou a opção sem padrão.
3. Grave `timing.json` e `grading.json` dessa execução.

### Lógica reinventada

Se você deixar o agente reescrever a mesma lógica em cada caso, a saída muda sem mudança na tarefa.

1. Compare os rastros entre os casos.
2. Avise a pessoa e proponha um script em `scripts/`, ou em `.agents/scripts/<nome>/` se várias skills usam.
3. Com o aceite, teste o script uma vez e passe a chamá-lo.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### teste a skill `resumir-reuniao` 0.2.0, com a ata `ata.md`, e compare com a 0.1.0 e sem skill.

`evals/evals.json` com três casos, um deles informal e um no limite. A rodada grava `workspace/iteration-1/eval-ata-sem-decisao/with_skill/0.2.0/`, `with_skill/0.1.0/` e `without_skill/`.

### compare criar um projeto com 5 tarefas, com skill e sem skill.

Dado o nome "Planejamento do trimestre" e 5 descrições de tarefa. Quando a skill executa o fluxo. Então o projeto existe, as 5 tarefas têm as propriedades certas, estão ligadas ao projeto e não há erro de chamada. Sem skill, o registro mostrou 15 idas e vindas, 3 chamadas que falharam e 12000 tokens. Com skill, o fluxo executou e fez 2 perguntas. Esses números só entram se o registro mostrar.

## Casos-limite

- Não existe versão anterior: rode a versão atual e a execução sem skill.
- Não há subagente: uma sessão separada para cada execução.
- O pedido não traz nome nem caminho da skill: pare e peça nome ou caminho, tarefa, entradas e saídas.
- A mesma lógica aparece numa execução só: não proponha script.
- A pessoa recusa o script: a lógica fica na instrução.
- O script já existe: chame o script em vez de reescrever a lógica.
- O pedido é testar a skill: entra aqui. O teste edita a skill validada na mesma conversa.
- O pedido é saber se um prompt dispara a skill: use `descrever-habilidade-ou-schema`.
- O pedido é só revisar, sem executar: use `revisar-habilidade`.
- O critério já foi enviado e ainda não rodou: grave em BDD e deixe sem validar até a execução.
- O pedido muda um passo, o formato do texto ou o diff: edite a skill. Não grave Gherkin disso.
- A comparação não tem o número no registro: diga que falta.
- O pedido veio do Notion: não edite a página. A escrita segue `publicar-habilidade`.
- O pedido é só o tamanho ou o tempo: use `medir-habilidade`. Não edite a skill.

## Pegadinhas

- A skill parece pronta na primeira versão. Ela é um documento vivo. A iteração parte do feedback.
- "Testar" parece só conferir a saída. O teste edita a skill validada nessa conversa.
- Não invente caso. Critério de aceite que a pessoa enviou entra em BDD. Ele só conta como validado depois da execução com você.
- Um passo, o formato do texto ou o diff parecem funcionalidade. O Gherkin testa o que a pessoa usa. Não crie um arquivo por passo.
- `# language: pt-br` parece o código do português. O Gherkin usa `pt` para essas palavras.
- Cada execução começa limpa, sem a sessão em que a skill foi escrita.
- Consulta de disparo não mede a qualidade da saída. Disparo fica em `descrever-habilidade-ou-schema`.
- A mesma lógica reescrita em cada caso vira script, com o aceite da pessoa. Script de várias skills fica em `.agents/scripts/<nome>/`.
- Pedido vindo do Notion parece permissão para gravar a página. A página é só leitura. Siga `publicar-habilidade`.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
