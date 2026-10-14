# language: pt

Funcionalidade: Registrar só os dias de participação
  A agenda não copia o intervalo inteiro da edição.

  Regra: Só entra o dia em que a empresa participa

    Exemplo: Participação em parte dos dias
      Dado que existe uma oportunidade com duração de mais de um dia
      E a empresa participa de apenas parte desses dias
      Quando a skill registra a participação na agenda
      Então a agenda fica só com os dias confirmados ou desejados
      Mas não cadastra todos os dias da edição

    Exemplo: Só o domingo
      Dado que existe uma oportunidade de vários dias
      Quando a pessoa diz que só participa no domingo
      Então a agenda mantém apenas o domingo

    Exemplo: O evento no dia errado
      Dado que existe um evento já criado num dia em que a empresa não participa
      Quando a pessoa corrige os dias de participação
      Então a skill remove ou cancela o evento incorreto
