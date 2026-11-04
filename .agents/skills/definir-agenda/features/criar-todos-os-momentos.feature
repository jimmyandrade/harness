# language: pt

Funcionalidade: Criar todos os momentos que o pedido lista
  O pedido com vários momentos de um período chega à agenda inteiro.

  Regra: A data não decide se o momento entra

    Exemplo: Momento de data já passada
      Dado que o pedido lista vários momentos de um período
      E um deles tem data já passada
      Quando a skill cria os eventos
      Então ela cria também o momento de data passada
      E não decide pela data se o momento entra
