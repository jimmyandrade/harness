# language: pt
Funcionalidade: Copy no tom de voz do projeto
  A copy respeita a identidade verbal e espera a fonte.

  Regra: A copy sai alinhada

    Exemplo: Texto da marca
      Dado que existe um pedido para criar, adaptar, lapidar ou validar texto da marca
      Quando a skill escreve, sugere, revisa ou reescreve
      Então a copy respeita o tom de voz e o vocabulário do projeto
      E deixa de fora termo proibido, frase genérica, cara de IA e linguagem desalinhada
      Mas não enfraquece desejo, clareza, personalidade nem potência comercial

    Exemplo: Peça de comunicação
      Dado que existe um slogan, uma headline, uma legenda, uma descrição de produto, uma bio, um e-mail, uma mensagem, uma campanha, uma apresentação, uma inscrição, uma abordagem, um CTA, um nome, uma microcopy ou uma comunicação institucional
      Quando a pessoa pede a copy
      Então a skill redige no tom de voz
      E considera contexto, canal, público, as fontes da marca, o vocabulário e a intenção criativa

  Regra: A copy espera a fonte

    Exemplo: Contexto ausente
      Dado que existe um texto sem contexto, canal, público, fonte da marca, vocabulário ou intenção criativa
      Quando a skill vai escrever ou aprovar
      Então ela pede o que falta
      Mas não aprova a copy

    Exemplo: Formato de conteúdo
      Dado que existe um formato de conteúdo que a pessoa apontou
      Quando a skill redige a copy
      Então o formato permanece como está
      Mas a skill não o altera

    Exemplo: Dado comercial de outra fonte
      Dado que existe uma copy que depende de cliente, peça, oportunidade ou histórico comercial
      Quando a skill vai escrever
      Então ela consulta a fonte que a pessoa indicou
      Mas não assume o dado
