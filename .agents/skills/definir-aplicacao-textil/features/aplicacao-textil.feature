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

  Regra: o texto da etiqueta é o padrão do projeto, com override curto e opcional

    Exemplo: Aplicação sem texto específico
      Dado que a aplicação vai na etiqueta e a pessoa não pede um texto específico
      Quando a habilidade grava
      Então o override fica vazio
      E vale o texto padrão do projeto
      Mas a habilidade não escreve nenhum texto

    Exemplo: Texto específico pedido
      Dado que a pessoa pede um texto específico para a etiqueta da aplicação
      Quando a habilidade registra o override
      Então ela avisa que o texto foge do padrão do projeto
      E grava o texto que a pessoa escreveu no campo de override
      Mas não redige o texto

    Exemplo: Limite de caracteres não definido
      Dado que as instruções do projeto não definem o limite de caracteres do texto da etiqueta
      Quando a habilidade vai registrar um override
      Então ela pergunta o limite uma vez
      Mas não escolhe um número

    Exemplo: Texto acima do limite
      Dado que o texto escrito passa do limite de caracteres
      Quando a habilidade vai gravar o override
      Então ela recusa o texto
      E pede uma redação menor
      Mas não corta o texto

    Exemplo: Banco sem campo de override
      Dado que o banco de aplicações não tem campo para o texto da etiqueta
      Quando a habilidade precisa registrar o override
      Então ela sugere criar o campo
      Mas não cria o campo sem o sim

  Regra: o banco vazio chama a procura de banco

    Exemplo: Banco de aplicações não definido
      Dado que as instruções do projeto não definem o banco de aplicações
      Quando a habilidade precisa ler ou gravar nele
      Então ela chama a habilidade de procurar banco de dados
      E diz a ela para que serve o banco e quais propriedades ele precisa ter
      Mas não pergunta o nome à pessoa antes

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

    Exemplo: Campo da foto não definido
      Dado que as instruções do projeto não definem o campo da foto da aplicação
      Quando a habilidade vai guardar a foto
      Então ela chama a habilidade de procurar banco de dados para achar o campo de arquivo
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
