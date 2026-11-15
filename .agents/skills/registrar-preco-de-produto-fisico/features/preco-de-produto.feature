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
