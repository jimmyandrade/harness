---
name: definir-idioma-da-conversa
description: Define o idioma em que se escreve um texto dirigido a uma pessoa, a tradução recolhível e se o texto leva a frase sobre o idioma. Usada antes de escrever uma revisão, uma resposta ou uma mensagem quando o idioma de quem recebe não está dito. Não serve para o idioma de PR, commit ou documento do projeto, nem para traduzir.
metadata:
  author: jimmyandrade
  version: "0.1.1"
  related:
    - definir-pessoa
    - evoluir-habilidade
---

# Definir idioma da conversa

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. Quem chama pode passar o valor, e ele vale mais.
```yaml
# `Idioma sem preferência conhecida` é o idioma de quem não tem preferência nem histórico, como `o idioma do projeto` ou o nome de um idioma.
"Idioma sem preferência conhecida": "o idioma do projeto"
# `Idioma pelo histórico` diz como decidir pelo que a pessoa já escreveu. O padrão usa o idioma que predomina. Uma regra de limiar, como "se o português é metade ou mais, inglês com tradução recolhida em português; abaixo disso, só inglês, de forma provisória", vale no lugar.
"Idioma pelo histórico": "o idioma que predomina"
# `Gravar o idioma levantado` é `sim` ou `não`. Com `sim`, grava no registro da pessoa o que o histórico mostrou.
"Gravar o idioma levantado": "não"
# `Frase sobre o idioma` é `sim` ou `não`. Com `sim`, o texto diz numa frase em que idioma foi escrito, com a redação do vocabulário.
"Frase sobre o idioma": "sim"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Leia a preferência da pessoa no registro dela, com `definir-pessoa`. Ela é um idioma só, ou um idioma com a tradução recolhível em outro. Uma preferência que a pessoa disse, ou que já se estabeleceu, nunca é sobrescrita por histórico nem por padrão.

### Passo 2

Sem preferência, levante o que a pessoa escreveu em conversas do mesmo tipo do texto, que quem chama indica, como as revisões que ela publicou nos PRs de outras pessoas e nos seus. Ignore código, crases e links. Decida por `Idioma pelo histórico`.
O histórico sozinho nunca decide que o texto sai no idioma da própria pessoa com tradução no outro: isso só vem de uma preferência dita por ela.
Com `Gravar o idioma levantado` em `sim`, grave no registro da pessoa o idioma, que veio do histórico, a proporção e uma amostra. Nunca diga a proporção em texto publicado.

### Passo 3

Sem histórico, use `Idioma sem preferência conhecida`.

### Passo 4

Devolva a quem chamou três coisas: o idioma principal, a tradução recolhível, se houver, e se o texto leva a frase sobre o idioma.
Com tradução recolhível, o texto principal vem no primeiro idioma e a tradução logo abaixo, dentro de um bloco recolhido, com a mesma voz. Código, nomes de arquivo e identificadores ficam iguais.
Com `Frase sobre o idioma` em `sim`, o texto diz numa frase, uma vez por rodada, em que idioma foi escrito. A redação da frase vem do vocabulário: busque a expressão com `lookup_terms` antes de escrever e use a alternativa que ele indica para o caso, preferência dita ou levantada pelo histórico. Nunca a escreva de memória nem copie uma redação de rascunho anterior, porque o vocabulário proíbe redações que já saíram. Nunca diga de onde veio a preferência nem que foi combinada em privado.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Preferência trocada pelo histórico

Se você escolher o idioma pelo que a pessoa escreveu quando o registro dela já manda um idioma, o texto sai no idioma errado e a pessoa percebe que a preferência não foi lida.

1. Leia o registro antes de olhar o histórico.
2. Use o histórico só sem preferência.

### Tradução decidida pelo histórico

Se você oferecer a tradução recolhível porque a pessoa escreve em dois idiomas, o texto fica com um bloco que ela nunca pediu.

1. Tradução recolhível só vem de preferência dita pela pessoa.
2. Pelo histórico, o texto sai num idioma só.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Em que idioma escrevo a revisão do PR da Ana?

O registro dela não tinha preferência. Li as revisões que ela publicou, sem contar código nem links, e o inglês predominou. Devolvi inglês, sem tradução, com a frase sobre o idioma. Não gravei nada no registro, porque `Gravar o idioma levantado` estava em `não`.

### Responda ao comentário do Caio

O registro dele diz português com a tradução recolhível em inglês. Devolvi português, a tradução em inglês num bloco recolhido e a frase sobre o idioma. Não olhei o histórico.

## Casos-limite

- A pessoa não tem registro: siga pelo histórico e, sem ele, pelo padrão.
- O histórico está vazio ou só tem código e links: use `Idioma sem preferência conhecida`.
- O idioma é do PR, do commit ou de um documento do projeto: não use esta habilidade. O parâmetro do projeto decide.

## Pegadinhas

- Aprovação sem texto não conta como o que a pessoa escreveu.
- A proporção do histórico fica no registro. Em texto publicado, nunca.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
