# language: pt
Funcionalidade: Confirmar o lugar físico antes de vincular
  O local só vale com o nome do espaço e o endereço completo.

  Regra: O endereço não é deduzido

    Exemplo: Falta o endereço
      Dado que a pessoa informa o nome do espaço sem o endereço
      Quando a skill vai vincular o local
      Então pergunta o endereço completo
      E não o deduz pela cidade

  Regra: A empresa do local só é cadastrada com o sim da pessoa

    Exemplo: Empresa inexistente
      Dado que a empresa do local não existe, mesmo buscando por nome e grafias
      Quando a skill chega ao vínculo
      Então pergunta se cadastra agora
      E só com o sim cadastra pela definir-empresa e vincula

  Regra: A localidade é validada contra a da empresa

    Exemplo: Conflito entre as duas
      Dado que a localidade do local difere da localidade da empresa
      Quando a skill valida
      Então registra o conflito, mostra os dois valores e confirma antes de gravar

    Exemplo: Cidade fora da lista
      Dado que a cidade do local não está na lista de localidades
      Quando a skill valida
      Então chama definir-localidade-geografica
      E não usa o estado como aproximação

  Regra: O espaço fica abaixo da empresa

    Exemplo: Mapeamento sem onde guardar o espaço
      Dado que o mapeamento não tem lugar para a sala ou o palco
      Quando a pessoa informa o espaço
      Então a skill pergunta onde guardar
