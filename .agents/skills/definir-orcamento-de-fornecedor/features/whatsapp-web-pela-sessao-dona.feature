# language: pt

Funcionalidade: Ler o orçamento no WhatsApp Web pela sessão dona

  Regra: o acesso ao WhatsApp Web segue `usar-whatsapp-web`

    Exemplo: o orçamento está num PDF da conversa
      Dado que o orçamento chegou como PDF na conversa do fornecedor
      Quando a habilidade precisa abrir o PDF no WhatsApp Web
      Então ela segue `usar-whatsapp-web` e pede a leitura à sessão dona
      E não abre uma aba própria do WhatsApp Web

    Exemplo: o PDF não traz o texto na página
      Dado que o visualizador do WhatsApp Web não traz o texto do PDF
      Quando a leitura é feita pela sessão dona
      Então o PDF é lido por captura de tela, até o rodapé com a validade
