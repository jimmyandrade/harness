# language: pt

Funcionalidade: Procurar venda
  A habilidade responde se uma venda já foi lançada e quais vendas houve, lendo o banco de vendas sem criar nem alterar nada.

  Regra: a busca usa os critérios que a pessoa deu

    Esquema do Cenário: Venda achada por um critério
      Dado que o banco de vendas tem uma venda com <critério>
      Quando a pessoa pergunta pela venda com <critério>
      Então a habilidade mostra essa venda
      E diz o critério que usou

      Exemplos:
        | critério                        |
        | a data da venda                 |
        | um período                      |
        | o produto vendido               |
        | a variante vendida              |
        | a pessoa cliente                |
        | o ponto de contato              |
        | o número do pedido              |
        | o link do pedido                |
        | o identificador da transação    |
        | o valor                         |

    Exemplo: Pedido sem critério
      Dado que a pessoa pergunta por uma venda sem dizer data, produto, pessoa, lugar, pedido, transação nem valor
      Quando a habilidade recebe o pedido
      Então pergunta uma vez qual critério usar
      Mas não lista o banco inteiro

    Exemplo: Dia no fuso da pessoa
      Dado que uma venda aconteceu à noite, no dia que a pessoa chama de hoje
      Quando a pessoa pergunta pelas vendas de hoje
      Então a habilidade mostra essa venda
      E a hora sai no fuso da pessoa

  Regra: cada venda achada sai com os mesmos dados

    Exemplo: Dados da venda
      Dado que a busca acha uma venda
      Quando a habilidade responde
      Então mostra o link da página, o pedido, a data e a hora, o valor, o status do pagamento, a pessoa cliente, as variantes e as unidades ligadas
      E diz qual dado está vazio na página
      Mas não inventa o dado que falta

  Regra: a habilidade não escolhe nem cria

    Exemplo: Várias vendas parecidas
      Dado que a busca acha mais de uma venda que pode ser a pedida
      Quando a habilidade responde
      Então mostra todas, com o que distingue cada uma
      Mas não escolhe uma delas

    Exemplo: Venda que bate só em parte
      Dado que nenhuma venda bate com todos os critérios e uma bate com parte deles
      Quando a habilidade responde
      Então mostra essa venda e diz qual critério bate e qual diverge
      Mas não diz que ela é a venda pedida

    Exemplo: Nenhuma venda
      Dado que nenhuma venda bate com os critérios
      Quando a habilidade responde
      Então diz os critérios que usou e que não achou
      Mas não cria a venda

    Exemplo: Pedido de lançar a venda
      Dado que a pessoa pede para cadastrar, completar, corrigir ou conciliar uma venda
      Quando o pedido chega
      Então a habilidade que atende é a de lançar a venda
      Mas esta habilidade não altera a página

  Regra: o banco vem do projeto

    Exemplo: Banco de vendas vazio nas instruções do projeto
      Dado que as instruções do projeto não definem o banco de vendas
      Quando a habilidade precisa do banco
      Então segue a habilidade que procura o banco de dados
      Mas não usa a lista de outro workspace
