# language: pt

Funcionalidade: Carregar a skill nos momentos certos
  O roteador decide pela descrição se a skill carrega.
  A suíte cobre tarefa óbvia, pedido parafraseado, tópico sem relação e quase-acerto.

  Regra: Tarefa óbvia e paráfrase carregam a skill

    Exemplo: Tarefa óbvia
      Dada uma descrição que começa com "Use essa habilidade sempre que"
      E uma consulta que pede o que a descrição cobre
      Quando a pessoa faz esse pedido
      Então a skill é carregada

    Exemplo: Pedido parafraseado
      Dada a mesma intenção em outras palavras
      E a pessoa não nomeia o domínio
      Quando a pessoa faz esse pedido
      Então a skill é carregada

  Regra: Tópico sem relação e quase-acerto ficam de fora

    Exemplo: Tópico sem relação
      Dada uma consulta sem relação com o propósito
      Quando a pessoa faz esse pedido
      Então a skill fica de fora

    Exemplo: Quase-acerto fora do propósito
      Dada uma consulta com palavras em comum e outra tarefa
      E o propósito não inclui essa tarefa
      Quando a pessoa faz esse pedido
      Então a skill fica de fora
