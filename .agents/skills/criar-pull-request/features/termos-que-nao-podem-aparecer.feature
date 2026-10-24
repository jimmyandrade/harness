# language: pt

Funcionalidade: Termos que não podem aparecer no pull request
  Um repositório público não pode levar o nome de uma empresa nem de um produto.

  Regra: A busca roda antes de abrir o pull request

    Exemplo: Termo encontrado num arquivo novo
      Dado que o parâmetro lista o termo "acme"
      E que um arquivo novo do pull request contém "Acme"
      Quando a skill vai abrir o pull request
      Então a busca acha o termo sem diferenciar maiúsculas
      E o pull request não é aberto
      E o arquivo volta para correção

    Exemplo: Lista vazia
      Dado que o parâmetro não lista nenhum termo
      Quando a skill vai abrir o pull request
      Então a skill não faz a busca
