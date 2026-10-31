# language: pt

Funcionalidade: Abertura da próxima edição
  A organização que não avisou o resultado também não avisa a próxima inscrição.

  Regra: Cada organização acompanhada ganha a busca da próxima edição

    Exemplo: Inscrições da turma seguinte
      Dado que a pessoa se inscreveu na turma de um ano
      Quando a skill acompanha a organização
      Então ela busca nos domínios da organização a inscrição da turma do ano seguinte
      E diz o período de inscrição achado, e se ele já fechou

  Regra: A busca recorrente segue `definir-rotina`

    Exemplo: Rotina pelo cronograma do edital
      Dado que o edital traz a data do resultado
      Quando a pessoa pede para não perder o resultado
      Então a skill segue `definir-rotina` para criar a busca recorrente
      E a frequência sobe perto da data do resultado e cai para `Frequência da busca de nova edição` depois dele
