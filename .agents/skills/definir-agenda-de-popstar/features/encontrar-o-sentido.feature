# language: pt

Funcionalidade: Encontrar o sentido do compromisso
  Cada compromisso confirma o apoio que a pessoa ou a fonte afirmou.

  Regra: O compromisso apoia um dos sentidos nomeados

    Exemplo: Compromisso com apoio afirmado
      Dado que existe um compromisso e o apoio que a pessoa ou a fonte afirmou
      Quando o sentido é confirmado
      Então a resposta diz se ele apoia história, posicionamento, receita, aprendizado, saúde ou relações importantes
      Mas ela usa só o apoio afirmado

    Exemplo: Nenhum sentido nomeado
      Dado que existe um compromisso sem história, posicionamento, receita, aprendizado, saúde ou relação importante afirmados
      Quando o sentido é confirmado
      Então a skill pede o sentido
      Mas ela não inventa o apoio
