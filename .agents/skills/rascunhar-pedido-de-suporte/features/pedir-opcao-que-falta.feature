# language: pt

Funcionalidade: Pedir ao suporte uma opção que falta numa tela

  Regra: o pedido leva o print e conta o problema em palavras comuns

    Exemplo: a lista de opções não tem a que a pessoa precisa
      Dado que um formulário não tem a opção que a pessoa precisa
      Quando a habilidade rascunha o pedido ao suporte
      Então ela tira o print com a lista de opções aberta
      E o texto diz o que a tela oferece, o que a pessoa precisa e por que uma coisa não serve para a outra

    Exemplo: o pedido usa um termo abstrato
      Dado que o texto precisa do termo gênero
      Quando a habilidade escreve o pedido
      Então ela explica o termo em palavras comuns, com um exemplo
      E não deixa o termo sozinho

    Exemplo: o print traz dado que o suporte não precisa ver
      Dado que o print mostra dado pessoal ou de pagamento
      Quando a habilidade confere o print antes do sim
      Então ela cobre o dado ou descreve a tela só com palavras
