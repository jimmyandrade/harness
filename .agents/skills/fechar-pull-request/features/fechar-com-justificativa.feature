# language: pt

Funcionalidade: Fechar um PR com justificativa
  Todo PR fechado sem merge leva o motivo e os links que o comprovam.

  Regra: O comentário de fechamento comprova o motivo

    Exemplo: PR que repete outro já mesclado
      Dado que um PR repete a mudança de outro PR já mesclado
      Quando a pessoa pede para fechá-lo
      Então o PR fecha com um comentário que diz o motivo
      E o comentário leva o link do PR mesclado e do commit na base

    Exemplo: Motivo sem prova
      Dado que a pessoa pede para fechar um PR sem dizer por quê
      Quando não há link que comprove o motivo
      Então o PR continua aberto
      E a resposta pergunta o motivo

  Regra: O PR substituído aponta para o substituto num alerta

    Exemplo: PR substituído por outro
      Dado que um PR novo substitui este PR
      Quando o PR é fechado
      Então o comentário de fechamento abre com um alerta `> [!IMPORTANT]`
      E o alerta leva o link do PR novo

  Regra: O comentário de fechamento é conferido antes e depois

    Exemplo: Comentário vazio
      Dado que o texto do comentário de fechamento está vazio ou o arquivo dele não existe
      Quando a skill vai fechar o PR
      Então ela não fecha e escreve o comentário antes

    Exemplo: Comentário antigo tomado pelo de fechamento
      Dado que o PR já tinha comentários antes do fechamento
      Quando a skill confere o fechamento
      Então ela confere que o último comentário tem o motivo e o link do substituto

    Exemplo: PR fechado sem o comentário
      Dado que o PR fechou e o comentário de fechamento não saiu
      Quando a skill percebe a falta
      Então ela publica o comentário na hora
      E diz na resposta que a ordem ficou trocada
