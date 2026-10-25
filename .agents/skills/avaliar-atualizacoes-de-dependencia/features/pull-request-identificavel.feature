# language: pt
Funcionalidade: Pull request de dependência identificável

  Regra: o pull request tem responsável e etiqueta

    Exemplo: o bot abre a atualização sem responsável nem etiqueta
      Dado que o Renovate abriu um pull request de dependência sem assignee e sem label
      Quando a habilidade avalia esse pull request
      Então o pull request fica com um assignee
      E o pull request fica com um label
