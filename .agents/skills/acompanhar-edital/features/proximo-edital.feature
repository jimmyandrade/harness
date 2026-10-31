# language: pt

Funcionalidade: Abertura do próximo edital
  A organização que não avisou o resultado também não avisa o próximo edital.

  Regra: Cada organização acompanhada ganha a busca do próximo edital

    Exemplo: Inscrições da turma seguinte
      Dado que a pessoa se inscreveu na turma de um ano
      Quando a skill acompanha a organização
      Então ela busca nos domínios da organização o edital da turma do ano seguinte
      E diz o período de inscrição achado, e se ele já fechou
