# language: pt
Funcionalidade: Anexar o cartaz da edição
  O cartaz, o print da divulgação ou o comunicado da data fica nos anexos da edição.

  Regra: O cadastro anexa o arquivo na mesma gravação

    Exemplo: Edição nova com o cartaz da divulgação
      Dado que a pessoa enviou o cartaz de uma edição que não existe na lista de oportunidades
      Quando a skill cadastra a edição
      Então o cartaz fica nos anexos da edição
      Mas o texto do cartaz não vai ao corpo da página

    Exemplo: Edição que já tem arquivos anexados
      Dado que a edição já tem o edital nos anexos
      E a pessoa enviou o cartaz da mesma data para atualizar a edição
      Quando a skill grava o cartaz
      Então os anexos da edição mantêm o edital e recebem o cartaz uma vez só

  Regra: A consulta só oferece o anexo

    Exemplo: A pessoa só pergunta sobre a edição
      Dado que a pessoa enviou o cartaz e só perguntou o horário da edição
      Quando a skill responde
      Então a resposta oferece anexar o cartaz
      Mas não grava o arquivo
