# language: pt
Funcionalidade: Registrar o nome anterior ao renomear
  A forma anterior permanece na propriedade de variações e o título fica o nome canônico.

  Regra: A forma anterior entra na variação sem apagar as que já estão

    Exemplo: Renomear ou consolidar o nome canônico
      Dado que existe um registro renomeado ou um nome canônico consolidado
      Quando a forma anterior ainda ajuda a busca o histórico a dedupe ou evita confusão
      Então a skill registra a forma anterior na propriedade de variações que o banco já tem
      E o título permanece o nome canônico
      E as variações existentes permanecem sem item duplicado

  Regra: Sem a propriedade a renomeação não fica concluída para a dedupe

    Exemplo: O banco não tem propriedade de variações
      Dado que existe uma renomeação cuja forma anterior ainda ajuda a busca
      Quando o banco não tem propriedade de variações
      Então a skill informa isso
      E propõe criar a propriedade
      E não trata a renomeação como concluída para a dedupe

    Exemplo: Renomeação recente com variação vazia
      Dado que existe uma renomeação recente
      Quando a variação antiga ainda está vazia
      Então a skill acrescenta o nome anterior à propriedade de variações
