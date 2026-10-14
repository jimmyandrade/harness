# language: pt
Funcionalidade: Checar a pessoa quando o perfil é único
  Um perfil social único ainda pode ter a pessoa duplicada.

  Regra: Perfil único não encerra a checagem da pessoa

    Exemplo: perfilexemplo___ com um perfil e duas pessoas
      Dado que existe um único perfil social perfilexemplo___
      Quando a skill avalia se perfilexemplo___ está duplicado
      Então a skill também busca os registros na lista de pessoas
      E encontra dois registros da mesma pessoa
      E não conclui que não há duplicata só porque o perfil é único
