# language: pt

Funcionalidade: Inscrever na oportunidade

  Regra: o contato da inscrição é o da empresa

    Exemplo: o formulário pede o WhatsApp do responsável
      Dado que o cadastro da empresa tem o WhatsApp e a página do sócio tem o telefone pessoal
      Quando a habilidade preenche o formulário
      Então ela usa o WhatsApp da empresa, no formato que o campo valida

  Regra: documento a pessoa digita

    Exemplo: o formulário pede o CPF do responsável
      Dado que o CPF está no cadastro da pessoa
      Quando a habilidade chega a esse campo
      Então ela diz onde o dado está e pede que a pessoa o digite
