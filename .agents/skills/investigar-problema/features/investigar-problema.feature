# language: pt

Funcionalidade: Investigar um problema relatado

  Regra: a investigação tem registro

    Exemplo: problema relatado sem tarefa
      Dado que alguém relatou um acesso bloqueado numa ferramenta
      E que não há tarefa sobre esse problema
      Quando a pessoa pede para investigar
      Então a habilidade cria a tarefa antes de começar
      E o retorno a quem relatou leva o link dela

  Regra: nada muda sem o sim

    Exemplo: correção encontrada na investigação
      Dado que a investigação achou uma configuração que causa o bloqueio
      Quando a habilidade propõe a correção
      Então ela mostra o que muda e espera o sim antes de mudar

  Regra: o fim da investigação oferece os registros

    Exemplo: investigação concluída
      Dado que a causa foi achada e registrada na tarefa
      Quando a habilidade encerra a investigação
      Então ela pergunta se a pessoa quer um artigo da base de conhecimento, um post-mortem ou os dois
      E só escreve o que a pessoa escolher

  Regra: a investigação cruza com a de outro agente

    Exemplo: alerta com investigação paralela concluída
      Dado que o problema veio de uma thread de alerta no Slack
      E que um agente do monitoramento postou a causa e os próximos passos nela
      Quando a habilidade conclui a investigação
      Então ela reagiu à thread com o emoji de olhos ao começar
      E a resposta diz onde a conclusão concorda e onde diverge da do agente
      E ela corrige a própria conclusão quando o agente viu algo que ela perdeu
