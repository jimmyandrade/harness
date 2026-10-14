# language: pt

Funcionalidade: Deslocamento para os voos
  O número do voo e a decolagem da ida e da volta servem para decidir a ida e a busca no aeroporto.

  Exemplo: Ida e busca no aeroporto
    Dado que a pessoa viajante quer saber quem a leva e quem a busca, ou se precisa de ônibus
    E a viagem tem trechos de ida e de volta
    Quando a pessoa pede para planejar o deslocamento para os voos
    Então a resposta traz o número do voo e o horário de decolagem de cada trecho
    E embarque e os outros marcos não entram no lugar da decolagem
