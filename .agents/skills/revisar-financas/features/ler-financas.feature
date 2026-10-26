# language: pt

Funcionalidade: Ler caixa, DRE, fluxo, auditoria e preço
  A leitura usa o que já está lançado.

  Regra: Sem fonte, a conta não se completa

    Exemplo: Situação do caixa
      Dado que existem lançamentos já registrados na fonte
      Quando a pessoa pede a situação financeira
      Então a resposta começa por tabelas na moeda das instruções do projeto
      E depois traz resumo, alertas e orientações
      Mas não grava lançamento

    Exemplo: DRE e fluxo do ano
      Dado que existe um pedido de DRE e de fluxo de caixa
      Quando a skill gera a saída
      Então a DRE traz os meses e o total anual
      E o fluxo traz saldo inicial, recebimentos, pagamentos, resultado do mês e saldo final acumulado

    Exemplo: Auditoria sem dado suficiente
      Dado que os dados são insuficientes para a auditoria
      Quando a pessoa pede a auditoria
      Então a skill diz o que falta
      Mas não preenche as três partes com estimativa

    Exemplo: Preço sem margem desejada
      Dado que existe um pedido de sugestão de preço
      E a margem desejada não foi dita
      Quando a skill analisa o preço
      Então pergunta a margem
      Mas não inventa o custo

  Regra: O período vem do pedido

    Exemplo: Pedido sem período
      Dado que "Períodos do resultado" tem "mês" e "semana"
      Quando a pessoa pede o resultado sem dizer o período
      Então a skill pergunta se é o semanal ou o mensal
      Mas não lê nada antes da resposta

    Exemplo: Resultado da semana
      Dado que "Períodos do resultado" tem "mês" e "semana"
      Quando a pessoa pede o resultado da semana
      Então a DRE e o fluxo de caixa trazem só essa semana
      E o título diz o primeiro e o último dia da semana, com o dia da semana

    Exemplo: Semanas do mês
      Dado que "Períodos do resultado" tem "mês" e "semana"
      Quando a pessoa pede o fluxo de caixa do mês por semana
      Então o fluxo traz uma coluna por semana e o total do mês
      E o saldo final de cada semana é o saldo inicial da seguinte

    Exemplo: Um período só
      Dado que "Períodos do resultado" tem só "mês"
      Quando a pessoa pede o resultado sem dizer o período
      Então a skill usa o mês e diz isso na resposta
