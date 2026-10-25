# language: pt
Funcionalidade: Hashes dos commits na resposta

  Regra: a resposta informa os hashes

    Exemplo: a tarefa gerou commits
      Dado que a tarefa gerou um ou mais commits
      Quando a resposta é entregue
      Então a resposta informa o hash de cada commit
