# language: pt
Funcionalidade: Cotação ao fornecedor

  Regra: toda cotação traz o CNPJ e o e-mail de quem compra

    Exemplo: A mensagem sai com os dois dados
      Dado que a pessoa aprovou o texto da cotação
      Quando a habilidade envia a mensagem à empresa
      Então a mensagem termina com o CNPJ e o e-mail de quem compra

  Regra: a empresa recebe cada informação num canal só

    Exemplo: A atendente já respondeu no WhatsApp
      Dado que uma pessoa da empresa já respondeu num chat
      Quando a habilidade tem uma informação nova para a empresa
      Então ela envia só ao chat onde a resposta começou
      E não repete o texto no chat geral da empresa

  Regra: o pedido mínimo e a quantidade não se misturam

    Exemplo: O mínimo da empresa passa do necessário
      Dado que o mínimo da empresa passa da quantidade necessária
      Quando a habilidade lê a resposta
      Então ela diz à pessoa o excesso que sobraria
      E não muda a quantidade da pessoa
