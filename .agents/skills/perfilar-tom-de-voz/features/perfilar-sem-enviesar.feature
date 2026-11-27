# language: pt

Funcionalidade: Perfilar o tom de uma pessoa ou de um canal sem enviesar
  Só se perfila a pedido, com uma amostra real, sem as mensagens de quem pede e sem as de bot.

  Regra: Só perfila a pedido explícito ou com a entrega de um histórico

    Exemplo: Ninguém pediu o perfil
      Dado que a pessoa está conversando sobre outro assunto
      Quando a habilidade avalia se deve perfilar um canal
      Então não perfila e não lê a amostra

    Exemplo: Histórico entregue
      Dado que a pessoa entrega a exportação de uma conversa com a organizadora fictícia "Bia Souza"
      Quando a pessoa pede só para ajustar o rascunho
      Então a habilidade perfila o tom com o histórico todo, sem as mensagens nossas
      E grava o resumo nas notas do contato e na página da pessoa
      E registra o histórico por definir-negociacao na mesma rodada
      E diz o que persistiu e o que ficou de fora

  Regra: A amostra de um canal exclui quem pede e os bots

    Exemplo: Perfil de um canal
      Dado que a pessoa pede o perfil do tom de um canal
      Quando a habilidade lê as mensagens do canal
      Então exclui as mensagens de quem pediu e as de bot
      E anota essa exclusão na origem do perfil

  Regra: Só o padrão recorrente vira termo

    Exemplo: Frase dita uma vez
      Dado que uma pessoa disse uma frase só uma vez na amostra
      Quando a habilidade escolhe o que registrar
      Então não registra essa frase como termo

  Regra: Conversa privada não é citada

    Exemplo: Justificar um termo
      Dado que a amostra veio de uma conversa privada
      Quando a habilidade explica o termo registrado
      Então descreve o padrão com as próprias palavras e não cola trecho literal
