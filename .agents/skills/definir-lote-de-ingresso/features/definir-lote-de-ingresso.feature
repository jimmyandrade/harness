# language: pt

Funcionalidade: Cadastrar e conferir o lote de ingresso de um evento
  O banco de lotes é a fonte da verdade dos lotes de cada evento.
  A habilidade confere, cadastra ou corrige o lote ali, com o sim da pessoa.

  Regra: O lote vem do banco de lotes, não da página do evento

    Exemplo: Evento sem lote
      Dado que nenhum lote do banco de lotes está ligado ao evento
      Quando a pessoa pergunta se os lotes do evento foram lançados
      Então a habilidade diz que o evento não tem lote
      E monta o plano de cadastro do lote
      E só grava depois do sim da pessoa

    Exemplo: Lotes escritos no corpo da página do evento
      Dado que o corpo da página do evento lista os lotes
      E que nenhum lote do banco de lotes está ligado ao evento
      Quando a habilidade confere os lotes
      Então ela trata o texto do corpo como erro de lançamento
      E propõe criar os lotes no banco de lotes com os mesmos valores

  Regra: Um lote que já existe é corrigido, não duplicado

    Exemplo: Lote já ligado ao evento
      Dado que o lote pedido já está ligado ao evento no banco de lotes
      Quando a pessoa pede para cadastrá-lo
      Então a habilidade confere esse mesmo lote
      E não cria outro registro

    Exemplo: Loteamento copiado da edição anterior
      Dado que a pessoa não diz o preço nem a quantidade
      E que a edição anterior do mesmo produto no mesmo local tem lotes
      Quando a habilidade monta o plano
      Então ela propõe os valores da edição anterior, com a origem
      E não decide preço nem quantidade sem o sim da pessoa

  Regra: A conta recebedora precisa estar ativa

    Exemplo: Lote sem conta recebedora
      Dado que o lote do evento está sem conta recebedora
      Quando a habilidade confere o lote
      Então ela avisa que o lote está sem conta recebedora
      E pede a conta ativa que deve receber

    Exemplo: Lote com conta descontinuada
      Dado que a conta recebedora do lote está descontinuada
      Quando a habilidade confere o lote
      Então ela propõe trocar pela conta ativa confirmada
      E não apaga a conta antiga

  Regra: A taxa é decisão de quem decide a taxa

    Exemplo: Taxa não informada
      Dado que a pessoa pede para cadastrar um lote a 10 reais
      E que não diz se há taxa
      Quando a habilidade monta o plano
      Então ela pergunta se há taxa e de quanto
      E não decide a taxa no lugar de quem decide

    Exemplo: Valor que inclui a taxa
      Dado que o projeto guarda no valor o total com a taxa
      E que quem decide a taxa confirmou taxa de 10%
      Quando a habilidade cadastra um lote de 10 reais
      Então o valor do lote é 11 reais
      E a taxa percentual é 10%

    Exemplo: Valor sem a taxa
      Dado que o projeto guarda no valor o preço sem a taxa
      E que quem decide a taxa confirmou taxa de 10%
      Quando a habilidade cadastra um lote de 10 reais
      Então o valor do lote é 10 reais
      E a taxa percentual é 10%

  Regra: O lote só conta com o link

    Exemplo: Lote cadastrado
      Dado que a pessoa aprovou o plano
      Quando a habilidade grava o lote
      Então ela devolve o link de cada lote com nome, valor, quantidade, status da janela e conta recebedora
      E lista as pendências com quem resolve cada uma
