# language: pt
Funcionalidade: Tipo do commit pela mudança

  Regra: correção de erro é fix mesmo em Markdown

    Exemplo: A instrução estava errada
      Dado que a mudança corrige um erro
      E o arquivo alterado é Markdown
      Quando a habilidade escolhe o tipo do commit
      Então o tipo é fix

    Exemplo: A mudança é documentação
      Dado que a mudança documenta
      E o arquivo alterado é Markdown
      Quando a habilidade escolhe o tipo do commit
      Então o tipo é docs
