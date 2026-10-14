# language: pt
Funcionalidade: Associar pessoa responsável à empresa fornecedora
  A fornecedora relevante tem uma pessoa nas pessoas responsáveis.

  Regra: A relação estruturada guarda a pessoa responsável

    Exemplo: Fornecedora ativa sem pessoa responsável
      Dado que existe uma empresa fornecedora ativa na lista de empresas
      Quando a skill cadastra, atualiza, valida ou consolida essa empresa
      Então a skill associa uma pessoa nas pessoas responsáveis
      E marca a opção de fornecedor no tipo de público quando fizer sentido
      Mas não usa observações no lugar da relação
