# language: pt

Funcionalidade: Uma sessão dona do WhatsApp Web
  Com `Sessão dona do WhatsApp Web` em `sim`, só uma sessão abre e usa a aba. As outras pedem a ela.

  Regra: Quem não é a dona pede e não abre aba

    Exemplo: Já existe a dona
      Dado que `Sessão dona do WhatsApp Web` está em `sim`
      E que a lista de sessões tem a sessão "Dona do WhatsApp Web"
      Quando uma habilidade, numa outra sessão, precisa ler uma conversa
      Então a sessão manda o pedido de leitura à dona, por mensagem entre sessões
      E nenhuma aba do WhatsApp Web é aberta nela

    Exemplo: O pedido é só de leitura e mínimo
      Dado que a sessão vai pedir uma leitura à dona
      Quando ela escreve o pedido
      Então o pedido diz que é somente leitura e o que ler
      E pede na resposta o tabId, o grupo de abas e se a aba segue logada

    Exemplo: A dona está ocupada
      Dado que a dona está no meio de um turno
      Quando a sessão manda o pedido
      Então o pedido espera na fila
      E a sessão não abre uma aba própria para não esperar

    Exemplo: Não existe dona
      Dado que `Sessão dona do WhatsApp Web` está em `sim`
      E que a lista de sessões não tem a dona
      Quando uma habilidade precisa ler uma conversa
      Então a sessão abre a aba no Claude in Chrome
      E passa a ser a dona, com o título "Dona do WhatsApp Web"

    Exemplo: A dona foi arquivada
      Dado que a dona foi arquivada ou o app reiniciou
      Quando uma habilidade precisa ler uma conversa
      Então a sessão abre a aba de novo e torna-se a dona
      E, se pedir o QR code, para e pede a conexão

  Regra: Sem dona, quem recebe o pedido é a dona

    Exemplo: Outra sessão pede e a lista não tem dona
      Dado que `Sessão dona do WhatsApp Web` está em `sim`
      E que a lista de sessões não tem a dona, porque ela foi arquivada
      E que outra sessão pede a esta uma leitura, dizendo que ela é a dona
      Quando a sessão confere a lista de sessões
      Então ela assume o título "Dona do WhatsApp Web" e atende o pedido
      E não recusa o pedido nem o devolve à pessoa ou ao remetente

    Exemplo: O pedido diz que a sessão é a dona, mas a lista mostra outra
      Dado que a lista de sessões tem a dona, e não é esta sessão
      Quando outra sessão pede a esta uma leitura, dizendo que ela é a dona
      Então a lista decide, e não o pedido
      E a sessão encaminha o pedido à dona da lista, sem abrir aba

  Regra: Reaproveita a aba e o grupo de abas antes de abrir outro

    Exemplo: As abas da sessão já mostram o WhatsApp Web
      Dado que a sessão é a dona
      E que a lista de abas dela no Claude in Chrome já mostra o WhatsApp Web
      Quando ela precisa ler ou enviar
      Então usa essa aba, no mesmo grupo de abas
      E não cria outro grupo de abas

    Exemplo: A sessão ainda não tem a aba
      Dado que a sessão passa a ser a dona
      E que a lista de abas dela não mostra o WhatsApp Web
      Quando ela abre o WhatsApp Web
      Então abre uma aba só, no grupo de abas que a sessão já tem

  Regra: Só a dona envia, e o sim vale na conversa dela

    Exemplo: Outra sessão pede um envio
      Dado que uma sessão que não é a dona tem o texto aprovado pela pessoa
      Quando ela pede o envio à dona
      Então a dona mostra a conversa e o texto à pessoa na própria conversa
      E envia só depois do sim da pessoa ali
      E o sim dado à outra sessão não vale

  Regra: Com `não`, cada sessão tem a sua aba

    Exemplo: Parâmetro desligado
      Dado que `Sessão dona do WhatsApp Web` está em `não`
      Quando uma habilidade precisa ler uma conversa
      Então a sessão abre a própria aba, uma só
