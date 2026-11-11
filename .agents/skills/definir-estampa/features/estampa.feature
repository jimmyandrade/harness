# language: pt

Funcionalidade: Estampa
  A estampa se cadastra ligada ao tecido, com a foto, e nunca ao produto nem à variante.

  Regra: a estampa é do tecido

    Exemplo: Estampa de um tecido
      Dado que a pessoa envia a foto de um tecido estampado
      Quando a habilidade cadastra a estampa
      Então ela liga a estampa ao tecido
      Mas não liga a estampa ao produto nem à variante

    Exemplo: Tecido que falta
      Dado que o tecido da estampa não está cadastrado
      Quando a habilidade vai ligar a estampa
      Então ela cadastra o tecido com a habilidade de definir tecido antes

    Exemplo: Outra estampa na variante
      Dado que a variante passa a ter outra estampa
      Quando a habilidade grava
      Então ela cadastra a estampa no outro tecido
      Mas não muda a estampa do tecido antigo

  Regra: o banco se procura antes de perguntar

    Exemplo: Banco de estampas não definido e achado
      Dado que as instruções do projeto não definem o banco de estampas
      E que o workspace conectado tem um só banco que serve
      Quando a habilidade precisa ler ou criar uma estampa
      Então ela usa esse banco e diz qual usou
      Mas não pergunta o nome ao usuário

    Exemplo: Dois bancos com nomes iguais ou parecidos
      Dado que o workspace conectado tem dois bancos de nomes iguais ou parecidos que servem
      Quando a habilidade precisa escolher o banco
      Então ela confirma com a pessoa qual é o certo

    Exemplo: Nenhum banco de estampas
      Dado que o workspace conectado não tem nenhum banco que sirva
      Quando a habilidade precisa ler ou criar uma estampa
      Então ela pede à pessoa que informe o banco ou sugere criá-lo
      Mas não cria o banco nem usa um nome próprio sem o sim

  Regra: a estampa se busca antes de criar

    Exemplo: Estampa que já existe
      Dado que o banco tem uma estampa com o mesmo nome e o mesmo motivo
      Quando a habilidade vai cadastrar
      Então ela relê o banco e busca com a habilidade de identificar duplicata
      E reaproveita a estampa que existe, sem criar outra

    Exemplo: Flor que pode ser estampa ou aplicação
      Dado que a pessoa cita um motivo, como uma flor
      Quando a habilidade decide o que cadastrar
      Então ela confere se o motivo é a estampa de um tecido ou uma aplicação de uma variante
      E considera que uma aplicação de uma variante pode parecer a estampa do tecido de outra

    Exemplo: Mesmo motivo em duas peças
      Dado que uma estampa e uma aplicação têm o mesmo motivo
      Quando a habilidade cadastra a estampa
      Então o motivo é um campo da estampa
      Mas a estampa não se relaciona com a aplicação

  Regra: a estampa nova cobra a foto e as informações

    Exemplo: Estampa nova sem foto
      Dado que a estampa é nova e não tem foto
      Quando a habilidade termina de gravar
      Então ela cobra a foto da estampa
      E deixa a estampa pendente, sem inventar a foto

    Exemplo: Informação que a foto não mostra
      Dado que a estampa é nova
      Quando a habilidade monta o cadastro
      Então ela pergunta o nome, o motivo e o que mais o banco pede
      Mas não inventa o que a foto não mostra

    Exemplo: Campo da foto não definido e achado
      Dado que as instruções do projeto não definem o campo da foto da estampa
      E que o banco tem um só campo de arquivo que serve
      Quando a habilidade vai guardar a foto
      Então ela usa esse campo e diz qual usou

    Exemplo: Campo da foto ambíguo ou ausente
      Dado que o banco tem mais de um campo de arquivo que serve, ou nenhum
      Quando a habilidade vai guardar a foto
      Então ela confirma com a pessoa qual campo usar, ou sugere criar o campo
      Mas não cria o campo sem o sim

    Exemplo: Estampa de antes da data de corte
      Dado que a estampa foi criada antes da data de corte da cobrança
      Quando a habilidade termina de gravar
      Então ela não cobra a foto nem as informações
      E o que falta não vira pendência

    Exemplo: Data de corte vazia
      Dado que as instruções do projeto não definem a data de corte da cobrança
      Quando a habilidade termina de gravar
      Então ela cobra o que falta de toda estampa

  Regra: a correção vale para todos os tecidos da estampa

    Exemplo: Estampa ligada a mais de um tecido
      Dado que a pessoa pede para corrigir uma estampa ligada a mais de um tecido
      Quando a habilidade grava a correção
      Então ela avisa que a correção vale para todos os tecidos ligados
