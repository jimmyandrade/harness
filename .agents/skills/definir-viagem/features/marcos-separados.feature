# language: pt

Funcionalidade: Marcos separados
  Embarque e decolagem permanecem em linhas distintas, e a hora ausente permanece vazia.

  Exemplo: Decolagem sem hora
    Dado que a pessoa pediu para registrar embarque e decolagem
    E a decolagem veio sem hora
    Quando a pessoa pede esse registro
    Então embarque e decolagem entram em linhas separadas do cronograma
    E a hora da decolagem fica vazia

  Exemplo: Início sem término
    Dado que a fonte informa o horário de um acontecimento e não informa o término
    Quando a pessoa pede para registrar esse marco
    Então o horário entra no início planejado
    E o fim planejado fica vazio
    E o início real e o fim real ficam vazios

  Exemplo: A data sem horário
    Dado que a data do transfer é conhecida e o horário está pendente
    Quando a pessoa pede para registrar o transfer no cronograma
    Então o transfer entra só com a data
    E a pendência fica no contexto
    E nenhum horário aproximado é criado

  Exemplo: Hora que chega depois
    Dado que o transfer já está no cronograma só com a data
    Quando a pessoa traz o horário confirmado desse transfer
    Então a mesma linha recebe o horário
    E nenhuma segunda linha é criada

  Exemplo: Só o início real
    Dado que a confirmação posterior traz só o início realizado
    Quando a pessoa pede para registrar esse horário
    Então o início real recebe esse horário
    E o fim real fica vazio

  Exemplo: Linha do tempo da pessoa viajante
    Dado que a pessoa viajante traz chegada ao aeroporto, check-in, embarque, decolagem, pouso, transfer, atividade e check-out
    E cada marco tem data ou horário próprio
    Quando a pessoa pede para registrar esses marcos
    Então cada marco entra numa linha do cronograma
    E status, horário planejado e horário real ficam independentes em cada linha
