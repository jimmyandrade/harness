# language: pt

Funcionalidade: Reservar tempo para uma carreira viva
  A marca ou o profissional em construção de reconhecimento reserva tempo antes da demanda espontânea.
  O mercado passa a ver o valor por essa presença.

  Regra: A reserva não espera a demanda

    Exemplo: Tempo reservado antes da demanda
      Dado que existe uma marca ou profissional em construção de reconhecimento
      E o tempo nomeado para atividade cultural, relacionamento, presença em eventos, bastidores, atividades do segmento ou estilo de vida
      Quando a reserva é feita
      Então o bloco fica no Google Agenda antes de existir demanda espontânea
      Mas a reserva não vira confirmação nem oportunidade

    Exemplo: Tempo não nomeado
      Dado que existe a intenção de reservar presença sem o tempo
      Quando a reserva é feita
      Então a skill pede o tempo
      Mas ela não inventa a duração nem espera a demanda

  Regra: A demanda é coerente com o negócio

    Exemplo: Ações reservadas antes da demanda
      Dado que existem ações de atividade cultural, relacionamento, prospecção, comunicação e participação em eventos coerentes com o negócio
      E o tempo que a pessoa nomeou
      Quando a demanda é criada
      Então o bloco fica reservado no Google Agenda antes da demanda espontânea
      Mas a reserva não vira confirmação nem oportunidade

    Exemplo: Ação sem coerência clara
      Dado que existe uma ação cuja coerência com o negócio não está clara
      Quando a demanda é criada
      Então a skill pede a coerência
      Mas ela não inventa o encaixe nem reserva a ação
