# language: pt

Funcionalidade: Escolher o canal da conversa
  O canal sai de `Canais em ordem de preferência`, e o WhatsApp Web não é o único caminho.

  Regra: O primeiro canal disponível da lista é usado

    Exemplo: Conector disponível, o padrão
      Dado que `Canais em ordem de preferência` está em `conector` e `WhatsApp Web`
      E que a sessão tem um conector do WhatsApp
      Quando a pessoa pede para ler uma conversa
      Então a conversa é lida pelo conector
      E nenhuma aba do WhatsApp Web é aberta

    Exemplo: Sem conector, cai no WhatsApp Web
      Dado que `Canais em ordem de preferência` está em `conector` e `WhatsApp Web`
      E que a sessão não tem conector do WhatsApp
      Quando a pessoa pede para ler uma conversa
      Então a conversa é lida no WhatsApp Web
      E a resposta diz que não havia conector

    Exemplo: Nenhum canal da lista disponível
      Dado que `Canais em ordem de preferência` está em `conector`
      E que a sessão não tem conector do WhatsApp
      Quando a pessoa pede para ler uma conversa
      Então a habilidade para e diz que nenhum canal da lista está disponível
