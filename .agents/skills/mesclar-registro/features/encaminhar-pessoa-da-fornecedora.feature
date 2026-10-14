# language: pt
Funcionalidade: Encaminhar a pessoa responsável da fornecedora
  A consolidação da fornecedora não encerra sem a pessoa responsável.

  Regra: Fornecedora consolidada segue para a skill da empresa

    Exemplo: Duplicata de fornecedora já é o mesmo item
      Dado que existe uma fornecedora consolidada neste passo
      Quando a skill termina a consolidação
      Então a pessoa responsável segue definir-empresa
      E a skill não deixa essa pessoa só na nota
      E a skill não deixa essa pessoa só na relação de donos
