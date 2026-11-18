# language: pt

Funcionalidade: Cor
  A cor de fornecedor ou fabricante tem um registro canônico, com o código como texto, a biblioteca preservada e o nome só quando o catálogo o traz.

  Regra: o número da cor é texto

    Exemplo: Zero à esquerda
      Dado que o fornecedor deu o código "0378"
      Quando a habilidade grava o número da cor
      Então ela grava "0378" como texto
      Mas não converte o código em número

    Exemplo: Mesmo número em duas bibliotecas
      Dado que o número 18-1659 existe nas bibliotecas TCX e TPG
      Quando a habilidade grava a cor
      Então ela preserva a sigla no número da cor
      Mas não grava o hex de uma biblioteca na outra

  Regra: o título segue a empresa, o número e o nome comercial

    Exemplo: Sem nome comercial
      Dado que a cor não tem nome oficial no catálogo
      Quando a habilidade cria a página
      Então o título é a empresa e o número da cor
      E a empresa fica ligada ao cadastro de empresas

    Exemplo: Com nome comercial
      Dado que o catálogo do fornecedor dá o nome da cor
      Quando a habilidade cria a página
      Então o título é a empresa, o número e o nome entre parênteses

  Regra: o nome comercial não é inventado

    Exemplo: Sem nome oficial
      Dado que o fornecedor não publica nome para a cor
      Quando a habilidade grava
      Então ela deixa o nome da cor vazio até a confirmação
      Mas não supõe um nome visual genérico

  Regra: o hex tem origem e limites

    Exemplo: Origem do hex
      Dado que o hex veio da leitura da imagem do chip
      Quando a habilidade grava o hex
      Então ela registra a origem no corpo da página
      Mas não a escreve em variações de nome

    Exemplo: Hex atrás da assinatura
      Dado que o hex da Pantone só aparece com assinatura
      Quando a habilidade procura o hex
      Então ela deixa o hex vazio e diz que falta
      Mas não inicia teste nem assinatura

    Exemplo: Metal
      Dado que a cor é ouro, prata ou cobre
      Quando a habilidade grava
      Então ela deixa a cor sem hex

  Regra: a família inconsistente é apontada

    Exemplo: Família estranha
      Dado que uma cor roxo-claro está na família vermelho
      Quando a habilidade confere a família
      Então ela aponta a inconsistência na resposta
      Mas não corrige a família sozinha

  Regra: outra skill consulta o banco antes de ligar

    Exemplo: Cor que não existe
      Dado que um item de estoque tem o código de cor de um fornecedor
      E que o banco de cores não tem essa cor
      Quando a habilidade liga o item
      Então ela cadastra a cor com a empresa e o número
      E só depois conclui o vínculo
