---
name: procurar-inscricao
description: Use essa habilidade sempre que for saber quem se inscreveu, se a inscrição foi confirmada ou se um ingresso foi retirado, mesmo sem dizer inscrição. NÃO use para saber se a tarefa existe, cadastrar, editar ou concluir a inscrição, nem quando a pessoa afirma que ela foi feita ou confirmada.
allowed-tools: notion:notion-ai-search
compatibility: Precisa de internet. A busca semântica na lista de inscrições usa notion-ai-search no servidor notion.
metadata:
  author: jimmyandrade
  version: "0.9.0"
  aliases:
    - responder-inscricao
  related:
    - definir-inscricao
    - procurar-email
    - definir-grafia
---

# Procurar inscrição

## Parâmetros de configuração

```yaml
{}
```

## Instruções

### Passo 1

A pergunta é sobre inscrição ou retirada de ingresso. A lista de inscrições, o nome de cada propriedade e as opções de status vêm do mapeamento de dados do projeto, no workspace conectado. Se a lista não estiver nessa conexão, pare. Não use a lista de outro workspace. Este texto usa os conceitos: o título, as observações, os participantes, quem fez a inscrição, o status da inscrição, a data da confirmação e a data do envio. Não responda a partir de uma tarefa. Se a pessoa afirmar que a inscrição foi feita ou confirmada, siga `definir-inscricao`. A comemoração fica junto da gravação. Não pare só na comemoração.

### Passo 2

Nessa lista, busque o pedaço no título e nas observações, por consulta direta e por busca semântica. Se o pedaço for um nome, siga `definir-grafia` e busque cada forma da variação, não só o nome do registro. Na frase, escreva a forma correta. Não exija o nome inteiro. Não busque no workspace inteiro.

### Passo 3

Leia cada inscrição encontrada. Os participantes são quem se inscreveu. Quem fez a inscrição é quem registrou a linha. Não troque um pelo outro. Se a nota nomear duas pessoas, diga o fato de cada uma. Quem apresenta não é a pessoa cujo ingresso foi retirado. Na frase, escreva a forma correta do nome. A busca não fica só nessa forma.

### Passo 4

Se houver mais de uma inscrição do mesmo evento, não responda sim. Diga que depende do que a pessoa chama de retirada. Para cada uma, mostre o nome, o status da inscrição, o participante, a data que estiver no registro e o link da página. A data é a data da confirmação. Se ela estiver vazia, use a data do envio. Não invente a data.

Inscrição confirmada de quem apresenta não é retirada de ingresso. Pré-cadastro não é aprovação nem retirada. A aprovação não está no registro. Sugira `procurar-email` para achar a mensagem da organização sobre esse evento. Não busque e-mail nesta habilidade. Oriente também a conferir os outros canais de contato com a organização. Um e-mail de ingresso disponível não aprova o pré-cadastro, a menos que a mensagem diga isso. Se a nota disser que a inscrição de uma pessoa foi um ingresso retirado, diga isso só dessa pessoa e oriente a conferir com a organização se a inscrição permanece válida. Não feche com sim para o evento. Não copie código, número do pedido, valor nem comprovante, a menos que a pessoa tenha pedido esse dado. Uma linha sem o evento no título nem na nota fica fora.

### Passo 5

Se nada for essa inscrição e a pessoa afirmou que ela foi feita ou confirmada, siga `definir-inscricao`. Nos outros casos, diga que ela não está na lista de inscrições. Diga o pedaço buscado e que usou as duas buscas. Não crie inscrição nesta habilidade. Não crie tarefa.

## Problemas comuns

### Confirmação como notícia

Se você só comemorar porque a pessoa disse que a inscrição foi confirmada, o status da página fica para trás.

1. Siga `definir-inscricao`.
2. A gravação vem junto com a comemoração.
3. Não pare só na comemoração.

### Sim único

Se você responder sim porque uma nota diz que um ingresso foi retirado, as outras inscrições do mesmo evento somem.

1. Diga que depende do que a pessoa chama de retirada.
2. Mostre cada inscrição, com status, data e link.
3. Não feche com sim para o evento.

### Pré-cadastro como fato consumado

Se você tratar o pré-cadastro como confirmado ou como retirada, a inscrição que ainda espera resposta vira fato consumado.

