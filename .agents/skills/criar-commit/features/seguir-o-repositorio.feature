# language: pt

Funcionalidade: Seguir a convenção do repositório
  A convenção que o repositório documenta vale mais que a preferência pessoal.

  Regra: Mensagem e branch seguem o que o repositório escreve

    Exemplo: Repositório que documenta o formato da mensagem
      Dado que o `CONTRIBUTING.md` do repositório define o formato da mensagem de commit
      E que a preferência pessoal pede outro formato
      Quando a skill escreve a mensagem
      Então a mensagem segue o formato do repositório
