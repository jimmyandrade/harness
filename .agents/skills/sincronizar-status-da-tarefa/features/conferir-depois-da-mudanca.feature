# language: pt
Funcionalidade: Conferir o status depois da mudança

  Regra: a conferência acontece sem pedido de varredura

    Exemplo: um commit é criado
      Dado que um commit foi criado
      Quando o trabalho termina
      Então a habilidade de sincronizar o status da tarefa é seguida
      E a pessoa não precisou pedir a varredura

    Exemplo: o estado do pull request muda
      Dado que o estado de um pull request mudou
      Quando o trabalho termina
      Então a habilidade de sincronizar o status da tarefa é seguida
      E a pessoa não precisou pedir a varredura
