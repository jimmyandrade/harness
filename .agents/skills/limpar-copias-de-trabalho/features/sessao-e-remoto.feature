# language: pt
Funcionalidade: Decidir se a cópia vale limpar

  Regra: a decisão usa a sessão aberta e o pull request no remoto

    Exemplo: outra sessão está na pasta
      Dado que uma cópia foi mantida
      E um terminal aberto está nessa pasta
      Quando a habilidade confere se vale limpar
      Então a cópia fica
      E a resposta diz que uma sessão aberta usa a pasta

    Exemplo: o remoto tem pull request mesclado e nenhuma sessão usa a pasta
      Dado que uma cópia foi mantida
      E o remoto tem pull request mesclado dessa branch
      E nenhuma sessão aberta usa a pasta
      Quando a habilidade confere se vale limpar
      Então a cópia pode sair
      E a resposta traz o link do pull request

    Exemplo: o remoto tem pull request aberto e nenhuma sessão usa a pasta
      Dado que uma cópia foi mantida
      E o remoto tem pull request aberto dessa branch
      E nenhuma sessão aberta usa a pasta
      Quando a habilidade confere se vale limpar
      Então a cópia pode sair se as outras conferências passarem
      E a resposta traz o link do pull request aberto
