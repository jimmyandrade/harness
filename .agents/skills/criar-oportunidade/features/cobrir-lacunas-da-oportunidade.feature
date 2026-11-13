# language: pt
Funcionalidade: Cobrir o ano, a taxa, a oferta, o local e o link da oportunidade
  Cada regra vale com os nomes de propriedade do mapeamento de dados do projeto.

  Regra: O ano da edição precisa estar num ciclo

    Exemplo: Ano posterior ao último ciclo
      Dado que o ano da edição vem depois do último ciclo da lista
      Quando a skill vai cadastrar a edição
      Então ela busca o ciclo por nome, ano e variações
      E cria o ciclo sem duplicar antes de seguir

    Exemplo: Ano incerto
      Dado que a fonte tem data parcial ou fontes em conflito
      Quando a skill vai definir o ano
      Então ela pergunta e não chuta o ano

  Regra: A taxa por duração vai nos campos numéricos

    Exemplo: Taxa de 1 dia e de 2 dias
      Dado que a taxa da marca varia entre 1 dia e 2 dias
      Quando a skill grava a taxa
      Então preenche os dois campos numéricos
      E não escreve a taxa no corpo

  Regra: O título descreve a oferta, não a candidata

    Exemplo: Mais de uma candidata
      Dado que duas candidatas disputam a mesma oferta
      Quando a skill cadastra a oferta
      Então mantém uma só oportunidade canônica
      E a candidatura vai para as inscrições e a tratativa para as negociações

  Regra: O local precisa de empresa e localidade confirmadas

    Exemplo: Empresa do local inexistente
      Dado que a empresa do local não existe na lista
      Quando a skill vai vincular o local
      Então pergunta se cadastra agora pelo definir-empresa
      E só então vincula

  Regra: O link específico substitui o genérico

    Exemplo: Link de página específica da plataforma de ingressos
      Dado que o link de inscrição está vazio ou genérico
      Quando a pessoa envia o link completo da página específica
      Então a skill substitui o link na oportunidade existente
      E não cria outra oportunidade
