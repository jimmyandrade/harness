# language: pt

Funcionalidade: Quando resolver a thread
  A thread é resolvida quando este PR fez a parte dele, mesmo que o resto vá para outra issue.

  Regra: O resto levado a uma issue não segura a thread

    Exemplo: Parte aplicada e regra geral numa issue
      Dado que a revisão pediu uma mudança nesta skill e a mesma regra no repositório inteiro
      E que este PR aplicou a mudança na skill
      E que a regra geral virou uma issue própria
      Quando a resposta é publicada com o link do commit e da issue
      Então a thread é resolvida
      E a resposta diz que o resto segue na issue

    Exemplo: Thread que espera uma decisão
      Dado que a resposta pergunta à pessoa uma decisão que muda este PR
      Quando a resposta é publicada
      Então a thread fica aberta

  Regra: A thread aberta que bloqueia o merge é dita

    Exemplo: A base exige conversas resolvidas
      Dado que a branch base exige conversas resolvidas para mesclar
      E que uma thread fica aberta esperando a decisão da pessoa
      Quando a skill devolve o resumo
      Então ela diz que essa thread bloqueia o merge até ser resolvida
