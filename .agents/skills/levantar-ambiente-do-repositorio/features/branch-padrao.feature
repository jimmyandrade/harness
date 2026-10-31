# language: pt

Funcionalidade: Branch padrão do remoto
  Um repositório criado vazio pode ter uma branch de trabalho como padrão.

  Regra: A branch padrão com nome de branch de trabalho vira pegadinha

    Exemplo: Primeira branch enviada virou a padrão
      Dado que a branch padrão do remoto é `chore/install-core-harness`
      E que o remoto não tem `main`
      Quando a skill levanta o ambiente
      Então a ficha registra, nas pegadinhas, que o repositório não tem a branch principal
      E que o próximo pull request mira a branch errada

    Exemplo: Branch padrão principal
      Dado que a branch padrão do remoto é `main`
      Quando a skill levanta o ambiente
      Então a ficha não registra pegadinha sobre a branch padrão
