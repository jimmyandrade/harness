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
      E não grava a aplicação como linha de composição de tecido

  Regra: a etiqueta é decisão do cadastro

    Exemplo: Aplicação nova
      Dado que a aplicação é nova
      Quando a habilidade monta o cadastro
      Então ela pergunta se a aplicação vai na etiqueta
      E registra a resposta no cadastro da aplicação
      Mas não decide sozinha

    Exemplo: Aplicação que não vai na etiqueta
      Dado que a pessoa diz que a aplicação não vai na etiqueta
      Quando a habilidade grava
      Então a aplicação fica fora da etiqueta

    Exemplo: Cadastro sem campo para a etiqueta
      Dado que o banco de aplicações não tem campo que diga se a aplicação vai na etiqueta
      Quando a habilidade precisa registrar a resposta
      Então ela sugere criar o campo
      Mas não cria o campo sem o sim

  Regra: o banco se procura antes de perguntar

    Exemplo: Banco de aplicações não definido e achado
      Dado que as instruções do projeto não definem o banco de aplicações
      E que o workspace conectado tem um só banco que serve
      Quando a habilidade precisa ler ou criar uma aplicação
      Então ela usa esse banco e diz qual usou
      Mas não pergunta o nome ao usuário

    Exemplo: Dois bancos com nomes iguais ou parecidos
      Dado que o workspace conectado tem dois bancos de nomes iguais ou parecidos que servem
      Quando a habilidade precisa escolher o banco
      Então ela confirma com a pessoa qual é o certo

    Exemplo: Nenhum banco de aplicações
      Dado que o workspace conectado não tem nenhum banco que sirva
      Quando a habilidade precisa ler ou criar uma aplicação
      Então ela pede à pessoa que informe o banco ou sugere criá-lo
      Mas não cria o banco nem usa um nome próprio sem o sim

  Regra: a aplicação se busca antes de criar

    Exemplo: Aplicação que já existe
      Dado que o banco tem uma aplicação com o mesmo nome e o mesmo motivo
      Quando a habilidade vai cadastrar
      Então ela relê o banco e busca com a habilidade de identificar duplicata
      E reaproveita a aplicação que existe, sem criar outra

    Exemplo: Flor que pode ser estampa ou aplicação
      Dado que a pessoa cita um motivo, como uma flor
      Quando a habilidade decide o que cadastrar
      Então ela confere se o motivo é a estampa de um tecido ou uma aplicação de uma variante
      E considera que uma aplicação de uma variante pode parecer a estampa do tecido de outra

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

    Exemplo: Campo da foto não definido e achado
      Dado que as instruções do projeto não definem o campo da foto da aplicação
      E que o banco tem um só campo de arquivo que serve
      Quando a habilidade vai guardar a foto
      Então ela usa esse campo e diz qual usou

    Exemplo: Campo da foto ambíguo ou ausente
      Dado que o banco tem mais de um campo de arquivo que serve, ou nenhum
      Quando a habilidade vai guardar a foto
      Então ela confirma com a pessoa qual campo usar, ou sugere criar o campo
      Mas não cria o campo sem o sim

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
