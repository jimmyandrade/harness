# language: pt

Funcionalidade: Resolver os comentários antes do merge
  Nenhum pull request é mesclado com comentário de pessoa ou de bot sem tratamento.

  Regra: Cada comentário é conferido antes do merge

    Exemplo: Comentário que ainda faz sentido
      Dado um comentário de pessoa ou de bot que aponta um problema no código atual do PR
      Quando a pessoa pede o merge
      Então o código é alterado na branch do PR
      E a thread recebe uma resposta com o que mudou
      E a thread é resolvida

    Exemplo: Comentário que não faz mais sentido
      Dado um comentário cujo problema não está mais no código atual do PR
      Quando a pessoa pede o merge
      Então a thread recebe uma resposta que explica por que ele não faz mais sentido
      E a thread é resolvida

    Exemplo: Comentário sem resposta
      Dada uma thread que ainda não foi atendida nem explicada
      Quando a pessoa pede o merge
      Então o placar mostra a thread aberta
      Mas a thread não é resolvida sem resposta
