# language: pt

Funcionalidade: Rastrear o lançamento que originou o ativo
  A despesa aponta a compra do bem durável.

  Exemplo: Compra de bem durável
    Dado que existe um lançamento financeiro que originou a compra de um ativo
    Quando a pessoa pede para rastrear essa compra
    Então a despesa aponta esse lançamento
    Mas não cria a página do ativo
