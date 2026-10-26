# language: pt

Funcionalidade: Linkar as fontes da explicação
  A resposta que explica uma escolha mostra onde está a prova, para quem lê conferir sem procurar.

  Regra: Cada afirmação de fato leva o link da fonte

    Exemplo: Resposta que explica uma exceção no código
      Dado que um comentário pede uma mudança que a skill não aplica
      Quando a skill responde a thread explicando o motivo
      Então cada afirmação sobre o código leva o link do trecho no commit atual
      E o link traz o SHA e as linhas

    Exemplo: Resposta que cita uma regra do projeto
      Dado que a resposta se apoia numa regra do projeto
      Quando a skill escreve a explicação
      Então a regra vem com o link do documento ou da decisão onde ela está
      Mas a skill não cita a regra de memória

    Exemplo: Afirmação sem fonte lida
      Dado que a skill não leu nenhuma fonte para uma afirmação
      Quando ela escreve a resposta
      Então a resposta diz que é inferência
      E não apresenta a afirmação como fato
