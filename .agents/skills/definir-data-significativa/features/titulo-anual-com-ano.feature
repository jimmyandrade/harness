# language: pt
Funcionalidade: Incluir o ano no título do evento anual
  O título segue o título do evento anual.
  O ano fica no final.

  Regra: Evento que acontece uma vez por ano leva o ano no título

    Exemplo: Cadastro na lista de datas significativas
      Dado que existe um evento que acontece uma vez por ano
      E o ano da data
      Quando a skill cadastra o evento na lista de datas significativas
      Então o título segue o título do evento anual
      E o ano fica no final

    Exemplo: Dia Internacional do Crochê de 2026
      Dado que existe o Dia Internacional do Crochê de 2026
      Quando a skill cadastra esse evento na lista de datas significativas
      Então o título fica Dia Internacional do Crochê 2026
      E não cria outro registro para o mesmo ano

    Exemplo: Registro anual sem o ano
      Dado que existe um evento anual já cadastrado sem o ano no título
      Quando a skill revisa esse registro
      Então ela renomeia o registro
      E coloca o ano no final

  Regra: A desambiguação usa o ano como parte do nome

    Exemplo: Dois anos do mesmo evento
      Dado que existem dois registros anuais do mesmo nome com anos diferentes
      Quando a skill desambigua na lista de datas significativas
      Então cada título traz o próprio ano no final
      E os dois anos não viram um registro só

  Regra: Evento que não é anual fica sem ano no título

    Exemplo: Compromisso que não se repete uma vez por ano
      Dado que existe um evento que não acontece uma vez por ano
      Quando a skill cria o título
      Então o título não recebe um ano
