# language: pt
Funcionalidade: Ler o card e avisar do conflito
  A legenda do post pode não trazer os dados da edição. O card, o local e as inscrições da mesma data completam o cadastro.

  Regra: O dado que só a imagem traz vem da imagem, sem aviso de problema

    Exemplo: Legenda sem a data
      Dado que a legenda do post não traz a data da edição
      E o card do post traz a data
      Quando a skill cadastra a edição
      Então a data da edição vem do card
      E a resposta diz que a data veio da imagem
      Mas a resposta não trata a legenda sem a data como um problema

    Exemplo: Legenda e imagem com datas diferentes
      Dado que a legenda e o card trazem datas diferentes
      Quando a skill cadastra a edição
      Então a skill avisa a organização pelo WhatsApp ou pelo e-mail que já tem
      Mas, sem canal, a skill avisa por um comentário no post
      E o texto passa pelo tom de voz da marca

  Regra: A empresa do local é cadastrada e a resposta traz o mapa

    Exemplo: Local fora da lista, com nome e endereço no card
      Dado que o card traz o nome do espaço e o endereço
      E a empresa do local não está na lista
      Quando a skill cadastra a edição
      Então a empresa do local é cadastrada na mesma resposta, sem perguntar
      E a resposta traz o link do Google Maps do local

  Regra: Inscrição na mesma data é avisada, não decidida

    Exemplo: Já há inscrição em outra feira no mesmo dia
      Dado que a marca já tem inscrição em outra oportunidade na data da edição nova
      Quando a skill cadastra a edição
      Então a resposta diz as duas oportunidades, a data com o dia da semana e o status de cada inscrição
      E a resposta diz que quem vai em cada uma é decisão da pessoa, se a marca for selecionada nas duas
      Mas a skill não decide isso nem cria tarefa
