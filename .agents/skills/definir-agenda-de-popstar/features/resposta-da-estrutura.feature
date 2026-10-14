# language: pt

Funcionalidade: Resumir a decisão da estrutura
  Toda resposta resume a decisão e o fuso quando há data ou horário.

  Regra: A resposta não inventa o fuso

    Exemplo: Estrutura com data e fuso
      Dado que existe uma estrutura de carreira com data e fuso
      Quando a resposta é escrita
      Então ela traz um resumo curto da decisão
      E nomeia o fuso usado

    Exemplo: A data sem fuso
      Dado que existe uma data cujo dia pode mudar sem o fuso
      Quando a resposta é escrita
      Então a skill pede o fuso
      Mas ela não inventa o fuso
