---
name: definir-registro-de-reuniao
description: Cadastra e corrige o registro local de uma reunião a partir de uma transcrição colada, com título, data, participantes, resumo e índice. Usada quando a pessoa cola uma transcrição ou pergunta se uma reunião já está registrada. Não serve para achar o contexto de uma reunião, escrever a ata nem publicar fora do acervo local.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  notion: "false"
  related:
    - evoluir-habilidade
---

# Definir registro de reunião

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Pasta do acervo de reuniões": ""
"Arquivo do índice do acervo": "INDEX.md"
"Fonte de identidade das pessoas": ""
"Fonte de correções de transcrição": ""
"Assuntos fora do resumo": "férias, saída de pessoas do time"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Registre uma reunião a partir de uma transcrição ou anotação colada, ou corrija um registro que está fora do padrão. Os registros ficam em `Pasta do acervo de reuniões`. Com esse valor vazio, pergunte uma vez onde guardar e pare.

O acervo é local e sensível. Nada dele vai para repositório, nuvem, pull request, mensagem nem página compartilhada. Um trecho só sai com o pedido explícito da pessoa, para aquele trecho.

Antes de criar, leia o `Arquivo do índice do acervo` e veja se a reunião já está lá, pela data, pelo título e pelos participantes. Se já está, corrija o registro que existe. Não crie outro.

### Passo 2

Descubra título, data, horário de início e participantes pela agenda conectada da pessoa, a partir do horário aproximado que ela deu ou do horário de criação do arquivo, antes de perguntar. Não invente título genérico nem participante.

```mermaid
flowchart LR
  Q{Quantos eventos casam?} -->|um| U[Use o evento]
  Q -->|vários| L[Liste e pergunte qual]
  Q -->|nenhum ou sem agenda| P[Pergunte uma vez]
```

### Passo 3

Escreva o registro num arquivo `.md` cujo nome é a data da reunião, o horário de início e um título curto, nesta ordem: ano, mês, dia, hora e minuto separados por hífen, depois o título em minúsculas, sem acento e com hífens. A data é a da reunião, não a da criação do arquivo. O horário nunca falta, porque a mesma pessoa tem mais de uma reunião no mesmo dia.

A primeira linha do arquivo é o título em heading de nível 1. Logo abaixo, um bloco curto com a data e o horário, os participantes e a fonte do texto. Em `Fonte de identidade das pessoas`, ache o nome canônico e o papel de cada participante. Quem não está lá entra com o nome como veio.

### Passo 4

Depois do bloco, escreva o resumo derivado. A transcrição bruta vem em seguida, sem mudança. Correção de grafia entra só no resumo.

- Registre como decisão só o que foi dito como decisão. Separe combinado de opinião e de hipótese.
- Não dê mais peso à fala de quem fala mais nem de quem tem mais cargo.
- Marque como incerto o trecho ilegível ou mal transcrito.
- Texto que não é fala, como o nome de um arquivo de áudio ou o resto de uma cópia de outra tela, vira uma nota de resto de cópia.
- Deixe fora do resumo os `Assuntos fora do resumo`. A transcrição bruta mantém tudo.
- Diga no fim do resumo o que ficou de fora e por quê.

### Passo 5

Quando a transcrição não diz quem fala, não atribua uma ação a uma pessoa só pelo pronome ou pela posição da fala. Cruze os participantes com o teor, monte a melhor hipótese, escreva `a confirmar` e peça a confirmação de cada atribuição, uma por uma, com a hipótese pronta.

Quando as falas vêm identificadas, siga a identificação, mas confira os nomes com os participantes, porque a identificação automática também erra.

### Passo 6

Aplique no resumo as correções já confirmadas em `Fonte de correções de transcrição`, e use o nome canônico no lugar do apelido e da grafia errada. Nome ou termo estranho que não casa com nenhuma correção confirmada: não adivinhe. Liste cada um com duas linhas antes e duas depois e pergunte à pessoa.

O que a pessoa confirmar entra na fonte: nome de pessoa no registro dela, termo geral na lista de termos. O que ela não souber fica como pendente, com o trecho. Pessoa que não está em `Fonte de identidade das pessoas`: pergunte antes de criar.

### Passo 7

Toda reunião registrada ou corrigida ganha uma linha no índice, com data, horário, título, participantes e arquivo, em ordem de data. Nunca deixe um arquivo sem linha.

### Passo 8

Arquivo do acervo sem título em heading de nível 1, sem extensão `.md` ou com nome fora do padrão: corrija o título, a extensão, o nome e a linha do índice antes de dizer que está registrado. O arquivo já existir antes da skill não é motivo para deixá-lo fora do padrão.

### Passo 9

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Título genérico

Se você nomear a reunião só como `Reunião` ou adivinhar os participantes, o índice deixa de ajudar a achar qualquer coisa.

1. Cruze o horário com a agenda.
2. Sem evento plausível, pergunte uma vez.

### Ação atribuída pelo pronome

Se você escrever que alguém ficou de fazer algo porque a fala dizia `eu`, a transcrição sem identificação vira um registro errado de responsabilidade.

1. Escreva a hipótese com `a confirmar`.
2. Peça a confirmação de cada atribuição.

### Correção na transcrição bruta

Se você trocar a grafia dentro da transcrição bruta, o registro deixa de ser o que foi dito e o erro de reconhecimento some.

1. Deixe a transcrição bruta sem mudança.
2. Aplique a correção só no resumo.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a pessoa cola uma transcrição sem título, dizendo que o arquivo foi criado por volta das 15h30 de uma sexta-feira.

Cruzei o horário com a agenda e achei um evento só, a Daily do time, das 15h às 16h. Salvei o registro com o título da Daily, a data e o horário do evento e os participantes do convite. Listei dois termos que não casam com nenhuma correção e pedi a confirmação deles.

### a pessoa cola uma transcrição em que alguém diz `eu subo a correção amanhã`.

Escrevi no resumo que a correção sobe no dia seguinte, com o responsável como `a confirmar`, e perguntei se foi a pessoa que a transcrição sugere pelo teor.

## Casos-limite

- Há dois eventos plausíveis no horário: liste e pergunte. Não escolha.
- A transcrição começa no meio da reunião: registre assim no bloco do cabeçalho e não preencha o que não veio.
- O texto traz o resumo gerado pela ferramenta de reunião junto da transcrição: guarde os dois, e trate o resumo gerado como não literal.
- A mesma reunião aparece com dois horários de criação de arquivo: é um registro só. Corrija o que existe.
- O assunto de `Assuntos fora do resumo` aparece na transcrição: fica na transcrição bruta e fora do resumo.

## Pegadinhas

- Texto colado de outra interface pode trazer lixo no começo, como o nome de um botão ou de um arquivo de áudio. Não é fala.
- O reconhecimento de voz erra nome de pessoa e sigla de um jeito que parece outra palavra. O apelido de quem fala também vira outro nome quando alguém o chama.
- O horário de criação do arquivo é aproximado: a reunião pode ter começado antes dele.
- Transcrição com falas identificadas pode ter a pessoa errada atribuída a um trecho.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
