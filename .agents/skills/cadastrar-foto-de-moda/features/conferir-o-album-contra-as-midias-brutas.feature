# language: pt

Funcionalidade: Conferir o álbum contra as mídias brutas
  Um produto com álbum de fotos tem cada foto bruta com equivalente nas mídias brutas do cadastro.

  Exemplo: Álbum sem nenhuma mídia bruta no cadastro
    Dado que um produto tem um álbum de fotos e nenhuma mídia bruta cadastrada
    Quando a habilidade confere o álbum contra as mídias brutas do produto
    Então grava o link do álbum no campo do álbum do produto
    E diz quantas fotos o álbum tem, quantas têm equivalente e quais faltam, pelo nome do arquivo
    E pede o sim da pessoa, com nome, origem e tamanho, antes de baixar e cadastrar as que faltam
    Mas nunca coloca foto bruta no campo da foto tratada
