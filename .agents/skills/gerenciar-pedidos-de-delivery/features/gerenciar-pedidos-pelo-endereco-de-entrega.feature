# language: pt

Funcionalidade: Gerenciar os pedidos de delivery pelo endereço de entrega

  Regra: O endereço de entrega decide se o pedido é do recorte

    Exemplo: Pedido entregue na cidade de origem
      Dado que o histórico do aplicativo traz um pedido entregue na cidade de origem no dia da ida de uma viagem
      Quando a pessoa pede para conferir os pedidos da viagem
      Então o agente deixa esse pedido fora da lista de pedidos da viagem
      E não o aponta como despesa faltante

  Regra: Um lançamento fora do recorte não é pedido faltante

    Exemplo: Despesa lançada sem o vínculo com a viagem
      Dado que um pedido entregue no destino tem despesa lançada sem a relação com a viagem
      Quando o agente confere os pedidos da viagem
      Então o agente complementa o vínculo na mesma despesa
      E não cria outro lançamento

  Regra: O recorte pode ser um período, sem viagem

    Exemplo: Pedidos de um mês
      Dado que a pessoa pede para ver se os pedidos de um mês estão lançados
      Quando o agente confere o histórico contra as despesas de alimentação daquele mês
      Então o agente lista cada pedido do mês com a situação de lançamento
      E segue o lançamento só dos que não estão lançados

  Regra: A reentrega do que faltou não é outro pagamento

    Exemplo: Segundo cartão do mesmo restaurante depois de uma entrega incompleta
      Dado que uma despesa de jantar já está lançada e o histórico traz outro cartão do mesmo restaurante perto da mesma data
      E que a pessoa diz que o restaurante reenviou o que faltou na primeira entrega
      Quando o agente confere os pedidos
      Então o agente não aponta o segundo cartão como despesa faltante
      E registra na despesa existente que houve duas entregas

  Regra: Dois pedidos do mesmo restaurante no mesmo dia são outra despesa sem a confirmação de reentrega

    Exemplo: Almoço e jantar no mesmo restaurante
      Dado que o histórico traz dois pedidos do mesmo restaurante no mesmo dia, um criado à tarde e outro à noite
      E que o detalhe do segundo não mostra alteração nem reembolso
      Quando o agente confere os pedidos
      Então o agente trata o segundo como outro pedido
      E segue o lançamento dele como despesa própria

  Regra: O valor pago de um pedido concluído com alteração é o do detalhe final

    Exemplo: Despesa lançada com o total do print feito durante o preparo
      Dado que uma despesa foi lançada com o total do pedido em preparo
      E que o detalhe final mostra o pedido concluído com alteração e um reembolso
      Quando o agente confere os pedidos
      Então o agente compara pelo total do detalhe final
      E pergunta qual valor vale quando o total e o reembolso não fecham
