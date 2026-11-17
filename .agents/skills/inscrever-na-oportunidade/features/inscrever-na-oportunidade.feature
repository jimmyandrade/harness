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

  Regra: o projeto escrito vem da produção cultural

    Exemplo: o edital pede o projeto e o texto ainda não foi entregue
      Dado que a inscrição pede um projeto escrito e a tarefa da produção cultural não está feita
      Quando a habilidade prepara a inscrição
      Então ela deixa o campo do projeto como pendência, com o prazo
      E não escreve o projeto nem envia a inscrição

    Exemplo: o texto foi devolvido na tarefa
      Dado que a produção cultural devolveu o texto do projeto na tarefa
      Quando a habilidade chega ao campo do projeto
      Então ela usa o texto entregue, no formato e no limite do formulário
      E mostra o projeto junto do resto antes de pedir o sim
