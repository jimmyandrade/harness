# language: pt

Funcionalidade: Rotina que gasta só o necessário
  Cada execução de uma rotina consome uso.
  A rotina roda quando o resultado tem quem o use.

  Regra: A frequência segue a necessidade do resultado

    Exemplo: Coleta que não precisa de dado fresco
      Dado que a pessoa pede uma rotina diária que coleta editais publicados
      Quando a rotina é criada
      Então ela roda só em dias úteis

    Exemplo: Rotina que avisa uma pessoa
      Dado que a rotina confere a caixa de entrada e avisa quem precisa responder
      Quando a rotina é criada
      Então ela roda só no `Horário comercial`, nunca à noite nem no fim de semana

  Regra: Gatilho no lugar da consulta periódica

    Exemplo: Fonte que avisa quando muda
      Dado que a fonte oferece webhook ou notificação
      Quando a pessoa pede uma rotina que consulta a fonte a cada hora
      Então a rotina dispara na chegada do evento

    Exemplo: Página sem gatilho vigiada por diff
      Dado que a fonte é uma página sem webhook nem RSS
      E que há um monitor que compara a página com a última versão guardada
      Quando a pessoa pede uma rotina que relê a página todo dia
      Então a rotina dispara quando o diff mostra mudança e lê só o trecho que mudou

    Exemplo: Página sem monitor disponível
      Dado que a fonte é uma página sem webhook nem RSS
      E que não há monitor de mudança de página
      Quando a rotina é criada
      Então ela consulta a página pela temperatura medida
      E a resposta diz que um monitor por diff dispensaria a releitura

  Regra: A auditoria propõe e não apaga

    Exemplo: Três rotinas leem a mesma caixa de e-mail
      Dado que três rotinas consultam a mesma caixa de entrada
      Quando a pessoa pede para auditar as rotinas
      Então a resposta propõe juntá-las numa rotina só
      E uma rotina que ninguém usa mais é pausada, não apagada

    Exemplo: Pedido de rotina para vigiar o consumo
      Dado que a pessoa pede uma rotina que confere o consumo de uso a cada hora
      Quando a rotina seria criada
      Então a resposta explica que cada conferência também consome e não cria a rotina
