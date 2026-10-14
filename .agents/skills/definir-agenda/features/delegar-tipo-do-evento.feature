# language: pt

Funcionalidade: Delegar a classificação do tipo
  A agenda grava o evento e não decide o tipo sozinha.

  Regra: O tipo vem de definir-tipo-do-evento

    Exemplo: Pedido para gravar um evento
      Dado que existe um pedido para criar, revisar ou alterar um evento
      Quando a skill vai salvar
      Então ela segue definir-tipo-do-evento
      E grava só negócio, compromisso interno, prazo ou entrega

    Exemplo: Tipo ainda incerto
      Dado que existe um pedido para criar ou alterar um evento
      E o tipo real não está claro
      Quando a skill vai salvar
      Então ela para e segue definir-tipo-do-evento
      Mas não cria nem altera o evento
