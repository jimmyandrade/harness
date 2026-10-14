# language: pt

Funcionalidade: Guardar evidência no lugar certo
  Foto, link e comprovante financeiro não se misturam no corpo.

  Contexto:
    Dado que existe um ativo a criar ou revisar

  Regra: Cada evidência usa a propriedade adequada

    Exemplo: Foto e link do produto
      Quando há foto do ativo ou link de produto
      Então a foto fica nas fotos
      E o link fica no link do produto

    Exemplo: Comprovante financeiro
      Quando há nota, recibo ou comprovante financeiro
      Então a evidência fica no lançamento na lista de despesas e investimentos
      Mas o corpo do ativo não repete esse dado

    Exemplo: Contexto sem propriedade
      Quando o texto é contexto, decisão ou pendência sem propriedade
      Então o corpo guarda esse texto
      Mas não repete o que já está na propriedade
