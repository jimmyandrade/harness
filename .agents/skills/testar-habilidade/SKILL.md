---
name: testar-habilidade
description: Testa uma skill com a tarefa, as entradas e as saídas de uma execução real, grava os casos e o Gherkin e compara a versão atual, a anterior e a execução sem skill. Usada quando a pessoa pede para testar uma skill ou conferir a saída dela, mesmo sem dizer teste. Não serve para mudar uma regra, só ver se a descrição dispara, só revisar sem executar nem medir o tamanho.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - descrever-habilidade-ou-schema
    - evoluir-habilidade
    - medir-habilidade
    - revisar-habilidade
---

# Testar habilidade

## Parâmetros de configuração

```yaml
# `Executar testes` é `sob pedido` ou `sempre`.
"Executar testes": "sob pedido"
"Pasta das habilidades": ".agents/skills"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Exija a skill, pelo nome ou pelo caminho, a tarefa, os arquivos ou links de entrada e as saídas, e peça o que faltar antes de avaliar. A skill fica em `Pasta das habilidades`, no repositório de origem. A cópia que um projeto recebe pronta, por dependência ou plugin, não se edita.

### Passo 2

O `evals/evals.json` já existe e começa com `evals` vazio. Acrescente um caso só depois que a pessoa executar o prompt com você. Nunca invente um caso.
Cada caso gravado tem `id`, `prompt`, `expected_output` e `files`. `files` fica vazio quando não há arquivo de entrada. O prompt é a mensagem que a pessoa escreveu. O resultado esperado descreve, para uma pessoa, o que foi sucesso nessa execução.
Quando houver mais de um caso, varie a redação, o detalhe e a formalidade. Pelo menos um caso testa um limite. Use o contexto real da execução. A skill só sai de `0.x` depois de 3 casos validados com a pessoa.
Saber se um prompt dispara a skill fica em `descrever-habilidade-ou-schema`. Esse teste entra no mesmo `evals/evals.json`, com `should_trigger` e `split`. Não crie outro arquivo de eval. Para a qualidade da saída, use o caso cujo `expected_output` descreve o resultado da tarefa.

O teste funcional é um arquivo Gherkin em `features/`, um arquivo por funcionalidade. O Gherkin testa o que a pessoa usa. Passo interno, formato do texto e diff não são funcionalidade. Não crie um arquivo por passo. A primeira linha é `# language: pt`. O texto fica em português. As palavras são `Funcionalidade`, `Regra`, `Exemplo`, `Contexto`, `Esquema do Cenário`, `Exemplos`, `Dado`, `Quando`, `Então`, `E` e `Mas`. `Funcionalidade`, `Regra`, `Exemplo`, `Contexto`, `Esquema do Cenário` e `Exemplos` levam dois-pontos. O passo não leva.
Cada critério de aceite que a pessoa enviou vira um `Exemplo`. Grave quando ela enviar. Não invente critério. Ele só conta como validado depois da execução com você.
O `Exemplo` tem de 3 a 5 passos. `Dado` é o contexto já ocorrido e abre sempre com `Dado que`: a palavra-chave não concorda com o substantivo. `Quando` é a ação. `Então` é a saída observável. `E` e `Mas` continuam o passo anterior. Saída válida, chamada que sucede, erro tratado e limite entram quando o critério falar disso.
Uma `Regra` agrupa os exemplos da mesma regra. O `Contexto` só repete um `Dado` curto em todos os exemplos da funcionalidade ou da regra. Valores que variam usam `Esquema do Cenário` e `Exemplos`.

```json
{
  "skill_name": "nome-da-skill",
  "evals": []
}
```

### Passo 3

Com `Executar testes` em `sob pedido`, os Passos 3 e 4 só rodam quando a pessoa pede a execução. Sem o pedido, grave o Gherkin e diga numa linha que o caso pode rodar depois. Com `sempre`, eles rodam a cada teste.
Cada execução começa limpa, sem resto de execução anterior nem do desenvolvimento da skill. O agente segue só as instruções da skill.
Com subagente, cada caso é uma tarefa filha. Sem subagente, use uma sessão separada.
Para cada execução, entregue o caminho da skill, o prompt, os arquivos de entrada e o diretório de saída. Na execução sem skill, não entregue o caminho da skill.

