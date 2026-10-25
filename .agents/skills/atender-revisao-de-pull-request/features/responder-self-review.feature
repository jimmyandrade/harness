# language: pt
Funcionalidade: Resposta ao self review

  Regra: comentário da própria pessoa recebe resposta

    Exemplo: A sugestão já está no commit
      Dado que o comentário é da pessoa que pediu o atendimento
      E a sugestão já está num commit
      Quando a habilidade trata o comentário
      Então a thread recebe a resposta com o commit
