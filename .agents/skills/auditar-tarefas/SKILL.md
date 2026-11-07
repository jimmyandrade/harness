---
name: auditar-tarefas
description: Use essa habilidade sempre que um gatilho em um cronograma, de página adicionada à base de dados ou de propriedade atualizada pedir a revisão de tarefas, ou quando for varrer a lista de tarefas, mesmo sem dizer auditar. NÃO use para cadastrar, revisar a pedido, editar ou mesclar uma tarefa, nem para marcar tarefa como concluída.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-tarefa
---

# Auditar tarefas

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Considerar pessoas consultadas` é `sim` ou `não`.
"Considerar pessoas consultadas": "não"
```
## Instruções

### Passo 1

A lista, o nome de cada propriedade e as opções de status vêm do mapeamento de dados do projeto, no workspace conectado. Se a lista não estiver nessa conexão, pare. Não use a lista de outro workspace. Os critérios de título, prazo, definição de concluído e boa prática são os do Passo 3 de `definir-tarefa`. Gatilho de comentário, página removida, Slack, calendário ou mail não revisa a lista.

### Passo 2

Se o gatilho for recorrente, em um cronograma, varra a lista. Não leia o workspace inteiro. Sinalize e não grave. Sinalize título com prazo, prazo no lugar errado, campo crítico faltando, tarefa que é só boa prática, e definição de concluído ausente, vaga ou que não dá para verificar.

### Passo 3

Se o gatilho for página adicionada à base de dados ou propriedade atualizada na base de dados, revise só essa página. Grave a correção que a regra já determina, como tirar o prazo do nome. Garanta o nome sem prazo, a data no prazo quando houver data, a definição de concluído como checklist, e que boa prática não seja tarefa. Não varra a lista. A correção insegura fica no comentário.

### Passo 4

Se faltar contexto, houver conflito de prioridade, o responsável estiver indefinido ou a intenção estiver em dúvida, não corrija. Comente na tarefa e marque quem responde pela tarefa, ou, sem esse papel, os responsáveis. Com `Considerar pessoas consultadas` em `sim`, marque também as consultadas e peça o parecer delas. O comentário diz o que foi encontrado, por que não corrigiu e qual decisão falta. Não invente a pessoa. Não marque como concluída. Parâmetro em `sim` e a lista sem esse papel: diga isso e siga. Não crie a propriedade.

## Problemas comuns

### Correção insegura

Se você corrigir sem contexto, com conflito de prioridade, sem responsável ou com a intenção em dúvida, a tarefa muda no escuro.

1. Não corrija.
2. Comente o que foi encontrado, por que não corrigiu e qual decisão falta.
3. Marque quem responde pela tarefa, ou, sem esse papel, os responsáveis. Não invente a pessoa.

### Cronograma que grava

Se você gravar a lista num gatilho em um cronograma, a varredura deixa de ser só um sinal.

1. Varra a lista e sinalize.
2. Não grave.
3. Inclua prazo no título, prazo no lugar errado, campo crítico faltando, boa prática sem entrega e definição de concluído ausente, vaga ou que não dá para verificar.

### Página que vira varredura

Se você varrer a lista porque o gatilho foi página adicionada à base de dados ou propriedade atualizada na base de dados, a revisão traz tarefa que o gatilho não pediu.

1. Revise só essa página.
2. Garanta nome sem prazo, data no prazo, checklist e entrega concreta.
3. Não varra a lista.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o gatilho em um cronograma encontra uma tarefa com "amanhã" no título e a definição de concluído vazia.

sinalizo os dois problemas. Não gravo. Se faltar contexto para corrigir, comento e marco quem está nos responsáveis.

### o gatilho propriedade atualizada na base de dados dispara e o título é "Relatório de vendas".

reviso só essa página. O título fica "Escrever relatório de vendas". Não varro a lista.

## Casos-limite

- Gatilho em um cronograma: sinalize e não grave. Página adicionada ou propriedade atualizada: revise só essa página.
- Falta contexto ou a intenção está em dúvida: comente e marque quem responde pela tarefa, ou os responsáveis. Não corrija.

## Pegadinhas

- Um cronograma parece licença para corrigir tudo. Ele só sinaliza.
- Quem executa parece quem decide. A correção insegura vai para quem responde pela tarefa.
- Gatilho de comentário, página removida, Slack, calendário ou mail parece pedir revisão. Não revise a lista.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
