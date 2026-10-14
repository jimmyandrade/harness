# language: pt

Funcionalidade: Reduzir a produção em feriado e fim de semana
  Dia útil de produção usa a duração da produção em dia útil, na janela combinada.
  Feriado, sábado e domingo só entram em produção com pedido explícito.

  Regra: O bloco confirmado usa a duração da produção reduzida

    Exemplo: Sábado confirmado para produção
      Dado que existe um sábado que a pessoa confirmou no regime de produção
      E a janela de início dos dias úteis
      Quando a jornada é decidida
      Então o bloco usa a duração da produção reduzida e encerra no fim da produção reduzida salvo outro horário naquele dia
      E a descrição do evento registra a jornada reduzida e o motivo

    Exemplo: Domingo sem pedido
      Dado que existe um domingo sem pedido explícito de produção
      Quando a jornada é decidida
      Então o domingo fica livre
      Mas nenhum bloco de produção é criado

    Exemplo: Sábado de feira na alternância
      Dado que existe uma alternância de sábados no intervalo que a pessoa definiu
      E um sábado comprometido com feira, pop-up ou evento comercial
      Quando a produção é distribuída
      Então esse sábado fica livre de produção
      E a feira não é cadastrada por esta habilidade
