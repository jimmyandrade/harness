# language: pt

Funcionalidade: Ler hoje como o registro atual
  A pergunta sobre um bem hoje busca o ativo, e a dúvida pergunta.

  Exemplo: Provador hoje
    Dado que a pessoa pergunta "temos algum provador hoje"
    Quando hoje quer dizer atualmente
    Então a busca é se já existe registro de ativo que seja provador
    Mas nenhuma página de ativo é criada

  Exemplo: Frase ambígua
    Dado que existe uma frase que não separa o dia do bem
    Quando a análise escolhe o destino
    Então a análise pergunta antes
    Mas não escolhe sozinha
