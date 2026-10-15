# language: pt
Funcionalidade: Compartilhar a conta com quem vai pagar
  Quem vai pagar recebe a chave Pix junto com os dados da conta, quando o projeto exige.

  Regra: Com a chave Pix exigida, a conta repassada leva a chave

    Exemplo: Conta repassada a quem vai fazer o pagamento
      Dado que as instruções do projeto exigem a chave Pix
      E que a conta tem uma chave Pix aleatória
      Quando a skill repassa a conta a uma pessoa que vai fazer o pagamento
      Então a mensagem traz a chave Pix aleatória junto com os dados da conta
