# language: pt
Funcionalidade: Consolidar registros que são o mesmo item
  A duplicata confirmada vai para um canônico.

  Regra: O canônico recebe as formas e a duplicata deixa de ser referência

    Exemplo: Consolidar sem apagar
      Dado que existem dois ou mais registros que são o mesmo item
      Quando a pessoa decide consolidar a duplicata
      Então a skill escolhe um canônico pelo link oficial correto ou por mais dados preenchidos
      E atualiza Variações de nome no formato do campo, inclusive a forma vinda da duplicata
      E anota na duplicata que ela é duplicata do canônico e não a usa como referência futura

  Regra: Apagar a duplicata só depois da mescla segura

    Exemplo: Ordem para apagar com conflito
      Dado que existe uma ordem para apagar a duplicata
      Quando a skill confere propriedades e relações
      Então ela mescla no canônico o que cabe com segurança e só então apaga
      E se houver conflito devolve o diff e confirma o valor canônico
      E registra o valor morto na propriedade que existe para isso ou no corpo da página
