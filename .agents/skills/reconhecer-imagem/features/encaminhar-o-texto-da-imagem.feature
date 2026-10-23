# language: pt
Funcionalidade: Encaminhar o texto da imagem
  O texto lido segue para a habilidade da entidade, inclusive a despesa.

  Regra: Com nome da edição e data, a busca é o passo seguinte

    Exemplo: A habilidade seguinte não veio na lista da conversa
      Dado que a pessoa enviou o print de um post com nome da oficina e data
      E procurar-oportunidade existe no catálogo conectado, mas não na lista inicial
      Quando a skill entrega o texto da imagem e o ambiente permite consultar o catálogo
      Então procurar-oportunidade é localizada e sua página é carregada para continuar
      Mas não pergunta se a pessoa quer chamar a habilidade

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

  Regra: Evidência financeira segue para a despesa

    Exemplo: Nota e transação sem pedido escrito de lançamento
      Dado que a pessoa enviou uma nota de compra e o print da mesma transação
      Quando a skill lê as imagens sem um pedido escrito
      Então o texto segue para lancar-despesa-da-empresa procurar o lançamento
      Mas a resposta não para só na transcrição

    Exemplo: A despesa de jantar precisa de uma habilidade fora da lista inicial
      Dado que a pessoa pediu para cadastrar uma despesa de jantar e enviou a imagem do pedido
      E lancar-despesa-da-empresa existe no catálogo conectado, mas não na lista inicial
      Quando o ambiente permite buscar a habilidade pelo nome
      Então a página de lancar-despesa-da-empresa é encontrada e carregada para continuar
      E a pessoa não precisa confirmar a chamada nem enviar o link da habilidade

  Regra: O comando financeiro acompanha a leitura do comprovante

    Exemplo: Registrar despesa a partir de uma imagem com comando ditado
      Dado que a pessoa anexou a imagem de um comprovante com um comando ditado para registrar a despesa
      Quando a habilidade entrega a leitura
      Então lancar-despesa-da-empresa recebe os dados lidos e a operação pedida
      Mas a resposta não exige um novo pedido pelo nome da habilidade
