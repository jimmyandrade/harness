# language: pt

Funcionalidade: Não antecipar a participação
  o ponto de contato é a execução real da participação da empresa.

  Regra: Reunião e oportunidade aprovada não criam o ponto

    Exemplo: Reunião com uma organização
      Dado que existe uma reunião ou resenha com uma organização
      Quando o pedido chega a esta habilidade
      Então ela para e segue definir-agenda
      Mas não cria o ponto de contato

    Exemplo: A oportunidade aprovada sem os dias
      Dado que existe uma oportunidade aprovada sem os dias de participação da empresa
      Quando o pedido é registrar na agenda
      Então a skill pergunta esses dias
      Mas não grava o ponto de contato na agenda
