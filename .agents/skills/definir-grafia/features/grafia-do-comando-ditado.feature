# language: pt

Funcionalidade: Resolver o nome de um comando ditado
  O nome do comando usa o cadastro confirmado antes de entrar na operação.

  Exemplo: Correção explícita do nome de pessoa sócia
    Dado que a pessoa confirmou qual cadastro corresponde à forma transcrita no comando da despesa
    Quando a habilidade confere a grafia e as variações desse registro
    Então devolve à habilidade de origem o nome canônico e o vínculo do cadastro confirmado
    E guarda a forma transcrita ainda ausente sem apagar as variações existentes
    Mas não altera o nome do registro nem executa o lançamento
