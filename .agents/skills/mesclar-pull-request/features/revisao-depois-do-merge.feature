# language: pt

Funcionalidade: Revisão sem tratamento depois do merge
  Depois do merge, o comentário de revisão que ninguém tratou não se perde.

  Regra: No PR da pessoa, os ajustes viram um PR novo

    Exemplo: Revisão pendente da pessoa no próprio PR
      Dado que a pessoa mesclou o próprio PR com uma revisão pendente que pede uma mudança
      Quando ela avisa que o PR foi mesclado
      Então um PR novo, a partir da base, traz o ajuste do comentário
      E a resposta tem o link desse PR

  Regra: No PR de outra pessoa, cada comentário espera a decisão

    Exemplo: Thread sem resolver no PR de outra pessoa
      Dado que um PR de outra pessoa foi mesclado com uma thread sem resolver
      Quando o merge é avisado
      Então a pessoa escolhe uma ação só para o comentário: resolver, responder, abrir uma issue ou abrir um PR
      E nada é feito com ele antes da resposta
