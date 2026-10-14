# language: pt
Funcionalidade: Cadastrar sem duplicar o registro
  O cadastro na lista de datas significativas não cria um segundo registro igual.

  Regra: O mesmo evento e a mesma data não entram de novo

    Exemplo: Data já cadastrada
      Dado que existe um registro com o mesmo evento e a mesma data
      Quando a skill cadastra essa data na lista de datas significativas
      Então ela não cria outro registro

    Exemplo: Registro equivalente confirmado
      Dado que existe um registro equivalente na lista de datas significativas
      Quando a pessoa confirma que é o mesmo evento e a mesma data
      Então a skill não cria um novo item
      E aponta o registro existente como canônico
      E completa a fonte ou as observações nesse registro se necessário
