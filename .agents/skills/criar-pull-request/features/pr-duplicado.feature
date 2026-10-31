# language: pt

Funcionalidade: Um PR por mudança
  Antes de abrir, procure o PR que já leva a mesma mudança.

  Regra: O PR aberto com o mesmo commit ou o mesmo título é atualizado

    Exemplo: Outro agente já abriu o PR da mesma mudança
      Dado que um agente de código abriu um PR com o mesmo título, de outra branch
      Quando a mudança vai virar pull request
      Então nenhum PR novo é aberto
      E a resposta aponta o PR que já existe e o que falta nele
