# language: pt

Funcionalidade: Auditar se o tempo apoia os objetivos
  A pessoa equilibra criação, visibilidade, receita e vida pessoal.
  A auditoria mostra se o tempo planejado alcança o apoio ao objetivo prioritário e onde ajustar.

  Regra: A fatia sai da agenda

    Exemplo: O tempo alcança o apoio ao objetivo prioritário
      Dado que existem os compromissos do Google Agenda com duração
      E os objetivos prioritários que a pessoa ou a fonte nomeou
      Quando a distribuição é auditada
      Então a resposta diz se o tempo planejado alcança o apoio ao objetivo prioritário
      E a resposta diz onde ajustar

    Exemplo: Duração ou objetivo ausente
      Dado que existe um compromisso sem duração ou sem objetivo prioritário nomeado
      Quando a distribuição é auditada
      Então a skill pede o que falta
      Mas ela não estima a fatia nem escolhe o objetivo
