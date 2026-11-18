# language: pt
Funcionalidade: Avisar quando o conteúdo de um destaque não abre
  Como pessoa que depende da leitura dos destaques
  Quero saber quando um destaque não foi lido
  De forma que a análise não afirme o que não viu

  Cenário: Os quadros do destaque abrem pretos
    Dado que os quadros de um destaque abrem vazios ou pretos no navegador
    Quando a habilidade tenta ler o destaque
    Então ela lista o destaque em Limites da análise como não lido
    E não deduz o conteúdo pelo título do destaque
    E oferece ler no navegador da própria pessoa

  Cenário: Abrir um destaque com a conta logada
    Dado que a habilidade abriu um destaque com a conta da pessoa
    Quando a resposta lista o que foi lido
    Então ela avisa que a conta pode aparecer como quem viu o destaque
