# language: pt

Funcionalidade: Aplicação
  A aplicação se cadastra ligada à variante, com a foto, e nunca ao produto nem ao tecido.

  Regra: a aplicação é da variante

    Exemplo: Aplicação de uma variante
      Dado que a pessoa cadastra um bordado ou um patch numa variante
      Quando a habilidade grava a aplicação
      Então ela liga a aplicação à variante
      Mas não liga a aplicação ao produto nem ao tecido

    Exemplo: Variante sem aplicação
      Dado que um produto tem uma variante com aplicação e outra sem
      Quando a habilidade registra a variante sem aplicação
      Então ela não exige aplicação
      E aceita de 0 a N aplicações por variante

    Exemplo: Mesma aplicação em duas variantes
      Dado que a mesma aplicação está em duas variantes
      Quando a habilidade grava
      Então ela reaproveita a aplicação e liga às duas variantes

    Exemplo: Aplicação por cima do tecido
      Dado que a aplicação vai por cima de um tecido
      Quando a habilidade grava
      Então ela não trata a aplicação como tecido
      E não grava a aplicação na composição nem na etiqueta

  Regra: o banco não vem da habilidade

    Exemplo: Banco de aplicações não definido
      Dado que as instruções do projeto não definem o banco de aplicações
      Quando a habilidade precisa ler ou criar uma aplicação
      Então ela pergunta à pessoa qual é o banco
      Mas não usa um nome de banco próprio

    Exemplo: Banco fora do workspace conectado
      Dado que o banco de aplicações não está no workspace conectado
      Quando a habilidade começa
      Então ela para

  Regra: a aplicação se busca antes de criar

    Exemplo: Aplicação que já existe
      Dado que o banco tem uma aplicação com o mesmo nome e o mesmo motivo
      Quando a habilidade vai cadastrar
      Então ela relê o banco e busca com a habilidade de identificar duplicata
      E reaproveita a aplicação que existe, sem criar outra

    Exemplo: Mesmo motivo de uma estampa
      Dado que uma aplicação e uma estampa têm o mesmo motivo
      Quando a habilidade cadastra a aplicação
      Então o motivo é um campo da aplicação
      Mas a aplicação não se relaciona com a estampa

  Regra: a aplicação nova cobra a foto e as informações

    Exemplo: Aplicação nova sem foto
      Dado que a aplicação é nova e não tem foto
      Quando a habilidade termina de gravar
      Então ela cobra a foto da aplicação
      E deixa a aplicação pendente, sem inventar a foto

    Exemplo: Informação que a foto não mostra
      Dado que a aplicação é nova
      Quando a habilidade monta o cadastro
      Então ela pergunta tudo sobre a aplicação: o nome, o motivo, a técnica e o que mais o banco pede
      Mas não inventa o que a foto não mostra

    Exemplo: Campo da foto não definido
      Dado que as instruções do projeto não definem o campo da foto da aplicação
      Quando a habilidade vai guardar a foto
      Então ela pergunta onde guardar
      Mas não escolhe o campo

    Exemplo: Aplicação de antes da data de corte
      Dado que a aplicação foi criada antes da data de corte da cobrança
      Quando a habilidade termina de gravar
      Então ela não cobra a foto nem as informações
      E o que falta não vira pendência

    Exemplo: Data de corte vazia
      Dado que as instruções do projeto não definem a data de corte da cobrança
      Quando a habilidade termina de gravar
      Então ela cobra o que falta de toda aplicação

  Regra: a correção vale para todas as variantes da aplicação

    Exemplo: Aplicação ligada a mais de uma variante
      Dado que a pessoa pede para corrigir uma aplicação ligada a mais de uma variante
      Quando a habilidade grava a correção
      Então ela avisa que a correção vale para todas as variantes ligadas
