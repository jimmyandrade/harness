# language: pt
Funcionalidade: Consolidar a pessoa duplicada de um perfil único
  Dois registros da mesma pessoa, com um perfil só, são o mesmo item.

  Regra: Não confundir com não separa a pessoa duplicada

    Exemplo: Duas pessoas e um perfil
      Dado que existem dois registros da mesma pessoa e um perfil social só
      Quando a skill consolida esses registros
      Então trata os dois como o mesmo item
      E Não confundir com não separa essa duplicata
