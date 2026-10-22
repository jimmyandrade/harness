# language: pt

Funcionalidade: Usar o termo conforme o nível
  Cada nível do vocabulário diz se o termo entra no texto.

  Regra: Evitável só entra com cena e contexto

    Exemplo: Termo evitável sem a cena
      Dado que o vocabulário marca o termo como discouraged
      E o texto não tem a cena que o when descreve
      Quando a skill escreve a legenda
      Então o termo fica de fora

    Exemplo: Termo proibido
      Dado que o vocabulário marca o termo como forbidden
      Quando a pessoa pede um texto com ele
      Então o termo nunca entra
