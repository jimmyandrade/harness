# language: pt
Funcionalidade: Analisar o perfil de um influenciador
  Como pessoa que monta a lista de perfis ideais da marca
  Quero ler estética, público, risco de marca e encaixe com o produto de um perfil
  De forma que eu decida se descarto, observo ou abordo

  Cenário: Perfil de pessoa usa todas as seções do modelo
    Dado que as instruções do projeto descrevem o posicionamento da marca
    Quando a habilidade analisa o perfil de uma pessoa
    Então a resposta preenche todas as seções do modelo, inclusive encaixe com o produto e aproximação
    E o próximo passo é um de descartar, observar, abordar, pedir indicação ou outro

  Cenário: Várias análises seguidas
    Quando a habilidade analisa mais de um perfil na mesma conversa
    Então a resposta fecha com os 3 padrões que mais se repetiram e os 3 motivos mais comuns de descarte
