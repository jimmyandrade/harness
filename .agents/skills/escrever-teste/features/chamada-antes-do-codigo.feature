# language: pt
Funcionalidade: Chamada de escrever teste numa tarefa de código

  Regra: a habilidade é chamada antes do código

    Exemplo: o repositório não tem comando de teste
      Dado que a tarefa muda código do repositório
      E o repositório não tem comando de teste
      Quando o agente executa a tarefa
      Então escrever-teste é chamada antes do código
      E o agente diz que não há comando de teste
