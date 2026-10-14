---
name: definir-recurso-de-aprendizado
description: Use essa habilidade sempre que for saber se uma aula, formação, oficina, curso ou recurso de aprendizado já existe, ou for criar ou atualizar a página desse recurso na lista de recursos de aprendizado, ligada à oportunidade, mesmo sem dizer recurso. NÃO use para saber o que tem no dia ou na semana, criar ou alterar o evento no Google Agenda, cadastrar a oportunidade, organizar o ponto de contato, nem criar a tarefa.
allowed-tools: notion:notion-ai-search notion:notion-fetch notion:notion-create-pages notion:notion-update-page
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.4.0"
  related:
    - definir-agenda
    - procurar-agenda
---

# Definir recurso de aprendizado

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Formato da data com dia da semana": "terça-feira, 01/09/2026"
```

## Instruções

### Passo 1

As listas e o nome de cada propriedade vêm do mapeamento de dados do projeto. Aula, formação, oficina, curso e recurso de aprendizado são esta habilidade. A página fica na lista de recursos de aprendizado, ligada à oportunidade. Nela ficam a transcrição e as anotações. A aula pode ser online ou presencial. A diferença entre as duas espera o que a pessoa ensinar. Não complete essa diferença.
Saber o que tem no dia ou na semana fica com `procurar-agenda`. Criar, revisar ou alterar o evento no Google Agenda fica com `definir-agenda`. Se o pedido for só isso, pare.

### Passo 2

A aula fica nos dois lugares: a página na lista de recursos de aprendizado e o evento no Google Agenda. A agenda operacional é o Google Agenda, provavelmente conectada ao Notion Calendar. Sem o banco ou sem o Google Agenda na conexão, pare. Não conclua que o recurso não existe.

### Passo 3

Se a pessoa pergunta se a aula, o dia de módulo, o encontro, a oficina, o curso ou o recurso já existe, busque na lista de recursos de aprendizado. Se não achar e houver oportunidade, grupo, módulo, curso, data aproximada ou nome do evento, cheque o Google Agenda antes de responder. Busque variações do título: Dia 1, DIA 1, Aula 1, Módulo 4, nome do programa, nome do grupo, organização e datas próximas.

### Passo 4

Se achar o evento, use data, horário de início, horário de fim, título, localização, link de reunião e descrição como evidência para criar ou atualizar a página. Vincule à oportunidade ou ao grupo canônico quando a relação for clara. Não crie item solto. Preencha a data e hora com início e fim. Status segue o contexto atual: Em andamento quando o módulo ainda estiver acontecendo. Ordem lógica segue os itens que já existem. Não peça dado que a agenda já traz, salvo conflito, ambiguidade ou ausência de início ou fim. Só diga que não está cadastrado depois de checar o banco e a agenda, quando a intenção envolver evento ou aula já agendados.

### Passo 5

A data de evento, compromisso, prazo, viagem, reserva, lançamento, entrega ou outro marco, na resposta, no resumo, na tabela, na descrição ou em outro texto, sai no formato da data com dia da semana. Calcule e confira o dia com a data, o horário e o fuso do evento antes de escrever. Sem horário ou sem fuso, e se o dia puder mudar, peça. Não invente. Intervalo ou vários dias: o dia da semana em cada data. Se a fonte trouxer um dia da semana incompatível com a data, sinalize e confirme antes de criar ou alterar a página. A data e hora permanece início e fim válidos. O dia da semana é a camada extra para a pessoa.

## Problemas comuns

### Conclusão sem a agenda

Se você disser que o recurso não existe só porque a lista de recursos de aprendizado não achou, a aula que já está no Google Agenda fica sem página.

1. Cheque o Google Agenda antes de responder.
2. Busque as variações do título e as datas próximas.
3. Só diga que não está cadastrado depois das duas checagens.

### Página sem o evento

Se você criar a página e deixar o evento de fora, a aula deixa de estar nos dois lugares.

1. O evento no Google Agenda fica com `definir-agenda`.
2. A página copia data, início, fim, título, localização, link e descrição desse evento.
3. Sem o Google Agenda na conexão, pare.

### Item solto

Se você criar a página sem a oportunidade ou o grupo quando a relação é clara, a transcrição fica fora do lugar.

1. Vincule à oportunidade ou ao grupo canônico.
2. Sem relação clara, pergunte. Não crie item solto.

### Online e presencial misturados

Se você inventar o procedimento de aula online ou presencial, a página nasce de um detalhe que a pessoa ainda não ensinou.

1. Registre que a aula pode ser online ou presencial.
2. Espere a pessoa ensinar a diferença.
3. Não complete essa diferença.

### Data sem o dia da semana

Se você escrever a data numérica sem o dia da semana, ou aceitar um dia da semana que não bate com a data, a pessoa lê a aula errada.

1. Calcule o dia com a data, o horário e o fuso.
2. Escreva no formato da data com dia da semana em cada data.
3. Se divergir, sinalize e confirme antes de criar ou alterar a página. A data e hora permanece início e fim válidos.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Essa aula já está na lista de recursos de aprendizado? tem o grupo e a data aproximada

Busquei na lista de recursos de aprendizado. Não achei. Chequei o Google Agenda por Dia 1, Aula 1, Módulo, nome do grupo e datas próximas. Achei o evento. Criei ou atualizei a página com data, início, fim, título, local, link e descrição, ligada à oportunidade. Não pedi o que a agenda já trazia.

### vai ter formação hoje?

Isso é o dia. Fica com `procurar-agenda`. A página da formação, quando a pessoa for participar, fica aqui.

### a fonte diz segunda-feira, 01/09/2026

01/09/2026 é terça-feira. Sinalizei a divergência e confirmei antes de criar ou alterar a página. A data e hora ficou com início e fim válidos. Na resposta, usei o formato da data com dia da semana.

## Casos-limite

- O pedido é saber o que tem no dia ou na semana: pare e siga `procurar-agenda`.
- O pedido é criar ou alterar o evento no Google Agenda: pare e siga `definir-agenda`.
- A lista de recursos de aprendizado ou o Google Agenda não está na conexão: pare. Não conclua que não existe.
- Há mais de um evento possível: nomeie e pergunte. Não escolha.
- Falta início ou fim, ou os dados conflitam: peça só isso.
- A relação com a oportunidade ou o grupo não é clara: pergunte. Não crie item solto.
- A pessoa ainda não ensinou a diferença entre online e presencial: não invente.
- O dia da semana da fonte não bate com a data: sinalize e confirme. Não grave a página.

## Pegadinhas

- A aula parece só um evento da agenda. Ela também é uma página na lista de recursos de aprendizado, ligada à oportunidade, para a transcrição e as anotações.
- O Notion Calendar parece outra agenda. A agenda operacional é o Google Agenda. O Notion Calendar é a conexão provável.
- Um banco vazio parece resposta. A conclusão espera a checagem da agenda.
- Online e presencial parecem procedimentos prontos. A diferença espera o que a pessoa ensinar.
- A data numérica parece bastar. O texto leva o dia da semana, calculado com a data, o horário e o fuso. A data e hora continua início e fim válidos.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
