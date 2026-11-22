# language: pt
Funcionalidade: Definir o cliente da loja de uma pessoa
  Toda pessoa da lista tem um cliente na loja, mesmo sem compra, e o link dele fica no registro da pessoa.

  Regra: O link de um cliente da loja é pedido de cadastro

    Exemplo: Cliente novo sem pessoa na lista
      Dado que existe um cliente na loja com nome e telefone
      E que nenhuma pessoa da lista casa pelo nome nem pelo telefone
      Quando a skill recebe o link do cliente
      Então ela cadastra a pessoa por definir-pessoa com o nome e o telefone do cliente
      E grava o link do cliente no campo do cliente na loja
      E não cria outro cliente na loja

  Regra: A busca fica restrita à lista de pessoas

    Exemplo: Busca no workspace inteiro não alcança a lista
      Dado que o workspace tem marcas e reuniões que citam o nome
      Quando a skill procura a pessoa
      Então a busca é restrita à lista de pessoas, pelo nome e pelo telefone

  Regra: Cliente existente é atualizado, não repetido

    Exemplo: Pessoa com cliente já criado
      Dado que a loja tem um cliente com o telefone da pessoa
      Quando a skill precisa do cliente
      Então ela atualiza esse cliente e não cria outro
