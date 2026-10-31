# language: pt

Funcionalidade: Bancos de anexos e de etapas da oportunidade
  Alguns negócios guardam os documentos e as datas da oportunidade em bancos próprios, com nomes que variam.
  A skill lê esses bancos quando eles existem e grava neles o que achar.

  Regra: Sem o banco, a pessoa escolhe o caminho

    Exemplo: Negócio sem banco de etapas
      Dado que a fonte de dados conectada não tem banco de etapas
      E que o edital achado traz a data do resultado
      Quando a skill vai gravar a data
      Então ela pergunta uma vez se a pessoa informa onde o banco está, se quer criá-lo ou se a resposta fica só na conversa
      E não cria o banco por conta própria

  Regra: O que o edital traz entra nos bancos, sem duplicar

    Exemplo: Edital com datas novas
      Dado que o edital achado traz o prazo de inscrição e o início da execução
      E que o banco de etapas não tem essas etapas para a edição
      Quando a skill lê o edital
      Então ela cria uma etapa para cada data, ligada à edição, com o link do edital como fonte

    Exemplo: Execução em módulos
      Dado que o edital de um curso traz aulas em dias diferentes, divididas em módulos
      Quando a skill lê o edital
      Então ela cria uma etapa para cada dia ou período de aula, ligada à edição

    Exemplo: Etapas simultâneas
      Dado que o banco de etapas já tem uma palestra num dia e numa hora
      E que o edital traz outra palestra na mesma hora, noutro espaço
      Quando a skill lê o edital
      Então ela cria a segunda etapa, porque o local é outro

    Exemplo: Documento já anexado
      Dado que o banco de anexos já tem o link do edital ligado à edição
      Quando a skill acha o mesmo edital
      Então ela não grava outro anexo

  Regra: A data prorrogada vira a canônica, e a antiga fica à vista

    Exemplo: Prazo de inscrição prorrogado
      Dado que o banco de etapas já tem o prazo de inscrição da edição
      E que uma prorrogação muda essa data
      Quando a skill lê a prorrogação
      Então ela marca a etapa antiga como substituída e cria a nova como o prazo que vale
      E a resposta diz a data antiga, a nova e o link da prorrogação
