# language: pt
Funcionalidade: Buscar fora da lista quando o registro não existe
  Sem o registro, a resposta não para na ausência.

  Regra: Registro ausente leva à busca na web

    Exemplo: Black Week fora da lista
      Dado que Black Week não está na lista de datas significativas
      Quando a skill responde quando será a Black Week
      Então a resposta diz que não está na lista
      E busca na mesma resposta, seguindo o uso da URL do calendário com o ano e o país 33
      Mas não cria o registro
