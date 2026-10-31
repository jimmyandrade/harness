# language: pt

Funcionalidade: Dividir o rascunho em mensagens
  A divisão do rascunho e o comunicado em mensagem única vêm de parâmetros.

  Regra: A divisão segue `Dividir em mensagens curtas`

    Exemplo: Divisão ligada, o padrão
      Dado que `Dividir em mensagens curtas` está em `sim`
      Quando o rascunho tem três ideias
      Então ele aparece e é enviado em três mensagens, na mesma ordem

    Exemplo: Divisão desligada
      Dado que `Dividir em mensagens curtas` está em `não`
      Quando o rascunho tem três ideias
      Então ele vai numa mensagem só, com uma linha em branco entre as ideias

  Regra: O comunicado segue `Comunicado numa mensagem só`

    Exemplo: Comunicado com o padrão
      Dado que `Comunicado numa mensagem só` está em `sim`
      E que o projeto preencheu `Mensagem única para` com outros tipos
      Quando o rascunho é um comunicado de produto
      Então ele vai numa mensagem só
