# language: pt

Funcionalidade: Key results mensuráveis
  Cada key result mede o objetivo em números, com alvo e prazo no título.

  Regra: O objetivo tem poucos key results que o medem

    Exemplo: O objetivo passa do máximo de key results
      Dado que o objetivo já tem o máximo de key results
      Quando alguém pede mais um
      Então a habilidade propõe trocar um key result existente

    Exemplo: O key result não explica o objetivo
      Dado que um key result vai ser cadastrado
      Quando a habilidade valida o key result
      Então ela explica numa frase como ele mostra o avanço do objetivo

  Regra: O título traz verbo, descrição, alvo e prazo

    Exemplo: O alvo está só na propriedade
      Dado que o título do key result não traz o valor-alvo
      Quando a habilidade revisa o key result
      Então o título segue verbo, descrição, "para" alvo e "até" data
      E o valor-alvo e a data-alvo também ficam nas propriedades

    Exemplo: O key result está sem título
      Dado que um key result aparece como "Nova página"
      Quando a habilidade encontra esse key result
      Então ela para o que depende dele
      E renomeia no padrão antes de seguir

  Regra: O alvo é numérico, com prazo e base auditável

    Exemplo: O resultado tem um valor absoluto
      Dado que o key result mede custo em moeda
      Quando a habilidade define o valor-alvo
      Então o alvo é o valor absoluto
      E a porcentagem fica como leitura derivada, com a base escrita

    Exemplo: O alvo é 1 ou 100%
      Dado que o valor-alvo é 1 ou 100% de cobertura
      Quando a habilidade revisa o key result
      Então ela propõe um alvo com gradação, como a quantidade coberta

    Exemplo: O campo calculado parece desatualizado
      Dado que a porcentagem de conclusão é calculada pela lista
      Quando a habilidade atualiza o key result
      Então ela não edita esse campo à mão

    Exemplo: O alvo é fácil demais ou impossível
      Dado que a área definiu o valor-alvo e o prazo
      Quando a habilidade valida o key result
      Então o alvo exige foco e cabe na capacidade real do ciclo

  Regra: Key result de redução conta como atingido abaixo do alvo

    Exemplo: O custo cai para zero
      Dado que um key result de redução tem base de R$ 3.912 e alvo de R$ 3.130
      E que o custo medido no mês é R$ 0
      Quando a habilidade calcula o progresso
      Então o key result aparece como atingido

    Exemplo: A lista só divide o valor atual pelo valor-alvo
      Dado que a lista calcula o progresso como valor atual ÷ valor-alvo
      Quando a habilidade vai gravar um key result de redução
      Então ela não grava o key result de redução nesse cálculo
      E propõe a economia sobre a base ou o ajuste do cálculo, e pergunta qual seguir

  Regra: Key result não é tarefa

    Exemplo: O key result descreve uma execução
      Dado que o key result diz "Configurar X"
      Quando a habilidade revisa o key result
      Então ela move a execução para uma tarefa
      E reescreve o key result como resultado

    Exemplo: O key result conta ações sem dizer o resultado
      Dado que o key result diz "Realizar 12 revisões mensais"
      Quando a habilidade revisa o key result
      Então ela pede o resultado, a evidência e o critério de qualidade

    Exemplo: O key result está ligado a um conteúdo
      Dado que um key result tem vínculo com um conteúdo individual
      Quando a habilidade revisa os vínculos
      Então ela orienta remover o vínculo
