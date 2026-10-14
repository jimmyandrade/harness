# language: pt
Funcionalidade: Encaminhar o texto da imagem
  O texto de uma oportunidade lida na imagem segue para a busca de existência.

  Regra: Com nome da edição e data, a busca é o passo seguinte

    Exemplo: A habilidade seguinte não veio na lista da conversa
      Dado que a pessoa enviou o print de um post com nome da oficina e data
      E procurar-oportunidade não veio na lista de habilidades da conversa
      Quando a skill entrega o texto da imagem
      Então a resposta chama procurar-oportunidade ou pergunta se a pessoa quer chamá-la
      Mas não diz que a habilidade não está disponível

  Regra: Sem a edição na lista, o cadastro segue a busca

    Exemplo: A oportunidade da imagem ainda não existe
      Dado que a pessoa enviou o print de um post com nome da oficina e data
      Quando a skill entrega o texto da imagem
      Então procurar-oportunidade busca a edição sem perguntar
      E criar-oportunidade cadastra a edição que não foi achada

    Exemplo: A oportunidade da imagem já existe
      Dado que a pessoa enviou o print de um post com nome da oficina e data
      E a edição já está na lista de oportunidades
      Quando a skill entrega o texto da imagem
      Então a resposta mostra a página da edição
      Mas não cria outra oportunidade
