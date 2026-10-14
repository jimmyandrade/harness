# language: pt

Funcionalidade: Encaminhar o ponto de contato para a agenda editável
  Criar, recriar, migrar ou revisar esse evento não usa a agenda removida.

  Regra: O destino vem da habilidade do ponto de contato

    Exemplo: O evento de ponto de contato
      Dado que existe um evento de um item de Pontos de contato
      Quando a skill cria, recria, migra ou revisa esse evento
      Então o destino é a agenda editável de organizar-ponto-de-contato
      Mas a agenda removida não é usada
