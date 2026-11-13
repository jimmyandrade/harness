# language: pt

Funcionalidade: Acompanhar os itens do ponto de contato

  Regra: o que a organização fornece fica em casa

    Exemplo: a organização fornece uma cadeira e não fornece mesa
      Dado que a oportunidade diz que a organização fornece uma cadeira e não fornece mesa
      Quando a habilidade prepara os itens do ponto
      Então a mesa da empresa ganha uma linha e a cadeira fornecida não

  Regra: cada momento é conferido com a pessoa

    Exemplo: a desmontagem
      Dado que o ponto tem três linhas de itens
      Quando a habilidade confere a desmontagem
      Então ela pergunta item a item e grava só a resposta da pessoa
      E lista na hora o que ficou para trás
