# language: pt
Funcionalidade: Publicar um produto do registro no catálogo do Mercado Pago
  Como pessoa que vende em ponto de venda físico
  Quero o produto do registro lançado no catálogo do Mercado Pago
  De forma que a maquininha e o QR Code cobrem o produto sem digitar tudo de novo

  Regra: a foto vem da fonte de verdade das fotos

    Exemplo: Foto copiada da fonte
      Dado que a fonte de verdade das fotos tem a foto do produto
      Quando a habilidade cadastra o produto no catálogo
      Então copia a foto da fonte para o catálogo
      Mas não pede que a pessoa baixe e suba a foto à mão

    Exemplo: Várias fotos na fonte
      Dado que a fonte tem mais de uma foto do produto
      Quando a habilidade escolhe a foto
      Então usa a principal e diz qual usou
      E diz que o catálogo aceita uma foto só

  Regra: o registro tem os dados que o catálogo pede

    Exemplo: Campos que o registro não tem
      Dado que o catálogo pede GTIN, categoria e alerta de estoque mínimo
      Quando o registro não tem esses campos
      Então a habilidade diz o que falta e recomenda o campo
      Mas não cria propriedade no registro

  Regra: o produto não se duplica

    Exemplo: SKU que já está no catálogo
      Dado que o catálogo já tem um produto com o SKU
      Quando a habilidade vai cadastrar o produto
      Então atualiza e mostra a diferença campo a campo
      Mas não cria um segundo produto com o mesmo SKU

  Regra: o preço do catálogo é o preço de etiqueta

    Exemplo: Preço à vista fora do catálogo
      Dado que a equipe dá um preço à vista diferente do da etiqueta
      Quando a habilidade grava o preço no catálogo
      Então grava o preço de etiqueta, o cheio a prazo
      Mas não grava o preço à vista

    Exemplo: Lista de preços sem pedido
      Dado que o catálogo tem listas de preços
      Quando a habilidade cadastra o produto
      Então não cria lista
      E diz que a lista sincronizada muda o preço com o preço base
