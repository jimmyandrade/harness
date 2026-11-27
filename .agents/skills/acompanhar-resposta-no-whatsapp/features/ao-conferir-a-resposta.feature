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

Funcionalidade: Ler a resposta sem pedir confirmação

  Regra: depois de enviar a pedido da pessoa, a sessão lê a resposta nova sozinha

    Exemplo: o contato respondeu logo depois do envio
      Dado que a sessão acabou de enviar uma mensagem a pedido da pessoa
      Quando a lista mostra uma resposta nova do contato, com contador de não lidas
      Então a sessão abre a conversa e lê a resposta sem perguntar
      E diz que a conversa ficou marcada como lida
      E traz na mesma resposta o que a resposta pede, o que falta fazer e o texto da próxima mensagem pronto para o sim

    Exemplo: a resposta pede uma mensagem a um terceiro
      Dado que a sessão leu a resposta do contato
      Quando a resposta pede que a pessoa avise outra pessoa
      Então a sessão propõe o texto e espera o sim antes de enviar
