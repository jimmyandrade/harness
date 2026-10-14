# language: pt

Funcionalidade: Planejar o mês financeiro
  Previsão e meta que ninguém disse não entram no plano.

  Regra: O plano pede o que falta

    Exemplo: Mês sem meta de lucro
      Dado que existe um pedido de planejamento do mês
      E a meta de lucro não foi dita
      Quando a skill monta o plano
      Então pergunta a meta
      Mas não inventa a previsão de vendas
