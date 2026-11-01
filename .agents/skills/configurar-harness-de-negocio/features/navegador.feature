# language: pt

Funcionalidade: Quem opera as telas
  O agente que controla o navegador faz os cliques; os prints da pessoa são o último recurso.

  Regra: O agente com navegador opera as telas

    Exemplo: Agente com controle do navegador
      Dado que o agente tem uma ferramenta que controla o navegador
      Quando o passo do runbook é um clique numa tela do Notion ou do GitHub
      Então o agente abre a tela, faz o clique e confere o resultado na própria tela
      E não pede print à pessoa

    Exemplo: Agente sem navegador
      Dado que o agente não tem ferramenta de navegador
      Quando o passo do runbook é um clique numa tela
      Então ele diz o clique à pessoa e confere o print que ela manda

  Regra: Algumas ações continuam com a pessoa

    Exemplo: Login e senha
      Dado que a tela pede login, senha ou código de verificação
      Quando o agente chega a ela
      Então ele para e pede que a pessoa entre na conta

    Exemplo: Conceder permissão a um app
      Dado que o passo instala um app ou aceita os termos de uma conexão
      Quando o agente chega ao botão que concede
      Então ele mostra o que será concedido e só clica depois do sim da pessoa

    Exemplo: Valor do token
      Dado que o agente opera a tela da conexão
      Quando chega o passo do token
      Então ele pode clicar no botão de copiar, sem mostrar o token na tela nem ler o valor
      E a pessoa testa e guarda o token no terminal dela

  Regra: O agente tira os próprios prints para o runbook

    Exemplo: Tela diferente do runbook
      Dado que o agente com navegador vê uma tela diferente da que o runbook descreve
      Quando a configuração termina
      Então ele usa os próprios prints, recortados e sem nomes, no pull request do runbook