### Passo 4

Rode o caso com a versão atual, com a versão anterior quando ela existir, e sem skill.
Compare sem skill e com skill. Sem skill, a pessoa repete a instrução a cada vez: conte idas e vindas, chamadas que falharam e pediram nova tentativa, e tokens. Com skill, o fluxo executa: conte só as perguntas que ainda faltaram. Os números saem do registro. Não os invente.
Grave o resultado em `workspace/iteration-N/` dentro da skill. Cada caso fica em `eval-{nome}/`. A versão atual e a anterior ficam em `with_skill/{semver}/`. A execução sem skill fica em `without_skill/`.
Dentro de cada uma: `outputs/`, `timing.json` e `grading.json`. O `benchmark.json` fica em `iteration-N/`. Esses JSON nascem nessa comparação. Não os escreva à mão.

### Passo 5

O teste edita a skill validada no repositório de origem, nesta mesma conversa, seguindo `evoluir-habilidade`. Sem essa edição, o teste não vale. Incorpore todos os resultados, não só as falhas. Leia o registro da execução, não só o resultado final.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

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
2. Tire a instrução vaga, a que não se aplica, ou a opção sem padrão, seguindo `evoluir-habilidade`.
3. Grave `timing.json` e `grading.json` dessa execução.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### teste a skill `resumir-reuniao` 0.2.0, com a ata `ata.md`, e compare com a 0.1.0 e sem skill.

`evals/evals.json` com três casos, um deles informal e um no limite. A rodada grava `workspace/iteration-1/eval-ata-sem-decisao/with_skill/0.2.0/`, `with_skill/0.1.0/` e `without_skill/`.

### compare criar um projeto com 5 tarefas, com skill e sem skill.

Dado que há o nome "Planejamento do trimestre" e 5 descrições de tarefa. Quando a skill executa o fluxo. Então o projeto existe, as 5 tarefas têm as propriedades certas, estão ligadas ao projeto e não há erro de chamada. Sem skill, o registro mostrou 15 idas e vindas, 3 chamadas que falharam e 12000 tokens. Com skill, o fluxo executou e fez 2 perguntas. Esses números só entram se o registro mostrar.

## Casos-limite

- Não existe versão anterior: rode a versão atual e a execução sem skill.
- Não há subagente: uma sessão separada para cada execução.
- O pedido não traz nome nem caminho da skill, a tarefa, as entradas ou as saídas: pare e peça.
- O pedido é saber se um prompt dispara a skill: use `descrever-habilidade-ou-schema`.
- O pedido é só revisar, sem executar: use `revisar-habilidade`.
- O pedido muda uma regra, sem teste: use `evoluir-habilidade`.
- O critério já foi enviado e ainda não rodou: grave em BDD e deixe sem validar até a execução. Com `Executar testes` em `sob pedido`, a execução espera o pedido da pessoa.
- A comparação não tem o número no registro: diga que falta.
- O pedido é só o tamanho ou o tempo: use `medir-habilidade`.

## Pegadinhas

- "Testar" parece só conferir a saída. O teste edita a skill validada no repositório de origem, nessa conversa, por `evoluir-habilidade`.
- Um critério novo parece pedir a rodada de execuções. Com `Executar testes` em `sob pedido`, ela espera o pedido da pessoa, porque cada rodada gasta muitos tokens.
- Não invente caso. Critério de aceite que a pessoa enviou entra em BDD. Ele só conta como validado depois da execução com você.
- Um passo, o formato do texto ou o diff parecem funcionalidade. O Gherkin testa o que a pessoa usa. Não crie um arquivo por passo.
- `# language: pt-br` parece o código do português. O Gherkin usa `pt` para essas palavras.
- Cada execução começa limpa, sem a sessão em que a skill foi escrita.
- Consulta de disparo não mede a qualidade da saída. Disparo fica em `descrever-habilidade-ou-schema`.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
