# language: pt

Funcionalidade: Conferir a saída da skill
  Cada critério de aceite enviado pela pessoa é um teste funcional.
  O exemplo só conta como validado depois da execução com a pessoa.

  Regra: O critério vira um exemplo observável

    Exemplo: Saída válida
      Dado o critério de aceite que a pessoa enviou
      Quando a skill executa o fluxo
      Então a saída observável corresponde ao critério

    Exemplo: Chamada que sucede
      Dado um critério que fala da chamada
      Quando a skill executa o fluxo
      Então a chamada sucede
      E a pessoa vê o efeito da chamada

    Exemplo: Erro tratado
      Dado um critério que fala de erro
      Quando a chamada falha
      Então o erro é tratado
      E a pessoa vê o que faltou

    Exemplo: Limite
      Dado um critério no limite do propósito
      Quando a skill executa o fluxo
      Então a saída observável cobre esse limite
