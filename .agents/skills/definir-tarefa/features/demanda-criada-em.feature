# language: pt

Funcionalidade: Data em que a demanda surgiu
  A data da demanda guarda o dia em que o pedido surgiu nesta conversa.

  Exemplo: Pedido nesta conversa
    Dado que a pessoa pede para criar a tarefa nesta conversa
    Quando a tarefa é criada
    Então a data da demanda recebe o dia desse pedido
    E esse dia não entra no prazo
    E a data do cadastro continua automática

  Exemplo: Data só numa conversa ilegível
    Dado que a data do pedido está só numa conversa que não dá para ler
    Quando a pessoa pede para criar a tarefa
    Então a data da demanda fica vazia
    E a resposta pede a data, uma captura ou a cópia dos trechos
