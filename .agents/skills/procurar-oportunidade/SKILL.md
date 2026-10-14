---
name: procurar-oportunidade
description: Use essa habilidade sempre que for saber se uma oportunidade já existe, mesmo sem dizer oportunidade ou duplicata. Um pedido confirmado, com a edição achada, segue a habilidade que o projeto indicar. NÃO use para cadastrar a oportunidade, organizar a participação, criar a tarefa, nem reconhecer o texto de uma imagem.
allowed-tools: notion:notion-ai-search notion:notion-fetch
compatibility: Precisa de internet. A busca semântica na lista de oportunidades usa notion-ai-search no servidor notion.
metadata:
  author: jimmyandrade
  version: "0.5.1"
  related:
    - criar-oportunidade
---

# Procurar oportunidade

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. `Habilidade do pedido confirmado` vazia quer dizer que a resposta para na edição achada.

```yaml
"Formato da data com dia da semana": "terça-feira, 01/09/2026"
"Habilidade do pedido confirmado": ""
```

## Instruções

### Passo 1

Peça o nome, ou use o texto que a pessoa já passou. O nome da edição e a data são o que se busca. A frase da legenda não é o nome. A lista de oportunidades e o nome de cada propriedade vêm do mapeamento de dados do projeto. Este texto usa os conceitos: o título da edição, as variações de nome e a data da edição. Se a pessoa não indicar outra lista, use a do mapeamento, no workspace conectado. Não peça a lista nesse caso. Se essa lista não estiver nessa conexão, pare. Não use a lista de outro workspace.

### Passo 2

Nessa lista, busque o pedaço do nome no título da edição e nas variações de nome, por consulta direta e por busca semântica. Não exija o título inteiro. Não busque no workspace inteiro. Uma palavra igual não é a edição. Uma palavra comum no texto de outra página não é o nome.

### Passo 3

Leia cada página encontrada. A mesma edição tem o nome, ou uma variação, e a mesma data. A data é a data da edição. Outro mês ou outro ano é outra edição. Se a data da página estiver vazia, mostre a página e diga que a data está vazia. Não invente a data. Não invente o grupo.

### Passo 4

Uma edição com o mesmo nome e a mesma data: ela existe. Mostre o título, a data e o link. Se entrou por uma variação, diga qual. Na mesma resposta, diga o pedaço buscado e que usou as duas buscas. Se o texto é um pedido realizado ou confirmado e as instruções do projeto indicam a `Habilidade do pedido confirmado`, siga essa habilidade nessa mesma resposta. Não pare na edição. Sem essa habilidade, pare na edição achada.

Várias que podem ser a edição: mostre título, data e link de cada uma. Não escolha. Não responda sim.

Nenhuma: diga que ela não existe na lista de oportunidades. Mostre o link da lista. Repita o nome, a data e o lugar buscados, e que usou as duas buscas. Não crie a oportunidade. Não organize a participação. Não crie tarefa. A resposta não pede para nomear a habilidade.

### Passo 5

Data de evento, compromisso, prazo, viagem, reserva, lançamento, entrega ou outro marco, na resposta, no resumo, na tabela ou em outro texto, sai no formato da data com dia da semana. Calcule e confira o dia com a data, o horário e o fuso do evento antes de responder. Sem horário ou sem fuso, e se o dia puder mudar, peça. Não invente. Intervalo ou vários dias: o dia da semana em cada data. Se a fonte trouxer um dia da semana incompatível com a data, sinalize a divergência. Não crie nem altere.

## Problemas comuns

### Palavra em comum

Se você citar uma página que só compartilha uma palavra com o nome, a resposta fala de outra edição.

1. Leia o título da edição e a data.
2. Deixe de fora a página de outro nome.
3. Conte o pedaço buscado e as duas buscas.

### Data de outra edição

Se você tratar o mesmo nome em outro mês ou outro ano como esta edição, duas edições viram uma.

1. Compare com a data da edição.
2. Outra data é outra edição. Mostre as duas se as duas aparecerem.
3. Data vazia: mostre a página e diga que a data está vazia. Não invente.

### Variação ignorada

