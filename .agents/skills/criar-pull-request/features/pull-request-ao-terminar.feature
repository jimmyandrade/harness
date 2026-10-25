# language: pt
Funcionalidade: Pull request ao terminar a mudança de código

  Regra: o parâmetro decide se o pull request abre sem um pedido separado

    Exemplo: o parâmetro manda criar o pull request
      Dado que o parâmetro de criar o pull request ao terminar está ligado
      E a mudança de código já está em commits
      Quando a tarefa termina
      Então o pull request é aberto
      E a resposta informa o hash de cada commit

    Exemplo: o padrão abre o rascunho
      Dado que o parâmetro de criar o pull request ao terminar está em rascunho
      E a mudança de código já está em commits
      Quando a tarefa termina
      Então a branch está no GitHub
      E o pull request está aberto em rascunho
      E a resposta diz o nome da branch, se ela subiu e o link do pull request

    Exemplo: o parâmetro espera o pedido
      Dado que o parâmetro de criar o pull request ao terminar está desligado
      E a pessoa não pediu para publicar
      Quando a tarefa termina
      Então a resposta diz o nome da branch e que o pull request não está aberto
      E a resposta informa o hash de cada commit
