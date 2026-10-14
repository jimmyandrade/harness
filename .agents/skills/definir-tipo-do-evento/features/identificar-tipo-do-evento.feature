# language: pt

Funcionalidade: Identificar o tipo do evento antes de gravar
  Criar, revisar ou alterar a agenda só acontece depois do tipo real.

  Regra: O tipo vem antes de salvar

    Exemplo: Pedido com tipo claro
      Dado que existe um pedido para criar, revisar ou alterar um evento
      E um tipo entre oportunidade, ponto de contato, negócio ou reunião comercial, compromisso interno, prazo, entrega, viagem, custo ou pagamento e reserva provisória
      Quando a skill classifica o pedido
      Então ela identifica esse tipo antes de qualquer gravação
      Mas não manda gravar outro tipo no lugar

    Exemplo: Tipo incerto
      Dado que existe um pedido para criar ou alterar um evento
      E o tipo real não está claro
      Quando a skill classifica o pedido
      Então ela pergunta o tipo
      Mas não cria nem altera o evento
