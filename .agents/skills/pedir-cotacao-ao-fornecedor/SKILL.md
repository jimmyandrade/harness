---
name: pedir-cotacao-ao-fornecedor
description: Prepara e envia o primeiro contato de cotação a cada empresa que pode vender ou fazer o item, e lê e responde o que ela devolve. Usada quando uma pesquisa de compra chega à hora de falar com a empresa, mesmo sem dizer cotação. NÃO serve para pesquisar opções, cadastrar a empresa, registrar o orçamento recebido nem pagar.
metadata:
  author: jimmyandrade
  version: "0.1.1"
  related:
    - anexar-arquivo-no-whatsapp
    - conversar-no-whatsapp
    - definir-empresa
    - definir-negociacao
    - definir-orcamento-de-fornecedor
    - definir-requisito-de-compra
    - definir-viagem
    - evoluir-habilidade
    - gerenciar-estoque
    - pesquisar-compra
---

# Pedir cotação ao fornecedor

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
# `Empresa de quem compra` é o nome, na lista de empresas do projeto, da empresa que compra. O CNPJ e o e-mail que toda mensagem de cotação traz vêm da página dela. Vazio, é a empresa dona do projeto.
"Empresa de quem compra": ""
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

O primeiro contato é por mensagem, pelo WhatsApp, pelo e-mail ou pelo formulário da empresa, e sai em qualquer hora: a loja fechada não adia a mensagem. Ligação é o último recurso, só quando a empresa não tem canal de texto.
A empresa que só tem telefone fixo no site, sem WhatsApp, recebe o primeiro contato pelo e-mail ou pelo formulário dela, quando existir, e não fica sem contato nem espera a ligação.
Prepare a mensagem para cada empresa de uma vez e peça o sim da pessoa a todas.

Antes do primeiro envio a cada empresa, ela precisa estar cadastrada, com o rótulo no WhatsApp e o link da página dela na nota do contato. A pressa não adia esses três.
Antes de contatar, veja se já houve conversa com ela, seguindo `conversar-no-whatsapp`, e diga o que o histórico já responde.

### Passo 2

A primeira mensagem explica o que é o item e para que a pessoa o usa, com o link do anúncio ou da compra quando houver. Uma empresa que não conhece o item não consegue dizer se atende: explique antes de pedir indicação.
A mensagem já traz o que a empresa vai perguntar: o material, o formato, a medida, a quantidade e o prazo. Antes de enviar, confira nos registros o que já se sabe e pergunte à pessoa só o que falta, como a quantidade, para a empresa não abrir uma segunda rodada de perguntas.

Toda mensagem de cotação traz o CNPJ e o e-mail de quem compra, no fim, para a empresa emitir o orçamento sem perguntar. Leia os dois na página da `Empresa de quem compra`, na lista de empresas do mapeamento de dados do projeto, e nunca os peça à pessoa.
Só quando a página não tem um dos dois, diga qual falta e peça só esse, depois de procurar no site, no perfil e nas notas fiscais dela.

O que a mensagem traz vem da especificação fechada em `definir-requisito-de-compra` e do cadastro do item lido na pesquisa, como a medida de um bem que já temos. A empresa que pede um dado que um dos dois cobre o recebe dele, sem perguntar à pessoa.
A que pede um dado que nenhum cobre leva a dúvida de volta a `definir-requisito-de-compra`, com a pergunta à pessoa. A foto do item segue `anexar-arquivo-no-whatsapp`, com o sim da pessoa.

### Passo 3

Quando a compra é por quantidade, a empresa tem um pedido mínimo (MOQ), e a primeira mensagem o pergunta a cada uma. O mínimo que a empresa responde vai para as notas da página dela, com a data.
O mínimo de uma empresa não vale para outra e não decide a quantidade da pessoa. Quando o mínimo da empresa passa da quantidade necessária, diga à pessoa o excesso que sobraria.

Quando o insumo é para peças que a própria marca produz, como etiqueta ou embalagem, a quantidade a orçar vem das unidades dessas peças: as produzidas mais as previstas, menos as já vendidas.
Leia essas contagens nos dados do projeto, seguindo `gerenciar-estoque`, e leve o total à pessoa para confirmar antes do envio. A mensagem leva essa quantidade, e nunca um número tirado de costume, de memória ou do mínimo de outra empresa.

### Passo 4

A mensagem diz à empresa só o que ela precisa para orçar e a disponibilidade da pessoa: quando ela pode retirar ou levar. Não conte que a pessoa viaja, onde está nem quando chega.
Confira a disponibilidade no momento do envio, na viagem de `definir-viagem` e no que a pessoa disse hoje, porque uma frase dita horas antes pode ter deixado de valer.

