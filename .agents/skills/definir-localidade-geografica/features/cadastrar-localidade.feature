# language: pt
Funcionalidade: Cadastrar país, estado e cidade com hierarquia e padrão
  Os nomes de propriedade vêm do mapeamento de dados do projeto.

  Regra: Buscar antes de criar

    Exemplo: Já existe equivalente
      Dado que a localidade já existe por nome, variação ou código
      Quando a skill vai cadastrar
      Então atualiza ou relaciona a página existente
      E não cria duplicata

  Regra: Cada página liga ao nível imediatamente acima pelo pai

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

  Regra: Os níveis da hierarquia são configuráveis

    Exemplo: Nível acima do país
      Dado que a hierarquia do projeto inclui o planeta ou um continente
      Quando a skill cadastra um país
      Então o país tem esse nível como pai

    Exemplo: Nível só em certos países
      Dado que a região existe só nos países listados
      Quando a skill cadastra um estado de um país listado
      Então o estado tem a região como pai
      Mas nos outros países o estado liga ao nível de cima

    Exemplo: Hierarquia não configurada
      Dado que o parâmetro dos níveis está vazio
      Quando a skill cadastra
      Então detecta os níveis no workspace e pergunta se a ordem não for clara

  Regra: A lista ausente não para o trabalho

    Exemplo: Mais de um banco corresponde
      Dado que a lista não está no mapeamento
      Quando a skill procura e acha mais de um banco
      Então confirma qual com a pessoa

    Exemplo: Nenhum banco corresponde
      Dado que a lista não está no mapeamento
      Quando a skill procura e não acha nenhum banco
      Então pergunta se deve criar ou onde está
