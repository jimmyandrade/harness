---
name: definir-tecido
description: Use essa habilidade sempre que chegar uma ficha técnica, uma etiqueta ou a composição de um tecido, para cadastrar, corrigir ou completar o tecido, com uma página por cor, a composição em percentuais e a ficha anexada, mesmo sem dizer cadastro. NÃO use para mover o estoque, lançar a compra nem acompanhar a produção do produto.
allowed-tools: notion:notion-ai-search notion:notion-fetch notion:notion-query-data-sources notion:notion-create-pages notion:notion-update-page
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.6.0"
  related:
    - acompanhar-producao-de-produto
    - definir-composicao-textil
    - definir-estampa
    - definir-tarefa
    - evoluir-habilidade
    - gerenciar-estoque
    - identificar-duplicata
    - procurar-banco-de-dados
---

# Definir tecido

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Modo de aprendizado": "perguntar"
# Nomes de banco e de campo: o projeto define. Vazios, use `procurar-banco-de-dados` antes de perguntar.
# `Banco de tecidos`: uma página por tecido e cor, ligada à empresa e à composição.
"Banco de tecidos": ""
# `Banco de composição`: uma linha por percentual e fibra, como `88% PES`.
"Banco de composição": ""
# `Banco de estampas`: uma página por estampa, que a página do tecido liga.
"Banco de estampas": ""
# `Campo do arquivo da ficha`: campo de arquivo do cadastro de tecidos que guarda o PDF da ficha. Vazio, o PDF vai no corpo da página, ou onde o sistema de cadastro usa para anexos.
"Campo do arquivo da ficha": ""
# `Campo da foto do tecido`: campo de arquivo que guarda a foto do tecido. Vazio, use `procurar-banco-de-dados` para achar o campo de arquivo do banco.
"Campo da foto do tecido": ""
# `Data de corte para cadastro completo`: o tecido criado antes dela não é cobrado do que falta. Vazia, todo tecido é cobrado.
"Data de corte para cadastro completo": ""
# `Siglas das fibras`: a sigla de cada fibra no nome da linha de composição.
"Siglas das fibras": {"algodão": "CO", "viscose": "CV", "poliéster": "PES", "poliamida": "PA", "elastano": "PUE", "linho": "LI", "seda": "SE"}
```

## Instruções

### Passo 1

Peça a ficha técnica ou a etiqueta e o fornecedor. Sem a ficha à mão, procure antes de pedir ao fornecedor: a cotação e a despesa da compra, a nota fiscal, as páginas dos produtos que usam o tecido, as fotos do tecido, as conversas com o fornecedor, inclusive os documentos delas, e o e-mail.

Mostre o que achou, com o link de cada fonte, e redija o pedido ao fornecedor só com o que faltar.

Os nomes dos bancos vêm das instruções do projeto. Com `Banco de tecidos` ou `Banco de composição` vazio, use `procurar-banco-de-dados` para cada um, dizendo que o primeiro guarda tecidos por cor e o segundo as linhas de composição por fibra. Não mude a estrutura de nenhum dos dois.

Leia o arquivo inteiro. Uma ficha de nota fiscal traz vários tecidos, cada um a partir de um cabeçalho de dados técnicos com o código e o nome do tecido. De cada tecido da ficha, tire o código, o nome, a composição, a largura, a gramatura, o rendimento, o encolhimento e os cuidados de lavar, passar e costurar.

### Passo 2

Leia de novo agora o `Banco de tecidos` filtrado pela empresa e pelo nome do tecido. A pessoa pode ter renomeado ou criado páginas desde a última leitura. Antes de criar uma página, busque com `identificar-duplicata`.

Cada cor de um tecido da ficha é uma página: o mesmo tecido em duas cores são duas páginas, com a mesma composição e a mesma ficha. Pergunte a cor que a ficha não diz. O nome segue o das páginas vizinhas, com o nome do tecido e a cor. A página leva a empresa.

A estampa é do tecido, não do produto: a página do tecido liga a estampa, e a variante do produto chega a ela pelo tecido. Pergunte qual é a estampa quando o tecido parece estampado e a ficha não diz. Estampa que falta em `Banco de estampas`, ou com o banco vazio, pergunte antes de criar, por `definir-estampa`. Não grave a estampa no produto nem na variante.

Monte o plano numa tabela antes de gravar: página, ação (criar, corrigir ou completar), composição de agora e composição da ficha. Mostre o plano e siga.

### Passo 3

A composição é a relação com linhas do `Banco de composição`, uma por fibra. O nome da linha é o percentual com ponto decimal e a sigla de `Siglas das fibras`, como `90.5% CO`. O percentual da fibra é a fração, como 0,905, e a linha liga a fibra. Use a linha que já existe com o mesmo nome e a mesma fibra. Crie só a que falta.

```mermaid
flowchart LR
  Q{A composição registrada é?} -->|vazia| G[Grava a da ficha]
  Q -->|igual à ficha| N[Nada muda]
  Q -->|diferente e o tecido é o da ficha| C[Corrige pela ficha e avisa]
  Q -->|diferente e veio de outra compra| M[Mantém, comenta e abre a tarefa por definir-tarefa]
