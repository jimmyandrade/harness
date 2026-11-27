# language: pt

Funcionalidade: Registrar o pedido e o prazo lidos na conversa
  Um pedido ou prazo dirigido à marca, lido numa conversa, num grupo, num e-mail ou num áudio, que ainda não consta nos registros, é registrado na hora por quem leu.

  Regra: O prazo dito só na conversa vai para os registros sem esperar a cobrança

    Exemplo: Grupo de uma loja coletiva cobra imagens para o card de divulgação
      Dado que o grupo de uma loja coletiva avisa de manhã "quem não enviar até hoje não terá o card"
      E que o pedido das imagens, feito semanas antes, não trazia data
      E que nenhuma tarefa, etapa do cronograma ou evento da agenda cita o pedido
      Quando a conversa é lida
      Então a tarefa ou a etapa é registrada com o prazo e a fonte: quem disse, onde e quando
      E a data entra na agenda, porque o prazo tem data
      E o mesmo resumo diz o que pediram, até quando e se o prazo já passou

    Exemplo: Pedido sem prazo
      Dado que um contato pede o material de divulgação sem dizer até quando
      Quando a conversa é lida
      Então o pedido é registrado com o prazo vazio
      E o prazo dito depois só atualiza o registro

  Regra: Em grupo, as marcas ou pessoas cobradas são listadas pelo nome

    Exemplo: A marca não está na lista dos cobrados
      Dado que o grupo cobra o material de três marcas pelo nome
      Quando a conversa é lida
      Então o resumo lista os três nomes
      E diz se a marca está entre eles
