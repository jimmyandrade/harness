# language: pt

Funcionalidade: Frequência pela temperatura do dado e janelas por tipo de rotina
  A frequência parte de quanto a fonte muda de fato.
  Cada tipo de rotina roda na janela em que não atrapalha ninguém.

  Regra: A temperatura do dado decide a frequência

    Exemplo: Fonte que parece mudar a cada minuto
      Dado que a pessoa pede uma rotina que consulta a fonte a cada minuto
      E que as datas das últimas atualizações da fonte mostram uma mudança por dia
      Quando a rotina é criada
      Então a resposta mostra a temperatura medida e propõe rodar uma vez por dia

    Exemplo: Fonte com RSS
      Dado que a fonte publica um feed RSS
      Quando a rotina é criada
      Então ela dispara pelo feed, sem consulta periódica

  Regra: Manutenção e processamento pesado rodam na `Janela de manutenção`

    Exemplo: Limpeza diária
      Dado que a rotina limpa registros antigos e não avisa ninguém
      Quando a rotina é criada
      Então ela roda na `Janela de manutenção`, fora do `Horário comercial`

  Regra: O fim do período segue `Ao fim do período`

    Exemplo: Rotina de uma campanha
      Dado que a rotina acompanha uma campanha com data de fim
      E que `Ao fim do período` está em `pausar`
      Quando a campanha termina
      Então a rotina é pausada, com o motivo na descrição dela

  Regra: O relatório segue `Cadência de relatório`

    Exemplo: Relatório com o padrão
      Dado que `Cadência de relatório` está em `semanal`
      Quando a pessoa pede uma rotina de relatório de vendas
      Então ela roda uma vez por semana, no `Horário comercial`
