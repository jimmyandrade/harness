---
name: publicar-produto-fisico-no-mercado-pago
description: Cadastra e atualiza um produto físico no catálogo do Mercado Pago, usado na maquininha e no QR Code, com a foto da fonte de verdade. Usada quando um produto do registro precisa ser cobrado no ponto de venda físico. NÃO serve para cadastrar o produto, registrar o preço, lançar a venda, publicar na loja virtual nem mover estoque.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - registrar-preco-de-produto-fisico
    - publicar-produto-fisico-na-loja-virtual
    - gerenciar-estoque
    - lancar-venda
    - evoluir-habilidade
---

# Publicar produto físico no Mercado Pago

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. Valor vazio: pergunte uma vez e não escolha.
```yaml
# `Fonte da verdade das fotos` é o lugar de onde a foto do produto sai, como a loja virtual. O catálogo não guarda a foto original: ela é copiada de lá, nunca baixada e subida à mão.
"Fonte da verdade das fotos": ""
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

O registro de produtos do projeto manda: nome, descrição, preço, custo, SKU e estoque saem dele, e o catálogo do Mercado Pago é o destino. Sem o registro do produto, pergunte uma vez. Não invente nome, tamanho, preço, custo, SKU nem quantidade.

O catálogo pede, de cada produto: nome (até 60 caracteres, obrigatório), descrição (até 2500), preço de venda (obrigatório), unidade de medida (unidade, metro, litro ou quilograma), custo, SKU, código de barras (GTIN), categoria, estoque atual e alerta de estoque mínimo. Aceita uma foto só.

Diga ao fim o que o registro não tem e o catálogo aceita, como o GTIN, o alerta de estoque mínimo e a categoria. Não crie propriedade no registro para isso: informe a limitação e recomende o campo.

### Passo 2

A foto vem de `Fonte da verdade das fotos`. O catálogo aceita uma foto por produto, em jpeg, png, jpg ou webp, e não aceita mais de uma. Com várias fotos na fonte, use a principal e diga qual usou. Sem foto na fonte, cadastre sem foto e diga que falta.

O catálogo guarda cópia da foto. Foto trocada na fonte depois não chega ao catálogo sozinha: diga isso e regrave a foto quando a pessoa pedir.

### Passo 3

O formato padrão é um produto único por variante, com o tamanho no fim do nome, como o produto "Colete X P". Cada variante do registro vira um produto, com o SKU e o estoque dela.

O catálogo também tem o cadastro com variações, com até 3 atributos entre tamanho, peso, cor, sabor, voltagem, material e personalizado, e preço e estoque por variação. Só use quando a pessoa pedir: ele ainda não foi validado com um produto real. Cadastro por planilha e por XML também existem e não foram exploradas.

### Passo 4

```mermaid
flowchart LR
  A{Navegador logado no Mercado Pago?} -->|sim| B[Chamar a API da própria página]
  A -->|não| C[Pedir à pessoa que entre]
  B --> D{A chamada respondeu?}
  D -->|sim| E[Conferir no Passo 6]
  D -->|não| F[Usar o formulário da tela]
```

O catálogo não tem API pública com credencial: o painel chama endpoints do próprio domínio, autorizados pela sessão da pessoa. Chame-os de dentro da página do painel, sem clicar nem tirar captura de tela. Não leia nem copie o cookie da sessão para chamar de fora do navegador.

Os endpoints, todos no domínio do painel e com a sessão: ler um produto com `GET /products/api/products/{id}`, criar com `POST /products/api/products`, atualizar com `PUT /products/api/products/{id}`, listar com `POST /products/list/api/list/v1` e subir a foto com `POST /products/api/file-upload`, em multipart com o campo `file`, que devolve o id da foto.

O produto é um objeto com título, `family_name`, preço, custo, descrição, `picture_id`, SKU, quantidade, `unit_measure`, `type` simples e `segment` varejo. O corpo da criação segue o que a leitura devolve, e a atualização com o mesmo corpo foi validada. A criação por esse caminho ainda não foi validada: a primeira vez foi pelo formulário.

### Passo 5

Antes de criar, liste o catálogo e procure o SKU do produto. Achou: é atualização, mostre a diferença campo a campo e grave só o que a pessoa pediu. Não achou: crie. Nunca crie um segundo produto com o mesmo SKU.

O preço do catálogo é o do registro de produtos. Quando o registro, a loja virtual e o que a pessoa disse divergem, pergunte qual vale antes de gravar. O catálogo tem um preço só: desconto à vista não entra aqui. Mudança de preço segue `registrar-preco-de-produto-fisico`.

### Passo 6

Depois de gravar, releia o produto e compare cada campo com o registro. Confira a foto pelo endereço que a leitura devolve e confira a descrição, porque o formulário juntou os parágrafos sem espaço. Mostre o que gravou, com o link da lista de produtos do painel.

O estoque do catálogo é um número próprio. Ele não acompanha o registro nem a loja virtual: diga que pode divergir e que o movimento segue `gerenciar-estoque`. Venda cobrada na maquininha segue `lancar-venda`.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Foto baixada e subida à mão

Se você baixar a foto, abrir o seletor de arquivos e subir de novo, a pessoa tem trabalho que a fonte de verdade já resolvia.

1. Copie a foto direto da fonte para o catálogo, pelo endpoint de envio.
2. Diga qual foto usou quando a fonte tem várias.

### Produto duplicado

Se você criar sem procurar o SKU, o ponto de venda mostra dois produtos iguais, com estoques diferentes.

1. Liste o catálogo e procure o SKU antes de criar.
2. Achou: atualize e mostre a diferença.

### Cookie lido para chamar de fora

Se você copiar o cookie da sessão para chamar a API fora do navegador, expõe uma credencial que a pessoa não entregou.

1. Chame de dentro da página do painel.
2. Sem navegador logado, peça à pessoa que entre.

### Preço escolhido em silêncio

Se você grava o primeiro preço que achou, a maquininha cobra um valor que a pessoa não decidiu.

1. Compare o registro, a loja virtual e o que a pessoa disse.
2. Divergiu: pergunte qual vale.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### lance o Colete Asa Curta 16-bit P no Mercado Pago, com a foto do Shopify

Procurei o SKU no catálogo e não achei. Copiei a única foto da loja virtual, criei o produto "Colete Asa Curta 16-bit P" com a descrição, o preço, o custo, o SKU e 1 unidade em estoque, e reli o produto. Disse que o catálogo aceita uma foto só e que o registro não tem GTIN nem alerta de estoque mínimo.

## Casos-limite

- O produto tem várias fotos na fonte: use a principal e diga qual. O catálogo não aceita mais de uma.
- O nome passa de 60 caracteres: mostre o nome encurtado proposto e espere o sim. Não corte em silêncio.
- A descrição passa de 2500 caracteres: pergunte o que cortar.
- O SKU já existe no catálogo: atualize e mostre a diferença.
- Sem navegador logado: peça à pessoa que entre no painel.
- A pessoa pede variações, planilha ou XML: diga que não foram validados e peça o sim.

## Pegadinhas

- O catálogo parece guardar várias fotos. Ele guarda uma só, e o seletor de arquivo não aceita mais de um.
- O campo de preço do formulário parece aceitar o valor escrito de fora. Ele só aceita o que é digitado na tela, e a chamada de API não tem esse limite.
- O painel parece ter API pública para o catálogo. A documentação pública não traz um endpoint de produtos, e o painel usa endpoints do próprio domínio.
- A descrição digitada no formulário perde a quebra de parágrafo.
- A categoria não vem pronta: a pessoa cria as categorias no painel.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
