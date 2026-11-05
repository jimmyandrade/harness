# language: pt
Funcionalidade: Rótulo na abertura do pull request

  Regra: o pull request nasce com rótulo

    Exemplo: Rotular o PR está ligado
      Dado que Rotular o PR é sim
      E existe um rótulo que descreve a mudança
      Quando a habilidade abre o pull request
      Então o comando de criação já leva esse rótulo

  Regra: o rótulo segue o tipo do commit

    Exemplo: Correção em Markdown
      Dado que a mudança corrige um erro
      E o arquivo alterado é Markdown
      E o título começa com fix
      Quando a habilidade escolhe o rótulo
      Então o rótulo é bug

    Exemplo: Documentação em Markdown
      Dado que a mudança documenta
      E o arquivo alterado é Markdown
      E o título começa com docs
      Quando a habilidade escolhe o rótulo
      Então o rótulo é o de documentação

  Regra: o pull request bloqueado nasce com o rótulo de bloqueio

    Exemplo: O merge depende de uma credencial que ainda não existe
      Dado que o workflow do PR lê um segredo que o repositório ainda não tem
      Quando a habilidade abre o pull request
      Então o comando de criação leva o rótulo do tipo e o Rótulo de PR bloqueado
      E a descrição diz o que falta para mesclar
