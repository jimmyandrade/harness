# language: pt

Funcionalidade: Plano informado entra na agenda
  Um plano com dia já dito vira evento na agenda, sem pedir permissão.

  Exemplo: Malas em 13/10/2026 e cuidado em 14/10/2026
    Dado que a pessoa informou malas e carro na terça-feira, 13/10/2026
    E informou cuidado e viagem não confirmada na quarta-feira, 14/10/2026, sem hora de saída
    Quando a pessoa informa esse plano
    Então os blocos entram na agenda sem pergunta de permissão
    E a resposta propõe reservar a saída com horário aproximado ou o dia inteiro

  Exemplo: Saída de viagem confirmada sem hora
    Dado que a viagem de quarta-feira, 14/10/2026, está confirmada
    E a pessoa não informou a hora de saída
    Quando a pessoa pede para colocar a saída na agenda
    Então a resposta pede a hora de saída
    E a saída não é gravada sem a hora
