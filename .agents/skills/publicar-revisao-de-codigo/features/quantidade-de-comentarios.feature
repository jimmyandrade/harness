# language: pt

Funcionalidade: Combinar o texto da revisão com a quantidade de comentários
  A revisão sabe se publicou nenhum, um ou mais de um comentário.

  Regra: Um ponto usa a frase que a pessoa escolheu

    Exemplo: A revisão tem um ponto
      Dado que a revisão deixa um ponto nos comentários
      Quando o corpo da revisão é escrito
      Então o texto traz só tem um ponto que eu deixei nos comentários
      E deixei um ponto no código não aparece

  Regra: A frase de idioma acompanha a quantidade de comentários

    Exemplo: A revisão tem um comentário
      Dado que a revisão publica um comentário
      Quando a frase de idioma é escrita
      Então o texto traz deixei uma versão em inglês abaixo do único comentário que eu fiz

    Esquema do Cenário: A frase combina com a quantidade
      Dado que a revisão publica <quantidade> comentários
      Quando o corpo da revisão é escrito
      Então a frase combina com <quantidade>

      Exemplos:
        | quantidade |
        | nenhum |
        | um |
        | mais de um |
