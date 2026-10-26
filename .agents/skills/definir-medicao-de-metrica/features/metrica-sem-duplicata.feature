# language: pt

Funcionalidade: Métrica sem duplicata
  Uma métrica nova só nasce depois de procurar o mesmo conceito com outro nome.

  Regra: Variações óbvias do nome contam como a mesma métrica

    Exemplo: A métrica existe no plural
      Dado que a lista de métricas tem "Ouvintes mensais"
      Quando alguém pede para criar a métrica "Ouvinte mensal"
      Então a habilidade não cria outra métrica
      E sugere usar a métrica existente

    Exemplo: A métrica existe sem acento ou abreviada
      Dado que a lista de métricas tem "Número de seguidores"
      Quando alguém pede para criar a métrica "Nº de seguidores"
      Então a habilidade não cria outra métrica
      E sugere usar a métrica existente

  Regra: Sinônimos e propriedades de desambiguação decidem o conceito

    Exemplo: A métrica existe com o nome de outra ferramenta
      Dado que a lista de métricas tem "Alcance" com a plataforma da rede social
      Quando alguém pede para criar "Contas alcançadas" da mesma plataforma
      Então a habilidade confere a plataforma, a origem, o escopo, a unidade, o período e a granularidade
      E, sendo o mesmo conceito, não cria outra métrica
      E registra o nome alternativo como sinônimo quando a lista tem onde guardá-lo

    Exemplo: O mesmo nome mede outra coisa
      Dado que a lista de métricas tem "Seguidores" de uma plataforma
      Quando alguém pede "Seguidores" de outra plataforma
      E as propriedades de desambiguação mostram plataformas diferentes
      Então a habilidade trata como métrica diferente
      E cria a métrica nova com essas propriedades preenchidas

    Exemplo: A busca não encontra o conceito
      Dado que nenhuma métrica tem o nome, as variações nem os sinônimos do pedido
      Quando a habilidade vai criar a métrica
      Então ela mostra o plano com o nome e as propriedades de desambiguação antes de gravar
