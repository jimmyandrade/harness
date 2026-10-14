# language: pt

Funcionalidade: Representar vários dias de forma legível
  Cada dia confirmado de participação fica achável.

  Regra: Dia confirmado não some num intervalo

    Exemplo: Mais de um dia da mesma oportunidade
      Dado que a empresa participa de mais de um dia da mesma oportunidade
      Quando a skill cria os eventos na agenda
      Então prefere um evento por dia
      E isso vale quando melhora leitura, busca, logística ou alteração

    Exemplo: Título com a posição do dia
      Dado que há mais de um dia confirmado
      Quando a skill cria os títulos
      Então cada título indica Dia 1/2, Dia 2/2 ou equivalente

    Exemplo: A viagem ou ocupação contínua
      Dado que existe um compromisso contínuo de viagem ou ocupação de longa duração
      Quando um intervalo representa melhor a operação
      Então a skill pode usar dia inteiro ou intervalo
      Mas não junta dias de participação que ficam melhores separados
