# language: pt

Funcionalidade: Arquivo que o chat mostra como miniatura borrada

  Regra: o arquivo que não baixa é pedido à pessoa

    Exemplo: comprovante em miniatura borrada
      Dado que a conversa mostra o comprovante como uma miniatura borrada
      Quando a habilidade tenta baixar o arquivo no WhatsApp Web
      Então ela diz que o WhatsApp Web não baixa esse arquivo
      E pede o arquivo à pessoa, em vez de tentar de novo
