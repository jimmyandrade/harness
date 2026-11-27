# language: pt

Funcionalidade: Tarifa do pedágio com desconto por frequência
  A pessoa pergunta qual tarifa se aplica a um pedágio com desconto por frequência, e a resposta conta as passagens que os registros provam, sem inventar o valor.

  Exemplo: Passagens provadas pelos registros
    Dado que os registros de despesa e as leituras da viagem mostram passagens anteriores na mesma praça e no mesmo sentido
    Quando a pessoa pergunta a tarifa da passagem de agora
    Então a resposta conta as passagens por praça e por sentido dentro do período do desconto
    E a resposta diz quais passagens os registros provam e quais não

  Exemplo: Passagem sem prova da tag
    Dado que uma passagem anterior não tem despesa lançada nem prova de que foi pela tag
    Quando a skill responde a tarifa
    Então a resposta diz que a passagem de agora pode não ser a primeira do período
    E a resposta indica onde conferir o valor cobrado, como o extrato da tag

  Exemplo: Valor que a concessionária não divulga
    Dado que a concessionária só divulga o valor de algumas passagens
    Quando a passagem de agora cai numa que ela não divulga
    Então a resposta dá o valor que ela publica e a faixa
    E a resposta não inventa o valor intermediário
