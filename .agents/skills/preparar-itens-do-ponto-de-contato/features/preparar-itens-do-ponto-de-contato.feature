# language: pt

Funcionalidade: Preparar os itens do ponto de contato

  Regra: o que a organização fornece fica em casa

    Exemplo: a organização fornece uma cadeira e não fornece mesa
      Dado que a oportunidade diz que a organização fornece uma cadeira e não fornece mesa
      Quando a habilidade monta o checklist
      Então a mesa da empresa entra e a cadeira fornecida não entra

  Regra: o checklist termina na volta

    Exemplo: a tarefa do ponto
      Dado que o ponto leva três bens
      Quando a habilidade cria a tarefa
      Então a definição de concluído tem um item por bem
      E o último item confere os bens na volta
