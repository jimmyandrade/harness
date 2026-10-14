# language: pt

Funcionalidade: Separar estoque de ativo imobilizado
  Item que se esgota não entra na lista de ativos imobilizados.

  Regra: O destino do item esgotável é a lista de estoque

    Exemplo: Compra de tecido
      Dado que existe uma compra de insumo consumível, esgotável ou controlado por quantidade
      Quando a pessoa pergunta se vai para ativo ou estoque
      Então a análise diz que o destino é a lista de estoque
      Mas não cria página na lista de ativos imobilizados

    Exemplo: Compra de bem durável
      Dado que existe uma compra de bem durável e não esgotável
      Quando a pessoa pergunta se vai para ativo ou estoque
      Então a análise diz que o destino é a lista de ativos imobilizados
      Mas não cria página na lista de estoque

  Regra: O destino do item controlável sai do tipo do item

    Contexto:
      Dado que existe uma compra, despesa, investimento, comprovante, nota, recibo ou contexto de item controlável

    Exemplo: Bem durável sujeito a depreciação
      Quando a decisão escolhe onde registrar
      E o item é durável, não esgotável e sujeito a depreciação
      Então o destino é a lista de ativos imobilizados
      E cobre máquina, equipamento, mobiliário, ferramenta, arara, manequim, expositor, computador e estrutura

    Exemplo: Item esgotável ou controlável por quantidade
      Quando a decisão escolhe onde registrar
      E o item se esgota ou se controla por quantidade, metragem, unidade, lote, rolo, pacote, kit ou volume
      Então o destino é a lista de estoque
      E cobre tecido, aviamento, linha, botão, etiqueta, embalagem e insumo de produção

    Exemplo: Dúvida de destino
      Quando a decisão não separa a lista de ativos imobilizados, a lista de estoque, a lista de produtos, a produção ou contexto financeiro
      Então a análise pede confirmação
      Mas não cria nem vincula registro

    Exemplo: Compra de insumo por investimento
      Quando o item se esgota e a compra veio como investimento
      Então o destino é a lista de estoque
      E o cadastro segue gerenciar-estoque
      Mas não cria página na lista de ativos imobilizados

    Exemplo: Item híbrido
      Quando o item desgasta e pode ser consertado
      Então a análise pede confirmação
      Mas não cria nem vincula registro
