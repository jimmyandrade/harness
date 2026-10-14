# language: pt

Funcionalidade: Manter a aula na página e na agenda
  A aula fica na lista de recursos de aprendizado e no Google Agenda.
  A página fica ligada à oportunidade e guarda a transcrição e as anotações.
  A aula pode ser online ou presencial.

  Regra: A conclusão espera as duas checagens

    Exemplo: O banco não achou e há um identificador
      Dado que a pessoa perguntou se a aula já existe e a lista de recursos de aprendizado não achou
      E há oportunidade, grupo, módulo, curso, data aproximada ou nome do evento
      Quando a skill responde
      Então ela busca o evento no Google Agenda por variações do título e datas próximas
      Mas ela não diz que não está cadastrado

    Exemplo: O evento está na agenda
      Dado que existe um evento no Google Agenda com data, início, fim, título, local, link e descrição
      E uma relação clara com a oportunidade ou o grupo
      Quando a skill usa esse evento como evidência
      Então a página é criada ou atualizada e ligada à oportunidade ou ao grupo
      E a data e hora, Status e Ordem lógica seguem o evento e os itens que já existem

    Exemplo: As duas fontes não têm o item
      Dado que a intenção envolve aula ou evento já agendado
      E a lista de recursos de aprendizado não tem o item
      E o Google Agenda não tem o evento
      Quando a skill responde
      Então a resposta diz que não está cadastrado
