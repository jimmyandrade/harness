# language: pt

Funcionalidade: Consultar o responsável pela oportunidade

  Regra: a pergunta de uma marca não vai no grupo de comunicados

    Exemplo: o grupo só aceita mensagens da organização
      Dado que o grupo de expositores só permite que administradores escrevam
      Quando a habilidade monta a pergunta sobre o acesso do carro
      Então ela vai pelo e-mail e pela conversa individual do responsável
      E só é enviada depois do sim da pessoa

  Regra: a resposta é gravada onde serve a quem organiza

    Exemplo: o responsável responde o horário da desmontagem
      Dado que o responsável respondeu até que horas o carro entra
      Quando a habilidade recebe a resposta
      Então ela grava na página da oportunidade e do ponto de contato
      E atualiza o cronograma e a lição nas notas do grupo
