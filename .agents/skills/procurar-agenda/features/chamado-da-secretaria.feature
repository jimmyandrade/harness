# language: pt

Funcionalidade: Abrir a agenda pelo nome da secretária
  O nome no pedido abre a busca.
  A variação conta.
  O pedido fora da agenda é resolvido e a agenda é oferecida.

  Regra: O nome basta

    Exemplo: Cancelar sem dizer agenda
      Dado que a agenda tem um apelido nas instruções do projeto
      E a pessoa chama a agenda por esse apelido e pede para cancelar os eventos do dia
      Quando o pedido não diz agenda, calendário, compromisso nem horário
      Então a menção abre a habilidade na hora
      E o cancelamento segue a habilidade do evento

    Exemplo: Outro pedido
      Dado que existe um pedido à secretária que não é a agenda
      Quando a resposta sai
      Então o pedido é resolvido
      E a resposta oferece ajuda com a agenda

    Exemplo: Nome na lista de pessoas
      Dado que existe um nome que pode ser pessoa, cliente, fornecedora ou marca
      Quando o contexto não separa a secretária
      Então a análise pergunta
      E não escolhe sozinha
