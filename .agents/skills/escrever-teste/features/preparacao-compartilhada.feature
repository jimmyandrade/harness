# language: pt

Funcionalidade: Preparação de teste compartilhada
  A preparação que se repete entre arquivos de teste mora num helper só.

  Regra: A preparação repetida vai para um helper

    Exemplo: Servidor subido em cada arquivo de teste de rota
      Dado que dez arquivos de teste sobem o servidor e montam o endereço do mesmo jeito
      Quando um teste de rota novo é escrito
      Então ele usa o helper compartilhado que sobe o servidor
      E o endereço vem da constante do código, não de um valor escrito no teste
