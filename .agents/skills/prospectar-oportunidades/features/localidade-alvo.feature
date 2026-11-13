# language: pt
Funcionalidade: Escolher a localidade-alvo da prospecção
  A viagem ativa decide onde procurar, e a prioridade decide o resto.

  Regra: A viagem ativa vem antes da prioridade

    Exemplo: Há viagem na janela
      Dado que existe uma viagem dentro da janela da viagem ativa
      Quando a skill escolhe a localidade-alvo
      Então a localidade-alvo é o destino da viagem

    Exemplo: A localidade é vetada
      Dado que a localidade-alvo tem prioridade vetada
      Quando a skill escolhe a localidade-alvo
      Então a skill não procura e diz o motivo

  Regra: Só os dias em comum com a viagem entram no cronograma

    Exemplo: Edição de vários dias com feira no meio
      Dado que a oportunidade dura vários dias e a viagem tem dias de feira
      Quando a skill registra a programação
      Então só as atividades dos dias em comum, sem os dias de feira, entram no cronograma
