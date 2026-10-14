# language: pt

Funcionalidade: Usar data e horário da fonte mais confiável
  Agenda e Notion divergentes não ficam com o horário mais fraco.

  Regra: A fonte canônica prevalece sobre a agenda

    Exemplo: Várias fontes com horários diferentes
      Dado que existem data e horário em oportunidade, inscrição, negócio, ponto de contato, site, formulário, e-mail ou conversa
      Quando a agenda e o Notion divergem
      Então a skill prioriza a fonte canônica mais confiável e mais recente

    Exemplo: A oportunidade com data e hora estruturadas
      Dado que existe uma oportunidade com data e hora estruturadas
      Quando a skill define o horário do evento
      Então usa esses dados como base

    Exemplo: Correção explícita da pessoa
      Dado que a pessoa corrigiu o horário ou indicou participação parcial
      Quando a skill grava o evento
      Então a correção explícita prevalece sobre a base

    Exemplo: Agenda recusou a alteração
      Dado que a agenda não aceitou a alteração de horário
      Quando a skill termina a operação
      Então avisa o que foi atualizado e o que não foi
