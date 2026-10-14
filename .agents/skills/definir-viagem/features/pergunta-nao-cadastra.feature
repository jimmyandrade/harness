# language: pt

Funcionalidade: Pergunta não cadastra
  Perguntar se a viagem existe não cria página.

  Exemplo: Datas já ocupadas
    Dado que a pessoa pergunta se já existe uma viagem para essas datas
    Quando a pessoa faz essa pergunta
    Então a resposta diz o que a busca encontrou
    E nenhuma viagem é criada
