# language: pt

Funcionalidade: Diferenciar oportunidade, negócio e ponto de contato
  A mesma feira, marca, loja, pessoa ou organização pode aparecer em várias partes.
  Registrar na agenda não junta as três.

  Regra: Cada parte tem o seu papel

    Exemplo: A mesma feira em partes diferentes
      Dado que existe uma feira, marca, loja, pessoa ou organização que aparece em mais de uma parte
      Quando o pedido é registrar algo na agenda
      Então oportunidade fica como fonte da edição, da data, da curadoria e da possibilidade
      E negócio fica como conversa, abordagem, negociação ou reunião comercial
      E ponto de contato fica como a execução real da participação da empresa

    Exemplo: Reunião com uma organização
      Dado que existe uma reunião ou resenha com uma organização
      Quando o pedido é registrar na agenda
      Então o registro fica como negócio
      Mas não vira ponto de contato

    Exemplo: A oportunidade aprovada sem os dias
      Dado que existe uma oportunidade aprovada
      E os dias de participação da empresa ainda não confirmados
      Quando o pedido é registrar na agenda
      Então a skill pergunta esses dias
      Mas não cria o ponto de contato na agenda
