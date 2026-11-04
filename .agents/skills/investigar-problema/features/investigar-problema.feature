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
