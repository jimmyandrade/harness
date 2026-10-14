# language: pt

Funcionalidade: Incluir inscrição que ainda não está no registro
  Uma inscrição enviada e ausente do registro entra na lista de inscrições.

  Regra: A inclusão acontece sem pedir licença

    Exemplo: Ana Souza no Festival Rota Sul 2026
      Dado que a inscrição de Ana Souza no Festival Rota Sul 2026 ainda está fora da lista de inscrições
      E o pedido confirmado na foto
      Quando a pessoa diz que a inscrição foi feita
      Então a skill inclui essa inscrição no registro
      E liga a inscrição à edição Festival Rota Sul 2026

    Exemplo: Só a foto do pedido confirmado
      Dado que a edição Festival Rota Sul 2026 já está na lista de oportunidades
      E a foto do pedido confirmado sem o nome de quem se inscreveu
      Quando a pessoa envia só essa foto
      Então a skill não cadastra a inscrição
      E exige quem fez a inscrição e para qual pessoa ou empresa ela foi feita
