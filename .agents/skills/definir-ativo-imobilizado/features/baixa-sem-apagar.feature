# language: pt

Funcionalidade: Anotar a baixa sem apagar
  Baixa, venda ou fim da vida útil permanecem no histórico.

  Regra: A página do bem permanece

    Exemplo: Baixa de uma máquina
      Dado que existe um ativo imobilizado que sai por baixa, venda ou fim da vida útil
      Quando a pessoa pede a baixa
      Então a análise anota o fato nas observações patrimoniais
      Mas não apaga a página
      E não cria propriedade de status
