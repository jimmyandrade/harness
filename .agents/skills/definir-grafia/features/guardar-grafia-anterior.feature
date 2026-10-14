# language: pt
Funcionalidade: Guardar a grafia anterior do título
  A correção de grafia mantém o nome canônico e registra a forma anterior.

  Regra: A forma anterior entra na variação sem trocar o título

    Exemplo: Corrigir a grafia do título
      Dado que existe uma grafia de título corrigida de pessoa ou de empresa
      Quando a forma anterior ainda ajuda a busca
      Então a skill registra a forma anterior na propriedade de variações
      E o nome canônico permanece no título
      E as variações existentes permanecem sem item duplicado
