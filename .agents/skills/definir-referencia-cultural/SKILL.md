---
name: definir-referencia-cultural
description: Registra, no banco de referências do projeto, uma fonte sobre uma referência cultural, como palavra indígena, grafismo, mito ou obra, com o nível, o crédito e o uso. Usada quando uma fonte sobre nome, estampa ou conceito é achada, descartada ou procurada de novo, mesmo sem dizer referência. NÃO serve para conferir o significado, escolher o nome nem criar a estampa.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.1"
  related:
    - procurar-banco-de-dados
    - identificar-duplicata
    - definir-localidade-geografica
    - escrever-link
    - conferir-termo-de-lingua-indigena
---

# Definir referência cultural

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Níveis da fonte` lista os níveis, do mais confiável ao menos confiável. Resumo gerado por IA nunca passa de `pista`.
"Níveis da fonte": ["comunidade", "obra de referência", "pesquisa acadêmica", "instituição", "site colaborativo", "pista"]
# `Usos` lista as opções de uso de um símbolo ou nome. `sagrado` e `restrito` pedem consulta à comunidade antes de uso comercial.
"Usos": ["aberto", "restrito", "sagrado", "não conferido"]
```

## Instruções

### Passo 1

O banco de referências e o nome de cada propriedade vêm do mapeamento de dados do projeto. Sem o banco, siga `procurar-banco-de-dados` antes de perguntar. Sem o banco na conexão, pare e não diga que a referência não existe.

### Passo 2

Antes de pesquisar na web, procure no banco pelo termo, pelo povo, pela língua e pelo link da fonte. Siga `identificar-duplicata` para achar a mesma fonte com outro título ou outra grafia. Se já existe, reaproveite o que foi conferido e atualize só o que mudou, sem criar outro registro.

### Passo 3

Registre cada fonte achada, inclusive a que você descartou como prova, com o motivo. Cada registro leva título, tipo, tema, instituição ou autor, link, data da consulta e resumo curto. Escreva no resumo o que a fonte afirma e o que ela não traz, como a palavra que não aparece.
Classifique a fonte em um dos `Níveis da fonte`, diga a língua e o povo de que trata e escolha um dos `Usos`. Um resumo gerado por IA e uma lista de nomes sem autoria ficam como `pista`.
Quando a fonte tem localidade, siga `definir-localidade-geografica`. O link sai como `escrever-link` manda, e o link de uma obra aponta para a obra ou diz que aponta para a página sobre ela.

### Passo 4

Quando a propriedade que o registro pede não existe no banco, como a língua, o povo, o nível da fonte, o uso ou a data da consulta, não crie schema e não escreva esse valor no corpo da página. Liste a propriedade que falta no fim da resposta e sugira criá-la.

### Passo 5

Diga na resposta o link de cada registro criado ou atualizado, o nível de cada fonte e o que ficou sem conferir.

## Problemas comuns

### Fonte descartada que some

Se você registrar só a fonte que serviu, a próxima busca repete o caminho e acha de novo o mesmo site fraco.

1. Registre também a fonte descartada, com o motivo.
2. Marque o nível dela como `pista` ou `site colaborativo`.

### Resumo de IA tratado como fonte

Se você registrar a resposta de um resumo gerado por IA como fonte confirmada, o significado de uma palavra entra no banco sem prova.

1. Registre-o como `pista`, com o que ele afirma.
2. Procure a fonte que ele cita e registre essa fonte à parte.

### Valor no corpo da página

Se você escrever a língua ou o povo no corpo da página por falta de propriedade, o dado some das buscas e dos filtros.

1. Deixe o valor de fora.
2. Liste a propriedade que falta e sugira criá-la.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Registre as fontes que achamos para o nome Poyvi

Procurei no banco antes e não achei fonte sobre a palavra. Registrei quatro: uma página de verbete como pista, um artigo de portal como descartado, o dicionário de tupi antigo como pendente de leitura e a página institucional sobre arte guarani. Cada registro leva o nível, a data da consulta e o que a fonte não traz. Listei as propriedades que faltam no banco: língua, povo, nível da fonte, uso e data da consulta.

## Casos-limite

- A fonte já está no banco com outro título: atualize o registro que existe.
- A fonte é da própria comunidade: marque o nível `comunidade` e dê o crédito a quem a escreveu.
- O símbolo parece sagrado: marque o uso como `sagrado` ou `não conferido` e diga que a comunidade deve ser consultada antes de uso comercial.
- O banco não tem a propriedade do nível da fonte: liste a propriedade que falta e escreva o nível só na resposta.

## Pegadinhas

- Um link para a página da enciclopédia sobre um livro parece o link do livro. É a página sobre a obra: diga isso no resumo.
- Uma fonte que cita a palavra parece confirmar o sentido. Uma lista colaborativa ou um artigo sem autoria só mostra que a palavra circula.
- Uma resposta de IA com links parece uma fonte. Os links dela são as fontes, e a resposta é só a pista.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
