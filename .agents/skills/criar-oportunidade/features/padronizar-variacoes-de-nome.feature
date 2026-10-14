# language: pt
Funcionalidade: Padronizar as variações de nome
  Nomes alternativos entram em bullets, um por item, com ponto e vírgula.

  Regra: Cada nome alternativo é um item da lista

    Exemplo: Registrar nomes alternativos
      Dado que o mapeamento tem as variações de nome
      Quando a skill registra nomes alternativos
      Então a skill usa uma lista de bullets com um nome por item
      E cada item termina com ponto e vírgula
      E mantém as grafias úteis para a busca com e sem sigla e com e sem ano
