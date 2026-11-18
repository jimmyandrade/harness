# language: pt
Funcionalidade: Tratar conteúdo ambíguo como hipótese
  Como pessoa que não quer acusar um perfil sem base
  Quero que um post ou destaque ambíguo apareça como hipótese, com as leituras possíveis
  De forma que a decisão seja minha e não da habilidade

  Cenário: Destaque que pode ser lido de duas maneiras
    Dado que um destaque tem sentido que depende de contexto que o perfil não mostra
    Quando a habilidade registra o sinal
    Então o sinal diz o que está visível e a data
    E lista as leituras possíveis
    E não afirma a intenção da pessoa nem o valor que ela defende
