# language: pt
Funcionalidade: Dependência entre issues

  Regra: a dependência fica na relação da issue

    Exemplo: uma issue espera outra
      Dado que a issue nova espera outra issue
      Quando a dependência é registrada
      Então a issue fica marcada como bloqueada pela outra
      E não há comentário que só diga a dependência
