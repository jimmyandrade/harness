# language: pt

Funcionalidade: Conferir a agenda e a viagem antes de combinar
  Uma mensagem que propõe, aceita ou combina data, hora, lugar ou prazo só é rascunhada depois de conferir a agenda e a viagem da pessoa.

  Regra: A proposta confere com a agenda e a viagem antes do texto

    Exemplo: Retirada marcada numa cidade de onde a pessoa já saiu
      Dado que a pessoa pede para combinar com um contato a retirada de exemplares amanhã numa cidade
      E que a viagem ativa mostra a saída dessa cidade amanhã cedo
      Quando a habilidade vai rascunhar a mensagem
      Então ela confere a agenda, seguindo `procurar-agenda`, e a viagem, seguindo `definir-viagem`
      E diz o conflito antes de mostrar o texto
      E oferece uma alternativa que cabe, como outro dia ou horário, outra pessoa ou o envio pelo correio

    Exemplo: Proposta que não bate com nada
      Dado que a agenda e a viagem não têm compromisso nem deslocamento no horário proposto
      Quando a habilidade rascunha a mensagem que combina o encontro
      Então o texto sai sem aviso de conflito
      E a resposta diz que a agenda e a viagem foram conferidas

    Exemplo: Sem acesso à agenda
      Dado que a sessão não alcança a agenda nem a viagem
      Quando a pessoa pede uma mensagem que combina uma data
      Então a habilidade para e pede o dado
      E não rascunha com a data suposta

    Exemplo: Mensagem que não combina data nem lugar
      Dado que a mensagem só agradece ou responde uma dúvida
      Quando a habilidade rascunha
      Então ela não consulta a agenda
