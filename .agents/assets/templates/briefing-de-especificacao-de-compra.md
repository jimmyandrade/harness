---
name: briefing-de-especificacao-de-compra
description: Formato do briefing que fecha a especificação do que vai ser comprado, com as perguntas por grupo, o que a empresa entrega e combina, e o veredito que vem depois das respostas das empresas.
metadata:
  version: "0.2.0"
---

## Contexto

Use este modelo para entrevistar a pessoa e fechar a especificação de um item, de um serviço ou de um item que a empresa entrega pronto, antes de pesquisar empresas e de pedir orçamento. A habilidade `definir-requisito-de-compra` lê este modelo ao entrevistar e ao gravar o requisito, e `pesquisar-compra` acrescenta a entrada de cada pesquisa ao histórico.

As perguntas abaixo são o ponto de partida. Adapte-as ao que vai ser comprado, tire a que a pessoa já respondeu e acrescente a que o fornecedor costuma perguntar daquele item. Cada resposta entra como a pessoa deu, e o que ela não sabe fica em aberto.

## Formato

# Especificação de <o que vai ser comprado>

**Tipo de compra:** <item entregue pronto pela empresa | item que a pessoa fornece | serviço sobre um item da pessoa>
**Contexto:** <para que serve e como se liga a outros itens ou serviços, e o que fica fora desta compra>
**Objetivo:** <o que a especificação precisa fechar antes do orçamento>
**Restrições:** <o que não se negocia, como prazo, material, resistência ou entrega>
**Novo ou usado:** <apenas novo | apenas usado | tanto faz>
**Teto de custo:** <valor, ou "não definido">
**Estado:** <não iniciada | em andamento | concluída>

## O que vai ser comprado

### 1. Escopo e uso

- Para que serve e onde será usado?
- Quantas variações existem, e uma única serve para todas?
- O que fica fora desta compra, mesmo que pareça parecido?

### 2. Arte e conteúdo

- Que arte, texto ou dado entra, e em que formato ela está (vetor ou imagem)?
- A pessoa fornece o arquivo, ou a empresa cria?

### 3. Aparência

- Tamanho e formato, com a medida de referência e o que decide o tamanho final.
- Cores e fundo, com a referência a reproduzir e a alternativa se a empresa não tiver a cor exata.
- Acabamento.

### 4. Material e resistência

- Material preferido, ou o que a empresa pode sugerir.
- Resistência esperada, como uso, lavagem ou calor.

### 5. Aplicação

- Onde e como o item será aplicado ou usado.
- Há instrução de cuidado a escrever no item, ou ele não leva texto?

### 6. Quantidade

- Quantas unidades são necessárias, e de onde vem o número.
- Quantas por peça ou por uso.
- A empresa informa o pedido mínimo, e o excesso que sobraria se ele passar da quantidade.

### 7. Prazo, entrega e amostra

- Prazo máximo, ou "a combinar".
- Destino e se a retirada no local é uma opção que baixa o custo do frete.
- A amostra aprovada vem antes da produção? Qual o custo e o prazo dela?

### 8. Restrições e teto

- O que não se negocia, em ordem de importância.
- Teto de custo total e custo por unidade esperado.

## O que a empresa entrega e combina

Preencha só o que vale para o tipo de compra.

- O que a empresa fornece e o que a pessoa fornece.
- Preparação do arquivo ou da matriz, com custo, prazo e se ela fica com a pessoa.
- Como o item vem entregue: em rolo, em cartela, solto, cortado ou dobrado.
- Preço por unidade para a quantidade necessária e para o pedido mínimo, e se há faixa por quantidade.
- Prazo de produção depois da amostra aprovada.

## Perguntas em aberto

1. <pergunta que a pessoa ainda não respondeu>
2. <pergunta que depende da amostra ou da resposta da empresa>

## Histórico da pesquisa

Uma entrada por pesquisa, a mais recente primeiro. As entradas antigas ficam.

### <data da pesquisa> — <o que foi pesquisado>

- **Onde buscou:** <fabricante, lojas, guias ou listagens locais>
- **Opções:** <opção — preço, fonte, data da consulta e link>
- **Descartadas:** <opção — motivo>
- **Empresas contatadas:** <empresa — canal e resposta>

## Veredito

Preencha depois das respostas das empresas. Compare por pedido mínimo, prazo, custo por unidade, custo da amostra, atendimento do que foi especificado, e frete ou retirada.

## Estilo

Escreva no idioma da pessoa, com os acentos, e use as medidas e os nomes que ela usou. Cada resposta fica como a pessoa deu, e o que ela não sabe vai para as perguntas em aberto, sem suposição.

Marque o tipo de compra primeiro, porque ele decide quais grupos valem. Uma compra de item entregue pronto não leva a pergunta do que a pessoa fornece, e uma compra de serviço leva a de preparo do arquivo.

O veredito fica vazio até as empresas responderem. Número de negócio, como a quantidade de peças, entra só como resposta, com a origem dele.
