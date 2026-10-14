# language: pt

Funcionalidade: Empresa do bem durável
  Fornecedor, fabricante, marca e proprietária passam pela empresa.

  Exemplo: Empresa que o bem precisa
    Dado que existe um bem durável cuja fornecedora, fabricante, marca ou proprietária precisa de consulta, cadastro ou reconciliação
    Quando o ativo precisa dessa empresa
    Então a consulta, o cadastro ou a reconciliação seguem definir-empresa
    Mas a marca fechada do ativo não vira essa empresa
