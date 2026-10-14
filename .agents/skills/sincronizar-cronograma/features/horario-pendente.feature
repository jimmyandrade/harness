# language: pt

Funcionalidade: Não poluir a agenda com dia inteiro sem horário
  Item com data e sem início e fim confirmados fica fora da agenda.
  Dia inteiro não substitui horário ausente.

  Regra: O marcador sem horário não vira evento de dia inteiro

    Exemplo: Só a data
      Dado que existe um item de viagem, missão, oportunidade ou o cronograma com data e sem horário confirmado
      Quando a skill sincroniza o item com a agenda
      Então nenhum evento de dia inteiro é criado
      E o item permanece no cronograma pendente de horário e fora da agenda

    Exemplo: Dia inteiro confirmado
      Dado que existe um item sem horário de início e fim
      Quando a pessoa confirma que o compromisso é de dia inteiro
      Então o evento de dia inteiro pode entrar
      Mas o formato de dia inteiro não cobre horário ausente

    Exemplo: Evidência posterior
      Dado que existe um item pendente de horário
      Quando comprovante, foto, mensagem, localização ou relato revela o horário
      Então o início real e o fim real são atualizados
      E o planejamento original permanece

    Exemplo: Momentos distintos
      Dado que existe uma evidência que revela embarque e happy hour
      Quando os dois são compromissos reais diferentes
      Então cada um vira um item atômico separado

    Exemplo: Fim sem autorização
      Dado que existe um item sem fim explícito e sem autorização para usar o próximo marco
      Quando não há próximo marco nem duração técnica autorizada
      Então o fim permanece pendente
      Mas nenhuma duração é inventada

    Exemplo: Marcador antigo
      Dado que existe um evento de dia inteiro criado só como marcador
      Quando um horário real substitui esse marcador
      Então o evento antigo é convertido, atualizado ou removido
      E uma nova leitura da agenda não encontra dia inteiro usado só como marcador
