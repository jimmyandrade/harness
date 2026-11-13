# language: pt

Funcionalidade: Lançar venda
  A venda liga cliente e unidades que já existem, concilia as fontes por campo e deixa a trilha no comentário da página.

  Regra: a venda não inventa o que falta

    Exemplo: Venda de duas peças
      Dado que existe um pedido para cadastrar uma venda de duas peças
      Quando a habilidade registra a venda
      Então vincula as unidades que já existem
      Mas não cria pessoa nem peça

    Exemplo: Cliente, unidade ou variante ausente
      Dado que a pessoa cliente, a unidade ou a variante dita não existe
      Quando a habilidade registra a venda
      Então para e pergunta
      Mas não cria o registro nem escolhe entre parecidos

    Exemplo: Venda que já existe
      Dado que a busca pelo número do pedido, pelo link ou pelo identificador da transação acha a venda
      Quando a habilidade lança a venda
      Então atualiza essa venda
      Mas não cria outra

    Exemplo: Venda ligada ao ponto de contato
      Dado que a venda aconteceu num ponto de contato
      Quando a habilidade registra a venda
      Então relaciona esse ponto de contato

    Exemplo: Ponto de contato não dito
      Dado que a pessoa não disse onde a venda aconteceu
      Quando a habilidade registra a venda
      Então pergunta o ponto de contato antes de criar
      E, na retirada, pergunta o local
      Mas não grava o canal usado para achar a cliente como ponto da venda

    Exemplo: Acompanhar a evolução e o retorno
      Dado que o pedido é acompanhar a evolução das vendas e o retorno
      Quando a habilidade registra a venda
      Então grava a data real e as peças
      Mas não cria propriedade de retorno nem grava um número para ele

    Exemplo: Peças vendidas e saldo
      Dado que a venda tem unidades com variantes
      Quando a habilidade relaciona os registros
      Então as peças saem das unidades
      Mas não preenche as peças vendidas nem altera o saldo do estoque

  Regra: o completar e o corrigir mantêm o dado válido

    Exemplo: Campo ausente
      Dado que uma venda já registrada tem um campo ausente e os demais válidos
      Quando a habilidade completa a venda
      Então preenche só o campo ausente
      E o dado válido permanece

    Exemplo: Dado no lugar errado
      Dado que uma venda tem um dado registrado no lugar errado
      Quando a habilidade corrige a venda
      Então move o dado para a propriedade que já existe
      E registra a trilha num comentário da página

  Regra: a venda retroativa não vira outra venda

    Exemplo: Pedido na loja depois da data real
      Dado que o pedido da loja on-line foi lançado depois da venda real
      Quando a habilidade vincula o lançamento retroativo
      Então a data real, o pagamento, o valor e o contexto permanecem
      E o pedido, a confirmação e o link ficam na venda original

    Exemplo: Venda original ausente
      Dado que o pedido tardio não acha a venda original
      Quando a habilidade lança o retroativo
      Então para e pergunta
      Mas não cria uma segunda venda

  Regra: fonte que diverge aparece em diff por campo

    Exemplo: Diff antes de alterar
      Dado que a mesma venda tem valores diferentes em fontes diferentes
      Quando a habilidade concilia as fontes
      Então mostra o diff por campo
      Mas não altera o valor ambíguo antes da confirmação

    Exemplo: Fonte canônica por campo
      Dado que a pessoa confirmou a fonte de um campo
      Quando a habilidade concilia outro campo que diverge
      Então pede a confirmação desse campo
      Mas não usa uma fonte para a venda inteira

  Regra: preço, desconto, pago e recebido são números distintos

    Exemplo: Pagamento com desconto e crédito
      Dado que a venda tem desconto, crédito utilizado, valor pago, valor recebido e meio efetivo
      Quando a habilidade registra o pagamento
      Então cada um fica no campo que já o representa
      Mas taxa, repasse e erro de lançamento não entram como desconto

    Exemplo: Motivo do desconto
      Dado que a venda tem desconto
      Quando a habilidade registra o desconto
      Então grava o motivo de cada parte e quem concedeu, quando a pessoa disse
      Mas não altera o valor inferido das peças

    Exemplo: Desconto sem motivo
      Dado que o motivo do desconto é só um rótulo, sem o porquê
      Quando a habilidade registra o desconto
      Então pergunta o porquê antes de gravar

  Regra: a entrada de um saque no cartão não é venda

    Exemplo: Entrada sem venda, devolvida logo depois
      Dado que o extrato tem uma entrada sem venda, devolvida logo depois para quem passou o cartão
      Quando a habilidade concilia a entrada
      Então pergunta à pessoa se foi um saque no cartão de crédito
      Mas não cria uma venda para fechar a conciliação

    Exemplo: Saque numa conta de pessoa física
      Dado que a entrada é um saque e a conta da máquina era de pessoa física na data
      Quando a habilidade concilia a entrada
      Então a entrada não vai para as vendas
      E o comentário da conciliação diz o que ela é

    Exemplo: Saque numa conta da empresa
      Dado que a entrada é um saque e a conta da máquina era da empresa na data
      Quando a habilidade concilia a entrada
      Então avisa que o saque infla o faturamento e recomenda não repetir
      E registra a entrada e a devolução como um par de lançamentos financeiros
      Mas confirma o tratamento contábil com quem cuida da contabilidade

  Regra: a nota fiscal do envio segue os parâmetros

    Exemplo: Envio a partir do início da nota
      Dado que o início da nota no envio está definido
      E que a venda é dessa data em diante com uma forma de entrega que transporta a mercadoria
      Quando a habilidade lança a venda
      Então diz se a nota falta e pede a emissão antes da etiqueta
      E grava a data de emissão só quando a nota existe

    Exemplo: Entrega sem envio
      Dado que a forma de entrega é a que não transporta a mercadoria
      Quando a habilidade lança a venda
      Então não exige a nota do envio

    Exemplo: Parâmetros da nota vazios
      Dado que o início da nota no envio ou a forma de entrega sem envio está vazio
      Quando a habilidade lança uma venda com envio
      Então pergunta uma vez se o projeto exige a nota
      Mas não impõe regra

  Regra: o nome de banco e de propriedade vem do projeto

    Exemplo: Banco de vendas vazio
      Dado que as instruções do projeto não definem o banco de vendas
      Quando a habilidade lança uma venda
      Então pergunta à pessoa o data source uma vez
      Mas não escolhe um banco

    Exemplo: Controle de estoque por unidade vazio
      Dado que o banco de unidades está vazio
      Quando a habilidade vincula os produtos vendidos
      Então não vincula unidade nem mexe no saldo

  Regra: migração, correção e reversão deixam a trilha

    Exemplo: Reversão
      Dado que existe uma migração, correção, reversão ou decisão de conciliação
      Quando a habilidade a faz
      Então o comentário da página diz o que mudou, por que mudou, a fonte e quando
      E o comentário vem antes de apagar, mover ou reverter
      Mas o chat não substitui o comentário

  Regra: o papel de cada local não se mistura

    Exemplo: Origem, ponto, retirada, destino e processamento
      Dado que a venda tem origem do estoque, ponto de contato, local da retirada, destino do envio e local de processamento
      Quando a pessoa registra onde cada etapa aconteceu
      Então o ponto de contato guarda onde a venda aconteceu e a retirada fica em local da retirada
      Mas origem do estoque, destino do envio e local de processamento não ocupam esses campos
      E a habilidade sugere a propriedade que falta e espera o sim

  Regra: o banco vazio chama a procura de banco

    Exemplo: Banco de vendas não definido
      Dado que as instruções do projeto não definem o banco de vendas
      Quando a habilidade precisa ler ou gravar uma venda
      Então ela chama a habilidade de procurar banco de dados
      E diz a ela para que serve o banco e quais propriedades ele precisa ter
      Mas não pergunta o nome à pessoa antes
