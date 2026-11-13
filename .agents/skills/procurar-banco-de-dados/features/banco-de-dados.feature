# language: pt

Funcionalidade: Banco de dados
  Quando o parâmetro de um banco está vazio, a habilidade procura o banco no workspace conectado antes de perguntar o nome à pessoa.

  Regra: o parâmetro preenchido vale

    Exemplo: Banco definido nas instruções do projeto
      Dado que as instruções do projeto definem o banco
      Quando outra habilidade precisa do banco
      Então esta habilidade não procura
      E o banco das instruções do projeto vale

  Regra: um banco que serve é usado e nomeado

    Exemplo: Um só banco serve
      Dado que o parâmetro do banco está vazio
      E que o workspace conectado tem um só banco com as propriedades esperadas
      Quando a habilidade procura
      Então ela devolve esse banco com o link
      E diz qual banco usou
      Mas não pergunta o nome à pessoa

    Exemplo: Nome parecido sem as propriedades
      Dado que o workspace conectado tem um banco de nome parecido
      E que ele não tem as propriedades esperadas
      Quando a habilidade confere os candidatos
      Então ela descarta esse banco
      E não o devolve só pelo nome

  Regra: a ambiguidade é da pessoa

    Exemplo: Dois bancos de nomes iguais ou parecidos
      Dado que dois bancos do workspace conectado servem
      Quando a habilidade termina a busca
      Então ela mostra os dois, com o nome, o link e as propriedades
      E pede à pessoa que escolha
      Mas não escolhe sozinha

  Regra: sem banco, a pessoa informa ou autoriza criar

    Exemplo: Nenhum banco serve
      Dado que nenhum banco do workspace conectado serve
      Quando a habilidade termina a busca
      Então ela pede à pessoa que informe o banco
      E sugere criá-lo, com o nome e as propriedades esperadas
      Mas não cria o banco sem o sim

    Exemplo: Workspace sem conexão
      Dado que não há workspace conectado
      Quando a habilidade precisa procurar
      Então ela diz que não há conexão
      E pede à pessoa que informe o banco

    Exemplo: Banco de outro workspace
      Dado que um banco que serve está em outro workspace
      Quando a habilidade confere os candidatos
      Então ela não usa esse banco

  Regra: a busca é só por bancos

    Exemplo: Busca por nome
      Dado que o parâmetro do banco está vazio
      Quando a habilidade procura
      Então ela busca entre os bancos, pelo nome e por sinônimos curtos
      Mas não varre o conteúdo das páginas nem o workspace inteiro

    Exemplo: Banco na lixeira ou arquivado
      Dado que um banco que serve está na lixeira ou arquivado
      Quando a habilidade confere os candidatos
      Então ela não o conta como candidato

  Regra: um campo dentro do banco segue o mesmo caminho

    Exemplo: Um só campo serve
      Dado que o parâmetro de um campo, como o de arquivo da foto, está vazio
      E que o banco conhecido tem um só campo do tipo esperado
      Quando a habilidade procura
      Então ela devolve esse campo e diz qual usou

    Exemplo: Campo ambíguo ou ausente
      Dado que o banco conhecido tem mais de um campo do tipo esperado, ou nenhum
      Quando a habilidade termina a busca
      Então ela pede à pessoa que escolha, ou sugere criar o campo
      Mas não cria o campo sem o sim

  Regra: o valor achado não é gravado sozinho

    Exemplo: Banco achado
      Dado que a habilidade achou o banco
      Quando ela devolve o resultado
      Então ela diz o valor para a pessoa poder fixá-lo nas instruções do projeto
      Mas não grava o valor nas instruções do projeto sozinha
