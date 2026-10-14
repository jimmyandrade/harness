# language: pt

Funcionalidade: Avisar evento em agenda aposentada
  A consulta avisa quando um calendário de um produto que não usamos mais ainda tem evento.

  Regra: A busca casa o calendário e não para no dia de hoje

    Exemplo: Pergunta sem compromisso no dia
      Dado que uma agenda está em Agendas com uso aposentada
      E nenhum compromisso nela no dia da pergunta
      Quando a pessoa pergunta se há compromisso nessa agenda
      Então a busca cobre a agenda, não só o dia de hoje
      E avisa se houver evento em outro dia

    Exemplo: Procurar de novo
      Dado que a resposta anterior cobriu só o dia de hoje
      Quando a pessoa pede para procurar de novo
      Então a busca cobre de novo a agenda
      E avisa se houver evento criado nela

    Exemplo: O evento em qualquer dia
      Dado que o evento da reunião de pesquisa está numa agenda de uso aposentada
      E o horário das 18h às 19h na quinta-feira, 01/10/2026
      Quando a pessoa pede todo evento dessa agenda em qualquer dia
      Então a resposta mostra esse compromisso, a data e o horário
      E avisa que o produto não é mais usado
