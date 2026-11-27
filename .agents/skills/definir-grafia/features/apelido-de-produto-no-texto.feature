# language: pt

Funcionalidade: Apelido de produto no texto a um terceiro
  O texto a um terceiro leva o nome canônico do produto, não o apelido que a equipe usou.

  Exemplo: Colete que a equipe chama de Y
    Dado que a equipe pediu um material citando "o colete Y"
    E o apelido Y só aparece no nome de unidades de estoque do colete X
    Quando a habilidade confere o nome nas páginas de produto, nas variantes e nas unidades de estoque
    Então o texto ao terceiro leva o nome X
    E propõe acrescentar Y às variações de nome do colete X
    Mas não grava a variação sem o sim da pessoa