Se você exigir o título inteiro e ignorar as variações de nome, a edição que já está na lista parece nova.

1. Busque o pedaço também nas variações de nome.
2. Uma variação é a mesma oportunidade.
3. Diga qual variação entrou.

### Legenda como nome

Se você buscar a frase da legenda, a lista não tem a edição e o nome certo fica de fora.

1. O nome é o da edição.
2. A data é a do evento.
3. A frase que convida o público não é o título.

### Criar na mesma habilidade

Se você cadastrar a oportunidade depois de não achar, a verificação vira criação.

1. Diga que ela não existe na lista de oportunidades.
2. Pare. Cadastrar fica com `criar-oportunidade`.

### Lista pedida à toa

Se você pedir a lista quando a pessoa não passou outra, a busca não acontece.

1. Use a lista do mapeamento, no workspace conectado.
2. Busque o pedaço nessa lista.
3. Peça a lista só quando a pessoa indicou outra e ela não está na conexão.

### Busca fora da lista

Se você buscar no workspace inteiro, uma tarefa, uma nota ou outra lista entra no lugar da oportunidade.

1. Busque só na lista de oportunidades.
2. Ignore página que não é dessa lista.

### Data sem o dia da semana

Se você escrever a data numérica sem o dia da semana, ou repetir um dia da semana que não bate com a data, a pessoa lê outra edição.

1. Calcule o dia com a data, o horário e o fuso.
2. Escreva no formato da data com dia da semana em cada data.
3. Se divergir, sinalize. Não crie nem altere.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Festival Rota Sul, entrada gratuita, 29 e 30 de setembro de 2026, 09h às 19h, Centro de Eventos Aurora, Rua das Flores, 100, Cidade Exemplo.

a oportunidade não existe na lista de oportunidades. Mostrei o link da lista. Busquei o pedaço "Rota Sul" e as datas terça-feira, 29/09/2026 e quarta-feira, 30/09/2026, 09h às 19h, no Centro de Eventos Aurora, Rua das Flores, 100, Cidade Exemplo, por consulta direta e por busca semântica. Não criei a oportunidade.

### a fonte diz segunda-feira, 01/09/2026

01/09/2026 é terça-feira. Sinalizei a divergência. Na resposta, usei o formato da data com dia da semana. Não criei a oportunidade.

## Casos-limite

- Várias páginas podem ser a edição: mostre título, data e link de cada uma. Não escolha. Não responda sim.
- O nome bate e a data é outro mês ou outro ano: é outra edição.
- A data da página está vazia: mostre a página e diga que a data está vazia. Não invente.
- O nome está só nas variações de nome: é a mesma oportunidade. Diga a variação.
- A pessoa não diz "oportunidade": o texto com o nome da edição e a data basta.
- A pessoa não passa a lista: use a do mapeamento, no workspace conectado. Não peça.
- A pessoa indicou outra lista e ela não está no workspace conectado: pare e peça a lista certa.
- Nada igual nessa lista: diga que não existe. Não crie. Não busque o workspace inteiro.
- Pedido confirmado e nenhuma `Habilidade do pedido confirmado` nas instruções: pare na edição achada.
- O dia da semana da fonte não bate com a data: sinalize. Não grave.

## Pegadinhas

- Uma palavra do nome, usada como verbo ou adjetivo no texto de outra página, parece o nome. Não é. Outro nome com a mesma palavra é outra oportunidade.
- Outro evento na mesma cidade, no mesmo lugar ou no mesmo mês parece esta edição. O nome e a data decidem.
- "Uma oportunidade para conhecer novidades" parece o título. É a legenda.
- Uma variação nas variações de nome parece apelido solto. É a mesma oportunidade.
- Não achar parece licença para cadastrar. Esta habilidade para na resposta. Cadastrar fica com `criar-oportunidade`.
- Achar a edição parece o fim de um pedido confirmado. Quando as instruções do projeto indicam a `Habilidade do pedido confirmado`, ela segue na mesma resposta.
- Grupo vazio parece pendência desta busca. Esta habilidade não pede o grupo e não preenche.
- A data numérica parece bastar. A resposta leva o dia da semana, calculado com a data, o horário e o fuso.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
