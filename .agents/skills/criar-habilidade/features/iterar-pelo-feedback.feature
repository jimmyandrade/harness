# language: pt

Funcionalidade: Iterar a skill pelo feedback
  A skill é um documento vivo.
  A criação repete enquanto o feedback pedir.

  Regra: O sinal vai para a habilidade que o resolve

    Exemplo: Subdisparo na criação
      Dado uma skill que não carregou quando deveria
      Quando a pessoa pede para criar ou continuar essa skill
      Então o ajuste da descrição segue descrever-habilidade-ou-schema

    Exemplo: Falha de execução na criação
      Dado um resultado inconsistente, uma falha de chamada ou uma correção da pessoa
      Quando a pessoa pede para criar ou continuar essa skill
      Então a instrução segue evoluir-habilidade
