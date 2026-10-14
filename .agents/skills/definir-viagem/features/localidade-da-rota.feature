# language: pt

Funcionalidade: Origem e destino na localidade
  A viagem consulta a lista de localidades para ligar a origem e o destino.

  Exemplo: Cidade que já existe
    Dado que Belo Horizonte já está na lista de localidades
    Quando a pessoa pede para registrar a viagem com origem BH
    Então a origem fica ligada a essa localidade
    E nenhuma localidade nova é criada

  Exemplo: Cidade ausente
    Dado que a cidade da origem não está na lista de localidades
    Quando a pessoa pede para registrar a viagem
    Então a origem fica vazia
    E a lacuna fica nomeada na viagem
    E nenhuma localidade nova é criada
