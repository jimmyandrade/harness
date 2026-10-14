# language: pt
Funcionalidade: Reforçar o dia da semana junto à data
  A data na resposta sai no formato da data com dia da semana.
  O prazo permanece uma data válida e o título continua sem palavra de tempo.

  Regra: O dia da semana sai da data, do horário e do fuso

    Exemplo: Data única na resposta
      Dado que existe um prazo com data, horário e fuso
      Quando a skill responde sobre esse prazo
      Então a resposta usa o formato da data com dia da semana
      E o dia da semana foi calculado com a data, o horário e o fuso

    Exemplo: Intervalo de vários dias
      Dado que existe um intervalo com mais de uma data
      Quando a skill responde sobre essas datas
      Então cada data relevante traz o próprio dia da semana

  Regra: Dia da semana divergente para a gravação

    Exemplo: A fonte não bate com a data
      Dado que existe uma fonte cujo dia da semana não corresponde à data numérica
      Quando a skill vai gravar o prazo
      Então ela sinaliza a divergência
      E confirma a informação correta antes de gravar
      Mas o título continua sem palavra de tempo
