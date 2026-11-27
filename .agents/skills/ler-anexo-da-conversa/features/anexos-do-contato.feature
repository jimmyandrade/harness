# language: pt

Funcionalidade: Ler os anexos da conversa
  Todo anexo da conversa é aberto e entregue a quem sabe lê-lo, sem a pessoa pedir, e o resultado vai para o registro e para o cadastro do assunto.

  Regra: O anexo é lido, não listado

    Exemplo: Fichas técnicas de tecido em PDF
      Dado que a fornecedora de tecidos mandou três PDFs de ficha técnica
      Quando a conversa é lida
      Então cada PDF é baixado e lido na mesma leitura
      E os dados vão para o cadastro do tecido, com a ficha no campo de arquivo
      E a resposta diz o que mudou e o que não bate, como o código da etiqueta diferente do da lista de preços

    Exemplo: Lista de preços cita um item encomendado
      Dado que a lista de preços cita um tecido que a pessoa encomendou
      Quando a lista é lida
      Então a resposta pergunta a situação do pedido, como a cor, o pagamento e a chegada
      E a resposta gravada vai na página do item, sem dedução

    Exemplo: Documento técnico com imagem dentro
      Dado que o PDF de ficha técnica traz a etiqueta como imagem
      Quando o PDF é lido
      Então o texto do PDF é lido direto
      E a imagem da etiqueta é lida por `reconhecer-imagem`

  Regra: O áudio vira texto na mesma rodada

    Exemplo: Áudio na exportação da conversa
      Dado que a exportação da conversa traz um áudio como arquivo
      Quando a conversa é lida, mesmo só para registrar o histórico
      Então o áudio é transcrito por `transcrever-audio-e-video`, sem perguntar
      E o comentário datado do registro traz o texto inteiro, com a palavra duvidosa marcada como incerta

    Exemplo: Reação ao áudio transcrito
      Dado que `Reação ao áudio transcrito` está preenchida
      Quando o áudio é transcrito
      Então a conversa recebe a reação ao áudio, sem perguntar

    Exemplo: Exportação sem mídia
      Dado que a exportação veio sem os arquivos de mídia
      Quando a conversa é lida
      Então a resposta diz que o áudio não veio e pede o arquivo
