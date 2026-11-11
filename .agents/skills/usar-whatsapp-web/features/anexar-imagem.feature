# language: pt

Funcionalidade: Anexar imagem ou documento no WhatsApp Web

  Regra: A imagem nunca entra pela entrada de figurinha

    Exemplo: Anexar uma foto
      Dado que quem chama já tem o destino, o arquivo e o sim da pessoa
      Quando a habilidade anexa a imagem
      Então ela roda o script de captura antes de clicar em Fotos e vídeos
      E envia o arquivo à entrada capturada
      E a pré-visualização mostra o campo de legenda

    Exemplo: A pré-visualização sem legenda
      Dado que a pré-visualização não tem campo de legenda
      Quando a habilidade confere o anexo
      Então ela fecha no X e recomeça, porque seria uma figurinha

    Exemplo: Restaurar a página
      Dado que a imagem foi enviada ou o envio foi cancelado
      Quando a habilidade termina
      Então ela roda o script de restauração
