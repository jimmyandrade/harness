# language: pt
Funcionalidade: Parar sem posicionamento da marca ou sem acesso ao perfil
  Como pessoa que depende da nota
  Quero que a habilidade não invente a base de comparação nem a leitura
  De forma que a nota sempre diga contra o que foi medida

  Cenário: Instruções do projeto sem o posicionamento da marca
    Dado que as instruções do projeto não definem o posicionamento da marca
    Quando a pessoa pede a análise de um perfil
    Então a habilidade pergunta uma vez onde está o posicionamento e para
    E não dá nota

  Cenário: Perfil privado ou fora do ar
    Dado que o perfil está privado, bloqueado ou não foi encontrado
    Quando a habilidade tenta abrir o perfil
    Então a resposta diz que não analisou e por quê
    E não deduz estética nem valores de um nome ou de um print antigo
