# language: pt

Funcionalidade: Um bot coleta, o especialista responde
  Cada fonte tem um bot coletor.
  O resultado já gerado é reaproveitado antes de pedir de novo.

  Regra: Um bot coletor por fonte repassa ao especialista

    Exemplo: Caixa de e-mail lida por dois bots
      Dado que dois bots leem a mesma caixa de e-mail, um para cobrança e um para suporte
      Quando a pessoa pede para auditar as rotinas
      Então a resposta propõe um bot que coleta e organiza os e-mails
      E que repassa cada e-mail ao bot especialista naquele tipo de comunicação

  Regra: Antes de pedir de novo, procure o resultado já gerado

    Exemplo: Relatório que uma rotina já publicou
      Dado que uma rotina publica o relatório de vendas num canal compartilhado
      Quando a pessoa vai pedir o mesmo relatório numa conversa longa ou a outro bot
      Então a resposta aponta o relatório já publicado antes de gerar outro
