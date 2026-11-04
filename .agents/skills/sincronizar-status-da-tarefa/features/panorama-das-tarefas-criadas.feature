# language: pt
Funcionalidade: Panorama das tarefas que a pessoa criou

  Regra: o panorama só lê

    Exemplo: A pessoa pede o panorama
      Dado que a pessoa pede o panorama do que criou
      Quando a habilidade monta o relato
      Então cada tarefa aparece no bloco da sua situação com a chave, o link e o link do PR
      E nenhuma ligação é gravada
      E nenhum status muda

    Exemplo: A tarefa aberta tem o PR já mesclado
      Dado que a tarefa está aberta
      E o PR que a cita já foi mesclado
      Quando a habilidade monta o relato
      Então a tarefa vai para o bloco de aberta com PR mesclado
      E a tarefa continua aberta

  Regra: a ausência de PR é conferida pela chave

    Exemplo: A consulta não traz PR
      Dado que a consulta não traz PR para a tarefa
      Quando a habilidade monta o relato
      Então a habilidade busca pela chave da tarefa antes de dizer que não tem PR
