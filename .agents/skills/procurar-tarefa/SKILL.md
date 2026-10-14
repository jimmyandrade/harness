---
name: procurar-tarefa
description: Use essa habilidade sempre que for saber se uma tarefa sobre um assunto já existe antes de abrir outra, mesmo sem dizer tarefa ou duplicata. NÃO use para criar, editar ou concluir a tarefa, varrer o workspace inteiro sem a pessoa aceitar, nem responder quem se inscreveu ou se o ingresso foi retirado.
allowed-tools: notion:notion-ai-search notion:notion-fetch
compatibility: Precisa de internet. A busca semântica na lista de tarefas usa notion-ai-search no servidor notion.
metadata:
  author: jimmyandrade
  version: "0.9.0"
  aliases:
    - encontrar-tarefa
    - verificar-tarefa-existente
  related:
    - procurar-inscricao
---

# Procurar tarefa

## Parâmetros de configuração

```yaml
{}
```

## Instruções

### Passo 1

Peça o pedaço do assunto. Se a pessoa passar uma lista, use essa. Se a lista não vier, use a lista de tarefas do mapeamento de dados do projeto, no workspace conectado. Não peça a lista nesse caso. O nome de cada propriedade também vem desse mapeamento. Este texto usa os conceitos: o título, o status e as observações da tarefa. Se a lista não estiver nessa conexão, pare. Não use a lista de outro workspace.

### Passo 2

Nessa lista, busque o pedaço no título por consulta direta e por busca semântica. Não exija o nome inteiro. Não busque no workspace inteiro nesta etapa.

### Passo 3

Leia cada título encontrado. Se o título já diz que é a mesma tarefa, ela existe. Mostre o nome, o status e o link. Na mesma resposta, diga o pedaço buscado e que usou as duas buscas.

### Passo 4

Se o pedaço estiver só nas observações e o título for outro, leia as observações e diga se é a mesma tarefa. O título é o sinal. Se não for a mesma, mas a nota trata do mesmo assunto, diga isso e conte a nota. Se a nota for de inscrição ou ingresso, não diga se a retirada aconteceu e não escolha uma das pessoas da nota. Diga que não é a mesma tarefa e siga `procurar-inscricao`. Uma palavra igual de outro assunto fica fora.

### Passo 5

Se nada for a mesma tarefa, diga que ela não existe na lista de tarefas, ou na lista que a pessoa indicou. Diga o pedaço buscado e que usou as duas buscas. Se houve nota parecida e o assunto não for inscrição nem ingresso, conte essa nota. Se não houve, diga que nada parecido apareceu nessa lista. Se o assunto for ingresso ou inscrição, siga `procurar-inscricao`. Não responda se a retirada aconteceu. Não consulte a lista de inscrições nesta habilidade. Nos outros assuntos, pergunte se a pessoa quer busca no workspace inteiro, porque essa busca gasta mais créditos. Não faça essa busca antes do sim. Não crie a tarefa.

## Problemas comuns

### Texto só nas observações

Se você tratar o pedaço nas observações como a mesma tarefa sem ler o que está escrito, uma nota solta vira tarefa repetida.

1. Leia as observações.
2. Diga se é a mesma tarefa ou não.
3. Mostre nome, status e link só quando for a mesma.

### Busca fora da lista

Se você buscar no workspace inteiro, uma nota ou uma reunião entra no lugar da tarefa.

1. Busque só na lista indicada. Sem lista indicada, busque na lista de tarefas do mapeamento.
2. Ignore nota, reunião e página que não são tarefa dessa lista.

### Nome inteiro

Se você exigir o nome completo da tarefa, a busca perde a tarefa cujo título só contém o pedaço do assunto.

1. Busque pelo pedaço do assunto.
2. Leia o título achado antes de decidir.

### Palavra em comum

Se você citar uma tarefa que só compartilha uma palavra com o assunto, a resposta fala de outra tarefa.

1. Não a cite quando for outro assunto.
2. Ingresso e inscrição do mesmo evento não viram a tarefa pedida. Não diga se a retirada aconteceu. Siga `procurar-inscricao`.
3. Conte o pedaço buscado e as duas buscas feitas na lista.

