---
name: definir-estampa
description: Use essa habilidade sempre que chegar a foto ou a descrição de um tecido estampado, ou for cadastrar, corrigir ou ligar uma estampa a um tecido, mesmo sem dizer estampa. NÃO use para cadastrar o tecido, a composição, a aplicação nem o produto.
allowed-tools: notion:notion-ai-search notion:notion-fetch notion:notion-query-data-sources notion:notion-create-pages notion:notion-update-page
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-composicao-textil
    - definir-tecido
    - evoluir-habilidade
    - identificar-duplicata
---

# Definir estampa

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Modo de aprendizado": "perguntar"
# Nomes de banco e de campo: o projeto define. Vazios, procure no workspace conectado antes de perguntar.
# `Banco de estampas`: uma página por estampa, ligada ao tecido.
"Banco de estampas": ""
# `Campo da foto da estampa`: campo de arquivo que guarda a foto da estampa.
"Campo da foto da estampa": ""
# `Data de corte da cobrança`: a estampa criada antes dela não é cobrada do que falta. Vazia, toda estampa é cobrada.
"Data de corte da cobrança": ""
```

## Instruções

### Passo 1

A estampa é do tecido. Ela se liga ao tecido que a tem e nunca ao produto nem à variante: a variante chega à estampa pelo tecido dela. Um tecido que falta é cadastrado por `definir-tecido` antes da estampa.

Os nomes vêm das instruções do projeto. Com `Banco de estampas` vazio, procure o banco por conta própria no workspace conectado, pelo nome e pelas propriedades (estampa, motivo, foto). Achou um só, use-o e diga qual. Achou mais de um de nome igual ou parecido, confirme com a pessoa qual é. Não achou nenhum, peça que ela informe o banco ou sugira criá-lo, e não crie sem o sim. Não mude a estrutura do banco.

### Passo 2

Leia de novo o `Banco de estampas` agora, filtrado pelo nome e pelo motivo. Antes de criar, busque com `identificar-duplicata`. Se a estampa já existe, reaproveite-a e ligue ao tecido, sem criar outra.

O motivo, como uma flor, é um campo da estampa. Uma aplicação do mesmo motivo é outro registro, e a estampa não se relaciona com ela.

Uma flor pode ser a estampa de um tecido ou uma aplicação numa variante, e a aplicação de uma variante pode parecer a estampa do tecido de outra. Confira qual é antes de cadastrar: estampa é do tecido, aplicação é da variante.

### Passo 3

Cadastre a estampa com o nome, o motivo, a foto e o tecido. Os nomes das propriedades vêm do mapeamento de dados do projeto. A foto vai em `Campo da foto da estampa`. Com o campo vazio, procure no banco o campo de arquivo que serve: um só, use-o e diga qual; mais de um, confirme; nenhum, sugira criar o campo e não crie sem o sim.

Outra estampa na variante é outro tecido: cadastre a estampa no outro tecido e deixe a do tecido antigo como está. Corrigir uma estampa ligada a mais de um tecido muda todos eles, então avise antes de gravar.

### Passo 4

Cobre da pessoa o que falta de cada estampa nova. Estampa nova é a criada depois de `Data de corte da cobrança`. Pergunte o nome, o motivo e o que mais o banco pede, e exija a foto. Não invente o que a foto não mostra.

Sem a foto, a estampa fica pendente: diga o que falta. A estampa criada antes da data de corte não é cobrada e o que falta nela não vira pendência, porque muitas estampas antigas não têm foto isolada.

### Passo 5

Na resposta, dê o link de cada estampa criada ou mudada e do tecido ligado, e diga o que ficou pendente.

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Estampa ligada ao produto

Se você ligar a estampa ao produto ou à variante, outra variante do mesmo produto com outra estampa fica errada.

1. Ligue a estampa ao tecido.
2. A variante chega à estampa pelo tecido dela.

### Estampa criada sem buscar

Se você criar a estampa sem buscar, o banco fica com duas para o mesmo desenho.

1. Leia o banco de novo pelo nome e pelo motivo.
2. Busque com `identificar-duplicata`.
3. Reaproveite a que existe.

### Foto inventada

Se você gravar a estampa sem a foto como se estivesse completa, o cadastro parece pronto sem estar.

1. Cobre a foto.
2. Deixe a estampa pendente até ela chegar.

### Nome de banco inventado

Se você usar um nome de banco que o projeto não definiu, a escrita cai no banco errado.

1. Leia `Banco de estampas` nas instruções do projeto.
2. Vazio, procure o banco no workspace conectado.
3. Com mais de um parecido, confirme. Sem nenhum, peça ou sugira criar.
4. Não invente um nome.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Esta é a foto do tecido novo, com flores de papoula

Busquei a estampa pelo nome e pelo motivo e não achei. Perguntei o nome e o que a foto não mostra, cadastrei a estampa com a foto e a liguei ao tecido. Não liguei a estampa ao produto.

### Essa estampa de flores já existe?

Li o banco pelo nome e pelo motivo. A estampa existia: reaproveitei e liguei ao novo tecido, sem criar outra.

## Casos-limite

- O tecido não está cadastrado: cadastre-o por `definir-tecido` antes.
- A estampa é antiga e não tem foto: não cobre, se for anterior à data de corte.
- A estampa serve a mais de um tecido: corrija com aviso, porque a correção vale para todos.
- Um parâmetro de banco ou de campo está vazio nas instruções do projeto: procure no workspace conectado, confirme se houver ambiguidade e, sem nada, peça ou sugira criar.

## Pegadinhas

- O produto parece o dono da estampa. O dono é o tecido, e a variante chega a ela pelo tecido.
- Estampa e aplicação do mesmo motivo parecem uma coisa só. São registros independentes.
- Uma flor parece sempre estampa. Pode ser aplicação, e a aplicação de uma variante pode parecer a estampa do tecido de outra: confira qual é.
- Uma correção parece valer para um tecido só. Vale para todos os que usam a estampa.
- A foto do tecido não é a foto da estampa isolada. Muitas estampas antigas só têm a foto da peça.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
