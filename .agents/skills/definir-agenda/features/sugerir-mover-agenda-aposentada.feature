# language: pt

Funcionalidade: Sugerir mover evento da agenda aposentada
  Um evento na agenda aposentada vai para a agenda padrão.

  Regra: O destino é a agenda padrão

    Exemplo: Reunião de pesquisa na agenda errada
      Dado que o evento da reunião de pesquisa está numa agenda de uso aposentada
      E o horário das 18h às 19h na quinta-feira, 01/10/2026
      Quando a pessoa diz que essa agenda está errada
      Então a resposta sugere mover o evento para a agenda padrão
      E nomeia essa agenda como destino
