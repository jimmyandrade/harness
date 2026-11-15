# language: pt

Funcionalidade: Molde, piloto, etiqueta e status do produto
  Molde é relação do produto, piloto e etiqueta mudam só por pedido, e a produção não vira pronta com unidade faltando.

  Exemplo: Molde com o tamanho
    Dado que a pessoa diz que fez o molde da camisa no XGG
    Quando a skill registra o pedido
    Então o molde da camisa é relacionado em Moldes
    E nenhuma tarefa é criada

  Exemplo: Molde sem o tamanho
    Dado que a pessoa diz que fez o molde da camisa sem dizer o tamanho
    Quando a skill registra o pedido
    Então a resposta pergunta o tamanho
    E nada é gravado antes da resposta

  Exemplo: Etiqueta não muda a produção
    Dado que a pessoa diz que a blusa já está etiquetada
    Quando a skill registra o pedido
    Então o status da etiqueta muda para etiquetada
    E o status da produção fica como estava

  Exemplo: Não marcar produzido com unidade faltando
    Dado que a propriedade de falta produção mostra unidade faltando
    Quando a skill avalia o status da produção
    Então o status não é marcado como produzido
    E a skill só propõe a mudança e espera o sim

  Exemplo: Fórmulas não são gravadas
    Dado que o produto tem fórmulas de falta, total e progresso
    Quando a skill registra a produção
    Então nenhuma fórmula é gravada

  Exemplo: Nomes vindos das instruções do projeto
    Dado que as instruções do projeto definem o nome do banco e o de cada propriedade
    Quando a skill registra uma produção
    Então ela usa o nome definido nas instruções

  Exemplo: Nome não definido
    Dado que as instruções do projeto não definem o nome do banco de produtos
    Quando a pessoa pede para registrar uma produção
    Então a skill pergunta uma vez e para
    E não usa um nome suposto

  Exemplo: Sem ligação com estoque
    Dado que as instruções do projeto não definem a ligação com estoque
    Quando a skill registra uma produção
    Então nenhum estoque é movido
    E nenhum campo de estoque é inventado
