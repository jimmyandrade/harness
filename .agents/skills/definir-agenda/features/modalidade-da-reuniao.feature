# language: pt
Funcionalidade: Modalidade da reunião
  A reunião diz se é presencial ou remota.

  Regra: Reunião remota ganha link do Meet

    Exemplo: Pedido sem modalidade
      Dado que existe um pedido de reunião sem dizer se é presencial ou remota
      Quando a skill for criar o evento
      Então a skill confirma a modalidade
      E se for remota cria o link do Google Meet
      Mas se for presencial não cria o link
