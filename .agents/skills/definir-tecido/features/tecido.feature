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

  Regra: os bancos não vêm da habilidade

    Exemplo: Banco de tecidos não definido
      Dado que as instruções do projeto não definem o banco de tecidos
      Quando a habilidade precisa ler ou criar uma página de tecido
      Então ela pergunta à pessoa qual é o banco
      Mas não usa um nome de banco próprio

    Exemplo: Banco de composição não definido
      Dado que as instruções do projeto não definem o banco de composição
      Quando a habilidade precisa ler ou criar uma linha de composição
      Então ela pergunta à pessoa qual é o banco
      Mas não usa um nome de banco próprio

    Exemplo: Banco fora do workspace conectado
      Dado que um dos bancos não está no workspace conectado
      Quando a habilidade começa
      Então ela para
      E não usa o banco de outro workspace nem muda a estrutura de nenhum dos dois

  Regra: um tecido é um artigo numa cor

    Exemplo: O mesmo artigo em duas cores
      Dado que a ficha traz um artigo que a pessoa quer em duas cores
      Quando a habilidade monta o plano
      Então ela planeja duas páginas, com a mesma composição e a mesma ficha

    Exemplo: A ficha não diz a cor
      Dado que a ficha não diz a cor do artigo
      Quando a habilidade monta o plano
      Então ela pergunta a cor
      Mas não cria página sem cor quando o artigo tem mais de uma

    Exemplo: Página que já existe
      Dado que o banco de tecidos tem uma página do artigo na cor pedida
      Quando a habilidade monta o plano
      Então ela relê o banco filtrado pela empresa e pelo nome do artigo antes de criar
      E busca duplicata com a habilidade de identificar duplicata

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
      E que o tecido da página é o artigo da ficha
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
