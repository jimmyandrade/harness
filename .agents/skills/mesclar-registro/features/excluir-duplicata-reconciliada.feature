# language: pt
Funcionalidade: Excluir a duplicata reconciliada nas listas do parâmetro
  Nas listas que as instruções do projeto nomeiam, a duplicata consolidada sai. Ela não fica arquivada.

  Regra: Reconciliação concluída exclui a duplicata

    Exemplo: Dados úteis já estão no canônico
      Dado que as instruções do projeto nomeiam a lista em Listas que excluem a duplicata reconciliada
      E existe nessa lista uma duplicata cujos dados úteis já estão no canônico
      Quando a skill finaliza a reconciliação
      Então a skill exclui a duplicata
      E a skill não arquiva a duplicata
      Mas pede confirmação antes de excluir se houver risco de perda ou dúvida sobre a duplicidade

  Regra: Sem o parâmetro, nada se exclui sem ordem

    Exemplo: A lista não está no parâmetro
      Dado que a lista não está em Listas que excluem a duplicata reconciliada
      E não há ordem para apagar
      Quando a skill finaliza a reconciliação
      Então a duplicata recebe a nota de que é duplicata do canônico
      E a skill não exclui a duplicata
