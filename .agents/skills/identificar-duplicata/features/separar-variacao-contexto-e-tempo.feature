# language: pt
Funcionalidade: Separar variação, contexto permanente e histórico temporal
  Cada tipo de informação fica na propriedade que a lista já tem para isso.

  Regra: Variação guarda só a forma do mesmo canônico

    Exemplo: Grafia alternativa do mesmo registro
      Dado que existe um banco com variação de nome grafia alternativa Não confundir com e contexto de desambiguação ou propriedade equivalente
      Quando a skill encontra uma grafia alternativa do mesmo registro canônico
      Então a skill registra essa forma só na propriedade de variações
      E não registra essa forma no contexto permanente

  Regra: Registros distintos ligam e o texto explica

    Exemplo: Dois registros distintos que podem ser confundidos
      Dado que existem dois registros distintos que podem ser confundidos
      Quando a skill explica como diferenciá-los
      Então a skill relaciona os dois em Não confundir com
      E usa o campo textual de desambiguação como explicação complementar
      E não usa esse texto como substituto da relação

    Exemplo: Contexto permanente com propriedade específica
      Dado que existe uma propriedade específica de desambiguação
      Quando a skill registra por que dois registros podem ser confundidos
      Então a skill usa essa propriedade
      E não usa o corpo nem observação geral

  Regra: Fato que muda com o tempo vai em comentário datado

    Exemplo: Contato preço prazo ou status
      Dado que existe uma informação de contato preço disponibilidade resposta decisão status prazo ou mudança operacional
      Quando a skill registra essa informação
      Então a skill grava um comentário datado
      E não grava esse fato na variação nem no contexto permanente
