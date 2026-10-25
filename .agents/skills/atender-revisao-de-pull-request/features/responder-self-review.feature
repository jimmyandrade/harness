# language: pt
Funcionalidade: Resposta ao self review

  Regra: comentário da própria pessoa recebe resposta

    Exemplo: A sugestão já está no commit
      Dado que o comentário é da pessoa que pediu o atendimento
      E a sugestão já está num commit
      Quando a habilidade trata o comentário
      Então a thread recebe a resposta com o commit

  Regra: a resposta sai no idioma do comentário quando o projeto pede

    Exemplo: O self review está em português
      Dado que o projeto pede a resposta no idioma do comentário
      E o comentário de self review está em português
      Quando a habilidade responde a thread
      Então a resposta está em português
