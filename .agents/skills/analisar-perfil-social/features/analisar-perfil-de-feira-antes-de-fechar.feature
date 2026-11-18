# language: pt
Funcionalidade: Analisar o perfil de uma feira antes de fechar a participação
  Como pessoa que prospecta feiras e eventos
  Quero saber se a estética e os valores do perfil de uma feira combinam com a marca
  De forma que eu não feche uma participação que destoa do posicionamento

  Cenário: Perfil de feira com apresentação visual incoerente com a marca
    Dado que as instruções do projeto descrevem o posicionamento da marca
    E que a pessoa trouxe o perfil de uma feira que ainda não conhecemos
    Quando a habilidade abre o perfil, os destaques e os posts recentes
    Então a resposta usa só as seções do modelo que valem para feira ou evento
    E cada sinal vermelho cita o post ou o destaque que o sustenta
    E o veredito traz a nota por eixo, os sinais verdes e vermelhos e o próximo passo
    E a resposta diz que o perfil não mostra a presença no local

  Cenário: A habilidade não grava o resultado
    Quando a análise termina
    Então a resposta entrega o texto no modelo
    E nada é gravado em banco, página ou tarefa sem a pessoa pedir