```

Quando o tecido registrado veio de outra compra, como uma etiqueta antiga, a composição dele fica como está. Comente no tecido o que diverge e por quê, e abra a tarefa de conferência por `definir-tarefa`, com o link da tarefa no comentário.

### Passo 4

Leia o corpo de cada página antes de anexar. Se ela já tem a seção da ficha, atualize essa seção e não crie outra. Sem a seção, escreva no fim da página um título com o fornecedor, uma linha com o código, a nota fiscal e a data da ficha, e uma lista curta com a composição, as medidas, os cuidados e o alerta do fornecedor.

O PDF vai em `Campo do arquivo da ficha`, e o resumo diz que ele está lá. Com o parâmetro vazio, ou sem esse campo no cadastro, o PDF vai no fim do resumo. O mesmo PDF fica num lugar só. Cada página recebe o próprio envio do arquivo.

Na resposta, dê o link de cada página e de cada linha de composição criada, e a divergência que cabe à pessoa conferir.

### Passo 5

Antes de encerrar, cobre da pessoa o que falta de cada tecido novo. Tecido novo é o criado depois de `Data de corte para cadastro completo`. Não grave como completo o que está incompleto.

- [ ] A composição, quando nem a ficha nem a etiqueta a trazem.
- [ ] Os dados técnicos que a ficha não traz: largura, gramatura, rendimento, encolhimento e cuidados.
- [ ] A foto do tecido, em `Campo da foto do tecido`, para cadastrar a estampa dele.

Com a foto de um tecido estampado, cadastre a estampa por `definir-estampa`, ligada ao tecido. Sem a foto, o tecido fica pendente: diga o que falta e não invente. O tecido criado antes da data de corte não é cobrado e o que falta nele não vira pendência, porque a foto e a ficha de muitos tecidos antigos não existem.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Ficha pedida sem procurar

Se você redigir o pedido da ficha ao fornecedor depois de olhar só o e-mail, o pedido repete o que a cotação, o produto ou a conversa já respondem.

1. Procure em cada fonte do Passo 1.
2. Mostre o que achou e o que falta.
3. Peça ao fornecedor só o que falta.

### Seção da ficha duplicada

Se você anexar a ficha sem ler a página, ela fica com duas seções iguais quando outra sessão já anexou.

1. Leia o corpo da página antes.
2. Atualize a seção que existe.

### Composição trocada entre tecidos

Se você copiar a composição de outra página do mesmo fornecedor, a variante sai com a etiqueta errada.

1. Leia a composição no tecido da ficha, pelo código.
2. Confira cada página do plano contra o tecido dela.

### Página renomeada no meio da tarefa

Se você gravar pelo que leu no começo da conversa, a escrita desfaz o que a pessoa mudou.

1. Leia o banco de novo antes do plano.
2. Siga os nomes de agora.

### Divergência corrigida sem perguntar a origem

Se você corrigir a composição de um tecido que veio de outra compra, o registro certo vira o errado.

1. Pergunte se o tecido registrado é o tecido da ficha.
2. De outra compra, mantenha, comente e abra a tarefa.

### Nome de banco inventado

Se você usar um nome de banco que o projeto não definiu, a escrita cai no banco errado ou num que não existe.

1. Leia `Banco de tecidos` e `Banco de composição` nas instruções do projeto.
2. Vazios, use `procurar-banco-de-dados`.
3. Não invente um nome.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Estes PDFs são as fichas das notas 111 e 222 do fornecedor

Quatro tecidos: uma viscose lisa, um suede com foil, uma malha estampada em duas cores e uma malha bolha. O plano teve cinco páginas. Corrigi o suede de 100% PES para 88% PES e 12% PUE, criei a viscose lisa e as linhas 88% PES, 12% PUE, 90.5% CO e 9.5% PA, e anexei a ficha da nota de cada tecido. Um tecido registrado diverge e veio de outra compra: ficou como está, com comentário e tarefa.

### Qual a composição do tecido da etiqueta que anexei?

A etiqueta não tem ficha. Gravei a composição dela, com o link da fonte, e disse que a ficha e os cuidados ainda faltam.

## Casos-limite

- A ficha não diz a cor: pergunte. Não crie página sem cor quando o tecido tem mais de uma.
- O mesmo tecido em duas cores tem duas páginas, mas conta uma vez na etiqueta da variante, como `definir-composicao-textil` monta.
- A ficha diz que o tecido é estampado e a estampa não está em `Banco de estampas`: pergunte antes de criar.
- A fibra não tem sigla em `Siglas das fibras`: pergunte a sigla antes de criar a linha.
- A composição vem só da etiqueta, sem ficha: grave a composição e cobre a ficha e os dados técnicos.
- A composição está só na nota fiscal ou na cotação: grave com o link da fonte e cobre os cuidados que faltam.
- O tecido é de antes da data de corte e não tem foto nem ficha: não cobre e não bloqueie.
- Um banco ou o campo da foto está vazio nas instruções do projeto: use `procurar-banco-de-dados`.

## Pegadinhas

- A ficha escreve o percentual com três casas, como `90.500%`. É 90,5%.
- A ficha diz elastano e o banco usa a sigla PUE. A sigla vem de `Siglas das fibras`, não da ficha.
- O envio do arquivo ao Notion vale para um anexo só. Duas páginas com a mesma ficha pedem dois envios.
- O PDF anexado no corpo de uma página não muda de lugar sozinho quando o campo de arquivo é criado. Mova-o para o campo e tire-o do corpo.
- Num cadastro fora do Notion, o campo de arquivo pode ter outro nome ou não existir. `Campo do arquivo da ficha` decide.
- A nota fiscal e a cotação costumam trazer a composição, a largura e a gramatura, mas não os cuidados. A falta de ficha não quer dizer falta de composição.
- A foto do tecido pode ter a composição só no nome do arquivo, sem texto legível no conteúdo.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
