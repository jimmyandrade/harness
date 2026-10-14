# language: pt

Funcionalidade: Gravar o SKU sem hífen
  O identificador do ativo segue a chave configurada.

  Regra: O SKU não leva hífen

    Exemplo: SKU informado com hífen
      Dado que existe um SKU escrito com hífen
      Quando a análise grava o ativo imobilizado
      Então o SKU fica sem hífen
