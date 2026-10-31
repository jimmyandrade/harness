# language: pt

Funcionalidade: Busca do resultado pelo nome em cada domínio
  O nome entre aspas, com `site:` em cada domínio, acha o documento que nenhum aviso trouxe.

  Regra: Cada forma do nome é buscada em cada domínio

    Exemplo: Nome artístico e nome civil
      Dado que a pessoa usa um nome artístico e um nome civil mais longo
      Quando a skill busca o resultado
      Então ela busca cada forma do nome entre aspas, com `site:` em cada domínio
      E a resposta mostra cada consulta feita

  Regra: O documento achado é lido antes de responder

    Exemplo: Nome numa lista de selecionados com prazo de matrícula
      Dado que a busca acha o nome num documento de resultado
      Quando a skill lê o documento
      Então a resposta diz a seleção, a edição, a situação da pessoa, a data do documento e o link
      E diz o prazo de matrícula ou de confirmação, e se ele já passou

  Regra: Busca sem resultado não prova reprovação

    Exemplo: Nenhum documento com o nome
      Dado que nenhuma consulta acha o nome
      Quando a skill responde
      Então ela diz que a busca não achou o nome, e não que a pessoa não passou
      E aponta a página de resultados do edital para conferir à mão
