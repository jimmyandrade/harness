# language: pt
Funcionalidade: Reforçar o dia da semana junto à data
  A data num texto sai no formato da data com dia da semana.
  O campo estruturado permanece válido.

  Regra: O dia da semana sai da data, do horário e do fuso

    Exemplo: A data única na resposta
      Dado que existe uma data de evento com horário e fuso
      Quando a skill escreve essa data
      Então o texto usa o formato da data com dia da semana
      E o dia da semana foi calculado com a data, o horário e o fuso

    Exemplo: Intervalo de vários dias
      Dado que existe um intervalo com mais de uma data
      Quando a skill escreve essas datas
      Então cada data relevante traz o próprio dia da semana

  Regra: Dia da semana divergente para a gravação

    Exemplo: A fonte não bate com a data
      Dado que existe uma fonte cujo dia da semana não corresponde à data numérica
      Quando a skill vai criar ou alterar o evento
      Então ela sinaliza a divergência
      E confirma a informação correta antes de gravar
      Mas o campo estruturado permanece válido
