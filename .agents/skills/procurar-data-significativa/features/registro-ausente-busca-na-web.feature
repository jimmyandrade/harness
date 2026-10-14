# language: pt
Funcionalidade: Buscar fora da lista quando o registro não existe
  Sem o registro, a resposta não para na ausência.

  Regra: Registro ausente leva à busca na web

    Exemplo: Black Week fora da lista
      Dado que Black Week não está na lista de datas significativas
      Quando a skill responde quando será a Black Week
      Então a resposta diz que não está na lista
      E busca na mesma resposta, seguindo as fontes de calendário com o ano e o código do país de cada fonte
      Mas não cria o registro
