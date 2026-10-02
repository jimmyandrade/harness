# language: pt

Funcionalidade: Conferir a saída da skill
  Cada critério de aceite enviado pela pessoa é um teste funcional.
  O exemplo só conta como validado depois da execução com a pessoa.

  Regra: O critério vira um exemplo observável

    Exemplo: Saída válida
      Dado que a pessoa enviou um critério de aceite
      Quando a skill executa o fluxo
      Então a saída observável corresponde ao critério

    Exemplo: Chamada que sucede
      Dado que um critério fala da chamada
      Quando a skill executa o fluxo
      Então a chamada sucede
      E a pessoa vê o efeito da chamada

    Exemplo: Erro tratado
      Dado que um critério fala de erro
      Quando a chamada falha
      Então o erro é tratado
      E a pessoa vê o que faltou

    Exemplo: Limite
      Dado que um critério está no limite do propósito
      Quando a skill executa o fluxo
      Então a saída observável cobre esse limite
