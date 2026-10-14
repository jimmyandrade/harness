# language: pt

Funcionalidade: Responder a auditoria do tempo
  A resposta informa a proporção, as lacunas, as remarcações e os ajustes.

  Regra: A auditoria não estima a proporção

    Exemplo: Auditoria de compromissos com objetivo
      Dado que existem compromissos do Google Agenda com objetivo já nomeado
      Quando a auditoria é respondida
      Então a resposta traz a proporção de compromissos alinhados, as lacunas por área, as remarcações recorrentes e os ajustes recomendados
      Mas ela não estima a proporção nem grava o evento

    Exemplo: Vários compromissos de uma vez
      Dado que existem vários compromissos auditados na mesma ação
      Quando a resposta é escrita
      Então ela é uma tabela com uma linha por compromisso
      E as colunas são alinhamento, lacuna por área, remarcação recorrente e ajuste recomendado
