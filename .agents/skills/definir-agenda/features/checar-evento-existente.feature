# language: pt

Funcionalidade: Checar se o evento já existe antes de criar
  Cadastrar na agenda não cria o mesmo compromisso duas vezes.

  Regra: A busca usa variação e não só o título exato

    Exemplo: O evento provável já na agenda
      Dado que existe um pedido para cadastrar um evento
      E nome, data, organização, oportunidade relacionada ou outro identificador mínimo
      Quando a skill vai criar
      Então ela busca na agenda por variações de nome, não só pelo título exato
      E atualiza o evento existente provável em vez de criar duplicata

    Exemplo: Dúvida razoável
      Dado que existe um pedido para cadastrar um evento
      E mais de um evento parecido na agenda
      Quando a skill vai criar
      Então ela mostra o que encontrou
      Mas pede confirmação antes de criar outro
