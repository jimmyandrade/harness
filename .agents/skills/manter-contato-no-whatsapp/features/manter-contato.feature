# language: pt

Funcionalidade: Manter o contato no WhatsApp

  Regra: A nota do contato abre com o link da página da pessoa

    Exemplo: Contato sem o link
      Dado que a dona abriu a conversa de uma pessoa que tem página no data source
      Quando a nota do contato não abre com o link da página
      Então a dona acrescenta o link à nota, sem apagar o que havia
      E grava na página o link da conversa

    Exemplo: Pessoa sem página
      Dado que a conversa é de uma pessoa sem página no data source
      Quando a dona confere a nota
      Então ela cadastra a página por definir-pessoa na mesma rodada, sem perguntar

  Regra: O número sem contato salvo segue o padrão do nome

    Exemplo: Salvar com a organização
      Dado que Salvar contato sem número salvo está em sim
      Quando a conversa é de um número que não está nos contatos
      Então a dona salva o contato no Padrão do nome do contato, com a organização

    Exemplo: Sem a organização
      Dado que a organização não está na página nem na conversa
      Quando a dona vai salvar o contato
      Então ela pergunta à pessoa

  Regra: Salvar o contato não pede pergunta nem espera o rascunho

    Exemplo: Número novo com envio pendente de aprovação
      Dado que Salvar contato sem número salvo está em sim
      E que o número é novo e a primeira mensagem ainda espera o sim do rascunho
      Quando a dona abre a conversa
      Então ela salva o contato, cadastra a pessoa ou a empresa que faltar, grava a nota e rotula antes de redigir, sem perguntar
      E só o envio espera o sim

  Regra: Toda conversa lida fecha a lista de conferência

    Exemplo: Leitura pedida por outra sessão
      Dado que outra sessão pediu a leitura de uma conversa
      Quando a dona termina de ler
      Então ela rotula a conversa com estado e contexto
      E diz à sessão que pediu os rótulos que ficaram

    Exemplo: Grupo
      Dado que a conversa é um grupo
      Quando a dona fecha a lista
      Então o que a nota guardaria vai para o registro no data source
