# language: pt
Funcionalidade: Informações da chamada no WhatsApp
  Quem confirmou a participação recebe na conversa o que precisa para entrar.

  Regra: A confirmação leva o evento e o link

    Exemplo: Pessoa confirma a call
      Dado que a pessoa confirmou a participação numa call marcada pela conversa
      E que o evento está na agenda com o link da chamada
      Quando a skill responde nessa conversa
      Então manda o evento nativo do WhatsApp
      E manda à parte uma mensagem com o link da chamada, o dia e a hora
