# language: pt

Funcionalidade: A oportunidade como primeira fonte dos domínios
  Quando o projeto guarda as oportunidades num banco, os links dela vêm antes da busca na web.

  Regra: Os links da oportunidade são a primeira referência

    Exemplo: Oportunidade com o link original
      Dado que a inscrição está ligada a uma oportunidade com o link do edital
      Quando a skill levanta os domínios
      Então o domínio desse link entra primeiro na lista
      E a busca na web só completa o que falta

  Regra: O link achado na web volta para a oportunidade pela skill dona dela

    Exemplo: Oportunidade sem o link do edital
      Dado que a oportunidade não tem o link do edital
      Quando a busca na web acha a página oficial do edital
      Então a skill segue `criar-oportunidade` para gravar o link na edição
      E não escreve na página da oportunidade por conta própria

  Regra: O banco de oportunidades sem caminho é procurado e registrado

    Esquema do Cenário: Banco achado sem estar nos parâmetros
      Dado que `Nome do data source de oportunidades` está vazio
      E que a busca no workspace conectado acha um banco de oportunidades só
      E que `Ao achar um banco` está em `<modo>`
      Quando a skill termina de levantar os domínios
      Então ela <ação> o nome do banco nas instruções do projeto

      Exemplos:
        | modo      | ação                     |
        | propor    | propõe gravar            |
        | registrar | grava                    |
