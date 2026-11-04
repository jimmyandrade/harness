# language: pt

Funcionalidade: Conferir a venda na porta de um evento
  A página de venda na porta lê os lotes direto do banco de lotes.
  A conferência olha o lote, a conta recebedora e a página no ar.

  Regra: O lote vem do banco de lotes, não da página do evento

    Exemplo: Evento sem lote no dia do show
      Dado que o evento da noite está com vendas abertas
      E que nenhum lote do banco de lotes está ligado a ele
      Quando a pessoa pergunta se a venda na porta está ok
      Então a habilidade diz que a página vai abrir sem nenhuma cota
      E monta o plano de cadastro do lote
      E só grava depois do sim da pessoa

    Exemplo: Lotes escritos no corpo da página do evento
      Dado que o corpo da página do evento lista as cotas
      E que nenhum lote do banco de lotes está ligado ao evento
      Quando a habilidade confere a venda na porta
      Então ela trata o texto do corpo como erro de lançamento
      E propõe criar os lotes no banco de lotes com os mesmos valores

  Regra: O lote da porta é o mesmo lote da tiqueteira

    Exemplo: Lote da tiqueteira já ligado ao evento
      Dado que o lote vendido na tiqueteira já está ligado ao evento no banco de lotes
      Quando a pessoa pede para liberar a venda na porta
      Então a habilidade confere esse mesmo lote
      E não cria outro registro para a porta

    Exemplo: Lote da tiqueteira que não deveria aparecer na porta
      Dado que um lote da tiqueteira ligado ao evento não está encerrado
      Quando a habilidade confere a venda na porta
      Então ela avisa que esse lote aparece na página da porta
      E pergunta se ele deve continuar à venda na porta

  Regra: A conta recebedora precisa estar ativa

    Exemplo: Lote sem conta recebedora
      Dado que o lote do evento está sem conta recebedora
      Quando a habilidade confere o lote
      Então ela avisa que a página mostra o Pix da conta padrão
      E pede a conta ativa que deve receber o Pix

    Exemplo: Lote com conta descontinuada
      Dado que a conta recebedora do lote está descontinuada
      Quando a habilidade confere o lote
      Então ela propõe trocar pela conta ativa confirmada
      E não apaga a conta antiga

  Regra: A taxa na porta é decisão de quem decide a taxa

    Exemplo: Taxa não informada
      Dado que a pessoa pede para cadastrar um lote a 10 reais
      E que não diz se há taxa na porta
      Quando a habilidade monta o plano
      Então ela pergunta se o valor já inclui a taxa
      E não decide a taxa no lugar de quem decide

    Exemplo: Taxa de 10% confirmada
      Dado que quem decide a taxa confirmou taxa de 10% na porta
      Quando a habilidade cadastra um lote de 10 reais
      Então o valor do lote é 11 reais

  Regra: O lote só conta depois da página no ar

    Exemplo: Lote cadastrado e página conferida
      Dado que o lote foi gravado com a janela ativa e a conta ativa
      Quando a habilidade abre a página de venda na porta do evento
      Então ela confirma que a cota aparece com o valor e o Pix
      E devolve o link do lote e o da página
