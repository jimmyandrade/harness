# language: pt

Funcionalidade: Uma viagem canônica
  Origem, destino e datas que já casam atualizam a mesma viagem.

  Exemplo: A viagem que já existe
    Dado que já existe uma viagem com a mesma origem, o mesmo destino e as mesmas datas
    Quando a pessoa pede para cadastrar esta viagem
    Então a viagem que já existe recebe a atualização
    E nenhuma outra viagem é criada

  Exemplo: Dados novos na viagem canônica
    Dado que a pessoa responsável pela operação traz dados novos
    E já existe a viagem canônica dessa origem, desse destino e dessas datas
    Quando a pessoa pede para registrar esses dados
    Então esses dados entram na viagem canônica
    E nenhuma outra viagem é criada

  Exemplo: Cadastro sem correspondência
    Dado que não existe viagem canônica para essa origem, esse destino e essas datas
    E a pessoa responsável pela operação traz origem, destino, datas, hospedagem e investimentos
    Quando a pessoa pede para cadastrar a viagem
    Então uma viagem é criada
    E origem, destino, datas, hospedagem e investimentos ficam rastreáveis nela

  Exemplo: Cadastro sem rota
    Dado que falta a origem, o destino ou as datas
    Quando a pessoa pede para cadastrar a viagem
    Então a skill pede o que falta
    E nenhuma viagem é criada
