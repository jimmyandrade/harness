# language: pt
Funcionalidade: Exigir aprendizado sobre o público
  Toda enquete serve a uma decisão, não só a movimentar a comunidade.

  Regra: A enquete tem objetivo de aprendizado acionável

    Exemplo: Pergunta divertida sem aprendizado
      Dado que a pergunta só movimenta a comunidade
      Quando a skill avalia a enquete
      Então a skill ajusta ou troca a pergunta
      E distingue movimento de comunidade de aprendizado real

    Exemplo: Opção sem aderência
      Dado que uma opção não tem aderência ao repertório, à cena ou ao público-alvo do negócio
      Quando a skill monta as opções
      Então a skill remove ou troca a opção
      E não completa a lista com opção fraca

  Regra: Sem objetivo informado a skill não para

    Exemplo: Objetivo ausente com template aderente
      Dado que a pessoa não disse o que quer aprender
      E que existe uma ideia aderente a conhecer o público
      Quando a skill sugere a enquete
      Então ela sorteia essa ideia
      E diz que é uma sugestão exploratória e o aprendizado provável

    Exemplo: Objetivo ausente sem template aderente
      Dado que a pessoa não disse o que quer aprender
      E que nenhuma ideia é aderente
      Quando a skill sugere a enquete
      Então ela para e pede só o dado que falta
