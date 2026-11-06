# language: pt

Funcionalidade: Pausar a própria rotina
  A habilidade não assume se a execução agendada consegue pausar a si mesma. O que fazer vem de `Pausar a própria rotina`.

  Regra: Com `tentar e perguntar`, a execução tenta e, se falhar, avisa

    Exemplo: A ferramenta aceita a pausa
      Dado que `Pausar a própria rotina` está em `tentar e perguntar`
      E que a ferramenta de agendamento deixa a execução pausar a si mesma
      Quando a condição de parada chega
      Então a execução pausa a rotina com o motivo na descrição dela

    Exemplo: A ferramenta recusa a pausa
      Dado que `Pausar a própria rotina` está em `tentar e perguntar`
      E que a ferramenta de agendamento pede a aprovação de uma pessoa
      Quando a condição de parada chega
      Então a execução avisa numa linha que a condição chegou
      E diz que a pessoa pausa a rotina pelo nome dela
      E não tenta a pausa de novo na mesma execução

  Regra: Com `perguntar`, a execução só avisa

    Exemplo: Sem tentativa
      Dado que `Pausar a própria rotina` está em `perguntar`
      Quando a condição de parada chega
      Então a execução avisa numa linha que a condição chegou
      E não chama a ferramenta de agendamento
