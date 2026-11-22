# language: pt
Funcionalidade: Formato do preço
  O preço é redondo, e o quebrado precisa de uma função dita.

  Regra: o preço é redondo, e o quebrado precisa de uma função

    Exemplo: Peça que precisa sustentar desejo
      Dado que a habilidade sugere o preço de uma peça que precisa comunicar valor autoral, marca ou desejo
      Quando ela decide o formato do preço
      Então ela sugere um preço redondo
      E diz que a função do preço é sustentar valor percebido

    Exemplo: Item de entrada
      Dado que a habilidade sugere o preço de um item de entrada que ajuda a reduzir a barreira da primeira compra
      Quando ela decide o formato do preço
      Então ela pode sugerir um preço quebrado
      E diz que a função do preço é favorecer a conversão
      E termina o preço na terminação do preço quebrado das instruções do projeto

    Exemplo: Preço quebrado sem função clara
      Dado que nenhuma função de conversão, entrada, campanha, saldo, condição especial ou barreira psicológica justifica o preço quebrado
      Quando a habilidade decide o formato do preço
      Então ela não sugere preço quebrado

    Exemplo: Todos os preços terminados em ,90
      Dado que a pessoa pede o preço de várias peças
      Quando a habilidade decide o formato de cada uma
      Então ela decide uma a uma pela função de cada peça
      Mas não termina todos os preços em ,90 por hábito

    Exemplo: Função da peça desconhecida
      Dado que a habilidade não sabe se a peça é de entrada, de campanha ou autoral
      Quando ela vai escolher o formato do preço
      Então ela pergunta à pessoa a função da peça antes de escolher

  Regra: peça autoral ou protagonista pede preço redondo

    Exemplo: Peça conceitual
      Dado que a peça é conceitual, premium, limitada, sob medida ou central da coleção
      Quando a habilidade define ou valida o preço
      Então ela prefere um preço redondo
      E evita o quebrado que faça a peça parecer promocional ou menos autoral

    Exemplo: Quebrado recomendado para uma peça autoral
      Dado que a habilidade ainda assim recomenda um preço quebrado para uma peça autoral
      Quando ela entrega a recomendação
      Então ela explica objetivamente por que a conversão pesa mais que o valor percebido nessa peça

  Regra: o preço quebrado é permitido em entrada, volume e conversão

    Exemplo: Peça acima do nível de entrada
      Dado que a peça está em um dos níveis acima da entrada da curva de preço
      Quando a habilidade considera um preço quebrado
      Então ela reavalia se o preço redondo protege melhor a percepção de valor

    Exemplo: Conflito com a curva ou o posicionamento
      Dado que um preço quebrado entra em conflito com a curva de preço, a pirâmide de mix ou o posicionamento da marca
      Quando a habilidade confere o preço
      Então ela sinaliza o conflito antes de recomendar

  Regra: preço cheio e preço de campanha se diferenciam

    Exemplo: Peça em saldo
      Dado que a peça está em saldo, campanha, condição especial ou outra promoção
      Quando a habilidade sugere o preço
      Então ela pode usar um preço quebrado
      E preserva a âncora do preço cheio, de preferência redonda
      E registra se o preço é cheio, promocional, de saldo, de campanha ou de condição especial

  Regra: a barreira psicológica de preço se usa com cuidado

    Exemplo: Peça que precisa sustentar desejo perto da barreira
      Dado que o preço calculado está perto de uma barreira das instruções do projeto
      E que a peça precisa sustentar desejo, autoria ou percepção premium
      Quando a habilidade avalia o preço quebrado
      Então ela não reduz o preço para baixo da barreira só para converter

    Exemplo: Peça comercial perto da barreira
      Dado que o preço calculado está perto de uma barreira das instruções do projeto
      E que a peça está numa faixa comercial
      Quando a habilidade avalia o preço quebrado
      Então ela compara o ganho provável de conversão com o risco de reduzir o valor percebido

  Regra: o número comunica posicionamento

    Exemplo: Dúvida entre os dois formatos
      Dado que há dúvida entre vender por impulso e sustentar desejo
      Quando a habilidade orienta a pessoa
      Então ela pergunta se o preço precisa vender por impulso ou sustentar desejo

  Regra: o preço derivado de uma taxa também segue o formato

    Exemplo: Cheio que embute a taxa do parcelamento
      Dado que o preço cheio a prazo sai do preço à vista dividido por um menos a taxa do parcelamento
      Quando a habilidade define o preço da etiqueta
      Então ela arredonda para o preço redondo mais próximo acima
      E mostra que o valor líquido não fica abaixo do preço-base

    Exemplo: Mudar o preço que a pessoa já definiu
      Dado que o formato pede mudar um preço que a pessoa já definiu, como de 299 para 300
      Quando a habilidade responde
      Então ela mostra o preço da pessoa ao lado
      E pergunta antes de tratar o novo preço como final

  Regra: o preço à vista segue a terminação das instruções do projeto

    Exemplo: Pix com terminação definida
      Dado que as instruções do projeto definem a terminação do preço à vista como 9
      Quando a habilidade define o preço do Pix
      Então ele termina em 9, como R$ 299
      E a habilidade diz que o à vista é um preço de conversão
      E a etiqueta de preço cheio segue a decisão do formato

    Exemplo: Débito derivado do Pix
      Dado que as instruções do projeto definem a terminação do preço à vista como 9
      Quando a habilidade deriva o preço do débito a partir do Pix
      Então ela arredonda para cima até a terminação do preço à vista
