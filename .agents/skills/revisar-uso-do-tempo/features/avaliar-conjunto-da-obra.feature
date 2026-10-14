# language: pt

Funcionalidade: Avaliar o conjunto da obra
  A agenda é classificada pelo objetivo e pela área da vida.
  A auditoria mede a distribuição e aponta o que o Google Agenda mostra.

  Regra: A classificação e os achados saem da agenda

    Exemplo: Agenda com objetivo, área e remarcação visíveis
      Dado que existem compromissos com objetivo e área da vida já nomeados
      E a duração e as remarcações que o Google Agenda mostra
      Quando o conjunto da obra é avaliado
      Então a resposta classifica por objetivo e área da vida
      E aponta ausência, excesso e remarcação recorrente que a agenda mostra

    Exemplo: Classificação ou histórico ausente
      Dado que existe um compromisso sem objetivo, área da vida ou histórico de remarcação na agenda
      Quando o conjunto da obra é avaliado
      Então a ausência entra no achado
      Mas a skill não atribui a classificação nem inventa a contagem
      E ela não remarca o compromisso
