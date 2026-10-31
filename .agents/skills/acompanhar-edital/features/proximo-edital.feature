# language: pt

Funcionalidade: Abertura do próximo edital
  A organização que não avisou o resultado também não avisa o próximo edital.

  Regra: Cada organização acompanhada ganha a busca do próximo edital

    Exemplo: Inscrições da turma seguinte
      Dado que a pessoa se inscreveu na turma de um ano
      Quando a skill acompanha a organização
      Então ela busca nos domínios da organização o edital da turma do ano seguinte
      E diz o período de inscrição achado, e se ele já fechou

  Regra: A busca recorrente segue `definir-rotina`

    Exemplo: Rotina pelo cronograma do edital
      Dado que o edital traz a data do resultado
      Quando a pessoa pede para não perder o resultado
      Então a skill segue `definir-rotina` para criar a busca recorrente
      E a frequência sobe perto da data do resultado e cai para `Frequência da busca do próximo edital` depois dele
