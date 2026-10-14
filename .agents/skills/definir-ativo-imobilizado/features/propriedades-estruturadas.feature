# language: pt

Funcionalidade: Preencher propriedades estruturadas
  O dado útil entra na propriedade, e o resto fica na observação.

  Contexto:
    Dado que existe um item a criar ou atualizar na lista de ativos imobilizados

  Regra: A propriedade estruturada recebe o dado

    Exemplo: Evidência com dado útil
      Quando o comprovante, a nota, o recibo, o link, a foto ou o contexto traz dado útil
      Então a análise preenche a propriedade estruturada disponível
      E deixa nas observações patrimoniais só o que não tem propriedade
      Mas não copia no corpo o que já está na propriedade

    Exemplo: Evidência sem inferência segura
      Quando a evidência não permite inferir marca, modelo, preço, medidas, quantidade ou data
      Então a análise deixa esses campos vazios
      Mas não inventa o valor
