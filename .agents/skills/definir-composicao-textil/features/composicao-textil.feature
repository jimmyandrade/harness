# language: pt

Funcionalidade: Composição têxtil
  Os materiais de um produto têm uma linha por parte e tecido, e a composição têxtil da etiqueta sai dessas linhas sem repetir tecido.

  Regra: o banco vazio chama a procura de banco e as partes não vêm da habilidade

    Exemplo: Banco de materiais do produto não definido
      Dado que as instruções do projeto não definem o banco de composições
      Quando a habilidade precisa ler ou gravar uma linha
      Então ela chama a habilidade de procurar banco de dados
      E diz a ela para que serve o banco e quais propriedades ele precisa ter
      Mas não pergunta o nome à pessoa antes

    Exemplo: Parte canônica não definida
      Dado que as instruções do projeto não definem a parte canônica
      Quando a habilidade vai gravar a parte principal do produto
      Então ela pergunta à pessoa qual é a parte canônica
      Mas não escolhe uma

    Exemplo: Partes de acabamento não definidas
      Dado que as instruções do projeto não definem as partes de acabamento
      Quando a habilidade monta a etiqueta
      Então ela pergunta à pessoa quais partes saem quando o tecido já está na frente ou no verso
      Mas não presume uma lista

    Exemplo: Banco fora do workspace conectado
      Dado que o banco de composições não está no workspace conectado
      Quando a habilidade começa
      Então ela para

  Regra: o produto se lê inteiro antes de mexer

    Exemplo: Produto com variações de nome
      Dado que a pessoa cita o produto por um nome antigo
      Quando a habilidade procura o produto
      Então ela acha pelo nome e pelas variações de nome
      E lê todas as linhas de materiais do produto antes de mexer

    Exemplo: Tecido diferente por parte
      Dado que a frente do produto é um tecido e o forro é outro
      Quando a habilidade grava
      Então ela grava uma linha para cada parte, com o tecido dela
      Mas não copia a composição de fibras nem a estampa do tecido para a linha

  Regra: a parte vem das opções que existem

    Exemplo: Parte dita pela pessoa
      Dado que a pessoa diz uma parte com outras palavras
      Quando a habilidade escolhe a parte
      Então ela usa a opção mais próxima do campo Parte
      E diz qual opção usou

    Exemplo: Parte que não existe
      Dado que nenhuma opção do campo Parte serve
      Quando a habilidade precisa da parte
      Então ela pede o sim da pessoa antes de criar a opção, com o nome e a descrição
      Mas não cria propriedade nova no produto

    Exemplo: Material que o projeto não trata como têxtil
      Dado que a pessoa cita um material que o projeto não trata como têxtil
      Quando a habilidade vai registrar a linha
      Então ela pergunta antes de registrar

  Regra: a parte canônica tem uma linha só por produto

    Exemplo: Produto dupla face
      Dado que o produto é dupla face
      Quando a habilidade grava as duas faces
      Então ela pergunta qual face fica para fora no uso principal
      E grava essa na parte canônica e a outra no verso
      E avisa que o prefixo do SKU pode mudar

    Exemplo: Frente toda em recortes
      Dado que a frente do produto é toda de recortes de outros tecidos
      Quando a habilidade grava
      Então um tecido fica na parte canônica
      E os outros vão em uma linha de recorte cada

  Regra: a linha aponta para o tecido real

    Exemplo: Tecido genérico
      Dado que a pessoa não sabe o tecido
      Quando a habilidade grava a linha
      Então ela usa o tecido genérico
      E diz que ficou genérico

    Exemplo: Tecido que falta
      Dado que o tecido não está cadastrado
      Quando a habilidade vai ligar a linha
      Então ela cadastra o tecido com a habilidade de definir tecido antes da linha

    Exemplo: Apelido do tecido
      Dado que a pessoa chama o tecido por um apelido
      Quando a habilidade liga a linha
      Então ela confere o nome no banco de tecidos antes

    Exemplo: Produto renomeado
      Dado que o produto mudou de nome
      Quando a habilidade atualiza as linhas
      Então ela renomeia as linhas do produto na mesma hora
      E procura o nome antigo nas outras linhas

  Regra: a etiqueta não repete material

    Exemplo: Um item por tecido
      Dado que o mesmo tecido aparece em cores diferentes
      Quando a habilidade monta a etiqueta
      Então ele conta uma vez

    Exemplo: Parte de acabamento repetida
      Dado que o tecido de uma parte de acabamento já está na frente ou no verso
      Quando a habilidade monta a etiqueta
      Então essa parte sai da etiqueta

    Exemplo: Dupla face
      Dado que o produto é dupla face
      Quando a habilidade monta a etiqueta
      Então ela leva uma composição por face

    Exemplo: Aplicação marcada para a etiqueta
      Dado que uma aplicação da variante foi marcada para a etiqueta
      Quando a habilidade monta a etiqueta
      Então ela monta a composição das fibras por parte como antes
      E lista a aplicação marcada depois dos tecidos
      Mas não escreve o texto da aplicação

    Exemplo: Aplicação marcada com override
      Dado que a aplicação marcada para a etiqueta tem um texto de override
      Quando a habilidade monta a etiqueta
      Então ela mostra o texto do override ao listar a aplicação

    Exemplo: Aplicação marcada sem override
      Dado que a aplicação marcada para a etiqueta não tem texto de override
      Quando a habilidade monta a etiqueta
      Então ela diz que vale o texto padrão do projeto
      Mas não escreve o texto

    Exemplo: Aplicação não marcada
      Dado que uma aplicação da variante não foi marcada para a etiqueta
      Quando a habilidade monta a etiqueta
      Então a aplicação fica fora da etiqueta

    Exemplo: Resultado mostrado
      Dado que a etiqueta está montada
      Quando a habilidade responde
      Então ela mostra a etiqueta
      E as linhas que ficaram de fora, com o motivo

  Regra: a estampa é do tecido

    Exemplo: Estampa
      Dado que a pessoa cita uma estampa
      Quando a habilidade classifica a parte
      Então ela não grava na composição nem no produto
      E manda cadastrar a estampa no tecido com a habilidade de definir tecido

    Exemplo: Outra estampa no produto
      Dado que o produto passa a ter outra estampa
      Quando a habilidade grava
      Então ela liga a linha a outro tecido, cadastrado com a habilidade de definir tecido
      Mas não muda a estampa do tecido antigo

    Exemplo: Bordado ou patch
      Dado que a pessoa cita um bordado ou um patch
      Quando a habilidade classifica a parte
      Então ela não grava como linha de composição de tecido
      E aponta a aplicação da variante, não do produto nem do tecido

    Exemplo: Variante sem aplicação
      Dado que um produto tem uma variante com aplicação e outra sem
      Quando a habilidade registra a variante sem aplicação
      Então ela não exige aplicação
      E aceita de 0 a N aplicações por variante

  Regra: a correção pedida é gravada

    Exemplo: Correção
      Dado que a pessoa pede para corrigir uma linha
      Quando a habilidade responde
      Então ela grava a correção
      E comenta na página do produto o que mudou e por quê, quando a pessoa pede o histórico

    Exemplo: Linha sem produto
      Dado que uma linha não tem produto vinculado
      Quando a habilidade a encontra
      Então ela só apaga com o sim da pessoa

    Exemplo: Percentual desconhecido
      Dado que a pessoa não sabe as porcentagens de uma malha
      Quando a habilidade registra o tecido
      Então ela registra as fibras sem inventar o percentual
      E guarda no comentário de onde virá a inferência
