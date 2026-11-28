# language: pt

Funcionalidade: Preencher a mídia bruta do álbum
  Cada mídia bruta cadastrada a partir de um álbum nasce com tipo, ângulo e texto alternativo.

  Exemplo: Álbum autorizado para cadastro
    Dado que a pessoa autorizou baixar e cadastrar as fotos que faltam de um álbum
    Quando a habilidade cadastra cada mídia bruta
    Então lê cada arquivo pela miniatura na orientação certa, numerada
    E preenche o tipo, o ângulo e o texto alternativo na mesma execução, sem perguntar de novo
    E registra nas observações o lado de quem veste, quando o ângulo é perfil
    Mas não deixa nenhum dos três em branco como pendência

  Exemplo: Peça aberta sobre uma superfície com pés na borda
    Dado que a foto mostra a peça aberta sobre uma superfície, com pés ou pernas na borda do quadro
    Quando a habilidade classifica a imagem
    Então o tipo é produto isolado, nunca pessoa usando
