# language: pt
Funcionalidade: Consultar o vocabulário antes da mensagem

  Regra: a mensagem espera as regras de voz

    Exemplo: criar, redigir, editar, revisar ou responder
      Dado que as regras de voz estão nesta habilidade e no vocabulário
      E que a pessoa pediu uma mensagem para o público
      Quando a mensagem é criada, redigida, editada, revisada ou respondida
      Então o vocabulário foi consultado antes do texto
