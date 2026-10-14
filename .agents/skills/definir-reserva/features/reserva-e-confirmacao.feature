# language: pt

Funcionalidade: Preservar reserva e compromisso confirmado
  Sem confirmação explícita, o evento continua provisório.

  Regra: Reserva não vira participação por oportunidade aprovada

    Exemplo: Natureza provisória
      Dado que existe um evento marcado como reserva, bloqueio provisório, a confirmar ou lembrete
      Quando a skill revisa esse evento
      Então mantém a natureza provisória
      Mas só se não houver confirmação explícita

    Exemplo: A oportunidade aprovada
      Dado que existe uma reserva na agenda
      E uma oportunidade aprovada
      Quando a skill revisa a reserva
      Então não converte a reserva em participação confirmada

    Exemplo: Participação confirmada
      Dado que a pessoa confirmou a participação
      Quando a skill atualiza o evento
      Então título e descrição deixam de dizer que era só reserva

    Exemplo: Pendência depois da confirmação
      Dado que a participação ainda depende de estoque, pagamento, curadoria, agenda, deslocamento ou terceiros
      Quando a pessoa confirma a participação
      Então a skill registra a pendência na descrição ou mantém marcador de incerteza no título
