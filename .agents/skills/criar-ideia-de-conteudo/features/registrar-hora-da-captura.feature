# language: pt
Funcionalidade: Registrar a hora da captura
  A data da captura inclui a hora, para separar ideias do mesmo dia.

  Regra: A hora distingue ideias cadastradas no mesmo dia

    Exemplo: Cadastrar uma ideia
      Dado que existem várias ideias que podem ser cadastradas no mesmo dia
      Quando a skill registra a ideia
      Então a data da captura inclui a hora do cadastro
      E a hora é a do instante do cadastro
