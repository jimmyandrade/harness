# language: pt

Funcionalidade: Conciliar recebimento
  O valor recebido de cada venda é o líquido liberado, lido no detalhe da venda na fonte, e a entrada sem venda não vira receita.

  Regra: o valor recebido é o líquido lido no detalhe de cada venda

    Exemplo: Duas vendas do mesmo bruto
      Dado que duas vendas do dia cobraram o mesmo valor bruto
      Quando a habilidade concilia o recebimento
      Então abre o detalhe de cada venda na fonte do valor recebido
      E leva o bruto, a taxa, o líquido, a liberação e o ID da transação para cada venda
      Mas não liga as liberações às vendas pela ordem

    Exemplo: Detalhe que não abre
      Dado que a fonte não mostra o detalhe de uma venda
      Quando a habilidade concilia o recebimento
      Então diz qual venda ficou sem o líquido e pergunta
      Mas não grava o bruto como valor recebido

  Regra: a entrada de um saque no cartão não é venda

    Exemplo: Entrada sem venda, devolvida logo depois
      Dado que o extrato tem uma entrada sem venda, devolvida logo depois para quem passou o cartão
      Quando a habilidade concilia a entrada
      Então pergunta à pessoa se foi um saque no cartão de crédito
      Mas não cria uma venda para fechar a conciliação

    Exemplo: Saque numa conta de pessoa física
      Dado que a entrada é um saque e a conta da máquina era de pessoa física na data
      Quando a habilidade concilia a entrada
      Então a entrada não vai para as vendas
      E o comentário da conciliação diz o que ela é

    Exemplo: Saque numa conta da empresa
      Dado que a entrada é um saque e a conta da máquina era da empresa na data
      Quando a habilidade concilia a entrada
      Então avisa que o saque infla o faturamento e recomenda não repetir
      E registra a entrada e a devolução como um par de lançamentos financeiros
      Mas confirma o tratamento contábil com quem cuida da contabilidade

  Regra: Todo o detalhe da transação volta para a venda e a fonte aponta para a venda

    Exemplo: Detalhe completo, comprovante e nota
      Dado que o detalhe da transação mostra o cliente e uma referência cortada com reticências
      E a fonte permite uma nota na transação
      Quando a habilidade concilia a venda
      Então grava na venda o link do detalhe, o cliente e a referência inteira
      E anexa o comprovante completo, ou pergunta antes de enviá-lo por e-mail ou SMS
      E, depois de anexar o comprovante do e-mail, rotula a conversa e a tira da caixa de entrada, sem aplicar a etiqueta de arquivo
      E grava na nota da transação os IDs da venda, do cliente, das unidades, das variantes, dos produtos, da família e do ponto de contato
      Mas, se a nota recusar link e pontuação, grava uma nota por registro só com letras, números e espaços
