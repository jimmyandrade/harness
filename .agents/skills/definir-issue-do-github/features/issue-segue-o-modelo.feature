# language: pt
Funcionalidade: Issue segue o modelo de saída

  Regra: O modelo vale para qualquer issue
    Exemplo: A pessoa pede uma issue de um achado no meio de outro trabalho
      Dado que a issue nasce de um achado, sem pull request
      Quando a pessoa pede para abrir a issue
      Então o agente lê o modelo issue-do-github antes de escrever
      E o título é tipo: descrição
      E o corpo tem Problema, Proposta e Pronto quando, em bullets

    Exemplo: O repositório usa outro idioma nas issues
      Dado que as issues recentes do repositório estão em inglês
      Quando a pessoa pede para abrir a issue
      Então o agente escreve em inglês, com as seções Problem, Proposal e Done when
      E a resposta diz qual idioma usou
