# language: pt

Funcionalidade: Atualizar a revisão quando o texto muda
  Um feedback que muda o formulário atualiza o que já foi publicado.

  Regra: O feedback atualiza comentários e respostas sem perguntar

    Exemplo: A pessoa muda o texto de uma revisão já publicada
      Dado que a revisão já foi publicada
      E a pessoa deu um feedback que muda o texto
      Quando o texto da revisão é reescrito
      Então os comentários e as respostas são atualizados
      E a pessoa não é perguntada se pode atualizar
