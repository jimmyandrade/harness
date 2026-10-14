# language: pt
Funcionalidade: Checar a pessoa quando o perfil é único
  Um perfil social único ainda pode ter a pessoa duplicada.

  Regra: A checagem da pessoa não para no perfil

    Exemplo: Um perfil e duas pessoas
      Dado que existe um único perfil social da mesma pessoa
      Quando a skill trata o perfil
      Então a checagem da pessoa fica com identificar-duplicata
      E dois registros da mesma pessoa seguem para mesclar-registro
      E Não confundir com não separa essa duplicata
