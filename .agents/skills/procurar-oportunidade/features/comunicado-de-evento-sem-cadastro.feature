# language: pt
Funcionalidade: Cadastrar o comunicado de evento que não está na lista
  Regra: Comunicado com nome e data segue o cadastro sem pergunta
    Exemplo: A edição do comunicado não existe
      Dado que o texto é um comunicado de evento com nome e data
      E que a edição não existe na lista de oportunidades
      Quando a busca termina
      Então a habilidade segue criar-oportunidade na mesma resposta
      E não pergunta à pessoa o que fazer

    Exemplo: Quem encaminha não é a organização
      Dado que a pessoa encaminhou o comunicado de uma feira
      Quando a oportunidade é cadastrada
      Então quem encaminhou não é gravado como organizador

    Exemplo: Só a pergunta se existe
      Dado que a pessoa só pergunta se a oportunidade existe
      E que ela não existe na lista
      Quando a busca termina
      Então a habilidade diz que não existe e não cadastra
