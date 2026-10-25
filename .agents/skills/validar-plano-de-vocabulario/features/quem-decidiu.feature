# language: pt

Funcionalidade: Registrar quem decidiu o nível do termo
  Quem decidiu fica em decided_by, com o e-mail individual quando ele existe.

  Regra: E-mail dividido não identifica quem decidiu

    Exemplo: Duas pessoas usam o mesmo e-mail
      Dado que quem decidiu divide o único e-mail com outra pessoa
      Quando a skill valida o plano
      Então decided_by leva só o nome de quem decidiu
      Mas o e-mail compartilhado não entra no plano
