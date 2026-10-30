# language: pt
Funcionalidade: Informações da chamada no Slack
  Quem confirmou a participação recebe na conversa o que precisa para entrar.

  Regra: A confirmação leva o link da chamada

    Exemplo: Pessoa confirma a call
      Dado que a pessoa confirmou a participação numa call combinada na conversa
      E que o evento está na agenda com o link da chamada
      Quando a skill responde nessa conversa
      Então a resposta traz o link da chamada, o dia e a hora
