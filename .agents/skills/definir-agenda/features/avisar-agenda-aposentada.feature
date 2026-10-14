# language: pt

Funcionalidade: Avisar evento em agenda aposentada ao criar
  Criar um evento avisa quando um calendário aposentado ainda tem compromisso.

  Regra: O evento novo não entra na agenda aposentada

    Exemplo: Já existe evento na agenda aposentada
      Dado que existe um pedido para criar um evento
      E um evento já criado numa agenda de uso aposentada
      Quando a skill vai criar
      Então ela avisa que o produto não é mais usado e mostra o compromisso
      E não grava o evento novo nesse calendário
