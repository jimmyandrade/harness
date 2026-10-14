# language: pt
Funcionalidade: Checar duplicata antes de cadastrar
  O cadastro novo só segue depois da checagem de equivalente.

  Regra: Equivalente existente impede o cadastro duplicado

    Exemplo: Identificadores de um registro novo
      Dado que a pessoa vai cadastrar um novo registro
      Quando ela informa os identificadores
      Então a skill checa se já existe um equivalente
      E se existir impede o cadastro duplicado
      E orienta a usar ou relacionar o registro existente

  Regra: A busca cobre o título e as variações mínimas

    Exemplo: Checagem antes de criar
      Dado que a pessoa vai criar um novo registro
      Quando a skill faz a checagem de duplicatas
      Então ela busca o termo principal no título
      E busca sigla, apelido, nome antigo e nome com e sem edição ou ano
      E abre os possíveis matches e compara site oficial, localidade, datas, organizador e perfis sociais

  Regra: Nome alternativo e grafia diferente apontam o canônico

    Exemplo: Identificar possíveis duplicatas antes de criar
      Dado que a pessoa busca e tenta cadastrar um novo registro de uma entidade
      Quando a busca inclui nomes alternativos e grafias diferentes
      Então a skill evita criar um registro repetido
      E aponta o registro canônico existente
