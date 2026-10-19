# language: pt

Funcionalidade: Interpretar o lançamento antes de gravar
  Venda, gasto e parcelado não nascem completos sem o que falta.

  Regra: Dado faltando trava o registro

    Exemplo: Venda recebida na hora
      Dado que existe uma venda da empresa recebida na hora
      Quando a skill interpreta a frase
      Então segue a habilidade de venda das instruções do projeto
      Mas não grava na lista de despesas e investimentos

    Exemplo: Gasto pago na hora
      Dado que existe um gasto da empresa pago na hora
      Quando a skill interpreta a frase
      Então classifica o gasto
      E segue lancar-despesa-da-empresa
      Mas não apaga lançamento anterior

    Exemplo: Gasto parcelado incompleto
      Dado que existe um gasto da empresa parcelado
      E sem o número de parcelas ou o valor de cada uma
      Quando a skill interpreta a frase
      Então pergunta o que falta
      Mas não grava

    Exemplo: Gasto pessoal
      Dado que existe um gasto pessoal
      Quando a skill interpreta a frase
      Então deixa o lançamento fora da fonte da empresa
