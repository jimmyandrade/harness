# language: pt

Funcionalidade: OKRs na Sprint
  As ações da Sprint empurram os key results do ciclo, e a revisão da Sprint atualiza esses key results.

  Regra: Cada key result tem ações que o movem

    Exemplo: O key result está sem ação
      Dado que um key result não tem tarefa vinculada
      Quando a habilidade fecha o plano de execução
      Então o key result tem pelo menos uma tarefa ou a lista das ações planejadas

    Exemplo: A ação não move o key result
      Dado que uma ação vai ser vinculada a um key result
      Quando a habilidade não explica por que a ação melhora o key result
      Então ela não vincula a ação
      E sugere uma ação que ataca a alavanca do key result

  Regra: A Sprint começa pelos OKRs do ciclo

    Exemplo: A área planeja a Sprint
      Dado que uma Sprint vai começar
      Quando a área define o que entra
      Então a habilidade parte dos key results em vigor no ciclo
      E não puxa tarefa sem key result sem uma exceção justificada

    Exemplo: A ação escolhida entra na Sprint
      Dado que a área escolheu as ações da Sprint
      Quando a habilidade registra o plano
      Então cada ação vira tarefa com responsável e prazo dentro da Sprint
      E cada pessoa sabe quais key results e tarefas puxa

  Regra: A revisão da Sprint atualiza os key results

    Exemplo: A Sprint termina
      Dado que a Sprint está sendo revisada
      Quando a área tem evidências do que mudou
      Então a habilidade revisita o progresso dos objetivos
      E atualiza os key results com essas evidências
