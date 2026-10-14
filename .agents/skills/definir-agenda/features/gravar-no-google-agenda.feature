# language: pt

Funcionalidade: Gravar o evento no Google Agenda
  A agenda operacional é o Google Agenda.
  Ela provavelmente está conectada ao Notion Calendar.
  Criar, revisar e alterar o evento acontecem nesse Google Agenda.

  Regra: O evento fica no Google Agenda

    Exemplo: Criar, revisar ou alterar
      Dado que o Google Agenda está conectado, provavelmente pelo Notion Calendar
      E o nome e o horário que a pessoa indicou
      Quando a pessoa pede para criar, revisar ou alterar o evento
      Então o evento fica no Google Agenda com esse nome e esse horário

    Exemplo: Google Agenda ausente
      Dado que o Google Agenda não está na conexão
      Quando a pessoa pede para criar o evento
      Então a gravação para
      E o evento não é inventado
