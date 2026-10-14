# language: pt

Funcionalidade: Etapas de viagem
  Cada ação de viagem recebe a etapa que a lista já tem.

  Esquema do Cenário: A etapa da ação
    Dado que a fonte traz <ação>
    Quando a pessoa pede para registrar o marco
    Então a etapa fica <etapa>

    Exemplos:
      | ação | etapa |
      | saída de casa, hotel ou ponto de encontro | Saída |
      | deslocamento geral sem marco mais específico | Ida |
      | confirmação da viagem ou entrada na hospedagem | Check-in |
      | entrada na aeronave ou em outro meio | Embarque |
      | partida efetiva do voo | Decolagem |
      | chegada efetiva do voo ao aeroporto | Pouso |
      | deslocamento organizado entre aeroporto, hospedagem e atividades | Transfer |
      | visita, compromisso ou programação | Atividade |
      | saída formal da hospedagem | Check-out |
      | deslocamento geral de retorno sem marco mais específico | Volta |
