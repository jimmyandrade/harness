# language: pt
Funcionalidade: Rótulo de estado

  Regra: o item que só anda depois de algo fora dele leva o rótulo de estado

    Exemplo: O rótulo de estado falta no sistema
      Dado que a habilidade de origem escolheu o rótulo de estado blocked
      E o sistema não tem esse rótulo
      Quando a habilidade rotula o item
      Então o rótulo blocked é criado e aplicado

    Exemplo: O estado muda
      Dado que o item tem o rótulo blocked
      E o que faltava foi feito
      Quando a habilidade atualiza o item
      Então o item fica sem o rótulo blocked
