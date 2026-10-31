# language: pt
Funcionalidade: Atender a revisão a cada rebase da branch com PR

  Regra: a revisão do PR é atendida antes de substituir a branch publicada

    Exemplo: o rebase traz da base código fora do padrão pedido na revisão
      Dado que a branch tem PR com uma revisão que pediu para trocar um padrão de teste
      E que a base avançou com testes escritos no padrão antigo
      Quando a branch é rebaseada sobre a base
      Então as revisões, as threads e os comentários abertos do PR são tratados por `atender-revisao-de-pull-request`
      E os testes que vieram da base passam para o padrão pedido no mesmo PR, antes do envio

    Exemplo: o rebase acontece dentro do atendimento da revisão
      Dado que `atender-revisao-de-pull-request` chamou a atualização da branch
      Quando a branch é rebaseada sobre a base
      Então o atendimento em curso já cumpre o passo, sem chamá-lo de novo
