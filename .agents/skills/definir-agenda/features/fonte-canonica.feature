# language: pt

Funcionalidade: Checar a fonte canônica antes de alterar a agenda
  A alteração de um evento ligado a uma página no Notion lê essa página antes.

  Regra: A página canônica vem antes da memória e do título do calendário

    Exemplo: Revisão de evento ligado
      Dado que existe um evento de agenda ligado a uma oportunidade, um negócio ou um ponto de contato
      Quando a pessoa pede revisão ou alteração
      Então a skill consulta a fonte canônica no Notion antes de mudar título, horário, data, local ou contexto
      E prioriza a propriedade estruturada que a página já tem
      Mas não usa só memória, título do calendário ou inferência solta

  Regra: A fonte é a página do time dono do evento

    Exemplo: Duas páginas trazem a data
      Dado que a data do evento aparece numa página do próprio time e na de outro time
      Quando a skill escolhe a fonte
      Então ela usa e cita a página do próprio time
      Mas só usa a de outro time se a do próprio time não traz a data
