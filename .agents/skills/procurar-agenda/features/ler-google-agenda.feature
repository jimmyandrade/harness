# language: pt

Funcionalidade: Ler o dia no Google Agenda
  A agenda operacional é o Google Agenda.
  Ela provavelmente está conectada ao Notion Calendar.
  Criar, revisar e alterar o evento ficam de fora desta consulta.

  Regra: A consulta lê o Google Agenda

    Exemplo: O que tem hoje
      Dado que o Google Agenda está conectado, provavelmente pelo Notion Calendar
      Quando a pessoa pergunta o que tem hoje
      Então a resposta lista o compromisso e o horário que o Google Agenda mostra
      E a resposta não cria, não revisa e não altera o evento

    Exemplo: Google Agenda ausente
      Dado que o Google Agenda não está na conexão
      Quando a pessoa pergunta como está o dia
      Então a consulta para
      E a resposta não inventa horário
