# language: pt

Funcionalidade: Mensagens não lidas antes de enviar

  Regra: com ler e mostrar, as não lidas aparecem antes do envio

    Exemplo: o grupo tem uma menção à pessoa entre as não lidas
      Dado que o grupo de destino tem mensagens não lidas
      E que uma delas marca a pessoa com um pedido
      Quando a pessoa aprova uma mensagem para esse grupo
      Então a habilidade mostra primeiro o pedido para a pessoa
      E pergunta se envia agora ou espera, antes de enviar

  Regra: com perguntar antes de abrir, a leitura espera o sim

    Exemplo: a pessoa prefere ler sozinha
      Dado que o parâmetro está em perguntar antes de abrir
      Quando a habilidade precisa abrir uma conversa com mensagens não lidas
      Então ela avisa que abrir marca as mensagens como lidas
      E abre só depois do sim
