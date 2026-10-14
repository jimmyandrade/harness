---
name: procurar-data-significativa
description: Use essa habilidade sempre que for saber quando cai uma data comemorativa, um feriado, um marco, uma sazonalidade ou uma janela, ou se ela já está na lista de datas significativas, mesmo sem dizer procurar. NÃO use para cadastrar, revisar ou alterar o registro, saber o que já está no dia ou na semana, criar ou alterar o evento na agenda, nem gerenciar viagens.
allowed-tools: notion:notion-ai-search notion:notion-fetch notion:notion-query-data-sources
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.5.1"
  related:
    - definir-data-significativa
---

# Procurar data significativa

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. `País do calendário` vazio quer dizer que você pergunta o país antes de seguir a URL do calendário.

```yaml
"Formato da data com dia da semana": "terça-feira, 01/09/2026"
"Título do evento anual": "nome do evento ano"
"URL do calendário": "https://www.timeanddate.com/calendar/?year={year}&country={country}"
"País do calendário": ""
"Uso da URL do calendário": "a que o Notion costuma utilizar, sem se restringir a ela"
```

## Instruções

### Passo 1

Saber quando uma data cai, ou se ela já está na lista de datas significativas, é esta habilidade. Data comemorativa, feriado, marco, sazonalidade, alta temporada, baixa temporada e janela entram aqui, mesmo sem dizer procurar. Cadastrar, revisar e alterar o registro ficam com `definir-data-significativa`. Saber o que já está no dia ou na semana é outra habilidade. Criar ou alterar o evento na agenda é outra habilidade. Se o pedido for gravar, pare. Não crie. Não altere.

### Passo 2

Se a lista não vier, use a lista de datas significativas do mapeamento de dados do projeto, no workspace conectado. Não peça a lista nesse caso. O nome de cada propriedade também vem desse mapeamento. Este texto usa os conceitos: o evento, que é o título, a data, a categoria, a fonte e as observações. Se a lista não estiver nessa conexão, pare. Não use lista de outro workspace. Não busque no workspace inteiro.

### Passo 3

Busque o pedaço do nome no evento, por consulta direta e por busca semântica. Não exija o título inteiro. Evento anual usa o título do evento anual, com o ano no final. Sem o ano na pergunta, cada ano continua um registro. Uma palavra igual não é o evento.

### Passo 4

Leia cada página encontrada. A data é a data do registro. Leia as observações. Outro ano é outro registro. Se a data estiver vazia, mostre a página e diga que a data está vazia. Não invente a data. Não invente a fonte.

### Passo 5

Um registro com o mesmo nome: diga quando cai, no formato da data com dia da semana, com o link do registro. O planejamento que as observações já trazem entra na resposta. Se as observações contradisserem a data, sinalize. Não recite a fonte no lugar da data. Não narre a busca. Não nomeie a habilidade.

Vários anos ou vários registros parecidos: mostre o evento, a data e o link de cada um. Não escolha. Não responda com uma data só.

Nenhum: diga que não está na lista de datas significativas. Outro evento não conta como este. Na mesma resposta, busque a data. Siga o uso da URL do calendário. `{year}` é o ano que a pessoa nomeou. Sem ano no pedido, use o ano corrente e diga qual ano a página cobre. `{country}` é o país do calendário. Sem o país do calendário, pergunte. Marque a data como vinda da web, no formato da data com dia da semana. A data da web não é o registro. Não invente a data. Não crie. Não narre a busca. Não nomeie a habilidade.

### Passo 6

Data na resposta, no resumo, na tabela ou em outro texto sai no formato da data com dia da semana. Calcule e confira o dia com a data, o horário e o fuso antes de responder. A data do registro sem horário é o dia civil. O dia da semana sai dessa data. Sem horário ou sem fuso, e se o dia puder mudar, peça. Não invente. Intervalo ou vários dias: o dia da semana em cada data. Se a fonte trouxer um dia da semana incompatível com a data, sinalize a divergência. Não crie nem altere.

## Problemas comuns

### Data de memória

Se você responder a data que já sabe, sem o registro, a pessoa recebe um marco que não está na lista.

1. Leia a data do registro encontrado.
2. Sem registro, diga que não está na lista de datas significativas.
3. Não invente a data. Não crie o registro.

### Ano misturado

Se você tratar outro ano do mesmo nome como este evento, duas edições viram uma.

1. Compare o ano no título do evento anual e a data do registro.
2. Outro ano é outro registro. Mostre cada um.
3. Sem o ano na pergunta, não escolha um ano.

### Palavra em comum

Se você citar uma página que só compartilha uma palavra com o nome, ou que a busca semântica trouxe na mesma lista, a resposta fala de outro evento.

1. Leia o evento.
2. Deixe de fora a página de outro nome.
3. Conte o pedaço buscado e as duas buscas.

### Resposta só de ficha

Se você só listar o evento, a data, a categoria e o método da busca, a pessoa perde o planejamento que o registro já traz.

1. Diga a data no formato da data com dia da semana, com o link do registro.
2. Inclua o planejamento que as observações já trazem.
3. Não narre a busca. Não nomeie a habilidade.

### Ausência que encerra

Se você só disser que não está cadastrada, a pessoa fica sem a data.

1. Diga que não está na lista de datas significativas.
2. Busque na mesma resposta. Siga o uso da URL do calendário. `{year}` é o ano nomeado, ou o ano corrente. `{country}` é o país do calendário.
3. A data da web não é o registro. Não crie.

### Criar na mesma habilidade

Se você cadastrar o registro ao não achar, a consulta vira cadastro.

1. Pare e siga `definir-data-significativa`.
2. Não crie. Não altere.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Quando será essa data comemorativa?

O registro traz o evento e a data no formato da data com dia da semana, com o link. O planejamento que está nas observações entra na resposta.

### Quando será essa data?

Ela não está na lista de datas significativas. Outro evento não conta como este. Busquei na web e segui o uso da URL do calendário. Marquei a data como vinda da web. Não criei o registro.

### a fonte diz segunda-feira, 01/09/2026

01/09/2026 é terça-feira. Sinalizei a divergência. Na resposta, usei o formato da data com dia da semana. Não criei nem alterei.

## Casos-limite

- A lista de datas significativas não está no workspace conectado: pare.
- Dois anos do mesmo evento: mostre os dois. Não escolha.
- Data vazia: mostre a página e diga que a data está vazia. Não invente.
- Nenhum registro: diga que não está na lista e busque na mesma resposta. Siga o uso da URL do calendário. A data da web não é o registro. Não crie.
- O pedido é cadastrar, revisar ou alterar: pare e siga `definir-data-significativa`.
- O pedido é saber o dia ou a semana: pare. É outra habilidade.
- O pedido é criar ou alterar o evento na agenda: pare. É outra habilidade.
- O dia da semana da fonte não bate com a data: sinalize. Não grave.

## Pegadinhas

- A data parece conhecimento geral. Ela sai da data do registro na lista de datas significativas. Sem o registro, não invente.
- Outro ano parece o mesmo evento. No título do evento anual, o ano no final separa os registros.
- A data numérica parece bastar. A resposta leva o dia da semana, calculado com a data, o horário e o fuso. O campo estruturado continua válido.
- A ficha e o relato da busca parecem a resposta. A pessoa quer a data do registro e o planejamento que as observações já trazem. A resposta não nomeia a habilidade.
- Um nome de data real parece regra. Fora dos exemplos, a habilidade vale para qualquer evento. O fato fica no data source.
- A ausência na lista parece o fim da resposta. Sem o registro, a busca vem na mesma resposta. Siga o uso da URL do calendário. A data da web não vira registro.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
