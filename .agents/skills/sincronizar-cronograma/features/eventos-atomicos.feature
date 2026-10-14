# language: pt

Funcionalidade: Priorizar eventos atômicos do cronograma
  Vários marcos reais viram um evento cada.
  O guarda-chuva duplicado sai depois da conferência.

  Regra: Um item canônico não vira bloco diário

    Exemplo: Vários marcos
      Dado que existe uma programação com vários marcos operacionais no cronograma
      Quando a skill sincroniza a programação com a agenda
      Então cada item real ganha um evento atômico
      E o evento usa o início, o fim, a localização, o contexto e a pessoa daquele item

    Exemplo: Bloco único
      Dado que existem vários marcos distintos
      Quando um bloco diário ou de vários dias reduziria a encontrabilidade ou esconderia um deslocamento
      Então a skill não substitui os marcos por esse bloco
      Mas um compromisso indivisível pedido pela pessoa pode permanecer

    Exemplo: Até o próximo marco
      Dado que a pessoa autorizou a regra até o próximo marco
      Quando o item anterior não tem fim explícito
      Então o início do próximo item pode ser o fim operacional
      E a regra fica explícita na descrição ou na auditoria

    Exemplo: Encerramento sem horário
      Dado que existe um item sem horário de início no encerramento da programação
      Quando não há próximo marco nem autorização de duração técnica
      Então o item permanece pendente até confirmação
      Mas nenhuma duração é inventada

    Exemplo: Guarda-chuva duplicado
      Dado que existem eventos atômicos que já cobrem a programação
      E um bloco diário sem função operacional própria
      Quando a skill confere os itens atômicos seguros
      Então remove ou cancela o guarda-chuva
      Mas só se nenhum dado exclusivo se perder
