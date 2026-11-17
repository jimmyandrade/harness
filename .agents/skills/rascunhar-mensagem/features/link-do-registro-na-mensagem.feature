# language: pt

Funcionalidade: Link do registro na mensagem de andamento

  Regra: quem lê o andamento acha o registro do trabalho

    Exemplo: resposta dizendo que a investigação começou
      Dado que a tarefa da investigação já foi criada
      Quando a habilidade redige a resposta dizendo que a investigação está em andamento
      Então a mensagem leva o link dessa tarefa

    Exemplo: andamento sem registro
      Dado que o trabalho citado ainda não tem tarefa nem página
      Quando a pessoa pede para avisar que o trabalho está em andamento
      Então a habilidade cria a tarefa antes de redigir
      E a mensagem leva o link dela
