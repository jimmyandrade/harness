# language: pt

Funcionalidade: Sugerir testes sem gravar
  A revisão sinaliza e sugere.
  Quem grava o Gherkin é evoluir-habilidade.

  Regra: A sugestão fica na resposta

    Exemplo: Risco de disparar de menos
      Dada uma descrição vaga ou sem gatilho
      Quando a skill é revisada
      Então a resposta aponta o risco de disparar de menos
      E a resposta sugere uma tarefa óbvia e um pedido parafraseado
      Mas o arquivo Gherkin não é gravado por esta revisão

    Exemplo: Risco de disparar demais
      Dada uma descrição sem "NÃO use para"
      Quando a skill é revisada
      Então a resposta aponta o risco de disparar demais
      E a resposta sugere um tópico sem relação e um quase-acerto
      Mas o arquivo Gherkin não é gravado por esta revisão
