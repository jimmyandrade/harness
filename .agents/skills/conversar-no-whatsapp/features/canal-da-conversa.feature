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

    Exemplo: O WhatsApp Web abre no Chrome, não no navegador embutido
      Dado que a sessão não tem conector do WhatsApp
      E que o navegador embutido do app mostra o aviso de navegador incompatível
      Quando a pessoa pede para ler uma conversa
      Então a conversa é lida no Chrome, pela extensão Claude in Chrome
      E a habilidade não pergunta antes de trocar de navegador

    Exemplo: Nenhum canal da lista disponível
      Dado que `Canais em ordem de preferência` está em `conector`
      E que a sessão não tem conector do WhatsApp
      Quando a pessoa pede para ler uma conversa
      Então a habilidade para e diz que nenhum canal da lista está disponível
