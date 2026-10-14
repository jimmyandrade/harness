# language: pt

Funcionalidade: Título encontrável na agenda
  O título ajuda a busca humana e por IA.

  Regra: O título leva o nome canônico

    Exemplo: O evento criado ou atualizado
      Dado que existe um evento que será criado ou atualizado na agenda
      Quando a skill define o título
      Então o título serve à busca humana e por IA
      E inclui o nome canônico mais buscável

    Exemplo: A edição, data e cidade
      Dado que existe um evento com edição, data e cidade
      Quando esses dados ajudam a achar o compromisso
      Então o título inclui edição, data, cidade e um contexto curto

    Exemplo: Palavra genérica
      Dado que existe um título que seria só Reservado, o evento, Reunião ou Feira
      Quando a skill define o título
      Então o título leva o nome canônico do contexto
      Mas não fica só na palavra genérica

    Exemplo: O evento provisório
      Dado que existe um evento provisório
      Quando a skill define o título
      Então o título pode começar com Reservado para ou A confirmar
      E inclui o nome canônico do contexto
