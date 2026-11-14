# language: pt

Funcionalidade: Tecido
  O tecido se cadastra a partir da ficha técnica, com uma página por cor, a composição em linhas de fibra e a ficha anexada.

  Regra: a ficha se procura antes de pedir ao fornecedor

    Exemplo: Ficha fora do alcance
      Dado que a pessoa não tem a ficha técnica à mão
      Quando a habilidade vai pedir a ficha ao fornecedor
      Então ela procura antes a cotação, a nota fiscal, as páginas das peças, as fotos do tecido, as conversas e o e-mail
      E mostra o que achou, com o link de cada fonte
      E pede ao fornecedor só o que faltar

  Regra: o banco vazio chama a procura de banco

    Exemplo: Banco de tecidos não definido
      Dado que as instruções do projeto não definem o banco de tecidos
      Quando a habilidade precisa ler ou criar uma página de tecido
      Então ela chama a habilidade de procurar banco de dados
      E diz a ela para que serve o banco e quais propriedades ele precisa ter
      Mas não pergunta o nome à pessoa antes

    Exemplo: Banco de composição não definido
      Dado que as instruções do projeto não definem o banco de composição
      Quando a habilidade precisa ler ou criar uma linha de composição
      Então ela chama a habilidade de procurar banco de dados
      E diz a ela para que serve o banco e quais propriedades ele precisa ter
      Mas não pergunta o nome à pessoa antes

    Exemplo: Estrutura dos bancos
      Dado que a habilidade usa os bancos
      Quando ela grava
      Então não muda a estrutura de nenhum dos dois

  Regra: cada cor de um tecido da ficha é uma página

    Exemplo: O mesmo artigo em duas cores
      Dado que a ficha traz um tecido que a pessoa quer em duas cores
      Quando a habilidade monta o plano
      Então ela planeja duas páginas, com a mesma composição e a mesma ficha

    Exemplo: A ficha não diz a cor
      Dado que a ficha não diz a cor do tecido
      Quando a habilidade monta o plano
      Então ela pergunta a cor
      Mas não cria página sem cor quando o tecido tem mais de uma

    Exemplo: Página que já existe
      Dado que o banco de tecidos tem uma página do tecido na cor pedida
      Quando a habilidade monta o plano
      Então ela relê o banco filtrado pela empresa e pelo nome do tecido antes de criar
      E busca duplicata com a habilidade de identificar duplicata

  Regra: a estampa é do tecido

    Exemplo: Tecido estampado
      Dado que o tecido da ficha é estampado
      Quando a habilidade monta a página
      Então a página do tecido liga a estampa
      Mas a habilidade não grava a estampa no produto nem na variante

    Exemplo: Estampa que a ficha não diz
      Dado que o tecido parece estampado e a ficha não diz a estampa
      Quando a habilidade monta o plano
      Então ela pergunta qual é a estampa

    Exemplo: Estampa que não existe
      Dado que a estampa não está no banco de estampas
      Quando a habilidade vai ligá-la ao tecido
      Então ela pergunta antes de criar

    Exemplo: Banco de estampas não definido
      Dado que as instruções do projeto não definem o banco de estampas
      Quando a habilidade precisa ler ou criar uma estampa
      Então ela pergunta à pessoa qual é o banco
      Mas não usa um nome de banco próprio

  Regra: a composição é uma linha por fibra

    Exemplo: Nome da linha
      Dado que a ficha diz 90,500% de algodão
      Quando a habilidade grava a composição
      Então o nome da linha é o percentual com ponto decimal e a sigla da fibra, como 90.5% CO

    Exemplo: Linha que já existe
      Dado que o banco de composição já tem uma linha com o mesmo nome e a mesma fibra
      Quando a habilidade grava a composição
      Então ela usa essa linha
      E cria só a que falta

    Exemplo: Fibra sem sigla
      Dado que as siglas das fibras não têm a sigla de uma fibra da ficha
      Quando a habilidade vai criar a linha
      Então ela pergunta a sigla antes de criar

  Regra: a composição registrada só muda pelo artigo da ficha

    Exemplo: Composição vazia
      Dado que a página do tecido não tem composição
      Quando a habilidade grava
      Então ela grava a composição da ficha

    Exemplo: Composição igual à ficha
      Dado que a composição registrada é igual à da ficha
      Quando a habilidade grava
      Então nada muda

    Exemplo: Composição diferente e o tecido é o artigo da ficha
      Dado que a composição registrada difere da ficha
      E que o tecido da página é o da ficha
      Quando a habilidade grava
      Então ela corrige pela ficha
      E avisa a pessoa

    Exemplo: Composição diferente e o tecido veio de outra compra
      Dado que a composição registrada difere da ficha
      E que o tecido da página veio de outra compra
      Quando a habilidade grava
      Então ela mantém a composição como está
      E comenta na página o que diverge e por quê
      E abre a tarefa de conferência com a habilidade de definir tarefa
      E põe o link da tarefa no comentário

  Regra: a ficha anexada fica num lugar só

    Exemplo: Página que já tem a seção da ficha
      Dado que a página já tem a seção da ficha
      Quando a habilidade anexa a ficha
      Então ela atualiza essa seção
      Mas não cria outra

    Exemplo: Campo do arquivo da ficha definido
      Dado que as instruções do projeto definem o campo do arquivo da ficha
      Quando a habilidade anexa o PDF
      Então o PDF vai nesse campo
      E o resumo diz que ele está lá

    Exemplo: Campo do arquivo da ficha vazio
      Dado que as instruções do projeto não definem o campo do arquivo da ficha
      Quando a habilidade anexa o PDF
      Então o PDF vai no fim do resumo, ou onde o sistema de cadastro usa para anexos
      E o mesmo PDF fica num lugar só

    Exemplo: Duas páginas com a mesma ficha
      Dado que duas páginas usam a mesma ficha
      Quando a habilidade anexa o PDF
      Então cada página recebe o próprio envio do arquivo

  Regra: a habilidade cobra o que falta do tecido novo

    Exemplo: Tecido novo sem ficha
      Dado que o tecido é novo e a pessoa não tem a ficha técnica
      Quando a habilidade termina de gravar
      Então ela cobra a composição, quando nem a etiqueta a traz
      E cobra os dados técnicos: largura, gramatura, rendimento, encolhimento e cuidados

    Exemplo: Tecido novo sem foto
      Dado que o tecido é novo e não tem foto
      Quando a habilidade termina de gravar
      Então ela cobra a foto do tecido
      E deixa o tecido pendente, sem inventar a foto

    Exemplo: Foto de um tecido estampado
      Dado que a pessoa envia a foto de um tecido estampado
      Quando a habilidade grava
      Então ela cadastra a estampa no banco de estampas do projeto
      E liga a estampa ao tecido

    Exemplo: Campo da foto não definido
      Dado que as instruções do projeto não definem o campo da foto do tecido
      Quando a habilidade vai guardar a foto
      Então ela chama a habilidade de procurar banco de dados para achar o campo de arquivo
      Mas não escolhe o campo

    Exemplo: Tecido de antes da data de corte
      Dado que o tecido foi criado antes da data de corte para cadastro completo
      Quando a habilidade termina de gravar
      Então ela não cobra a ficha, os dados técnicos nem a foto
      E o que falta não vira pendência

    Exemplo: Data de corte vazia
      Dado que as instruções do projeto não definem a data de corte para cadastro completo
      Quando a habilidade termina de gravar
      Então ela cobra o que falta de todo tecido
