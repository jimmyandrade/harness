# language: pt
Funcionalidade: Organizar e-mails a partir de decisões confirmadas
  Regra: O contexto segue a finalidade da obrigação
    Exemplo: Pedágio de viagem pessoal com possibilidade de viagens profissionais futuras
      Dado que a pessoa confirmou que a viagem do comprovante era pessoal
      E que informou que viagens futuras da concessionária podem ser de trabalho
      Quando o comprovante é classificado
      Então somente o caso confirmado recebe contexto pessoal
      E não é criado um filtro que torne toda mensagem da concessionária pessoal

    Exemplo: Separação financeira não altera o uso histórico do empréstimo
      Dado que a pessoa confirmou que o empréstimo teve uso pessoal e empresarial
      E que pretende separar novas operações em conta PJ
      Quando o aviso desse empréstimo é classificado
      Então a obrigação histórica continua mista
      E a conta PJ pretendida não é apresentada como criada

  Regra: A etiqueta não substitui a leitura humana
    Exemplo: Manter alerta de segurança para revisão
      Dado que a pessoa pediu etiqueta BASB no alerta de segurança
      E que pediu para não arquivar nem marcar como lido antes de vê-lo
      Quando a etiqueta é aplicada
      Então a mensagem permanece na entrada com a etiqueta de segurança
      E o estado de leitura anterior é preservado
