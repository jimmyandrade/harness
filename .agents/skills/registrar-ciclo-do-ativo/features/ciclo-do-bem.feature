# language: pt

Funcionalidade: Registrar o ciclo do bem que já existe
  O fato do bem fica no ativo correspondente.

  Contexto:
    Dado que um ativo imobilizado já existe

  Regra: O ciclo usa a propriedade ou a observação

    Exemplo: Fato com propriedade
      Quando chega estado, manutenção, conserto, empréstimo, parceria, baixa, descarte, venda, perda, troca ou depreciação
      Então o registro fica no ativo correspondente
      E usa a propriedade estruturada que já existe

    Exemplo: Fato sem propriedade
      Quando não há propriedade adequada
      Então a análise anota nas observações patrimoniais
      E sugere a criação da propriedade
      Mas não cria a propriedade antes do sim

    Exemplo: Ciclo sem evidência financeira
      Quando a mudança não traz evidência financeira
      Então a análise não cria despesa
      Mas mantém o registro no ativo
