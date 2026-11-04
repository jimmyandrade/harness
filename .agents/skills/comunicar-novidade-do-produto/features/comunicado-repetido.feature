# language: pt
Funcionalidade: Comunicado repetido

  Regra: uma novidade já comunicada não sai de novo

    Exemplo: o canal já tem o comunicado da mesma novidade
      Dado que outra sessão já publicou no canal o comunicado da mesma novidade
      Quando a pessoa aprova o rascunho para publicar
      Então nada é publicado
      E a resposta mostra quando e por quem o comunicado saiu

    Exemplo: o pull request já registra o comunicado
      Dado que o pull request da novidade tem o comentário de comunicado publicado
      Quando a habilidade junta o que entrou
      Então ela diz que a novidade já foi comunicada, com o canal e a data
      E não escreve outro comunicado

  Regra: o comunicado publicado fica registrado

    Exemplo: o comunicado sai no canal
      Dado que a pessoa aprovou o rascunho e ninguém comunicou a novidade antes
      Quando o comunicado é publicado no canal
      Então cada pull request comunicado ganha um comentário com o canal, a data e a hora
