# language: pt

Funcionalidade: Termo que só vale num contexto
  O termo de um canal, de um evento ou de quem fala não vira regra geral da marca.

  Regra: Contexto fica num nível do meio, com o quando usar

    Exemplo: Termo permitido só num canal
      Dado que a pessoa permite um termo só no canal que ela nomeou
      Quando a skill classifica o termo
      Então o nível é allowed_with_care
      E o quando usar diz o canal
      Mas o termo não vira allowed

    Exemplo: Contexto ambíguo
      Dado que a pessoa não diz em que canal ou público o termo vale
      Quando a skill classifica o termo
      Então ela pergunta o contexto
      E não grava nada
