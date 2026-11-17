# language: pt

Funcionalidade: Analisar o regulamento de uma oportunidade

  Regra: formulário com prazo vira tarefa no mesmo turno

    Exemplo: o grupo da organização manda o formulário de cadastro
      Dado que o manual e o grupo pedem o cadastro de expositores até uma data que já passou
      Quando a habilidade lê as fontes
      Então ela lista o cadastro como exigência vencida
      E cria a tarefa com prazo, depois de perguntar quem responde

  Regra: o que o texto não diz é lacuna

    Exemplo: o manual não trata do acesso do carro na desmontagem
      Dado que o manual fala do acesso na montagem e não na desmontagem
      Quando a habilidade lista o que falta
      Então ela marca o acesso na desmontagem como lacuna com a pergunta pronta
      E não supõe que o acesso é igual ao da montagem

  Regra: o projeto escrito é exigência à parte

    Exemplo: o edital pede justificativa, orçamento e cronograma
      Dado que o regulamento do edital pede um projeto escrito com prazo, limite de páginas e critérios
      Quando a habilidade lista as exigências
      Então ela lista o projeto como exigência à parte, com prazo, formato, limite e critérios
      E propõe a produção cultural como responsável da tarefa, sem escrever o projeto
