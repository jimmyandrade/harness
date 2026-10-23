# language: pt
Funcionalidade: Associar pessoa responsável à empresa fornecedora
  O contexto comercial determina se é necessário um contato nominal.

  Regra: A relação estruturada guarda a pessoa responsável

    Exemplo: Fornecedora de relacionamento continuado com pessoa identificada
      Dado que existe uma empresa fornecedora com relacionamento comercial continuado e contato operacional identificado
      Quando a skill cadastra, atualiza, valida ou consolida essa empresa
      Então a skill associa esse contato nas pessoas responsáveis
      E marca a opção de fornecedor no tipo de público quando fizer sentido
      Mas não usa observações no lugar da relação

  Regra: Compra pontual não exige contato nominal

    Exemplo: Restaurante sem pessoa conhecida
      Dado que a pessoa informa uma compra pontual em restaurante e não conhece ninguém do estabelecimento
      Quando pede para cadastrar a empresa mesmo sem contato nominal
      Então a empresa é cadastrada sem exigir o nome do dono ou de uma pessoa responsável
      E nenhuma pessoa é inventada ou criada como contato genérico
      Mas a ausência de contato não bloqueia o vínculo da despesa à empresa
