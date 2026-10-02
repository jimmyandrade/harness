# language: pt
Funcionalidade: Reescrever a descrição de um schema
  O fato novo entra junto com o que a descrição já dizia.

  Regra: Descrição existente não é substituída

    Exemplo: Cadastro canônico entra na frase que já existia
      Dado que a descrição de um schema já nomeia o que a fonte guarda
      Quando a pessoa pede para gravar um fato novo nessa descrição
      Então a skill reescreve a descrição com o fato novo
      E cada fato que já estava permanece
      Mas a skill não substitui a descrição por uma frase mais curta
