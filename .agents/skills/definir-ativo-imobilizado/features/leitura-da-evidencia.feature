# language: pt

Funcionalidade: Ler evidência do bem
  Comprovante, nota, recibo, foto e link entram na leitura quando existem.

  Exemplo: Comprovante em imagem
    Dado que existe um comprovante, nota, recibo ou foto do item
    Quando a evidência é uma imagem
    Então a leitura fica com reconhecer-imagem
    Mas esta habilidade não lê a imagem

  Exemplo: O link do produto
    Dado que um link de produto existe
    Quando o cadastro preenche o bem
    Então a leitura usa esse link
