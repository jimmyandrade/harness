# language: pt
Funcionalidade: Grafia no título do evento
  O nome do pedido não vira o título sem conferência.

  Regra: Nome de evento devolve a forma canônica

    Exemplo: Grafia diferente no pedido da reunião
      Dado que existe um nome de empresa no pedido de um evento
      Quando a skill confere a grafia
      Então devolve a forma canônica
      E não grava o evento