Uma mensagem enviada com dado errado ou a mais se corrige editando-a, não mandando outra. Se não der, diga à pessoa quais empresas ficaram assim.

### Passo 5

A empresa recebe cada informação num canal só. Quando uma pessoa da empresa já respondeu no WhatsApp, a conversa segue nesse chat, e o mesmo texto não vai também ao chat geral da empresa.
Antes de enviar a mesma informação a dois chats da mesma empresa, leia o que já foi dito em cada um e mande só o que falta, no chat onde a resposta já começou.

Quando a empresa responde, leia a resposta e responda com os fatos que já se sabe, sem pedir à pessoa o que a conversa já tem. Delegue a leitura e a resposta à habilidade de conversa.
Só leve à pessoa a decisão que é dela: aceitar preço ou orçamento, pagar, combinar data e hora de retirada ou entrega, e passar dado pessoal ou fiscal. Nesses casos, diga as palavras da empresa e a opção que você recomenda.
O orçamento que chega segue `definir-orcamento-de-fornecedor`. A recusa se registra como `definir-negociacao` manda, no mesmo turno.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Empresa deixada sem contato por ter só telefone fixo

Se você deixar sem mensagem a empresa cujo site traz só telefone fixo, ela fica fora da rodada embora tenha e-mail ou formulário, e a pessoa descobre depois.

1. Procure o e-mail e o formulário no site.
2. Prepare a mensagem para esse canal, com o mesmo texto das outras e o sim da pessoa.
3. Só sem nenhum canal de texto a ligação entra, como último recurso, e a resposta diz isso.

### Cotação sem CNPJ e e-mail

Se você enviar a cotação sem o CNPJ e o e-mail de quem compra, a empresa pergunta os dois antes de orçar e a resposta atrasa.

1. Leia o CNPJ e o e-mail na página da `Empresa de quem compra`, na lista de empresas do projeto.
2. Não os peça à pessoa: a página tem os dois.
3. Ponha os dois no fim da mensagem.

### Mesma informação em dois chats da empresa

Se você mandar o mesmo texto ao chat geral da empresa e ao da pessoa que já respondeu, a empresa lê duas vezes e responde em dois lugares, e a conversa se divide.

1. Leia os dois chats antes de enviar.
2. Siga no chat onde a pessoa da empresa já respondeu e mande só o que falta.
3. Registre a troca na discussão da empresa, como `definir-negociacao` manda.

### Empresa consultada sem a especificação

Se você contatar a empresa antes de fechar a especificação, ela pergunta o que a pessoa ainda não decidiu e abre uma segunda rodada.

1. Feche a especificação com `definir-requisito-de-compra`.
2. Leve na primeira mensagem o material, o formato, a medida, a quantidade e o prazo.

### Mínimo de uma empresa tomado como quantidade

Se você usar o mínimo de uma empresa como a quantidade a orçar, a pessoa compra mais do que precisa e a outra empresa orça outro número.

1. Calcule a quantidade pelas unidades das peças, como o Passo 3 manda.
2. Pergunte o mínimo a cada empresa e diga o excesso que sobraria.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### peça cotação de etiqueta às duas gráficas que achamos

Conferi o cadastro, o rótulo e a nota de cada empresa, li as conversas antigas e preparei uma mensagem por empresa, com o item, a medida, a quantidade confirmada, o pedido mínimo, o CNPJ e o e-mail de quem compra. Peguei o sim da pessoa a todas antes de enviar.

### a gráfica já respondeu no chat do atendente, e o chat geral ainda não tem nada

Segui no chat do atendente e mandei só o que faltava. Não repeti o texto no chat geral da empresa.

## Casos-limite

- A empresa só tem telefone fixo: use o e-mail ou o formulário. Ligue só sem canal de texto.
- A página da empresa de quem compra não tem o CNPJ ou o e-mail: procure no site, no perfil e nas notas fiscais, e peça à pessoa só o que continuar faltando.
- A empresa pede um dado que a especificação não cobre: volte a `definir-requisito-de-compra`.
- O mínimo da empresa passa da quantidade necessária: diga o excesso à pessoa, sem mudar a quantidade.
- A mensagem saiu com dado a mais: edite a mensagem e não mande outra.

## Pegadinhas

- A mesma informação parece mais segura em dois chats da empresa. Ela é lida duas vezes e respondida em dois lugares: siga no chat onde a pessoa da empresa já respondeu.
- A empresa que pergunta o CNPJ e o e-mail mostra que a cotação saiu sem eles. Leve os dois em toda mensagem, lidos da página de quem compra, sem perguntar à pessoa.
- O mínimo de uma empresa parece o padrão do mercado. Ele vale só para ela e não decide a quantidade da pessoa.
- Uma frase dita horas antes sobre a disponibilidade pode ter deixado de valer. Confira no momento do envio.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
