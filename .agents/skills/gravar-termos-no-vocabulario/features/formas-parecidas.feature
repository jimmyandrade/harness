# language: pt

Funcionalidade: Cada forma do termo tem a própria linha
  Plural, singular, feminino, masculino e outra grafia não se juntam numa linha só.

  Regra: A forma vizinha só entra com o estado que a pessoa escolheu

    Exemplo: Cadastrar casa com casas já no vocabulário
      Dado que casas está proibida no vocabulário
      Quando a pessoa cadastra casa como permitida
      Então casa ganha a própria linha, permitida
      E casas continua proibida

    Exemplo: Sugerir as outras formas
      Dado que a pessoa cadastrou só moradias
      Quando a skill responde
      Então sugere moradia, sem gravar
      E pergunta o estado da forma sugerida
