# language: pt

Funcionalidade: Foto do produto ausente no cadastro
  Um material que usa fotos de produto confere o cadastro antes e pede a fonte quando ele está vazio.

  Exemplo: Conjunto de peças sem foto no cadastro
    Dado que um material precisa das fotos de um conjunto de peças
    E nenhum dos produtos tem foto tratada nem bruta nos campos de foto
    Quando a habilidade confere os campos de foto antes de começar o material
    Então diz que o cadastro não tem as fotos e qual é a fonte provável
    E pede à pessoa o link do álbum ou os arquivos
    Mas não tenta acessar um serviço sem conector
