# language: pt

Funcionalidade: Issue que substitui outra
  A substituição aparece num alerta do GitHub, em cada uma das duas issues.

  Regra: A nova aponta para a antiga, e a antiga aponta para a nova

    Exemplo: Issue reescrita numa issue nova
      Dado que uma issue nova substitui uma issue aberta
      Quando a issue nova é aberta
      Então o corpo dela abre com um alerta `> [!NOTE]` que leva o link da antiga
      E a antiga recebe um comentário que abre com um alerta `> [!IMPORTANT]` e leva o link da nova
