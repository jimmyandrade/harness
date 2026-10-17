# language: pt
Funcionalidade: Liberar espaço sem perder arquivo

  Exemplo: Só cache que se recria sozinho é apagado
    Dado que o disco está cheio
    E que há cache do npm e arquivos em Downloads
    Quando a pessoa pede para liberar espaço
    Então só o cache do npm é proposto para apagar
    E Downloads aparece só com o tamanho

  Exemplo: A pessoa roda o comando que apaga
    Dado que a lista do que se recria sozinho foi mostrada
    Quando a pessoa diz que pode apagar
    Então o comando que apaga aparece num bloco próprio
    Mas nenhum caminho é apagado pelo agente
