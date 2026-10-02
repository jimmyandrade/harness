# language: pt

Funcionalidade: Carregar a skill nos momentos certos
  O roteador decide pela descrição se a skill carrega.
  A suíte cobre tarefa óbvia, pedido parafraseado, tópico sem relação e quase-acerto.

  Regra: Tarefa óbvia e paráfrase carregam a skill

    Exemplo: Tarefa óbvia
      Dado que a descrição começa com "Use essa habilidade sempre que"
      E a consulta pede o que a descrição cobre
      Quando a pessoa faz esse pedido
      Então a skill é carregada

    Exemplo: Pedido parafraseado
      Dado que a pessoa diz a mesma intenção em outras palavras
      E a pessoa não nomeia o domínio
      Quando a pessoa faz esse pedido
      Então a skill é carregada

  Regra: Tópico sem relação e quase-acerto ficam de fora

    Exemplo: Tópico sem relação
      Dado que a consulta não tem relação com o propósito
      Quando a pessoa faz esse pedido
      Então a skill fica de fora

    Exemplo: Quase-acerto fora do propósito
      Dado que a consulta tem palavras em comum e pede outra tarefa
      E o propósito não inclui essa tarefa
      Quando a pessoa faz esse pedido
      Então a skill fica de fora
