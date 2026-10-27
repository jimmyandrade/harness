# language: pt

Funcionalidade: Links na descrição do pull request
  Quem lê a descrição abre o run, o job, o pull request e o commit sem procurar o número.

  Regra: Cada citação leva o endereço completo

    Exemplo: Descrição que cita o run que quebrou
      Dado que a descrição cita o run, o job, o pull request e o commit que falhou
      Quando a skill escreve a descrição
      Então cada um aparece como endereço https completo
      E a descrição não fica só com o número ou com o hash
