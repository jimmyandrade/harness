# language: pt
Funcionalidade: Associar a despesa ao veículo sem duplicar a placa
  Regra: A placa permanece no cadastro do veículo
    Exemplo: Combustível de uma viagem associado ao carro
      Dado que a pessoa confirmou o veículo pela placa e a viagem do gasto de combustível
      E o veículo está cadastrado e há relações mapeadas para associar a despesa ao veículo e à viagem
      Quando a despesa de combustível é registrada
      Então a despesa fica associada ao veículo e à viagem para a prestação de contas
      E a placa não é repetida no título, na descrição nem nas observações da despesa
