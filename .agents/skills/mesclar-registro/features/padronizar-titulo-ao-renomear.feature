# language: pt
Funcionalidade: Padronizar o título ao renomear um registro
  O mapeamento de dados diz, por lista, se o título é padronizado, e a skill só atua nas listas que declaram isso.

  Regra: Lista sem as chaves de título padronizado não usa o recurso

    Exemplo: O mapeamento não declara a sugestão de título
      Dado que existe um registro renomeado numa lista sem a chave de sugestão de título
      Quando a skill conclui a renomeação
      Então a skill não cria a propriedade de sugestão nem a fórmula de conferência
      E guarda só o nome anterior nas variações

  Regra: A sugestão de título é conferida e aplicada gravando o valor no título

    Exemplo: O título difere da sugestão
      Dado que a lista declara a sugestão de título e a pessoa quer o título padronizado
      E que o título do registro é diferente da sugestão
      Quando a skill renomeia o registro
      Então a skill grava o valor da sugestão no título
      E não tenta apertar o botão, porque a API não aperta botão

  Regra: O nome de um filho derivado do pai se atualiza pela automação

    Exemplo: Renomear um registro pai com filhos
      Dado que o nome do filho é derivado do nome do pai por uma automação do projeto
      Quando a skill renomeia o registro pai
      Então a skill não renomeia os filhos à mão
      E acrescenta o nome anterior de cada filho às variações dele
      E acrescenta o nome anterior do pai às variações do pai
