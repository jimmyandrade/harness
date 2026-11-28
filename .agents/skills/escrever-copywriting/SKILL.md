---
name: escrever-copywriting
description: Use essa habilidade sempre que for escrever texto que atrai, converte ou vende a partir de ganchos reais da marca, como comentário público, legenda, headline, assunto de e-mail, texto de divulgação ou abertura de apresentação, mesmo sem dizer copy, copywriting, gancho ou texto persuasivo. NÃO use para escolher as palavras no tom de voz, formatar a legenda do post, publicar nem decidir pela pessoa.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - criar-carrossel-do-instagram
    - criar-ideia-de-conteudo
    - definir-reel-do-instagram
    - escrever-legenda-do-post
    - redigir-com-tom-de-voz
  models:
    - opcoes-de-copywriting
---

# Escrever copywriting

## Parâmetros de configuração

Leia cada valor nas instruções do projeto e no mapeamento de dados, primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Esta habilidade não traz nome de lista nem de página como padrão.

```yaml
# `Fontes de ganchos` lista os caminhos, páginas ou bancos onde o projeto guarda o que a marca tem de real para contar: produto, tecnologia, peça, história, bastidor. Vazio, peça as fontes à pessoa e pare.
"Fontes de ganchos": []
# `Banco de copywriting` é onde o projeto guarda copies prontas, gatilhos e exemplos. Vazio, a habilidade segue só com as fontes de ganchos.
"Banco de copywriting": ""
```

## Instruções

### Passo 1

Copywriting é o texto que atrai, converte ou vende. A voz da marca fica com `redigir-com-tom-de-voz`, o formato do post com `escrever-legenda-do-post`, e esta habilidade não publica nem decide pela pessoa.

Antes de escrever, responda as três perguntas da intenção:

- O que a pessoa que lê precisa entender para agir?
- Como o texto se conecta com ela?
- O texto a faz sentir algo?

Tenha também onde o texto aparece, quem lê e a ação que se quer dela. O que não der para inferir, pergunte uma vez. Para quem lê e não conhece a marca, o texto funciona sem contexto: nada de "como vocês já sabem", de nome interno nem de referência a outro post.

### Passo 2

Leia os ganchos na base do projeto, em `Fontes de ganchos`, e o `Banco de copywriting` quando houver. Sem fonte, peça à pessoa onde está a base e pare. Nunca invente fato.

Um gancho é um destes, em conceito:

- um fato curioso do produto ou da tecnologia;
- uma peça concreta e fácil de procurar;
- a história de criação;
- uma contradição ou uma ironia da marca;
- a conexão com o contexto do texto, como o evento, a data ou quem recebe.

Anote a fonte de cada gancho. Um gancho sem fonte vira pergunta, não texto.

### Passo 3

Entregue 2 ou 3 ângulos diferentes, não a mesma frase com palavras trocadas. Cada ângulo traz o gancho, a fonte, o texto proposto e uma frase que diz por que atrai quem não conhece a marca. A pessoa escolhe. Num texto curto, como um comentário, cada opção é uma frase ou duas.

Leia o modelo de saída `opcoes-de-copywriting` quando for gerar a saída.

### Passo 4

Reprove o texto que parece copy. Valide cada opção antes de mostrar, corrija e repita até passar.

- [ ] Não tem frase que serviria para qualquer marca, como "a melhor opção para você".
- [ ] Não tem convite vazio, como "venha", "vem", "vai estar lá" ou "imperdível".
- [ ] Não tem promessa que ninguém combinou, como desconto, brinde ou prazo.
- [ ] Não afirma fato que a fonte não confirma.
- [ ] O ritmo não é o previsível de abertura com exclamação, adjetivo, convite.
- [ ] Tem um gancho concreto que quem não conhece a marca entende sozinho.
- [ ] Fala com uma pessoa, não tenta agradar todo mundo.

### Passo 5

O que o texto afirma sobre o produto, o evento ou a tecnologia está na fonte ou foi confirmado pela pessoa. O que não está vira pergunta, como "isso vai estar ativo no dia?", e não entra como afirmação.

Pedido com urgência e sem tempo de pesquisar: entregue com o que já está confirmado e diga, no fim, o que ficou sem conferir. Pedido de vender com desconto, brinde ou outra promessa que a pessoa não combinou: recuse a promessa, ofereça o ângulo sem ela e pergunte se a condição existe.

### Passo 6

Depois da escolha, passe o texto por `redigir-com-tom-de-voz`, que ajusta o vocabulário e a frase da marca. Quando o texto é de um post, passe-o também por `escrever-legenda-do-post`. Publicar, comentar ou enviar só com o sim da pessoa para aquele texto.

## Problemas comuns

### Texto raso que parece copy

Se você abrir com elogio, adjetivo e convite, quem não conhece a marca não tem motivo para parar.

1. Volte às fontes e escolha um gancho concreto.
2. Abra com o gancho e deixe o convite para depois, ligado a ele.

### Fato de memória

Se você afirmar um detalhe do produto ou do evento que lembra mas não leu, o texto promete o que a marca pode não cumprir.

1. Confirme na fonte ou pergunte à pessoa.
2. Sem confirmação, o fato sai ou vira pergunta.

### Opções que são a mesma

Se você entregar três opções que mudam só as palavras, a pessoa não tem o que escolher.

1. Parta de um gancho diferente em cada opção.
2. Diga em uma frase o que cada uma ganha.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### escreva um comentário para o post de aniversário da loja coletiva

Opção rasa, reprovada: "Parabéns pelo aniversário! A marca vai estar lá, venha conhecer!". Tem convite vazio e serviria para qualquer marca. Reescrita com gancho real, da ficha técnica de uma peça: "Cinco anos de loja coletiva. A camisa que dispensa passar, a mais pedida da casa, cabe dobrada numa mala de mão." A pessoa recebe mais um ângulo, pela história de criação, e um terceiro que pergunta se a marca terá algo ativo no dia, em vez de afirmar.

### escreva a legenda do lançamento da jaqueta

A opção rasa, "Nova jaqueta, imperdível!", foi reprovada. A reescrita abriu com o fato da fonte, o tecido que não molha sem forro plástico, e a peça foi nomeada de forma fácil de procurar. Depois da escolha, a legenda passou por `redigir-com-tom-de-voz` e por `escrever-legenda-do-post`.

### preciso de um assunto de e-mail para a coleção nova, agora, sem tempo de olhar a base

Entregou 2 assuntos com o que já estava confirmado e disse no fim: "não conferi a data de chegada nem o nome oficial da peça".

## Casos-limite

- Sem fonte de ganchos: peça onde está a base do projeto e pare. Não escreva com gancho de memória.
- Texto muito curto, como um comentário: dê opções de uma ou duas frases, com a fonte no quadro e não no texto.
- Pedido com urgência e sem tempo de pesquisar: entregue o confirmado e diga o que ficou sem conferir.
- Pedido de vender com desconto ou outra promessa não combinada: recuse a promessa e pergunte se a condição existe.
- A base só tem fatos que a pessoa não pode usar, como dado interno: avise e não os use.

## Pegadinhas

- Um texto bonito parece copy boa. Quem não conhece a marca precisa entender o gancho sem contexto.
- O convite parece fechar o texto. Sem gancho antes dele, é um convite vazio.
- A voz da marca parece parte do copywriting. Ela vem depois, de `redigir-com-tom-de-voz`, sobre a opção escolhida.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
