# language: pt

Funcionalidade: Projetar o caixa das próximas participações
  A projeção calcula a reserva de cada participação e compara o caixa do período com o caixa seguro recomendado.

  Regra: os nomes e os números vêm das instruções do projeto

    Exemplo: Banco de oportunidades vazio
      Dado que as instruções do projeto não definem a fonte das oportunidades
      Quando a habilidade vai projetar o caixa
      Então ela pergunta uma vez qual é a fonte
      E não escolhe um banco por conta própria

    Exemplo: Fonte fora do espaço conectado
      Dado que a fonte das oportunidades não está no espaço conectado
      Quando a habilidade vai projetar o caixa
      Então ela para
      E não usa a fonte de outro espaço

    Exemplo: Número dos parâmetros
      Dado que as instruções do projeto definem o caixa seguro recomendado e a contingência usada
      Quando a habilidade calcula e compara
      Então ela busca o valor vigente de cada parâmetro
      E não fixa outro número no lugar

    Exemplo: Número vazio
      Dado que um parâmetro numérico das instruções do projeto está vazio
      Quando a habilidade precisa dele
      Então ela pergunta uma vez
      E não inventa o número

  Regra: a data citada escolhe a edição

    Exemplo: Inscrição em outra data
      Dado que a pessoa pede o caixa de uma data
      E que a inscrição registrada está em outra data
      Quando a habilidade calcula o caixa
      Então ela diz que a inscrição não é dessa data
      Mas não usa o orçamento de outra data no lugar

  Regra: o período segue o horizonte padrão ou o pedido

    Exemplo: Pedido sem período
      Dado que a pessoa pede a projeção sem informar o período
      Quando a habilidade monta a resposta
      Então ela calcula o período do dia da projeção até esse dia mais o horizonte padrão
      E informa o período no formato do período de referência, com as datas desta execução

    Exemplo: Pedido com período
      Dado que a pessoa informa o período
      Quando a habilidade monta a resposta
      Então ela usa o período informado
      Mas não usa o horizonte padrão

  Regra: a taxa de inscrição nunca é zero por falta de dado

    Exemplo: Taxa da feira conhecida
      Dado que a taxa de inscrição da feira específica foi informada ou encontrada
      Quando a habilidade estima a taxa segura
      Então ela usa a taxa da feira como referência principal
      Mas não a troca pelo piso

    Exemplo: Taxa desconhecida com piso
      Dado que a feira não tem taxa de inscrição
      E que a localidade tem piso de taxa de inscrição
      Quando a habilidade estima a taxa segura
      Então ela usa o piso como taxa provisória
      E diz na resposta que a taxa é provisória e veio do piso da localidade

    Exemplo: Taxa desconhecida sem piso
      Dado que a feira não tem taxa de inscrição
      E que a localidade não tem piso de taxa de inscrição
      Quando a habilidade estima a taxa segura
      Então ela pede o piso
      Mas não assume R$ 0,00 nem conclui a taxa antes da resposta

  Regra: o custo de participação segue o método dos parâmetros

    Exemplo: Contingência absorve a variação
      Dado que a projeção usa a contingência usada
      Quando a habilidade estima o custo de participação
      Então a contingência absorve alimentação, deslocamento, estacionamento, estrutura e custo não previsto
      Mas esses itens não viram quantia à parte

    Exemplo: Repasse à parte
      Dado que a participação tem repasse de faturamento pago depois
      Quando a habilidade calcula o caixa seguro projetado
      Então o repasse fica fora da base
      E não é multiplicado pela contingência

    Exemplo: Participação em ponto menor sem custo informado
      Dado que existe uma participação em ponto menor sem custo informado
      Quando a habilidade estima o custo
      Então ela usa o custo mínimo para esse ponto, que é um parâmetro

  Regra: a reserva é o maior entre o projetado e o piso do grupo

    Exemplo: Caixa seguro projetado
      Dado que a habilidade tem os custos já lançados, a taxa segura e o custo complementar
      Quando ela calcula o caixa seguro projetado
      Então toma o maior valor entre os custos já lançados e a taxa segura mais o custo complementar
      E multiplica por um mais a contingência usada

    Exemplo: Caixa seguro final com piso do grupo
      Dado que a habilidade calculou o caixa seguro projetado e o grupo tem piso mínimo
      Quando ela calcula a reserva
      Então a reserva é o maior valor entre o projetado e o piso mínimo do grupo

    Exemplo: Grupo sem piso mínimo
      Dado que o grupo não tem piso mínimo
      Quando ela calcula a reserva
      Então usa o piso mínimo recomendado da localidade

    Exemplo: Piso ausente
      Dado que a localidade não tem um dos três pisos
      Quando a habilidade precisa dele
      Então ela pede o piso
      Mas não o troca por parâmetro, por média histórica nem pelo custo do ponto menor

  Regra: a resposta compara e mostra a origem

    Exemplo: Comparação com o caixa seguro recomendado
      Dado que a habilidade calculou o caixa projetado do período
      Quando apresenta a projeção
      Então informa se ele fica acima, igual ou abaixo do caixa seguro recomendado vigente

    Exemplo: Referências históricas
      Dado que a projeção usa dado histórico para uma premissa
      Quando apresenta a projeção
      Então lista cada referência que sustentou a premissa
      E separa a referência histórica do período projetado e do parâmetro atual
      Mas não cria referência para premissa que veio só dos parâmetros

  Regra: a habilidade só lê

    Exemplo: Dado ausente
      Dado que falta um campo nos bancos consultados
      Quando a habilidade identifica a falta
      Então ela diz a limitação ou recomenda o campo na resposta
      Mas não cria, renomeia, exclui nem reconfigura a estrutura dos bancos
