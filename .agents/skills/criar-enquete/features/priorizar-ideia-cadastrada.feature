# language: pt
Funcionalidade: Priorizar a ideia já cadastrada
  A enquete parte da fonte de ideias do projeto antes de nascer do zero.

  Regra: Ideia cadastrada vem antes de ideia nova

    Exemplo: Há uma ideia cadastrada aderente
      Dado que a fonte de ideias do projeto tem uma ideia aderente ao objetivo
      Quando a skill sugere a enquete
      Então a skill usa essa ideia
      E diz qual ideia usou

    Exemplo: Não há ideia aderente
      Dado que a fonte de ideias não tem ideia aderente
      Quando a skill cria uma ideia nova
      Então a ideia sai marcada como ainda não consolidada
      E a skill recomenda cadastrá-la com criar-ideia-de-conteudo só se for reutilizável e aprovada

  Regra: O banco de modelos é opcional

    Exemplo: O projeto não tem banco de modelos
      Dado que o parâmetro do banco de modelos de conteúdo está vazio
      Quando a skill sugere a enquete
      Então ela não pergunta o nome do banco nem o procura
      E cria a ideia do zero e diz isso
