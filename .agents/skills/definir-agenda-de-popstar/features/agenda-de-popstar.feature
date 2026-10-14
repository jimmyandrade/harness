# language: pt

Funcionalidade: Transformar intenção em estrutura
  A agenda de popstar sustenta uma carreira possível no longo prazo.
  Ela combina segmento, negócio, comunicação, dinheiro, saúde, afeto e descanso.

  Regra: O segmento é o das instruções do projeto, ou o que a pessoa nomeia

    Exemplo: Segmento nas instruções do projeto
      Dado que as instruções do projeto definem o Segmento
      Quando a intenção vira estrutura
      Então o segmento é esse
      E negócio, comunicação, dinheiro, saúde, afeto e descanso entram como a pessoa ou a fonte nomeou

    Exemplo: Segmento nomeado pela pessoa
      Dado que as instruções do projeto não definem o Segmento
      E a pessoa nomeia o segmento da carreira
      Quando a intenção vira estrutura
      Então o segmento é o que a pessoa nomeou
      Mas a skill não troca esse segmento por outro
