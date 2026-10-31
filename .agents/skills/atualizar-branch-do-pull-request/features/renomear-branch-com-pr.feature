# language: pt

Funcionalidade: Renomear a branch de um PR aberto
  Renomear a branch fecha o PR, e o PR novo substitui o antigo.

  Regra: O PR antigo é fechado com o link do novo

    Exemplo: Branch com o prefixo da ferramenta
      Dado que a branch `cursor/…` já tem PR aberto
      Quando a branch é renomeada para `<tipo>/<descrição>`
      Então um PR novo é aberto da branch renomeada, com o mesmo título e corpo
      E o corpo do novo abre com um alerta `> [!NOTE]` que leva o link do antigo
      E o PR antigo é fechado com um comentário que abre com um alerta `> [!IMPORTANT]` e leva o link do novo
