# language: pt
Funcionalidade: Triar só os grupos marcados
  A pessoa escolhe quais grupos do WhatsApp entram na triagem, com uma etiqueta.

  Regra: Sem a etiqueta nas instruções, todo grupo é varrido

    Exemplo: Parâmetro vazio
      Dado que a etiqueta dos grupos em triagem está vazia
      Quando a skill varre as conversas do WhatsApp
      Então ela varre todo grupo com mensagem nova, como antes

  Regra: Com a etiqueta nas instruções, só o grupo marcado é varrido

    Exemplo: Grupo sem a etiqueta
      Dado que a etiqueta dos grupos em triagem está preenchida
      E que um grupo não tem essa etiqueta
      Quando a skill varre as conversas do WhatsApp
      Então ela não lê o grupo
      E o grupo não entra no relatório nem recebe rótulo

    Exemplo: Grupo com a etiqueta
      Dado que um grupo tem a etiqueta dos grupos em triagem
      Quando a skill varre as conversas do WhatsApp
      Então ela varre o grupo e rotula seguindo o fluxo normal

    Exemplo: Conversa individual
      Dado que a etiqueta dos grupos em triagem está preenchida
      Quando a skill varre as conversas do WhatsApp
      Então as conversas individuais seguem varridas sem a etiqueta

    Exemplo: Grupo sem a etiqueta que a pessoa nomeia
      Dado que a pessoa nomeia um grupo sem a etiqueta
      Quando a skill varre as conversas
      Então ela varre esse grupo
