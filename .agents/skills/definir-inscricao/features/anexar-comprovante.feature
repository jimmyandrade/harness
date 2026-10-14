# language: pt

Funcionalidade: Comprovante da inscrição
  A foto do pedido confirmado fica na propriedade de comprovantes.

  Exemplo: Foto do pedido confirmado
    Dado que a inscrição de Ana Souza no Festival Rota Sul 2026 existe
    E a foto do pedido confirmado
    Quando a skill grava essa inscrição
    Então a foto fica nos comprovantes da inscrição
    E a foto não entra no corpo da página
