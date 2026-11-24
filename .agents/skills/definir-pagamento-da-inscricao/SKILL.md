---
name: definir-pagamento-da-inscricao
description: Use essa habilidade sempre que for tratar o prazo, o valor, o sinal ou a chave Pix para pagar uma inscrição ou a vaga numa feira ou evento, ou antes de pagar a um terceiro, mesmo sem dizer pagamento. NÃO use para gravar o status da inscrição, lançar a despesa depois de paga, preencher o formulário nem pagar pela pessoa.
allowed-tools: notion:notion-ai-search notion:notion-fetch
compatibility: Precisa de internet e, para conferir o titular, do app de pagamento da empresa aberto no navegador.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-inscricao
    - definir-negociacao
    - definir-tarefa
    - lancar-despesa-da-empresa
    - procurar-email
---

# Definir pagamento da inscrição

## Parâmetros de configuração

```yaml
# `Prazo curto para pagar` é o tempo que falta até o prazo máximo de pagamento, abaixo do qual o prazo conta como em cima da hora. Com o prazo curto, a mensagem à organização não pergunta de desconto nem de condição.
"Prazo curto para pagar": "48 horas"
```

## Instruções

### Passo 1

Ao tratar participação, reserva de vaga, taxa, sinal, boleto ou lista de espera, procure o prazo máximo para responder ou confirmar interesse e o prazo máximo para pagar, e diferencie os dois.

Procure em todas as fontes: propriedades, comentários datados, e-mail por `procurar-email`, canal já registrado, edital, regulamento, formulário, site e PDF. Uma regra relativa, como "até 2 dias após a confirmação", não responde o prazo de confirmação.

Sem data nem regra confiável, sinalize isso antes de qualquer recomendação, sugira perguntar à organização e não considere a participação segura, salvo se já estiver confirmada e paga. Nunca invente a data. Toda pendência acionável vira tarefa por `definir-tarefa`.

### Passo 2

A vaga se confirma depois do pagamento. Antes dele, a mensagem à organização pede só o que falta para pagar, como o valor, a chave Pix e o titular. Depois de enviar o comprovante, ela pede que a organização confirme que a vaga está reservada. Perguntar da reserva antes de pagar não faz sentido.

Para confirmar o valor, a mensagem pede que a organização o informe e não repete o valor que a marca calculou, porque o valor dela pode ser outro e a conta da marca soaria como uma exigência. A conta da marca fica para a pessoa conferir contra a resposta.

Com o prazo de pagamento dentro de `Prazo curto para pagar`, a mensagem não pergunta de desconto nem de outra condição: o desconto que a organização já ofereceu por escrito vale como ela disse, e a mensagem pede só o que falta para pagar. Qualquer dúvida sobre o desconto fica para depois do pagamento, com o comprovante.

### Passo 3

A pessoa só paga depois de conferir o titular da chave. Com a chave Pix em mãos, consulte o nome do titular, o documento e o banco na tela de conferência do app de pagamento da empresa, sem pagar. Pare nessa tela: não confirme valor, não digite senha e feche a aba. Diga à pessoa o que a tela mostrou.

Compare o titular e o banco com o nome da organização e com o que ela informou. Se não batem, ou se a organização não os informou, peça a ela a confirmação do nome do titular e do banco antes do pagamento, e só então devolva a decisão à pessoa. Pagar é sempre a decisão e o ato da pessoa.

### Passo 4

Registre o resultado da consulta como comentário datado na discussão da página da pessoa ou da empresa, por `definir-negociacao`. O pagamento feito vai por `lancar-despesa-da-empresa`.

## Problemas comuns

### Pedido à organização antes do pagamento

Se você perguntar da reserva antes de pagar, escrever o valor da marca no pedido de confirmação ou perguntar do desconto com o prazo curto, a organização estranha o pedido, esconde o valor dela atrás de um sim ou gasta o tempo que falta.

1. Antes do pagamento, peça só o que falta para pagar, e que a organização informe o valor, sem escrever o número da marca.
2. Dentro de `Prazo curto para pagar`, não toque no desconto.
3. Confira a resposta contra a conta da marca: se divergirem, mostre os dois à pessoa e não pague. A reserva e a dúvida do desconto vão na mensagem do comprovante.

### Pagamento sem conferir o titular

Se você entregar a chave Pix sem o titular e o banco, a pessoa paga a um nome que não reconhece e descobre o erro depois.

1. Consulte o titular e o banco na tela de conferência, sem pagar.
2. Compare com o nome da organização e diga o resultado.
3. Sem batida, peça à organização a confirmação do nome e do banco antes do pagamento.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### A Loja Exemplo vai pagar o sinal da feira e a organização passou só a chave Pix, um e-mail.

Consultei a chave na tela de conferência do app de pagamento, sem pagar. O titular era uma pessoa física com um nome diferente do da organização, e o banco não tinha sido informado. Disse isso à pessoa, registrei a consulta na discussão da página da organização e propus pedir à organização o nome do titular e o banco antes do pagamento.

## Casos-limite

- O prazo de pagamento está dentro de `Prazo curto para pagar`: peça só o que falta para pagar, sem perguntar de desconto.
- A organização já informou titular e banco por escrito e a tela mostra os mesmos: diga que batem e devolva a decisão à pessoa.
- A tela de conferência não abre ou pede senha: não digite nada. Diga o que falhou e peça a confirmação à organização.
- A chave é de um CNPJ e o nome da tela é um MEI com o número no nome: é o formato normal desse cadastro. Compare o documento e o banco com o que a organização disse.

## Pegadinhas

- Perguntar da reserva ou do desconto parece prudência antes de pagar. A reserva vem do pagamento, e com o prazo curto o desconto já oferecido por escrito vale como foi dito.
- Consultar a chave parece o primeiro passo de pagar. A tela de conferência só mostra o titular: pagar começa em "Continuar", e quem continua é a pessoa.
- A busca na internet pelo titular costuma voltar vazia para MEI. A tela de conferência do app de pagamento é a fonte.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
