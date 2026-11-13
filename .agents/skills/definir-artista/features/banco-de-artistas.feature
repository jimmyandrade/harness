# language: pt

Funcionalidade: Banco de artistas
  O banco de artistas se acha pela habilidade de procurar banco de dados, e a pessoa só é perguntada quando ela não resolve.

  Regra: o banco vem da procura

    Exemplo: Banco com nome definido
      Dado que as instruções do projeto definem o nome do banco de artistas
      Quando a habilidade precisa ler ou gravar um artista
      Então ela chama a habilidade de procurar banco de dados com esse nome
      E diz a ela para que serve o banco e quais propriedades ele precisa ter
      Mas não pede o link à pessoa antes

    Exemplo: Mais de um banco ou nenhum
      Dado que a procura acha mais de um banco, ou nenhum
      Quando a habilidade segue a resposta da procura
      Então ela pede à pessoa o link ou a escolha
      Mas não usa um banco de outro workspace
