# language: pt

Funcionalidade: Responder o pedido de dados da hospedagem

  Regra: dado sensível só sai com o sim da pessoa

    Exemplo: o anfitrião pede o documento dos hóspedes
      Dado que a hospedagem pediu nome e documento dos hóspedes na conversa da reserva
      Quando a habilidade monta a resposta
      Então ela mostra o rascunho com cada documento e o que falta
      E só envia depois do sim da pessoa

  Regra: só vai o que a hospedagem pediu

    Exemplo: o hotel pede só a lista de hóspedes e o horário
      Dado que o hotel pediu nomes e horário de chegada
      Quando a habilidade monta a resposta
      Então ela não manda documento nem telefone
