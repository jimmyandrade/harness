# language: pt

Funcionalidade: Preço de produto
  O preço anterior se lê na fonte do histórico antes de perguntar, e uma mudança de preço entra como linha nova.

  Regra: a fonte do histórico se lê antes de perguntar

    Exemplo: Qual era o preço e quando mudou
      Dado que a pessoa pergunta o preço anterior de um produto e a data da mudança
      Quando a habilidade ainda não perguntou nada
      Então ela lê a fonte do histórico de preços
      E responde com o que achou
      E diz qual fonte consultou

    Exemplo: A fonte não responde
      Dado que a mudança é anterior ao que a fonte do histórico guarda
      Quando a habilidade responde
      Então ela diz qual fonte consultou e até onde ela chega
      E pergunta à pessoa só o que a fonte não responde

    Exemplo: A fonte padrão
      Dado que as instruções do projeto não definem a fonte do histórico de preços
      Quando a habilidade escolhe onde ler
      Então ela lê o banco do Notion

  Regra: a leitura das versões da página segue o modo das instruções do projeto

    Exemplo: Modo automático sem resposta da fonte
      Dado que o modo de leitura das versões da página é automático
      E que a fonte do histórico não responde
      Quando a habilidade procura o preço anterior
      Então ela lê as versões da página do produto e, se há variação, as da variação
      E diz até onde esse histórico chega
      E pergunta à pessoa só o que nada respondeu

    Exemplo: Modo automático com resposta da fonte
      Dado que o modo de leitura das versões da página é automático
      E que a fonte do histórico responde
      Quando a habilidade procura o preço anterior
      Então ela não lê as versões da página

    Exemplo: Modo sempre
      Dado que o modo de leitura das versões da página é sempre
      Quando a habilidade procura o preço anterior
      Então ela lê a fonte do histórico e as versões da página, mesmo que a fonte responda

    Exemplo: Modo perguntar
      Dado que o modo de leitura das versões da página é perguntar
      E que a fonte do histórico não responde
      Quando a habilidade procura o preço anterior
      Então ela pergunta à pessoa se lê as versões da página
      Mas não lê antes da resposta

    Exemplo: Modo nunca
      Dado que o modo de leitura das versões da página é nunca
      E que a fonte do histórico não responde
      Quando a habilidade procura o preço anterior
      Então ela pergunta à pessoa o preço sem ler as versões da página

    Exemplo: Preço diferente por variação
      Dado que o produto tem variações com preços diferentes
      Quando a habilidade lê as versões da página
      Então ela lê as do produto e as da variação pedida
      Mas não lê as da unidade

  Regra: o histórico só recebe linhas novas

    Exemplo: Mudança de preço do catálogo
      Dado que a pessoa muda o preço de catálogo de um produto
      Quando a habilidade registra a mudança
      Então ela acrescenta uma linha na fonte do histórico
      E a linha traz produto, variação quando há, canal, motivo, quem decidiu, preço anterior, preço novo, vigência e custo na data

    Exemplo: Correção de uma linha antiga
      Dado que uma linha do histórico tem o preço errado
      Quando a habilidade corrige o registro
      Então ela acrescenta uma linha nova
      Mas não edita nem apaga a linha antiga

    Exemplo: Motivo ou quem decidiu faltando
      Dado que a pessoa não disse o motivo da mudança
      Quando a habilidade monta a linha
      Então ela pergunta o motivo antes de acrescentar
      E faz o mesmo com quem decidiu

    Exemplo: Produto sem linha no histórico
      Dado que o produto não tem nenhuma linha no histórico
      Quando a habilidade registra uma mudança de preço
      Então acrescenta antes a linha de carga inicial, com o preço atual e a fonte
      Mas não inventa o preço nem a data do que veio antes

    Exemplo: Remarcação da ferramenta de sugestão de preço
      Dado que o histórico de publicações da ferramenta de sugestão mostra uma redução com data e hora
      Quando a habilidade registra essa mudança
      Então usa a data e hora da publicação e grava como quem decidiu quem aceitou a sugestão
      E diz quando o preço de comparação não pôde ser provado por venda

    Exemplo: Preço de comparação acima do menor preço recente
      Dado que o novo preço é uma redução com preço de comparação
      Quando o preço de comparação passa do menor preço praticado nos 30 dias anteriores
      Então a habilidade não acrescenta a linha com esse valor
      E mostra o menor preço dos 30 dias

  Regra: o grupo sai do estoque do local, não do nome

    Exemplo: Preço dito para um grupo
      Dado que a pessoa diz que um grupo de produtos ficou por um preço num local
      Quando a habilidade vai mudar ou registrar o preço
      Então ela lista os produtos pelo estoque do local
      E tira os que foram vendidos antes
      E mostra a lista e espera a confirmação da pessoa

    Exemplo: Produto que não foi ao local
      Dado que um produto do grupo não foi levado ao local
      Quando a habilidade monta a lista
      Então esse produto não muda de preço

    Exemplo: Produto que já saiu do estoque
      Dado que um produto do grupo já tinha saído do estoque do local
      Quando a habilidade monta a lista
      Então esse produto não muda de preço

    Exemplo: Unidade sem finalidade de venda
      Dado que uma unidade do local tem finalidade de piloto, figurino ou acervo
      Quando a habilidade monta a lista
      Então essa unidade não conta como estoque de venda

  Regra: nenhum nome de banco vem da habilidade

    Exemplo: Banco do histórico de preços não definido
      Dado que as instruções do projeto não definem o banco do histórico de preços
      Quando a habilidade precisa ler ou acrescentar uma linha
      Então ela chama a habilidade de procurar banco de dados
      E diz a ela para que serve o banco e quais propriedades ele precisa ter
      Mas não usa um nome de banco próprio

    Exemplo: Banco de produtos ou de variações não definido
      Dado que as instruções do projeto não definem o banco de produtos ou o de variações
      Quando a habilidade precisa ler o produto ou a variação
      Então ela chama a habilidade de procurar banco de dados
      Mas não pergunta o nome à pessoa antes

  Regra: o destino do preço de um ponto de venda não é escolhido pela habilidade

    Exemplo: Destino vazio
      Dado que as instruções do projeto não definem o destino do preço de um ponto de venda
      Quando a habilidade vai registrar o preço de um local
      Então ela pergunta à pessoa onde registrar
      Mas não escolhe o catálogo, a venda nem outro banco

    Exemplo: Fonte do estoque por local vazia
      Dado que as instruções do projeto não definem a fonte do estoque por local
      Quando a habilidade precisa listar o que há no local
      Então ela pergunta à pessoa de onde ler o estoque
      Mas não inventa nome de banco nem de propriedade

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

  Regra: todo preço leva justificativa

    Exemplo: Preço sugerido
      Dado que a habilidade sugere ou valida um preço
      Quando ela responde
      Então ela justifica o preço com os critérios que usou, como uma pessoa mentora
      E diz quais critérios pesaram mais

    Exemplo: Critério não consultado
      Dado que a habilidade não consultou um critério, como o markup
      Quando ela escreve a justificativa
      Então ela não cita esse critério como usado

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
