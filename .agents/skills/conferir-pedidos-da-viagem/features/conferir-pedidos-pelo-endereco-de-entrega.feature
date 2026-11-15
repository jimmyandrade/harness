# language: pt

Funcionalidade: Conferir os pedidos da viagem pelo endereço de entrega

  Regra: O endereço de entrega decide se o pedido é da viagem

    Exemplo: Pedido entregue na cidade de origem
      Dado que o histórico do aplicativo traz um pedido entregue na cidade de origem no dia da ida
      Quando a pessoa pede para conferir os pedidos da viagem
      Então o agente deixa esse pedido fora da lista de pedidos da viagem
      E não o aponta como despesa faltante

  Regra: Um lançamento sem a viagem não é pedido faltante

    Exemplo: Despesa lançada sem o vínculo com a viagem
      Dado que um pedido entregue no destino tem despesa lançada sem a relação com a viagem
      Quando o agente confere os pedidos da viagem
      Então o agente complementa o vínculo na mesma despesa
      E não cria outro lançamento

  Regra: A reentrega do que faltou não é outro pagamento

    Exemplo: Segundo cartão do mesmo restaurante depois de uma entrega incompleta
      Dado que uma despesa de jantar já está lançada e o histórico traz outro cartão do mesmo restaurante perto da mesma data
      E que a pessoa diz que o restaurante reenviou o que faltou na primeira entrega
      Quando o agente confere os pedidos da viagem
      Então o agente não aponta o segundo cartão como despesa faltante
      E registra na despesa existente que houve duas entregas
