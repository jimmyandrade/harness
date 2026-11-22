# language: pt

Funcionalidade: Ligar o gasto ao cartão que o pagou
  Um gasto da empresa pago no cartão de pessoa física fica rastreável.

  Regra: O cartão tem página própria e o gasto continua da empresa

    Exemplo: Cartão de pessoa física pagou a compra da empresa
      Dado que a compra é da empresa e foi paga no cartão de uma pessoa física
      Quando a skill cadastra o cartão
      Então a página guarda o titular, a bandeira e os quatro últimos dígitos
      E a observação diz que o cartão é usado em compras da empresa
      Mas a skill não grava o número completo nem o código de segurança

    Exemplo: Lista de cartões com outro nome
      Dado que a pessoa indicou a lista
      Quando a skill não acha a lista pela palavra cartão
      Então abre a lista indicada
      Mas não diz que a lista não existe
