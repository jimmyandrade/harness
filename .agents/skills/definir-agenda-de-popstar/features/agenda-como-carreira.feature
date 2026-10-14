# language: pt

Funcionalidade: Usar a agenda como ferramenta de carreira
  A agenda liga criação, rotina, presença cultural, comunicação, relações, compromissos e viabilidade financeira.
  O critério de sentido é o das instruções do projeto.

  Regra: O segmento tem a própria lista

    Exemplo: Carreira que está começando
      Dado que o segmento tem atividades nas instruções do projeto e a carreira está começando
      Quando a agenda é organizada
      Então o próximo movimento inclui só o que foi nomeado entre as atividades do segmento
      E a resposta não cobra a estrutura de quem já percorreu mais tempo
      E viabilidade comercial e retorno financeiro permanecem

  Regra: Compromisso se remarca

    Exemplo: Repetição que alcança a revisão do bloqueio
      Dado que existe um compromisso que alcança a revisão do bloqueio
      Quando a agenda é revisada
      Então o compromisso é remarcado
      E a skill pede a revisão do bloqueio e uma ação de cuidado
      Mas ela não escreve orientação de saúde nem descarta o compromisso

  Regra: Recurso próprio só entra registrado

    Exemplo: Gasto sem hipótese
      Dado que existe a intenção de investir recurso próprio
      E a falta de hipótese, limite, custo, prazo de retorno ou critério de revisão
      Quando a agenda registra o gasto
      Então a skill pede o que falta
      Mas ela não inventa o número nem o prazo
