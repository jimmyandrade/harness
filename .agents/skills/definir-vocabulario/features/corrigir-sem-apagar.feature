# language: pt

Funcionalidade: Corrigir um termo sem apagar o resto da linha
  Uma correção muda só o campo enviado. A descrição, as notas e o resto da linha continuam.

  Regra: A correção mantém o que não foi enviado

    Exemplo: Corrigir só o motivo
      Dado que o termo está no vocabulário com descrição, notas e quem decidiu
      Quando a skill corrige só o motivo
      Então o motivo muda
      E a descrição, as notas e quem decidiu continuam na linha

    Exemplo: Conferir depois de gravar
      Dado que a skill gravou uma correção
      Quando ela lê a linha de novo
      Então confere que nenhum campo que não foi enviado sumiu
      Mas, se algo sumiu, grava de volta a linha que guardou e avisa a pessoa

  Regra: Um campo só é limpo a pedido

    Exemplo: Limpar as notas
      Dado que a pessoa pediu para limpar as notas de um termo
      Quando a skill grava a correção
      Então envia as notas vazias
      E diz que as notas saíram
