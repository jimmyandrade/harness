# language: pt
Funcionalidade: Explicar a substituição da branch publicada

  Regra: a resposta diz o que acontece

    Exemplo: a história da branch foi reescrita
      Dado que a branch já está no GitHub
      E que o rebase trocou os commits
      Quando a resposta pede autorização para publicar
      Então a resposta diz que a branch no GitHub será substituída e que a base não muda
