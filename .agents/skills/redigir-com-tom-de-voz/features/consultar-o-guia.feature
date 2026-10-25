# language: pt
Funcionalidade: Consultar o guia de tom de voz antes da mensagem

  Regra: a mensagem ao público espera o guia

    Exemplo: criar, redigir, editar, revisar ou responder
      Dado que as instruções do projeto nomeiam o guia de tom de voz
      E que a pessoa pediu uma mensagem para o público
      Quando a mensagem é criada, redigida, editada, revisada ou respondida
      Então o guia foi consultado antes do texto
