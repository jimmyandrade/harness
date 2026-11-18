# language: pt
Funcionalidade: Separar a nota de fit por eixo
  Como pessoa que decide com base na análise
  Quero ver a nota de estética separada da nota de valores
  De forma que um eixo forte não esconda o fraco

  Cenário: Estética alta e valores baixos
    Dado que o perfil tem estética muito alinhada e conteúdo que destoa dos valores da marca
    Quando a habilidade escreve o veredito
    Então a nota de estética e a nota de valores aparecem separadas
    E nenhuma nota única resume as duas
    E o próximo passo cita o eixo que pesou
