# language: pt
Funcionalidade: Título de evento externo no tom de voz
  O título é vivo e continua achável.

  Regra: Título externo guarda o nome canônico

    Exemplo: Debriefing com organização externa
      Dado que existe um evento com convidado ou organização externa
      Quando a skill escreve o título
      Então o título tem intenção clara, recorte específico e conexão humana
      E guarda o nome canônico mais buscável
      Mas não parece publicidade exagerada
