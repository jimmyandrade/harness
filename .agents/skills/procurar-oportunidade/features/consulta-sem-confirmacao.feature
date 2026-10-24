# language: pt
Funcionalidade: Consultar a oportunidade sem confirmação técnica desnecessária
  Regra: Usar a fonte disponível na mesma conexão
    Exemplo: A fonte pode ser lida após a falha ao carregar a base
      Dado que carregar a base falhou e a referência da fonte está disponível na mesma conexão
      Quando a pessoa pede para verificar a lista ou a fonte sem confirmar com ela
      Então a consulta usa a fonte disponível sem nova pergunta de confirmação
      E a pessoa não recebe um pedido indevido de liberação de acesso
