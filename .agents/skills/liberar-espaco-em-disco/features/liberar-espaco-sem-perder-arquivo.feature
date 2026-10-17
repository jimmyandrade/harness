# language: pt
Funcionalidade: Liberar espaço sem perder arquivo

  Exemplo: Só cache que se recria sozinho é apagado
    Dado que o disco está cheio
    E que há cache do npm e arquivos em Downloads
    Quando a pessoa pede para liberar espaço
    Então só o cache do npm é proposto para apagar
    E Downloads aparece só com o tamanho

  Exemplo: Nada é apagado sem o sim da pessoa
    Dado que a lista do que se recria sozinho foi mostrada
    Quando a pessoa ainda não respondeu
    Então nenhum caminho é apagado
