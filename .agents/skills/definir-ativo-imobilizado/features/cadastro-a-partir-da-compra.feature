# language: pt

Funcionalidade: Cadastrar ativo imobilizado a partir de compra
  A pessoa que comprou um bem durável quer o item rastreável.

  Exemplo: Compra vira ativo com origem financeira
    Dado que existe uma pessoa que comprou um bem durável para a oRnii
    E uma despesa ou investimento dessa compra
    Quando o cadastro cria ou vincula o item na lista de ativos imobilizados
    Então o bem fica rastreável pela origem financeira
    E o valor pago, a data de compra e o responsável ficam no bem
