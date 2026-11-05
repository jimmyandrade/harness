# language: pt
Funcionalidade: Valor do registro fora dos parâmetros
  Um valor que a habilidade lê de um registro da fonte de dados fica no registro.

  Regra: o parâmetro não passa por cima do registro

    Exemplo: Ajuste de foto e cor de fundo do carrossel
      Dado que a habilidade do carrossel lê o ajuste de foto e a cor de fundo do registro do formato do post
      E que o formato da imagem muda de um post para outro
      Quando a pessoa pede para pôr esses valores nos parâmetros das instruções do projeto
      Então nenhuma chave entra nos parâmetros
      E a resposta diz que os valores ficam no registro de cada formato