1. Diga o status como está.
2. A aprovação não está no registro.
3. Sugira `procurar-email`. Não busque e-mail nesta habilidade.
4. Oriente a conferir os outros canais de contato.

### Retirada fechada

Se você disser que a retirada já aconteceu e parar, a pessoa não sabe se a inscrição continua válida.

1. Diga o que a nota afirma, só da pessoa nomeada.
2. Oriente a conferir com a organização se permanece válida.
3. Não feche com sim para o evento.

### Sim sem pessoa

Se você responder que a retirada já aconteceu sem dizer de quem, a inscrição de quem apresenta e o ingresso de outra pessoa viram um fato só.

1. Diga o nome de cada pessoa que a nota cita.
2. O participante é quem está nos participantes.
3. Não responda sim para o evento inteiro.

### Tarefa no lugar da inscrição

Se você responder a partir de uma tarefa, a observação da tarefa vira o registro da inscrição.

1. Leia a lista de inscrições.
2. A nota da tarefa não decide se o ingresso foi retirado.
3. Não crie tarefa.

### Quem registrou a linha

Se você tratar quem fez a inscrição como o participante, quem gravou a linha vira quem vai ao evento.

1. Os participantes são a pessoa da inscrição.
2. Quem fez a inscrição é quem registrou a linha.
3. Não troque um pelo outro.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### A gente retirou ingresso do Rota Sul?

depende do que se chama de retirada. A inscrição de apresentador no Festival Rota Sul 2026 está confirmada; quem apresenta é Caio Mendes; mostrei a data do registro e o link. A inscrição da Loja Exemplo como expositora está confirmada. A nota que trata a inscrição de Ana Souza como ingresso retirado vale só para ela; orientei a conferir com a organização se permanece válida. Não respondi sim para o evento.

## Casos-limite

- Há mais de uma inscrição do mesmo evento: diga que depende do que se chama de retirada. Mostre cada uma, com status, data e link.
- O status é o de pré-cadastro: não é aprovação nem retirada. Sugira `procurar-email`. Não busque e-mail nesta habilidade. Oriente a conferir os outros canais de contato.
- A pessoa afirma que a inscrição foi feita ou confirmada: siga `definir-inscricao`. A comemoração fica junto da gravação.
- A nota fala de ingresso retirado: vale só para a pessoa nomeada. Oriente a conferir com a organização se permanece válida.
- A nota cita duas pessoas: diga o fato de cada uma. Não junte as duas num sim.
- A pergunta veio depois de saber se a tarefa existe: responda a inscrição. Não diga que a tarefa existe.
- A lista de inscrições não está no workspace conectado: pare. Não use outra lista.
- Nada com esse pedaço, e a pessoa afirmou que a inscrição foi feita ou confirmada: siga `definir-inscricao`. Nos outros casos, diga que não está na lista de inscrições. Não crie inscrição nesta habilidade. Não crie tarefa.

## Pegadinhas

- Quem fez a inscrição não é o participante. Quem fez a inscrição é quem registrou a linha. Quem apresenta e quem retirou o ingresso podem ser pessoas diferentes.
- Um sim para o ingresso parece cobrir o evento. Cada inscrição do mesmo evento é um fato. Pré-cadastro não é confirmação. A nota de retirada não fecha a validade.
- O pré-cadastro sem aprovação parece o fim da pergunta. A mensagem pode estar no e-mail. Sugira `procurar-email`. Não busque a caixa nesta habilidade. Um e-mail de ingresso disponível não aprova o pré-cadastro.
- Dizer que a inscrição foi confirmada parece só notícia. A gravação do status fica em `definir-inscricao`, e a comemoração vem junto. Não pare só na comemoração.
- Não existe propriedade de retirada de ingresso. A retirada está na observação e vale só para a pessoa nomeada naquela frase.
- Comprovantes ficam no arquivo da propriedade. Não entram no corpo da página. Código, número do pedido, valor, status e data não se repetem na observação quando a propriedade existe.
- O status concluído é de tarefa. O status da inscrição é outro. Não troque um pelo outro.
- Não peça para a pessoa nomear a habilidade. Não diga que nomear deixa a busca mais precisa.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
