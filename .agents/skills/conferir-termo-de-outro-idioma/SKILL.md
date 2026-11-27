---
name: conferir-termo-de-outro-idioma
description: Confere o significado de uma palavra de outro idioma, como uma língua indígena, o japonês ou o iorubá, por língua, variedade e grafia, com a fonte de cada afirmação. Usada quando um nome, uma estampa ou um texto cita uma palavra estrangeira com um significado. NÃO serve para escolher o nome, traduzir, registrar a fonte nem decidir se um símbolo é sagrado.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  aliases:
    - conferir-termo-de-lingua-indigena
  related:
    - procurar-banco-de-dados
---

# Conferir termo de outro idioma

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Fontes por confiança` lista os tipos de fonte, do mais confiável ao menos confiável. Resumo gerado por IA nunca passa de pista.
"Fontes por confiança": ["falante ou comunidade", "dicionário ou gramática de referência", "pesquisa acadêmica", "instituição", "site colaborativo", "pista"]
```

## Instruções

### Passo 1

Receba a palavra, o sentido que alguém afirmou e onde ela será usada. Pergunte uma vez a língua e a variedade só quando nenhuma fonte do pedido as diz. Não complete a língua por palpite: tupi antigo, guarani paraguaio, mbyá e nheengatu são línguas e variedades diferentes, e a mesma grafia pode ter sentido diferente em cada uma. Vale para qualquer idioma: o iorubá de Nigéria e o de Benim, o japonês em kanji e em kana.

### Passo 2

Procure o termo no banco de referências do projeto antes de pesquisar na web. Se já foi conferido, use o registro e diga a data da consulta. Sem o banco na conexão, siga com a pesquisa e diga que não consultou o banco.

### Passo 3

Pesquise a palavra por língua e variedade, em fontes dos `Fontes por confiança`, da mais confiável para a menos. Procure também as grafias vizinhas, porque a ortografia muda de uma fonte para outra: a transliteração para o alfabeto latino, como o romaji do japonês, e os sinais que o texto perde, como os tons e os pontos sob as letras do iorubá, mudam o sentido de uma palavra.
Um resumo gerado por IA, uma lista colaborativa e um portal sem autoria são pista: use-os para saber onde procurar e procure a fonte que eles citam.
Uma fonte que só usa a palavra, como um artigo sobre o dia da bandeira de um país, mostra que a palavra circula e não prova o sentido.

### Passo 4

Responda separando em três blocos o que foi conferido, o que é pista e o que não foi conferido. Cada afirmação vem com a língua, a variedade, a fonte e o link. Diga a palavra que não aparece numa fonte de referência que você procurou.
Quando uma palavra só foi achada numa língua, não a atribua a outra. Quando o sentido de uma palavra de símbolo ou de grafismo parece sagrado ou restrito, como um termo ligado a uma religião ou a um povo, diga que a comunidade deve ser consultada antes do uso comercial, e não decida por ela.

### Passo 5

Cada fonte achada, usada ou descartada, é registrada no banco de referências do projeto.

## Problemas comuns

### Sentido de uma língua atribuído a outra

Se você disser que uma palavra do guarani paraguaio vale para o tupi antigo, o nome de uma peça passa a afirmar um sentido que nenhuma fonte confirmou.

1. Diga a língua e a variedade de cada fonte.
2. Procure a palavra na língua que o pedido cita e diga que não achou, se for o caso.

### Resumo de IA tratado como confirmação

Se você repetir como fato o que um resumo gerado por IA afirma, o erro dele entra no nome ou no texto da marca.

1. Trate o resumo como pista.
2. Procure a fonte que ele cita e confira a afirmação nela.

### Grafia sem os sinais da língua

Se você conferir a palavra sem os tons, os acentos ou os caracteres originais, como "ọbẹ̀" escrito "obe", a fonte pode definir outra palavra.

1. Confira a grafia exata do pedido e diga qual sinal falta.
2. Marque como não conferido o sentido que só vale com o sinal que o pedido não trouxe.

### Palavra usada, não explicada

Se você tratar um artigo que usa a palavra como prova do sentido, a fonte só mostra que a palavra circula.

1. Procure uma fonte que defina a palavra.
2. Sem ela, deixe o sentido como não conferido.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Poyvi quer dizer bandeira em tupi-guarani?

Conferi só em páginas sobre o guarani paraguaio e a bandeira do Paraguai, que listam a palavra com o sentido de bandeira. Não achei em dicionário nem em tupi antigo, que é outra língua. Marquei o sentido como pista, listei as fontes com língua e link e disse que falta conferir num dicionário de guarani e de tupi antigo.

### Ọ̀sun quer dizer algo no nome de uma estampa?

Conferi em dicionário de iorubá e em fonte sobre a tradição religiosa. Separei o nome do orixá e o sentido de uma palavra comum de grafia parecida. Marquei o nome como termo que pede consulta à comunidade antes do uso comercial e disse que o sentido da grafia sem os sinais não foi conferido.

## Casos-limite

- A pessoa não diz a língua: pergunte uma vez e pare, quando nenhuma fonte a diz.
- A palavra tem mais de um sentido: liste cada um com a fonte e não escolha.
- A fonte é um falante da comunidade: marque como o nível mais alto e dê o crédito.
- O pedido é escolher entre dois nomes: confira cada palavra e devolva a decisão à pessoa.
- O idioma é uma língua de grande circulação, como o japonês: procure em dicionário e em gramática de referência antes de qualquer site, e não trate uma tradução automática como fonte.

## Pegadinhas

- Uma grafia igual parece a mesma palavra. A ortografia e o sentido mudam entre tupi antigo, guarani e nheengatu, e entre os sistemas de transliteração do japonês.
- O guarani falado hoje parece a continuação direta do tupi antigo. São línguas da mesma família, com palavras que mudaram.
- Uma resposta de IA com links parece uma fonte. Os links são as fontes e a resposta é só a pista.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
