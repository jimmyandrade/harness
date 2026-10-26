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

  Regra: O intervalo vem do pedido

    Exemplo: Pedido sem intervalo
      Dado que "Apelidos de intervalo" tem "semana" e "mês"
      Quando a pessoa pede o resultado sem dizer o intervalo nem o ponto de contato
      Então a skill pergunta qual intervalo, oferecendo os apelidos
      Mas não lê nada antes da resposta

    Exemplo: Apelido de intervalo
      Dado que "Apelidos de intervalo" tem "semana"
      Quando a pessoa pede o resultado da semana passada
      Então a skill converte o apelido nas datas da semana
      E a saída começa pelo intervalo, com o dia da semana de cada data

    Exemplo: Intervalo qualquer
      Dado que a pessoa pede o resultado de 05/10/2026 a 18/10/2026
      Quando a skill gera a saída
      Então a DRE e o fluxo de caixa trazem só esse intervalo
      Mas não pergunta o intervalo

    Exemplo: Mês dividido por semana
      Dado que "Apelidos de intervalo" tem "semana" e "mês"
      Quando a pessoa pede o fluxo de caixa do mês por semana
      Então o fluxo traz uma coluna por semana e o total do mês
      E o saldo final de cada semana é o saldo inicial da seguinte

  Regra: O recorte pode ser um ponto de contato

    Exemplo: Resultado de um ponto de contato
      Dado que "Nome do ponto de contato" é "evento"
      E que os lançamentos estão ligados ao evento na fonte
      Quando a pessoa pede o resultado de um evento
      Então a saída traz só os lançamentos desse evento
      E o intervalo é o do próprio evento, sem pergunta

    Exemplo: Lançamentos sem ligação ao ponto de contato
      Dado que os lançamentos não estão ligados ao ponto de contato na fonte
      Quando a pessoa pede o resultado desse ponto de contato
      Então a skill diz que não consegue recortar
      Mas não estima o resultado
