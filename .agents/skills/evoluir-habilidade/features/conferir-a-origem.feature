# language: pt
Funcionalidade: Conferir a origem antes de alterar a skill

  Regra: a cópia instalada não recebe a edição

    Exemplo: a skill vem do core
      Dado que a skill deste projeto vem do core por dependência
      E que a pessoa pediu para alterar essa skill
      Quando a alteração é gravada
      Então ela fica no repositório do core e a cópia instalada permanece igual
