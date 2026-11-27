# language: pt

Funcionalidade: Ler os anexos que o contato manda
  Um documento de dados técnicos é aberto e lido, e os dados vão para o cadastro sem a pessoa pedir.

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
