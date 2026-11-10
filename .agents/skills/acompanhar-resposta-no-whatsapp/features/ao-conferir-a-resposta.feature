# language: pt

Funcionalidade: Conferir a resposta sem marcar como lida

  Regra: com ler a lista, a rotina não abre a conversa

    Exemplo: o contato respondeu com duas mensagens
      Dado que a rotina acompanha a resposta de um contato
      E que o parâmetro está em ler a lista
      Quando a linha do contato mostra duas não lidas
      Então a rotina avisa o horário e a prévia da última mensagem
      E a conversa continua com as mensagens não lidas

  Regra: com abrir a conversa, a rotina lê as mensagens novas

    Exemplo: o contato respondeu com duas mensagens
      Dado que o parâmetro está em abrir a conversa
      Quando a linha do contato mostra duas não lidas
      Então a rotina abre a conversa e traz as duas mensagens
      E avisa que elas ficaram marcadas como lidas

Funcionalidade: Acompanhar pela etiqueta

  Regra: a rotina lê a etiqueta e nunca é editada por contato

    Exemplo: um contato novo passa a ser acompanhado
      Dado que existe uma rotina que lê as conversas com a etiqueta Ação esperada
      Quando a pessoa envia uma mensagem que espera resposta
      Então a conversa recebe a etiqueta Ação esperada
      E a rotina não é editada

    Exemplo: o contato respondeu
      Dado que a conversa tem a etiqueta Ação esperada
      Quando a linha do contato mostra a resposta
      Então a rotina avisa o horário e a prévia
      E troca a etiqueta Ação esperada por Respondida
