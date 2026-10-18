# language: pt

Funcionalidade: Registrar a despesa reconhecida em uma evidência
  Uma evidência de gasto segue para a busca e o lançamento sem duplicidade.

  Regra: Procurar antes de lançar

    Exemplo: O gasto já está lançado
      Dado que o gasto da evidência já tem um lançamento
      Quando a habilidade procura a despesa
      Então a resposta aponta o lançamento existente
      Mas não cria outra despesa da mesma compra

  Regra: Registrar o gasto da empresa que ainda não existe

    Exemplo: O usuário confirma a despesa
      Dado que o gasto da evidência tem valor e data e ainda não tem lançamento
      E o usuário confirmou que é despesa da empresa
      Quando a habilidade processa a evidência
      Então a despesa é registrada nesta execução

    Exemplo: A despesa é inferível pelo contexto
      Dado que o gasto da evidência tem valor e data e ainda não tem lançamento
      E o contexto permite inferir que é despesa da empresa
      Quando a habilidade processa a evidência
      Então a despesa é registrada sem exigir um pedido escrito de lançamento
