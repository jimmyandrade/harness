# language: pt
Funcionalidade: Pesquisa antes de comprar

  Regra: o que já temos vem antes da pesquisa na web

    Exemplo: O estoque já tem o item
      Dado que a pessoa quer comprar um item
      E o estoque tem saldo desse item
      Quando a habilidade pesquisa a compra
      Então a resposta mostra o saldo e pergunta se a pessoa ainda quer comprar

  Regra: a recomendação diz o que não foi confirmado

    Exemplo: O fabricante não confirma a compatibilidade
      Dado que um guia recomenda um modelo para o uso da pessoa
      E o fabricante não confirma a compatibilidade
      Quando a habilidade recomenda as opções
      Então o requisito aparece como não confirmado
      E a resposta traz a pergunta ao fabricante ou ao vendedor

  Regra: a habilidade não compra nem registra a compra

    Exemplo: A pessoa escolheu uma opção
      Dado que a pessoa escolheu uma opção
      Quando a habilidade termina a recomendação
      Então ela entrega os links e não finaliza o pedido

  Regra: cada pesquisa deixa o rastro no requisito

    Exemplo: A pesquisa terminou com as opções
      Dado que a habilidade pesquisou as opções de um item com requisito
      Quando ela responde com as opções
      Então o requisito ganha uma entrada no histórico da pesquisa
      E a entrada traz a data, onde buscou, as opções com preço, fonte e link e as descartadas com o motivo
      E a habilidade não finaliza o pedido
