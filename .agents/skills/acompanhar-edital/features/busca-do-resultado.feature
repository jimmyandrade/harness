# language: pt

Funcionalidade: Busca do resultado pelo nome em cada domínio
  O nome entre aspas, com `site:` em cada domínio, acha o documento que nenhum aviso trouxe.

  Regra: Cada variação do nome é buscada em cada domínio

    Exemplo: Nome artístico e nome civil
      Dado que a pessoa usa um nome artístico e um nome civil mais longo
      Quando a skill busca o resultado
      Então ela busca cada variação do nome entre aspas, com `site:` em cada domínio
      E a resposta mostra cada consulta feita

    Exemplo: Nome do documento com um sobrenome a mais
      Dado que a pessoa se apresenta com o primeiro nome e um sobrenome
      E que o documento oficial traz o nome civil com outro sobrenome no meio
      Quando a skill junta as variações do nome
      Então ela pergunta ou procura o nome civil completo antes de buscar
      E busca também o primeiro nome com cada sobrenome conhecido

    Exemplo: Ferramenta de busca com filtro de domínio
      Dado que a ferramenta de busca tem um filtro de domínio
      Quando a skill busca o nome num domínio
      Então ela usa o filtro da ferramenta, e não `site:` escrito na consulta

  Regra: Página do edital fora do ar não encerra a busca

    Exemplo: Notícia do edital removida depois da seleção
      Dado que a página da notícia do edital responde que não existe mais
      Quando a skill procura os documentos da seleção
      Então ela procura os arquivos do site pelo nome ou pela listagem por data
      E lê os documentos que continuam publicados

  Regra: O edital é identificado pelo órgão e pelo objeto

    Exemplo: Dois editais com o mesmo número
      Dado que a mantenedora publicou dois editais com o mesmo número e o mesmo ano, para objetos diferentes
      Quando a skill acha um documento por esse número
      Então ela confere o órgão e o objeto antes de ligá-lo à edição

  Regra: O documento achado é lido antes de responder

    Exemplo: Nome numa lista de selecionados com prazo de matrícula
      Dado que a busca acha o nome num documento de resultado
      Quando a skill lê o documento
      Então a resposta diz a seleção, a edição, a situação da pessoa, a data do documento e o link
      E diz o prazo de matrícula ou de confirmação, e se ele já passou

    Exemplo: Menção honrosa
      Dado que a busca acha o nome numa lista de menções honrosas
      Quando a skill lê o documento
      Então a resposta diz que a pessoa recebeu menção honrosa, sem dizer que foi selecionada

  Regra: Cada etapa da seleção tem a sua situação

    Exemplo: Inscrição habilitada não é aprovação
      Dado que a busca acha o nome numa lista de inscrições habilitadas
      Quando a skill lê o documento
      Então a resposta diz que a inscrição foi habilitada para a próxima etapa, sem dizer que a pessoa passou
      E a skill continua a busca até o resultado final

    Exemplo: Convocação para prova
      Dado que a busca acha o nome num cronograma de provas
      Quando a skill responde
      Então a data, a hora e o local da prova abrem a resposta, como prazo de agir

    Exemplo: Desclassificação por ausência
      Dado que o resultado final traz o nome com a situação desclassificada e o motivo ausente
      Quando a skill responde
      Então ela diz a situação, o motivo e a data da prova que a pessoa perdeu
      E diz se há chamada de excedentes com o nome

  Regra: PDF que a leitura pela web não abre é baixado para leitura

    Exemplo: PDF com o texto compactado
      Dado que a leitura pela web não devolve o texto de um PDF de resultado
      Quando a skill precisa saber se o nome está nele
      Então ela baixa o PDF numa pasta temporária e extrai o texto
      E não grava o arquivo nos anexos

  Regra: Busca sem resultado não prova reprovação

    Exemplo: Nenhum documento com o nome
      Dado que nenhuma consulta acha o nome
      Quando a skill responde
      Então ela diz que a busca não achou o nome, e não que a pessoa não passou
      E aponta a página de resultados do edital para conferir à mão
