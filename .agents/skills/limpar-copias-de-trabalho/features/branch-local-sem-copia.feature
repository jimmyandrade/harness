# language: pt
Funcionalidade: Branch local sem cópia de trabalho

  Regra: a branch local sai quando o trabalho dela está no GitHub

    Exemplo: a fila do bot terminou e sobraram as branches locais
      Dado que só a cópia principal existe e sobraram branches locais de pull requests já mesclados ou fechados
      Quando a habilidade limpa as cópias de trabalho
      Então cada branch cujo commit é o do pull request mesclado ou fechado é removida
      E a resposta lista cada branch com a decisão e o link do pull request

    Exemplo: a branch tem commit que não está no GitHub
      Dado que uma branch local tem um commit que nenhuma branch remota nem pull request contém
      Quando a habilidade limpa as cópias de trabalho
      Então a branch fica
      E a resposta diz que o commit só existe nesta máquina
