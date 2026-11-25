# language: pt
Funcionalidade: Contar e datar só o que leu
  Como pessoa que decide com base na análise
  Quero que cada número e cada data da análise venham do que a habilidade leu
  De forma que uma conta errada ou uma data inventada não cheguem à página do perfil

  Cenário: Contas marcadas num post
    Dado que um post marca uma lista de contas na legenda
    Quando a habilidade escreve quantas contas o post marca
    Então ela conta a lista antes de escrever o número
    E não arredonda nem estima

  Cenário: Data que a habilidade não leu
    Dado que a habilidade viu um post só pela miniatura, sem a data
    Quando ela escreve o período dos posts
    Então ela escreve o mês ou a idade que a plataforma mostra
    E não inventa um dia

  Cenário: Bio cortada no "mais"
    Dado que a bio do perfil termina em "mais"
    Quando a habilidade lê a bio e a grava no cadastro do perfil
    Então ela abre a bio inteira antes
    E não grava o texto cortado
