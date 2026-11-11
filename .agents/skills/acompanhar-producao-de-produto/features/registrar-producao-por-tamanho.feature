# language: pt

Funcionalidade: Produção por unidade e tamanho
  A produção do produto fica no banco de variações e produção, uma linha por tamanho, e não vira tarefa.

  Exemplo: Lembrar de produzir com o tamanho
    Dado que a pessoa pede para produzir 2 camisetas GG
    Quando a skill registra o pedido
    Então Previstas da linha da camiseta GG recebe 2
    E nenhuma tarefa é criada

  Exemplo: Produção sem tamanho
    Dado que a pessoa diz que terminou a calça jeans sem dizer o tamanho
    Quando a skill registra o pedido
    Então a resposta pergunta o tamanho
    E nada é gravado antes da resposta

  Exemplo: Cortar vários tamanhos
    Dado que a pessoa diz que cortou 3 camisetas P e 2 camisetas M
    Quando a skill registra o pedido
    Então Cortadas da linha da camiseta P recebe 3
    E Cortadas da linha da camiseta M recebe 2

  Exemplo: Produzir mais do que o previsto
    Dado que a linha da camiseta GG tem 2 em Previstas e 2 em Produzidas
    Quando a pessoa diz que produziu mais 1 camiseta GG
    Então a resposta pergunta antes de gravar

  Exemplo: Produto que não existe
    Dado que o produto não está no banco de produtos
    Quando a pessoa pede para produzir 1 unidade dele
    Então a resposta diz que o produto não existe e pergunta
    E o produto não é criado

  Exemplo: Banco fora do workspace conectado
    Dado que o banco de produtos não está no workspace conectado
    Quando a pessoa pede para registrar uma produção
    Então a skill para e não usa a lista de outro workspace
