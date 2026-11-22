---
name: publicar-produto-fisico-na-loja-virtual
description: Publica e corrige um produto físico na loja virtual, com título, slug, descrição, variantes, estoque e prontidão para venda e marcação em post. Usada quando o produto vai à loja virtual ou precisa de correção lá, mesmo sem dizer loja. NÃO serve para cadastrar o produto, registrar o preço, movimentar estoque, vender no ponto de venda físico nem escrever o post.
metadata:
  author: jimmyandrade
  version: "0.5.0"
  aliases:
    - definir-produto-na-loja
  related:
    - registrar-preco-de-produto-fisico
    - gerenciar-estoque
    - identificar-duplicata
    - redigir-com-tom-de-voz
    - evoluir-habilidade
---

# Publicar produto físico na loja virtual

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Canais exigidos` lista os canais de venda onde o produto precisa estar publicado para ser marcado num post. Vazio, nenhum canal é exigido.
"Canais exigidos": []
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

O registro de produtos do projeto manda: nome completo, variantes, preço e estoque saem dele, e a loja é o destino. Sem o registro, pergunte uma vez. Não invente nome, tamanho, preço, SKU nem quantidade.

Ache o produto do registro pelo título e pelas Variações de nome, com `identificar-duplicata`, e pelo SKU quando houver. Produto renomeado guarda o nome antigo nas variações, e olhar só o título diz que ele não existe.

Antes de gravar, leia o produto na loja. Mostre a diferença entre o registro e a loja e grave só o que a pessoa pediu.

Antes de criar um produto, procure na loja o que pode ser o mesmo, seguindo `identificar-duplicata`: pelo nome completo, por cada palavra marcante dele, pelas variações de nome do registro, pelo slug e pelo tipo, também em rascunho e arquivado. Achado um candidato, mostre o link e pergunte antes de criar. A resposta diz o que foi buscado e o que apareceu, mesmo quando nada apareceu.

### Passo 2

O título da loja é o nome completo do produto no registro. Um título mais curto que o nome do registro é divergência: mostre e proponha o alinhamento.

O título mantém a grafia do registro, com as maiúsculas internas, como em tanGa. Um canal que normaliza o nome, como o catálogo da maquininha, fica com a grafia dele, e a resposta diz isso.

### Passo 3

O slug é adequado quando deriva do nome completo do produto, em minúsculas, ASCII, kebab-case, sem palavra cortada, sem número de id e igual ao slug do registro, quando ele existe. Alerte antes de gravar um slug fora disso e mostre o slug proposto. Alerte também quando o slug que já está na loja diverge do nome, como o que omite uma palavra do nome.

Ao trocar o slug de um produto que já tem endereço público, crie o redirecionamento do endereço antigo para o novo na mesma chamada. Sem ele, os links já publicados quebram.

Cada endereço anterior continua valendo. Quando o slug troca de novo, aponte direto para o endereço novo os redirecionamentos que já existiam, sem cadeia de um endereço para outro. Atualize também o slug e o link do produto no registro.

### Passo 4

Cada eixo de variação, como o tamanho, é uma opção do produto. Preço e SKU de cada variante seguem o registro.

Toda variante leva SKU, vindo da variante do registro, em cada lançamento e em cada correção. Variante sem SKU na loja é pendência: corrija na hora e diga o que gravou. Preço novo ou mudança de preço seguem `registrar-preco-de-produto-fisico`.

### Passo 5

Defina o estoque de cada variante e local com a quantidade do registro. Quando a loja ou o registro divergem de uma quantidade, pergunte qual vale antes de gravar. Movimento de entrada ou saída segue `gerenciar-estoque`.

Variante prevista no registro, sem unidade cortada nem produzida, pode entrar na loja com estoque zero, para mostrar a disponibilidade futura. Isso não é divergência de estoque: diga que a variante é prevista e que o zero é esperado.

### Passo 6

Os atributos do produto no registro, como cuidados, características e comprimento, vão para os campos de atributo da categoria na loja, com as entradas que já existem lá. Não crie entrada nova sem a pessoa. Um atributo que falta no registro é gravado primeiro no registro, ou a resposta diz que falta. Um atributo que a categoria não aceita fica na descrição, e a resposta diz qual ficou fora dos campos.

### Passo 7

O produto está pronto para venda e para marcação num post quando:

- [ ] Tem ao menos uma foto aprovada pela pessoa.
- [ ] A descrição foi aprovada pela pessoa. Sugestão da IA não aprovada não é gravada.
- [ ] O título e o slug passaram pelos Passos 2 e 3.
- [ ] O status está ativo, e cada variante tem preço, SKU e estoque.
- [ ] O produto está publicado em cada canal de `Canais exigidos`.

A lista vale também quando a pessoa pede para ativar ou publicar. Com item faltando, não ative nem publique em canal: o produto fica em rascunho. Complete antes o que o registro já tem, como título, preço, SKU, estoque, tipo, atributos e a descrição aprovada, e diga o que falta e quem faz. Ative quando a lista estiver completa.

Diga o que falta. Um canal que um aplicativo gerencia, como o do Instagram, não publica por API: peça à pessoa que o faça no painel da loja e avise que a sincronização com a rede leva tempo.

### Passo 8

Quando a descrição do produto muda no registro, valide o texto novo contra o vocabulário, com `redigir-com-tom-de-voz`, antes de gravar, e sincronize a descrição com o produto na loja na mesma passada. Produto que ainda não está na loja: diga que não há o que sincronizar.

### Passo 9

Na resposta, mande o link de cada produto criado ou alterado: o do painel da loja e, com o produto ativo, o endereço público.

### Passo 10

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Slug que corta o nome

Se você aceitar um slug sem uma palavra do nome do produto, o endereço, o link do post e o registro dizem coisas diferentes.

1. Derive o slug do nome completo.
2. Mostre o alerta e o slug proposto antes de gravar.

### Slug trocado sem redirecionamento

Se você trocar o slug de um produto já divulgado sem redirecionar, os links antigos dão erro.

1. Troque o slug com o redirecionamento do antigo para o novo.
2. Confira o endereço novo depois.

### Produto achado só pelo título

Se você buscar o produto da loja pelo título e disser que ele não está no registro, um produto renomeado fica sem par, e o histórico e o preço vão para o lugar errado.

1. Busque também nas Variações de nome e pelo SKU.
2. Só diga que o produto não existe depois dessas buscas.

### Variante sem SKU

Se você publicar ou corrigir o produto e deixar uma variante sem SKU, a loja e o registro deixam de se encontrar pelo SKU.

1. Leia o SKU da variante no registro e grave na variante da loja.
2. Releia a variante e diga o que gravou.

### Produto marcado sem estar pronto

Se você disser que o produto pode ser marcado no post sem conferir o Passo 7, a marcação falha na hora da publicação.

1. Rode a lista do Passo 7.
2. Diga cada item que falta e quem faz.

### Descrição alterada sem sincronizar

Se você grava a descrição nova no registro e não a leva à loja, o texto da loja diz outra coisa que o do registro.

1. Valide o texto contra o vocabulário antes de gravar.
2. Leia o produto na loja e grave a descrição nova na mesma passada.
3. Produto fora da loja: diga que não há o que sincronizar.

### Produto criado em duplicata

Se você criar um produto sem procurar o que já está na loja, a loja fica com duas páginas da mesma peça, com estoque e links divididos.

1. Antes de criar, procure por nome, palavras do nome, variações, slug e tipo, também em rascunho e arquivado.
2. Achado um candidato, mostre o link e pergunte.
3. Diga na resposta o que buscou e o que apareceu.

### Produto ativado com a lista incompleta

Se você ativar o produto e publicá-lo em canal sem a foto aprovada, a descrição aprovada ou outro item do Passo 7, a loja mostra uma página vazia a quem compra, mesmo que a pessoa tenha pedido para ativar.

1. Rode a lista do Passo 7 antes de ativar, também quando o pedido é só ativar.
2. Com item faltando, mantenha o rascunho, complete o que o registro já tem e diga o que falta e quem faz.
3. Ative e publique quando a lista estiver completa.

### Resposta sem link

Se você disser que criou ou alterou um produto sem mandar o link, a pessoa precisa procurar o produto para conferir.

1. Mande o link do painel de cada produto.
2. Com o produto ativo, mande também o endereço público.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### ativa o Cropped Nadador tanGa

Conferi o Passo 7: o produto não tinha foto aprovada nem descrição aprovada. Mantive o rascunho, completei título, preço, SKU e estoque do registro e disse que faltavam a foto e a descrição e quem aprova cada uma. Não ativei nem publiquei em canal.

### use "calca-dupla-nhee" como slug da Calça Dupla Face nhEe

Alertei que o slug omite "face", propus `calca-dupla-face-nhee`, troquei com o redirecionamento do antigo e confirmei o endereço novo. O título curto da loja ficou como divergência para a pessoa decidir.

## Casos-limite

- O registro não tem slug: derive do nome completo e mostre antes de gravar.
- O slug adequado já existe em outro produto: pergunte. Não acrescente sufixo de número em silêncio.
- A pessoa insiste num slug fora da regra: grave com o alerta dito, sem repetir a objeção.
- O produto não tem foto, ou outro item do Passo 7 falta: deixe em rascunho e diga o que falta. Vale também quando a pessoa pediu para ativar.
- A quantidade do registro e a da loja divergem: pergunte qual vale.
- A busca acha um produto parecido de outra peça: mostre o link e diga por que parece outra, sem criar nem apagar.
- A categoria não aceita um atributo do registro: deixe o atributo na descrição e diga qual ficou fora.
- O nome da loja não bate com o título do registro: procure nas Variações de nome e pelo SKU antes de dizer que o produto não existe.
- A variante é só prevista, sem unidade produzida: pode entrar com estoque zero. Não pergunte qual quantidade vale.
- A variante da loja não tem SKU: grave o do registro, e sem SKU no registro pergunte.

## Pegadinhas

- O estoque zero numa variante parece produto esgotado. Pode ser variante prevista, que mostra a disponibilidade futura e ainda não foi produzida.
- A loja aceita variante sem SKU e não acusa erro. O SKU é o que liga a variante ao registro.
- Um produto pode estar na loja sem estar à venda: o status não ativo o esconde, e a marcação em post exige o produto ativo e publicado no canal.
- O canal do Instagram é gerenciado por aplicativo: a publicação por API não acusa erro, mas também não o publica.
- A API de estoque atual exige uma chave de idempotência em cada gravação. Sem ela, a chamada falha.
- O nome do canal de venda pelo campo antigo de nome está obsoleto: leia o título do catálogo.

- A busca pelo título exato parece bastar. A mesma peça pode estar na loja com outro nome, outra grafia ou só no conjunto: busque também pelas palavras do nome e pelo tipo.
- O campo de atributo com o mesmo nome parece valer para toda categoria. Cada categoria aceita só os seus: a gravação de um campo de outra categoria falha.

- O pedido de ativar parece dispensar a lista do Passo 7. Ele não dispensa: um produto ativo e publicado sem foto nem descrição aprovadas aparece vazio na loja.
- O título da loja parece poder seguir a grafia que o canal devolve. Ele segue a do registro, como tanGa, mesmo que outro canal troque as maiúsculas.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
