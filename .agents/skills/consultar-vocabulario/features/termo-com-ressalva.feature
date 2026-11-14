# language: pt

Funcionalidade: Consultar o vocabulário antes de escrever
  O termo permitido com ressalva só vale no contexto que o `when` descreve.

  Regra: A ressalva do termo vale para o canal e o destino do texto

    Exemplo: Ponto final na última frase do WhatsApp
      Dado que o ponto final tem um `when` que o proíbe na última frase do WhatsApp
      Quando a consulta é feita com a tag do WhatsApp
      Então a resposta devolve o `when` do termo
      E o texto não termina com ponto final
