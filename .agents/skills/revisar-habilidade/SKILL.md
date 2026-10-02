---
name: revisar-habilidade
description: Use essa habilidade sempre que for revisar uma skill já escrita, sinalizar descrição vaga, gatilho faltando ou problema de estrutura, ver risco de disparar demais ou de menos, ou sugerir casos a partir do propósito. NÃO use para criar a primeira versão, executar o teste e editar a skill, só medir tamanho, nem gravar a página no Notion. Pedido vindo do Notion segue publicar-habilidade.
metadata:
  author: jimmyandrade
  version: "0.2.9"
  related:
    - criar-habilidade
    - descrever-habilidade-ou-schema
    - evoluir-habilidade
---

# Revisar habilidade

## Parâmetros de configuração

```yaml
{}
```

## Instruções

### Passo 1

Exija a skill, pelo nome ou pelo texto. Se faltar, peça. Leia a descrição e o corpo. Não revise com conhecimento geral.

### Passo 2

Sinalize descrição vaga, gatilho faltando e problema de estrutura.
Descrição vaga não começa com `Use essa habilidade sempre que`, não fala da intenção de quem pede, ou não fecha com `NÃO use para`. Gatilho faltando não diz quando carregar. Estrutura fora do lugar foge de `Parâmetros de configuração` com um bloco `yaml`, `Instruções` com `Passo 1`, `Passo 2`, e depois `Problemas comuns`, `Exemplos de entrada e saída`, `Casos-limite`, `Pegadinhas` e `Scripts disponíveis`. `Exemplos de entrada e saída` abre com `Estes exemplos ilustram fatos. Eles podem não estar no data source.` Passo com mais de um desfecho traz um flowchart Mermaid no sentido configurado. Um só fica na frase.

### Passo 3

Aponte o risco de disparar demais: a descrição é larga e o `NÃO use para` não cobre o quase-acerto. Aponte o risco de disparar de menos: a descrição fala da mecânica, repete o nome da skill, ou não cobre o pedido parafraseado nem o caso em que a pessoa não nomeia o domínio.

### Passo 4

Sugira a suíte a partir do propósito declarado. Não grave o caso.
Deve disparar: uma tarefa óbvia e um pedido parafraseado, a mesma intenção em outras palavras.
Não deve disparar: um tópico sem relação e um quase-acerto que o propósito não cobre. Se o propósito inclui essa tarefa, a sugestão muda para o lado que deve disparar.
Funcional: cada critério de aceite já escrito, como `Exemplo` Gherkin em português. Cubra saída válida, chamada que sucede, erro tratado e limite, quando o propósito falar disso. Quem grava o arquivo é `evoluir-habilidade`.
Comparação: o mesmo caso sem skill e com skill. Sem skill, idas e vindas, chamadas que falharam e tokens. Com skill, as perguntas que ainda faltaram.
Quem grava e roda o disparo é `descrever-habilidade-ou-schema`. Quem grava o funcional, compara e edita a skill é `evoluir-habilidade`. Quem cria a primeira versão é `criar-habilidade`.

## Problemas comuns

### Revisão que grava o caso

Se você gravar a sugestão no eval, a revisão finge uma validação.

1. Deixe a sugestão na resposta.
2. O disparo segue `descrever-habilidade-ou-schema`.
3. O funcional e a comparação seguem `evoluir-habilidade`.

### Descrição reescrita

Se você reescrever a descrição em vez de sinalizar, a revisão vira outra skill.

1. Aponte o problema.
2. A correção da descrição segue `descrever-habilidade-ou-schema`.
3. A correção que vem de uma execução segue `evoluir-habilidade`.

### Sugestão genérica

Se você sugerir um caso que o propósito não declara, o teste não é desta skill.

1. Leia o propósito na descrição.
2. Sugira só o que esse propósito cobre, e o que ele deixa de fora.
3. Não complete com artigo genérico.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### revise a skill de criar projeto no ProjectHub

Deve disparar: montar um workspace novo, criar um projeto, iniciar um projeto para o planejamento do trimestre. Não deve disparar: o clima, escrever código Python, criar uma planilha, salvo se o propósito incluir planilha. Funcional: Dado o nome "Planejamento do trimestre" e 5 descrições de tarefa. Quando a skill executa. Então o projeto existe, as 5 tarefas têm as propriedades certas, estão ligadas ao projeto e não há erro de chamada. Sem skill, a pessoa repete a instrução, há mais idas e vindas, chamadas que falham e mais tokens. Com skill, o fluxo executa e só pergunta o que falta. A sugestão não entra no eval.

## Casos-limite

- A skill ainda não existe: use `criar-habilidade`.
- O pedido é executar o teste: use `evoluir-habilidade`.
- O pedido é só o disparo: use `descrever-habilidade-ou-schema`.
- O propósito não fala de planilha, chamada ou limite: não sugira esse caso.
- O pedido veio do Notion: não edite a página. A escrita segue `publicar-habilidade`.

## Pegadinhas

- Sugerir caso parece gravar o eval. A sugestão fica na resposta.
- Descrição longa parece sem risco. O risco de disparar demais está no que o `NÃO use para` não cobre.
- Pedido vindo do Notion parece permissão para gravar a página. A página é só leitura. Siga `publicar-habilidade`.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
