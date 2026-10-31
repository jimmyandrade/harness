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
