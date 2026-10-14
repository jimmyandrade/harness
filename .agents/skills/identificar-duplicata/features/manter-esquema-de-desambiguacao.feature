# language: pt
Funcionalidade: Manter o esquema mínimo da desambiguação
  A fonte que desambigua guarda o título, as variações, o vínculo e o contexto.

  Regra: O esquema mínimo separa o contexto da grafia

    Exemplo: Configurar o banco para desambiguação
      Dado que existe uma fonte de dados que usa a desambiguação
      Quando a skill configura o esquema do banco
      Então o título permanece o nome canônico
      E o banco mantém Variações de nome Não confundir com e o contexto da desambiguação ou a propriedade equivalente
      E o contexto não entra nas grafias
