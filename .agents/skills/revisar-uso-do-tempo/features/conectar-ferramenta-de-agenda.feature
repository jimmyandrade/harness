# language: pt

Funcionalidade: Conectar a ferramenta de agenda antes de desistir da auditoria
  Auditar o tempo espera a ferramenta ativa e pronta.

  Regra: A auditoria continua depois da conexão

    Exemplo: Ferramenta disponível e desconectada
      Dado que existe um pedido para auditar o uso do tempo
      E a ferramenta de agenda disponível, mas não conectada ou não pronta
      Quando a skill vai concluir que não consegue
      Então ela inicia a conexão em vez de só instruir
      E depois de ativa e pronta continua a auditoria original

    Exemplo: Conexão que falha
      Dado que existe um pedido de auditoria da agenda
      E a conexão falhou, está indisponível ou pede ação manual fora do chat
      Quando a skill verifica a ferramenta
      Então ela explica o bloqueio
      Mas só então oferece a alternativa manual
