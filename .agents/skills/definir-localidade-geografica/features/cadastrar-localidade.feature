# language: pt
Funcionalidade: Cadastrar país, estado e cidade com hierarquia e padrão
  Os nomes de propriedade vêm do mapeamento de dados do projeto.

  Regra: Buscar antes de criar

    Exemplo: Já existe equivalente
      Dado que a localidade já existe por nome, variação ou código
      Quando a skill vai cadastrar
      Então atualiza ou relaciona a página existente
      E não cria duplicata

  Regra: A hierarquia é país, estado, cidade pelo pai

    Exemplo: Cidade com pai errado
      Dado que a cidade está sem pai ou ligada ao país
      Quando a skill revisa
      Então corrige o pai para o estado antes de concluir

  Regra: O ISO vale para país e estado

    Exemplo: Estado sem código
      Dado que o estado está sem o código ISO 3166-2
      Quando a skill revisa
      Então ajusta o código ao padrão

  Regra: Cidade inexistente nasce com a prioridade

    Exemplo: Oportunidade em cidade que falta
      Dado que a cidade citada não existe na lista
      Quando a skill vai cadastrar
      Então pergunta a prioridade de oportunidades da cidade
      E cria a cidade com ela e com o estado como pai
      Mas nunca usa o estado como aproximação

  Regra: A incerteza fica registrada

    Exemplo: Fonte parcial
      Dado que a fonte é incompleta
      Quando a skill grava
      Então registra nas observações a origem e a dúvida pendente
