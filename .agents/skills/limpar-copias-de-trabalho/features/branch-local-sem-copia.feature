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

  Regra: toda branch local é conferida contra a base, mesmo a de outra sessão

    Exemplo: sobraram branches antigas de outras tarefas
      Dado que o repositório tem branches locais que outras sessões criaram
      E o pull request de cada uma foi mesclado com o mesmo commit da branch
      Quando a habilidade limpa as cópias de trabalho
      Então cada uma dessas branches é removida
      E a resposta não lista branch local sem decisão

    Exemplo: a branch sem pull request teve o conteúdo levado por outro
      Dado que uma branch local não tem pull request nem branch remota
      E os arquivos que ela cria ou muda já estão na base, levados por outro pull request mesclado
      Quando a habilidade limpa as cópias de trabalho
      Então a branch é removida
      E a resposta traz o link do pull request que levou o conteúdo
