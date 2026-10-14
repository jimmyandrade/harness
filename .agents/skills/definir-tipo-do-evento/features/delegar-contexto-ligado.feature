# language: pt

Funcionalidade: Delegar o contexto ligado ao evento da agenda
  A classificação manda cada parte para a skill dona.

  Regra: O evento ligado não vira cadastro da agenda

    Exemplo: A oportunidade que já existe
      Dado que um compromisso está ligado a uma oportunidade que já existe
      Quando a skill classifica o compromisso
      Então ela segue procurar-oportunidade
      Mas não cadastra a oportunidade

    Exemplo: A oportunidade que ainda não existe
      Dado que um compromisso está ligado a uma oportunidade que não existe
      Quando a skill classifica o compromisso
      Então ela oferece criar a oportunidade
      Mas não cria a oportunidade
