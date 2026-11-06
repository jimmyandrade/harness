# language: pt

Funcionalidade: Comparar a execução com e sem skill
  Os números saem do registro da execução.
  Sem registro, o número fica ausente.

  Regra: A comparação usa o que o registro mostra

    Exemplo: Registro completo
      Dado que existe o registro da execução sem skill
      E existe o registro da execução com skill
      Quando a comparação lê os dois registros
      Então as idas e vindas, as chamadas que falharam e os tokens saem do registro sem skill
      E as perguntas que ainda faltaram saem do registro com skill

    Exemplo: Número ausente no registro
      Dado que um registro não tem a contagem de tokens
      Quando a comparação lê esse registro
      Então a comparação diz que o número falta
