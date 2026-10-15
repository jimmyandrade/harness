# language: pt
Funcionalidade: Informar dados para pagamento com a chave Pix
  Quem vai pagar recebe a chave Pix principal junto com os dados da conta, quando o projeto exige.

  Regra: Com a chave Pix obrigatória, os dados para pagamento levam a chave principal

    Exemplo: Chave Pix principal já cadastrada na conta
      Dado que as instruções do projeto tornam a chave Pix obrigatória nos dados para pagamento
      E que a conta tem uma chave Pix principal aleatória cadastrada
      Quando a skill informa os dados para pagamento a uma pessoa que vai pagar
      Então a mensagem traz a chave Pix aleatória junto com os dados da conta
      Mas a skill não pergunta a chave à pessoa
