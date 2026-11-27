# language: pt

Funcionalidade: Nome de produto que o cadastro desatualizou
  O texto a um terceiro leva o nome canônico, que a pessoa confirma quando o nome dito não bate com o título do produto.

  Exemplo: Colete com a grafia antiga no título
    Dado que a equipe pediu um material citando "o colete X"
    E o título da página do produto ainda tem a grafia antiga Y
    E só as unidades de estoque têm o nome X
    Quando a habilidade confere o nome nas páginas de produto, nas variantes e nas unidades de estoque
    Então mostra os nomes achados e pergunta qual é o canônico
    E depois do sim o texto ao terceiro leva o nome X
    E propõe pôr Y nas variações de nome do produto
    Mas não grava o título nem a variação sem o sim da pessoa
