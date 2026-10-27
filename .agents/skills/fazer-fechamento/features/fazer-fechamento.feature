# language: pt
Funcionalidade: Fazer o fechamento financeiro
  O fechamento diz o que fechou, quanto pagar a quem e o que falta cobrar.

  Regra: O recorte e o intervalo vêm do pedido

    Exemplo: Pedido sem ponto de contato e sem intervalo
      Dado que "Apelidos de intervalo" tem "semana" e "mês"
      Quando a pessoa pede o fechamento sem dizer o ponto de contato nem o intervalo
      Então a skill pergunta o que fechar, oferecendo os apelidos
      Mas não lê nem grava nada antes da resposta

    Exemplo: Fechar a semana
      Dado que "Apelidos de intervalo" tem "semana"
      Quando a pessoa pede o fechamento da semana passada
      Então a skill converte o apelido nas datas da semana
      E fecha cada ponto de contato da semana
      E soma o que ficou para pagar e para cobrar

    Exemplo: Fechar um intervalo qualquer
      Dado que a pessoa pede o fechamento de 05/10/2026 a 18/10/2026
      Quando a skill faz o fechamento
      Então ela fecha cada ponto de contato desse intervalo
      Mas não pergunta o intervalo

  Regra: O mesmo fechamento no Notion e na planilha

    Exemplo: Fechar um evento na planilha
      Dado que "Onde fica o fechamento" é "planilha"
      E que o evento tem entradas, custos e line-up nas fontes
      Quando a pessoa pede o fechamento desse evento
      Então a skill atualiza a mesma planilha, sem criar arquivo novo
      E diz o total do fechamento, quanto pagar a cada pessoa e o que falta cobrar da casa

    Exemplo: Fechar um evento no Notion
      Dado que "Onde fica o fechamento" é "notion"
      Quando a pessoa pede o fechamento desse evento
      Então a skill grava as entradas e os custos ligados ao evento
      E entrega o mesmo resumo do fechamento na planilha

    Exemplo: O mesmo evento nos dois modos
      Dado que um evento passado foi fechado no Notion e na planilha
      Quando a pessoa compara os dois fechamentos
      Então os totais, os pagamentos e as cobranças são iguais

  Regra: O fechamento não apaga nem inventa

    Exemplo: Pagamento já marcado
      Dado que alguém marcou um pagamento como pago
      Quando a skill atualiza o fechamento
      Então o pagamento continua marcado, com a data e o comprovante

    Exemplo: Dado que falta
      Dado que falta o borderô, o caixa da casa ou o Pix de alguém
      Quando a pessoa pede o fechamento
      Então a skill diz o que falta e de quem
      Mas não estima o valor que falta

    Exemplo: Casa sem regra de divisão
      Dado que a casa não tem a regra de divisão cadastrada
      Quando a pessoa pede o fechamento desse evento
      Então a skill não calcula a divisão
      E diz que a regra da casa está pendente

  Regra: O ponto de contato pode ter fechamento de caixa

    Exemplo: Fechamento de caixa de uma pop-up
      Dado que "Nome do ponto de contato" é "pop-up"
      Quando a pessoa pede o fechamento da pop-up com a contagem do caixa
      Então a skill compara o caixa contado com as vendas registradas
      E mostra a diferença, quando houver

  Regra: A planilha é procurada antes de pedir o link

    Exemplo: Planilha sem link
      Dado que "Onde fica o fechamento" é "planilha"
      E que nem o pedido nem o mapeamento trazem o link da planilha
      Quando a pessoa pede o fechamento
      Então a skill procura a planilha pelo conector, pelo nome e pelo nome das abas
      Mas não pede o link antes de procurar

    Exemplo: Planilha fora do alcance do conector
      Dado que a busca pelo conector não achou a planilha
      Quando a skill responde
      Então diz que buscas rodou
      E pede que a dona da planilha a compartilhe com a conta do conector, ou mande o link
