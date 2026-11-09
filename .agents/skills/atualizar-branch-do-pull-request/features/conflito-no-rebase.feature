# language: pt
Funcionalidade: Escolher como tratar o conflito de um rebase

  Regra: o parâmetro `Conflito no rebase` decide quando perguntar

    Exemplo: modo resolver
      Dado que `Conflito no rebase` é `resolver`
      E que o rebase da branch tem um conflito
      Quando a habilidade atualiza a branch
      Então o conflito é resolvido à mão nos commits rebaseados, sem pergunta

    Exemplo: modo perguntar
      Dado que `Conflito no rebase` é `perguntar`
      E que o rebase da branch tem um conflito
      Quando a habilidade atualiza a branch
      Então ela mostra o arquivo e as duas versões e espera a resposta antes de resolver

    Exemplo: modo automático com perda possível
      Dado que `Conflito no rebase` é `automático`
      E que resolver o conflito descartaria linhas de um dos lados
      Quando a habilidade atualiza a branch
      Então ela pergunta e diz o que se perderia

    Exemplo: sem ninguém para responder
      Dado que a execução é agendada e `Conflito no rebase` manda perguntar
      Quando o rebase dá conflito
      Então o rebase é abortado e os arquivos em conflito são listados
