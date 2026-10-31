# language: pt

Funcionalidade: A oportunidade como pré-requisito e primeira fonte
  O acompanhamento parte de uma oportunidade cadastrada.
  O que já foi lido na conversa não se procura de novo.

  Regra: A oportunidade existir é pré-requisito

    Exemplo: Inscrição sem oportunidade cadastrada
      Dado que a inscrição não está ligada a nenhuma edição
      E que `procurar-oportunidade` não acha a edição
      Quando a skill começa o acompanhamento
      Então ela segue `criar-oportunidade` e só depois continua

    Exemplo: Edital pessoal fora do espaço de trabalho do negócio
      Dado que a inscrição é da pessoa e não do negócio
      E que a única fonte de dados conectada é a do negócio
      Quando a skill começa o acompanhamento
      Então ela não cria a oportunidade no banco do negócio
      E segue com a busca na web e a resposta só na conversa, dizendo isso

  Regra: O link achado na web volta para a oportunidade pela skill dona dela

    Exemplo: Oportunidade sem o link do edital
      Dado que a oportunidade não tem o link do edital
      Quando a busca na web acha a página oficial do edital
      Então a skill segue `criar-oportunidade` para gravar o link na edição
      E não escreve na página da oportunidade

  Regra: O que já está no contexto não se procura de novo

    Exemplo: Oportunidade lida por procurar-oportunidade
      Dado que `procurar-oportunidade` já leu a edição nesta conversa
      E que nenhum banco nem propriedade mudou desde então
      Quando a skill levanta os domínios
      Então ela usa a edição do contexto, sem nova busca

    Exemplo: Propriedade criada depois da confirmação da pessoa
      Dado que a pessoa confirmou a criação de uma propriedade de link na edição
      Quando a skill volta a levantar os domínios
      Então ela relê o esquema e remapeia as propriedades antes de buscar

  Regra: O banco sem caminho é procurado e registrado

    Esquema do Cenário: Banco achado sem estar nos parâmetros
      Dado que `Nome do data source de oportunidades` está vazio
      E que a busca na fonte de dados conectada acha um banco de oportunidades só
      E que `Ao achar um banco` está em `<modo>`
      Quando a skill termina de levantar os domínios
      Então ela <ação> o nome do banco nas instruções do projeto

      Exemplos:
        | modo      | ação          |
        | propor    | propõe gravar |
        | registrar | grava         |
