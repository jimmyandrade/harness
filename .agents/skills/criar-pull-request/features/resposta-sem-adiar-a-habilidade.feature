# language: pt
Funcionalidade: Resposta sobre o pull request

  Regra: a resposta diz se a habilidade foi usada

    Exemplo: a pessoa pergunta se a habilidade foi usada
      Dado que o pull request foi aberto com criar-pull-request
      Quando a pessoa pergunta se essa habilidade foi usada
      Então a resposta diz que ela foi usada
      E a resposta não contém a expressão ficou para este pedido
