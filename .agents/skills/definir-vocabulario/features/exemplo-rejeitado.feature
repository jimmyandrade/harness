# language: pt
Funcionalidade: Exemplo ruim de um aviso
  A frase que só informa um estado entra como exemplo ruim.

  Regra: Aviso passivo é referência negativa

    Esquema do Cenário: Frase que só informa
      Dado que a frase "<frase>" aparece num aviso
      Quando ela só informa um estado
      Então ela fica proibida como exemplo ruim
      E a descrição registra que falta tensão para a pessoa agir

      Exemplos:
        | frase |
        | O item continua disponível |
        | O pedido está pronto |
