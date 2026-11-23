---
name: realizar-compra
description: Leva até a tela final o pedido de compra que a pessoa mandou fazer, confere endereço, prazo e nome da nota, decide com ela os extras do checkout, como seguro, e finaliza só com o sim dela ao item, ao total e ao pagamento. Usada quando a pessoa pede para comprar um item já escolhido, mesmo sem dizer checkout. Não serve para pesquisar ou comparar opções, nem para registrar a compra depois de paga.
compatibility: Precisa de navegador.
metadata:
  author: jimmyandrade
  version: "0.1.1"
  related:
    - definir-ativo-imobilizado
    - evoluir-habilidade
    - gerenciar-estoque
    - lancar-despesa-da-empresa
    - pesquisar-compra
---

# Realizar compra

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Confirme que a pessoa pediu a compra deste item. Recomendação, aprovação de uma opção ou "me ajuda a entender se vale a pena" não são o pedido. Sem o pedido, volte a `pesquisar-compra`.

Abra a página do anúncio e confira que o item, o vendedor, a variação, a voltagem e o preço são os que a pessoa escolheu. Diferença de preço ou de variação volta à pessoa antes de seguir.

### Passo 2

Leve o pedido até a tela final de revisão, sem pagar. Use o navegador em que a pessoa já está logada e nunca contorne verificação de conta, captcha ou login: peça que ela os resolva.

Na revisão, leia e guarde o endereço de entrega, a forma e o prazo de entrega, o frete, o total, o nome e o documento da nota, os extras oferecidos e a hora limite da oferta. Confira a entrega com o prazo que a pessoa pediu, como entrega no dia seguinte.

### Passo 3

O que o checkout oferece além do item, como seguro, garantia estendida, assinatura ou frete mais caro, é decisão da pessoa. Não aceite nem recuse sozinho: mostre cada extra, o preço e a opção que o site marca por padrão, e espere a resposta.

A pergunta vem como enquete, com uma alternativa para cada opção do site, com o nome, a cobertura e o preço, e uma para seguir sem o extra. Antes dela, ponha o navegador embutido à frente, aberto na tela do checkout onde as opções aparecem, para a pessoa conferir com os próprios olhos. Texto corrido numa resposta, sem enquete e sem a tela à vista, não conta como perguntar.

O endereço, o nome da nota e o meio de pagamento também são dela. Diga o que o site mostra, aponte o que difere do que a pessoa disse, como a nota em nome de outra pessoa, e espere. Não digite número de cartão, código de segurança, CPF nem senha.

### Passo 4

Antes de pagar, peça o sim da pessoa a três coisas juntas: o item, o total e o meio de pagamento. Só então marque o meio e finalize. Uma aprovação anterior de outro total ou de outro meio não vale.

Depois de finalizar, confira a confirmação do site e diga o número do pedido, o total pago, o endereço e a data de entrega. Sem confirmação visível, diga que o pagamento não foi confirmado e não repita a compra.

### Passo 5

O registro da compra segue o Passo 7 de `pesquisar-compra`: o pagamento vai para `lancar-despesa-da-empresa`, o insumo para `gerenciar-estoque` e o bem durável para `definir-ativo-imobilizado`. Esta habilidade não grava nada.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Extra do checkout decidido sozinho

Se você recusar ou aceitar o seguro, a garantia estendida ou outro extra sem perguntar, a pessoa paga o que não quis ou fica sem a cobertura que queria.

1. Pare na oferta, ponha o checkout à frente no navegador e abra a enquete com cada opção, o preço e a opção que o site marca por padrão.
2. Espere a resposta antes de marcar ou recusar.
3. Só depois siga para o pagamento.

### Pagamento sem o sim ao total

Se você finalizar com a aprovação de uma recomendação, a pessoa paga um total ou um meio que não confirmou.

1. Mostre item, total e meio de pagamento juntos.
2. Espere o sim a esses três.
3. Finalize só depois.

### Nota ou endereço de outra pessoa

Se você seguir sem avisar que a nota sai no nome de outra pessoa ou que o endereço não é o dito, a pessoa descobre depois do pagamento.

1. Compare o que o site mostra com o que ela disse.
2. Aponte a diferença e espere a decisão.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### realize a compra desta impressora, entrega amanhã na minha casa

Abri o anúncio e conferi o item e o preço. Fui até a revisão: endereço, entrega no dia seguinte e total. O checkout ofereceu seguro: deixei a tela das opções à frente e abri a enquete com cada plano e o preço. A nota estava no nome de outra pessoa, e avisei. Perguntei o meio de pagamento e finalizei só depois do sim ao item, ao total e ao meio.

## Casos-limite

- A pessoa só aprovou uma recomendação: não compre, volte a `pesquisar-compra`.
- O total ou a variação mudou desde a aprovação: pergunte de novo.
- A loja pede verificação de conta ou captcha: peça que a pessoa resolva.
- A oferta tem hora limite: diga o prazo, e não pague para ganhar tempo sem o sim.
- A confirmação não aparece: não repita a compra, diga que não foi confirmada.

## Pegadinhas

- Recusar o seguro parece a escolha neutra. É dinheiro da pessoa, e quem decide é ela.
- O endereço da conta parece o da entrega. Confira o que o site mostra e o que a pessoa disse.
- O nome da nota é o da conta logada, que pode não ser o de quem compra.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
