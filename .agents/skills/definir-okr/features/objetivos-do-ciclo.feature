# language: pt

Funcionalidade: Objetivos do ciclo
  A área sai do ciclo com poucos objetivos claros, ligados à estratégia e com dono.

  Regra: O objetivo nasce da visão da área

    Exemplo: A área começa a definir os objetivos
      Dado que uma área vai definir os objetivos de um ciclo
      Quando a habilidade propõe os objetivos
      Então ela leu antes a missão, os princípios e os limites da área
      E a visão da área no ciclo está escrita antes dos objetivos

  Regra: O objetivo é específico, qualitativo e legível

    Exemplo: O objetivo chega com um número
      Dado que o título do objetivo traz uma métrica
      Quando a habilidade revisa o objetivo
      Então ela reescreve o objetivo sem número
      E o título faz sentido lido em voz alta, sem prefixo

  Regra: A área tem poucos objetivos no ciclo

    Exemplo: A área passa do máximo de objetivos
      Dado que a área já tem o máximo de objetivos no ciclo
      Quando alguém pede mais um objetivo
      Então a habilidade propõe trocar ou aprofundar um objetivo existente
      E não cria um objetivo raso a mais

    Exemplo: Uma área relevante está sem objetivo
      Dado que um ciclo está ativo
      Quando a habilidade revisa a cobertura das áreas
      Então cada área relevante tem pelo menos um objetivo no ciclo

  Regra: O objetivo tem dono e segue a estratégia

    Exemplo: O objetivo está sem área ou sem champion
      Dado que um objetivo vai entrar em vigor
      Quando a habilidade valida o objetivo
      Então ele tem a área responsável vinculada
      E ele tem uma pessoa champion

    Exemplo: O objetivo não conversa com a estratégia
      Dado que um objetivo não segue a estratégia, a tática e a cultura do negócio
      Quando a habilidade avalia se ele fica no ciclo
      Então ela ajusta o objetivo ou propõe descartar

  Regra: Os OKRs só fecham com as duas respostas

    Exemplo: A área quer fechar os OKRs
      Dado que a área está fechando os OKRs do ciclo
      Quando a habilidade valida se eles guiam a execução
      Então a área responde o que precisa entregar ou mudar no ciclo
      E a área responde como mede em números se está chegando lá

    Exemplo: Falta uma das respostas
      Dado que a área não responde uma das duas perguntas
      Quando ela tenta dar os OKRs por fechados
      Então a habilidade trata como erro de especificação
      E pede o ajuste antes de seguir

  Regra: O ciclo revisa os OKRs com honestidade

    Exemplo: Um key result perde o sentido no meio do ciclo
      Dado que o contexto mudou e um key result não mede mais o objetivo
      Quando a habilidade faz a revisão periódica
      Então ela ajusta ou troca o key result
      E registra o que mudou e qual decisão humana foi tomada

    Exemplo: Um key result não avança
      Dado que um key result está parado ou piorando
      Quando a habilidade reporta o progresso
      Então o número aparece como está
      E vira insumo para decidir ações e prioridades
