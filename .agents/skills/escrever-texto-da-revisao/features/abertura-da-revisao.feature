# language: pt

Funcionalidade: Escolher a abertura da revisão de um pull request
  O corpo segue o parâmetro de abertura. O valor padrão do harness não muda.

  Regra: O parâmetro decide se o corpo tem uma versão ou duas

    Exemplo: O parâmetro pede versão única
      Dado que a abertura da revisão é versão única
      Quando o corpo da revisão de um pull request é escrito
      Então o corpo sai numa versão só
      E os rótulos de versão curta e versão longa não aparecem

    Exemplo: O parâmetro pede o par
      Dado que a abertura da revisão é versão curta e versão longa
      Quando o corpo da revisão de um pull request é escrito
      Então o corpo traz a versão curta e a versão longa

  Regra: O valor padrão do parâmetro no harness não muda

    Exemplo: O harness continua com o valor vazio
      Dado que a habilidade documenta a escolha de abertura
      Quando a habilidade é lida
      Então o valor de abertura da revisão continua vazio
      E versão única e o par estão descritos como escolhas
