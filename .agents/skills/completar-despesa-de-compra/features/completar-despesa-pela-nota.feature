# language: pt

Funcionalidade: Completar a despesa de uma compra pela nota fiscal
  A recebedora e o comprovante saem do pedido, não do nome da plataforma.

  Regra: A nota fiscal do pedido identifica quem vendeu

    Exemplo: Compra num marketplace com nota fiscal
      Dado que a despesa tem só o nome da plataforma como recebedora
      E que o pedido tem uma nota fiscal emitida
      Quando a skill completa a despesa
      Então cadastra o emitente da nota como recebedora
      E anexa o PDF e o XML da nota à despesa
      Mas não pede o sim para baixar a nota

    Exemplo: Compra sem nota fiscal
      Dado que a nota fiscal ainda não foi gerada
      Quando a skill completa a despesa
      Então anexa as telas dos detalhes da compra como comprovante mínimo
