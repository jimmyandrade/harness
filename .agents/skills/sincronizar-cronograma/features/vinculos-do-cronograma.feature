# language: pt

Funcionalidade: Ligar os itens de horários à oportunidade e ao ponto
  Montagem, início, fim, desmontagem e blocos ligam sempre à oportunidade.

  Regra: O ponto de contato entra só quando existe

    Exemplo: Há ponto de contato correspondente
      Dado que o item de montagem pertence a uma oportunidade com ponto de contato
      Quando a skill liga o item
      Então o item liga à oportunidade e ao ponto de contato

    Exemplo: Evento formativo sem venda
      Dado que o evento é formativo e a pessoa confirmou que não houve venda
      Quando a skill liga o item
      Então o item liga só à oportunidade
      E nenhum ponto de contato é criado para ligá-lo
