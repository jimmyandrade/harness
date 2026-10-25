# language: pt
Funcionalidade: Ligação do pull request à tarefa

  Regra: o assunto parecido espera confirmação

    Exemplo: O pull request não cita a tarefa
      Dado que o pull request não traz a chave da tarefa
      E uma tarefa aberta tem o mesmo assunto
      Quando a habilidade monta o plano
      Então o plano marca a ligação pelo assunto
      E a ligação não é gravada antes do sim

  Regra: a gravação segue o estado do pull request

    Exemplo: O pull request ainda está aberto
      Dado que a pessoa confirmou a ligação pelo assunto
      E o pull request está aberto
      Quando a habilidade grava a ligação
      Então o corpo do pull request cita a tarefa

    Exemplo: O pull request já foi mesclado
      Dado que a pessoa confirmou a ligação pelo assunto
      E o pull request já foi mesclado
      Quando a habilidade grava a ligação
      Então a tarefa recebe um comentário com o link do pull request

  Regra: sem fluxo de status a ligação é gravada

    Exemplo: O projeto não tem fluxo de status
      Dado que a pessoa confirmou a ligação pelo assunto
      E o projeto não tem fluxo de status
      Quando a habilidade grava a ligação
      Então a ligação fica registrada
      E o status da tarefa permanece
