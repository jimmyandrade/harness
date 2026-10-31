# language: pt

Funcionalidade: Atualizar o saldo do item esgotável
  Entrada e saída mexem no saldo existente.

  Regra: O saldo não nasce do nada

    Exemplo: Entrada com quantidade
      Dado que existe uma entrada de produto com quantidade
      Quando a skill registra o movimento
      Então soma a quantidade ao saldo atual
      E o pagamento segue definir-lancamento-financeiro

    Exemplo: Saída acima do saldo
      Dado que existe uma saída maior que o saldo conhecido
      Quando a skill registra o movimento
      Então pergunta antes de alterar
      Mas não grava saldo negativo

    Exemplo: Reposição sem quantidade
      Dado que existe um pedido de reposição
      E a quantidade a comprar não foi dita
      Quando a skill trata a reposição
      Então informa o saldo
      Mas não inventa o quanto repor
