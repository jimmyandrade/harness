# language: pt
Funcionalidade: Reforçar o dia da semana junto à data
  A data na resposta sai no formato da data com dia da semana.

  Regra: O dia da semana sai da data, do horário e do fuso

    Exemplo: Data única na resposta
      Dado que existe uma data de compromisso com horário e fuso
      Quando a skill responde sobre essa data
      Então a resposta usa o formato da data com dia da semana
      E o dia da semana foi calculado com a data, o horário e o fuso

    Exemplo: Intervalo de vários dias
      Dado que existe um intervalo com mais de uma data
      Quando a skill responde sobre essas datas
      Então cada data relevante traz o próprio dia da semana

  Regra: Dia da semana divergente na resposta

    Exemplo: A fonte não bate com a data
      Dado que existe uma fonte cujo dia da semana não corresponde à data numérica
      Quando a skill responde sobre essa data
      Então a resposta sinaliza a divergência
      E usa o dia da semana calculado com a data, o horário e o fuso
      Mas a skill não cria nem altera o evento
