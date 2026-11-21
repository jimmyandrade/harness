# language: pt
Funcionalidade: Conferir a prontidão do produto
  Como pessoa que vai marcar o produto num post
  Quero a lista do que falta para o produto estar pronto e quem faz cada item
  De forma que a marcação não falhe na hora de publicar

  Regra: toda variante leva SKU

    Exemplo: Variante sem SKU na loja
      Dado que a variante da loja não tem SKU e o registro tem
      Quando a habilidade confere o produto
      Então grava o SKU do registro na variante
      E relê a variante e diz o que gravou

    Exemplo: Variante só prevista
      Dado que o registro prevê uma variante sem unidade produzida
      Quando a habilidade define o estoque da loja
      Então a variante entra com estoque zero
      Mas não trata o zero como divergência de estoque

