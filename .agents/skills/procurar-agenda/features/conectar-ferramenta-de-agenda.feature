# language: pt

Funcionalidade: Conectar a ferramenta de agenda antes de desistir da busca
  Buscar o dia ou a semana espera a ferramenta ativa e pronta.

  Regra: A busca continua depois da conexão

    Exemplo: Ferramenta disponível e desconectada
      Dado que existe um pedido para saber o que está na agenda
      E a ferramenta de agenda disponível, mas não conectada ou não pronta
      Quando a skill vai concluir que não consegue
      Então ela inicia a conexão em vez de só instruir
      E depois de ativa e pronta continua a busca original

    Exemplo: Conexão que falha
      Dado que existe um pedido de busca na agenda
      E a conexão falhou, está indisponível ou pede ação manual fora do chat
      Quando a skill verifica a ferramenta
      Então ela explica o bloqueio
      Mas só então oferece a alternativa manual
