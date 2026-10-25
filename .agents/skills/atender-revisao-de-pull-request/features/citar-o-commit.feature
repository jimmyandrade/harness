# language: pt

Funcionalidade: Citar o commit na resposta
  A resposta diz qual commit mudou o ponto, para quem lê chegar nele sem procurar.

  Regra: O commit aparece pelo SHA curto, com link

    Exemplo: Resposta a um comentário que foi atendido
      Dado que um comentário foi atendido num commit
      Quando a skill responde a thread
      Então a resposta cita o commit pelo SHA curto
      E o SHA é um link para o commit no pull request

    Exemplo: A pessoa quer ver a mudança
      Dado que um comentário foi atendido num commit
      Quando a skill responde a thread
      Então a resposta mostra as linhas que saíram e as que entraram
      E a resposta cita o commit
