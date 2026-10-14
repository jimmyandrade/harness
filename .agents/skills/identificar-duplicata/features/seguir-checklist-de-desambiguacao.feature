# language: pt
Funcionalidade: Seguir o checklist da desambiguação
  A avaliação de um item novo ou de um conflito segue uma ordem fixa.

  Regra: A avaliação percorre a sequência inteira

    Exemplo: Item novo ou conflito
      Dado que existe um possível item novo ou um possível conflito
      Quando a skill avalia o caso
      Então a skill busca o nome principal e as variações e compara link oficial, datas, local e perfis
      E a duplicata segue para consolidação no canônico ou o parecido diferente liga em Não confundir com
      E Variações de nome fica no formato padrão e a diferença permanente vai no contexto, com o fato temporal em comentário datado
