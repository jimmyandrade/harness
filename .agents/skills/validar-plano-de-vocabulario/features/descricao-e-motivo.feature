# language: pt

Funcionalidade: Separar a explicação da palavra e o motivo de uso
  A descrição explica a palavra e o motivo diz por que usamos.

  Regra: Os dois campos não se misturam

    Exemplo: Termo permitido
      Dado que o termo é permitido
      Quando a skill grava a linha
      Então a descrição explica a palavra
      E o motivo diz por que a marca usa o termo
