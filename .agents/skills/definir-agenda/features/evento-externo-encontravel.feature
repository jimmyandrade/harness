# language: pt
Funcionalidade: O evento externo encontrável
  O título soa como a empresa e a descrição continua buscável.

  Regra: Título de evento externo soa como a empresa

    Exemplo: Convidado de fora da empresa
      Dado que existe um evento com convidado ou organização externa
      Quando a skill cria ou atualiza o título
      Então o título segue o tom de voz e guarda o nome canônico
      E não troca data, horário, convidado, link ou página canônica
      Mas não parece publicidade exagerada

  Regra: Descrição com contexto de busca

    Exemplo: O evento ligado a uma página canônica
      Dado que existe um evento com página, grupo, oportunidade, negócio ou ponto de contato
      Quando a skill cria ou atualiza o evento
      Então a descrição traz o link da página canônica
      E explica em uma frase o que o evento é no sistema
      Mas não alonga o que a propriedade do Notion já guarda

  Regra: Variações de grafia na descrição

    Exemplo: Nome com acento, sigla ou apelido
      Dado que existem nomes que variam com acento, abreviação ou grafia informal
      Quando a skill cria ou atualiza a descrição
      Então a descrição inclui as variações úteis de busca
      E inclui com e sem acento, sigla, apelido, grupo, edição e venue
      Mas não inclui variação irrelevante

  Regra: Grafia conferida antes do título

    Exemplo: O pedido traz uma grafia diferente da canônica
      Dado que existe um pedido de evento com grafia diferente da canônica
      Quando a skill cria o título
      Então a skill confere a grafia antes de gravar
      E o título usa a forma canônica
      Mas a skill não grava a forma do pedido
