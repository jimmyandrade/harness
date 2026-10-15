# language: pt

Funcionalidade: Numeração canônica do ponto de contato
  O número do ponto manda no título da agenda.

  Regra: Pontos de contato guarda a numeração

    Exemplo: Número divergente
      Dado que existe um evento de agenda ligado a um ponto de contato físico
      E o número do título da agenda diverge do número em Pontos de contato
      Quando a skill confere a numeração
      Então Pontos de contato é a fonte da ordenação e da numeração
      E o título da agenda pode estar desatualizado

    Exemplo: Não é outro evento
      Dado que o número do calendário é diferente do número do ponto de contato
      Quando a skill compara os dois
      Então não conclui que são eventos diferentes só por esse número
      E cruza data, horário, nome, local, cidade, grupo, oportunidade e descrição

    Exemplo: Correspondência confirmada
      Dado que a correspondência entre o evento e o ponto está confirmada
      Quando a pessoa não pediu só diagnóstico
      Então a skill atualiza o título da agenda para a numeração canônica

    Exemplo: Só diagnóstico
      Dado que a pessoa pediu só diagnóstico
      Quando o número da agenda diverge do ponto
      Então a skill explica a divergência
      Mas não altera o evento

    Exemplo: Correspondência ambígua
      Dado que a correspondência ainda está ambígua
      Quando a skill ainda não confirmou o ponto
      Então explica o que bate e o que diverge
      E pede confirmação antes de renomear, criar ou alterar
