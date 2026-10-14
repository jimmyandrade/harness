# language: pt
Funcionalidade: Responder com o que o registro guarda
  A data da resposta sai do registro, não do texto da skill.

  Regra: A data pedida vem da data do registro

    Exemplo: Black Friday 2026
      Dado que o registro Black Friday 2026 está na lista de datas significativas
      E a data sexta-feira, 27/11/2026
      Quando a skill responde quando será a Black Friday
      Então a resposta traz sexta-feira, 27/11/2026
      E o planejamento sai das observações desse registro