### Lista pedida à toa

Se você pedir a lista quando a pessoa não passou outra, a busca não acontece.

1. Use a lista de tarefas do mapeamento, no workspace conectado.
2. Busque o pedaço nessa lista.
3. Peça a lista só quando a pessoa indicou outra e esse título não está na conexão.

### Nota parecida em silêncio

Se você disser que a tarefa não existe e esconder uma nota que já leu, como o ingresso citado dentro de uma inscrição, a pessoa acha que você não olhou.

1. Diga que não é a mesma tarefa.
2. Conte a nota, com o nome da tarefa em que ela está, quando o assunto não for inscrição nem ingresso.
3. Se a nota for de inscrição ou ingresso, siga `procurar-inscricao`. Não diga se a retirada aconteceu.

### Busca ampla sem pergunta

Se você varrer o workspace inteiro sem a pessoa aceitar, a busca gasta créditos que ela não autorizou.

1. Termine a lista de tarefas antes.
2. Pergunte pela busca no workspace inteiro e diga que ela gasta mais créditos.
3. No assunto ingresso ou inscrição, siga `procurar-inscricao`. Não abra a lista de inscrições nesta habilidade.

### Criar na mesma habilidade

Se você criar a tarefa depois de não achar, a verificação vira criação.

1. Diga que a tarefa não existe.
2. Pare. Criar a tarefa é outra habilidade.

### Sim pela nota

Se você responder que a retirada já aconteceu porque a observação de uma tarefa diz isso, quem apresenta e quem teve o ingresso retirado viram a mesma pessoa.

1. Não responda sim nem não a partir da nota da tarefa.
2. Diga que essa tarefa não é a retirada do ingresso.
3. Siga `procurar-inscricao`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### saber se já existe tarefa sobre cadastrar os domínios no Google Search Console, na lista de tarefas indicada.

a tarefa não existe nessa lista. Nada parecido apareceu. Busquei o pedaço "Search Console" por consulta direta e por busca semântica. Perguntei se quer busca no workspace inteiro, porque gasta mais créditos. Não fiz essa busca. Não criei tarefa.

### procurar-tarefa pra retirar ingresso do festival?

a tarefa não existe na lista de tarefas. A inscrição de apresentador no festival não é a tarefa de retirar o ingresso. Não respondi se a retirada já aconteceu. Segui `procurar-inscricao`. Não busquei o workspace inteiro. Não criei tarefa.

## Casos-limite

- Vários títulos contêm o pedaço: mostre nome, status e link de cada um e diga quais são a mesma tarefa.
- O título é outro e o pedaço está nas observações: leia as observações antes de decidir.
- A pessoa não diz "tarefa": a intenção de saber se o assunto já está na lista basta.
- A pessoa não passa a lista: use a lista de tarefas do mapeamento, no workspace conectado. Não peça.
- A pessoa indicou outra lista e ela não está no workspace conectado: pare e peça a lista certa.
- Nada igual e nada parecido na lista: diga isso e pergunte pela busca no workspace inteiro. Não a faça antes do sim.
- O assunto é ingresso ou inscrição: siga `procurar-inscricao`. Não consulte a lista de inscrições nesta habilidade. Não responda se a retirada aconteceu.

## Pegadinhas

- Uma nota de reunião que cita o assunto não é a tarefa. Na consulta do Search Console, a nota sobre Google Search não era o cadastro do domínio.
- Uma palavra igual não é a mesma tarefa. "Domínio" numa tarefa de catálogo não é o Search Console. Essa tarefa fica fora da resposta. Uma nota que cita duas pessoas traz dois fatos. Responder sim a partir dela mistura quem apresenta com quem teve o ingresso retirado. Essa resposta fica em `procurar-inscricao`.
- A busca no workspace inteiro gasta mais créditos. Pergunte antes, fora de inscrição e ingresso. Nesses assuntos, siga `procurar-inscricao`. Não abra a lista de inscrições nesta habilidade.
- O workspace conectado pode ser de outra empresa. Sem lista indicada, a lista é a do mapeamento. Se a pessoa indicou outra e esse título não está na conexão, pare. Não troque pela lista que a conexão mostrou no lugar.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
