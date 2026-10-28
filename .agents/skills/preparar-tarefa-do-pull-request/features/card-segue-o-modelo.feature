# language: pt
Funcionalidade: Descrição do card segue o modelo do tipo

  Regra: O modelo vale para qualquer card
    Exemplo: A pessoa pede um card de um tipo que tem modelo
      Dado que o tipo do card tem um modelo de descrição
      Quando a pessoa pede para criar o card
      Então o agente lê o modelo do tipo e o formato dos critérios antes de escrever
      E a descrição tem as seções do modelo, na ordem
      E cada critério é um título com "deve" ou "não deve" e os itens Dado que, Quando e Então

    Exemplo: O tipo do card não tem modelo
      Dado que o tipo do card não tem modelo de descrição
      Quando a pessoa pede para criar o card
      Então os critérios usam Dado que, Quando e Então
      E nenhum critério é uma lista solta de bullets
