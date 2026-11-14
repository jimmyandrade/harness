# language: pt
Funcionalidade: Guardar a programação para escolher depois
  Regra: Armazenamento não confirma participação
    Exemplo: A pessoa pede toda a programação no cronograma da oportunidade
      Dado que a programação consultada tem sessões e uma oportunidade identificada
      Quando a pessoa pede toda a programação no cronograma ligado à oportunidade para escolher depois
      Então todas as sessões publicadas ficam vinculadas à oportunidade com os horários informados
      E nenhuma sessão é escolhida nem inscrita e nenhum evento é criado no calendário
