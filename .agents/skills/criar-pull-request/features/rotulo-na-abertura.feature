# language: pt
Funcionalidade: Rótulo na abertura do pull request

  Regra: o pull request nasce com rótulo

    Exemplo: Rotular o PR está ligado
      Dado que Rotular o PR é sim
      E existe um rótulo que descreve a mudança
      Quando a habilidade abre o pull request
      Então o comando de criação já leva esse rótulo
