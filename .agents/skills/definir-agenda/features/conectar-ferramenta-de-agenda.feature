# language: pt

Funcionalidade: Conectar a ferramenta de agenda antes de desistir
  Criar, revisar, alterar ou sincronizar espera a ferramenta ativa e pronta.

  Regra: A sessão é checada antes de afirmar que não há ferramenta

    Exemplo: Ferramenta disponível e desconectada
      Dado que existe um pedido para criar, revisar, alterar ou sincronizar um evento
      E a ferramenta de agenda disponível, mas não conectada ou não pronta
      Quando a skill vai concluir que não consegue
      Então ela inicia a conexão em vez de só instruir
      E depois de ativa e pronta continua a tarefa original

    Exemplo: Conexão que falha
      Dado que existe um pedido de agenda
      E a conexão falhou, está indisponível ou pede ação manual fora do chat
      Quando a skill verifica a ferramenta
      Então ela explica o bloqueio
      Mas só então oferece a alternativa manual
