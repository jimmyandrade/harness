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

    Exemplo: O evento existente sem descrição
      Dado que o evento provável já está na agenda e não tem descrição
      Quando a skill atualiza esse evento
      Então ela lê o evento inteiro e completa a descrição com o link da fonte
      E diz que o evento foi alterado, não mantido

    Exemplo: O título do evento existente
      Dado que o evento provável já está na agenda com um título que não traz o nome canônico
      Quando a skill atualiza esse evento
      Então ela pode trocar o título pelo nome canônico mais buscável
      E completa a descrição com o link da fonte
