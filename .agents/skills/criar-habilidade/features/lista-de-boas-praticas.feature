# language: pt

Funcionalidade: Lista de boas práticas não vira skill
  Uma skill faz uma tarefa.
  Uma boa prática entra na skill da tarefa em que ela se aplica.

  Regra: Cada prática vai para a skill da tarefa

    Exemplo: Pedido de uma skill de boas práticas de rotinas
      Dado que a pessoa envia uma lista de boas práticas de rotinas agendadas
      Quando ela pede uma skill com essas práticas
      Então nenhuma skill de boas práticas é criada
      E cada prática vai para a skill que faz a tarefa em que ela se aplica, com evoluir-habilidade
      E a skill nova só é proposta para a tarefa que nenhuma skill cobre, com o nome da tarefa
