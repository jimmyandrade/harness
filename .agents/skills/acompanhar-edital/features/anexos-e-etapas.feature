# language: pt

Funcionalidade: Bancos de anexos e de etapas da oportunidade
  Alguns negócios guardam os documentos e as datas da oportunidade em bancos próprios, com nomes que variam.
  A skill lê esses bancos quando eles existem e grava neles o que achar.

  Regra: Cada banco é opcional

    Exemplo: Negócio sem banco de etapas
      Dado que o workspace não tem banco de etapas
      E que a edição não tem propriedade para a data do resultado
      E que o edital achado traz essa data
      Quando a skill lê o edital
      Então ela segue sem o banco de etapas
      E lista a data no fim da resposta, sem escrever no corpo da oportunidade

  Regra: O que o edital traz entra nos bancos, sem duplicar

    Exemplo: Edital com datas novas
      Dado que o edital achado traz o prazo de inscrição e o início da execução
      E que o banco de etapas não tem essas etapas para a edição
      Quando a skill lê o edital
      Então ela cria uma etapa para cada data, ligada à edição, com o link do edital como fonte

    Exemplo: Data retificada
      Dado que o banco de etapas já tem o prazo de inscrição da edição
      E que uma retificação do edital muda essa data
      Quando a skill lê a retificação
      Então ela atualiza a etapa e diz a data antiga, a nova e o link da retificação

    Exemplo: Documento já anexado
      Dado que o banco de anexos já tem o link do edital ligado à edição
      Quando a skill acha o mesmo edital
      Então ela não grava outro anexo
