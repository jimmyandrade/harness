---
name: definir-aplicacao-textil
description: Use essa habilidade sempre que for cadastrar, corrigir ou ligar uma aplicação, como um bordado ou um patch, a uma variante, ou chegar a foto de uma aplicação, mesmo sem dizer aplicação. NÃO use para cadastrar a estampa, o tecido, a composição nem o produto.
allowed-tools: notion:notion-ai-search notion:notion-fetch notion:notion-query-data-sources notion:notion-create-pages notion:notion-update-page
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  aliases:
    - definir-aplicacao
  related:
    - definir-composicao-textil
    - definir-estampa
    - evoluir-habilidade
    - identificar-duplicata
---

# Definir aplicação têxtil

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Modo de aprendizado": "perguntar"
# Nomes de banco e de campo: o projeto define. Vazios, procure no workspace conectado antes de perguntar.
# `Banco de aplicações`: uma página por aplicação, ligada às variantes que a têm.
"Banco de aplicações": ""
# `Campo da foto da aplicação`: campo de arquivo que guarda a foto da aplicação.
"Campo da foto da aplicação": ""
# `Data de corte da cobrança`: a aplicação criada antes dela não é cobrada do que falta. Vazia, toda aplicação é cobrada.
"Data de corte da cobrança": ""
# `Limite de caracteres do texto da etiqueta`: o tamanho máximo do texto de override. Vazio, pergunte uma vez e não escolha um número.
"Limite de caracteres do texto da etiqueta": ""
```

## Instruções

### Passo 1

A aplicação é da variante. Ela vai por cima de um tecido e muda de uma variante para outra, então não se liga ao produto nem ao tecido. A propriedade da variante é opcional e aceita de 0 a N registros: uma variante sem aplicação é válida.

Os nomes vêm das instruções do projeto. Com `Banco de aplicações` vazio, procure o banco por conta própria no workspace conectado, pelo nome e pelas propriedades (aplicação, motivo, técnica, foto). Achou um só, use-o e diga qual. Achou mais de um de nome igual ou parecido, confirme com a pessoa qual é. Não achou nenhum, peça que ela informe o banco ou sugira criá-lo, e não crie sem o sim. Não mude a estrutura do banco.

### Passo 2

Leia de novo o `Banco de aplicações` agora, filtrado pelo nome e pelo motivo. Antes de criar, busque com `identificar-duplicata`. Se a aplicação já existe, reaproveite-a e ligue à variante, sem criar outra. A mesma aplicação pode estar em mais de uma variante.

O motivo, como uma flor, é um campo da aplicação. Uma estampa do mesmo motivo é outro registro, e a aplicação não se relaciona com ela.

Uma flor pode ser a estampa de um tecido ou uma aplicação numa variante, e a aplicação de uma variante pode parecer a estampa do tecido de outra. Confira qual é antes de cadastrar: aplicação é da variante, estampa é do tecido, cadastrada por `definir-estampa`.

### Passo 3

Cadastre a aplicação com o nome, o motivo, a técnica, a foto e as variantes. Os nomes das propriedades vêm do mapeamento de dados do projeto. A foto vai em `Campo da foto da aplicação`. Com o campo vazio, procure no banco o campo de arquivo que serve: um só, use-o e diga qual; mais de um, confirme; nenhum, sugira criar o campo e não crie sem o sim.

A aplicação não é tecido e não vira linha de composição de tecido. Se ela vai na etiqueta é decisão do cadastro: pergunte à pessoa e registre a resposta no campo que o mapeamento do projeto define para isso. Sem o campo, sugira criá-lo e não crie sem o sim. Não decida sozinha. Corrigir uma aplicação ligada a mais de uma variante muda todas elas, então avise antes de gravar.

O texto que a aplicação mostra na etiqueta é o padrão do projeto, pré-gerado fora desta habilidade, e você nunca o escreve. Um campo opcional do cadastro, que o mapeamento do projeto nomeia, guarda um texto curto que o substitui. Vazio, vale o padrão.

O override é exceção. Só o ofereça quando a pessoa pedir um texto específico, avise que ele foge do padrão e grave o que ela escreveu, sem redigir. Compare com `Limite de caracteres do texto da etiqueta`: acima do limite, recuse e peça uma redação menor, sem cortar. Limite vazio: pergunte uma vez. Sem o campo no banco, sugira criá-lo e não crie sem o sim.

### Passo 4

Cobre da pessoa tudo sobre cada aplicação nova. Aplicação nova é a criada depois de `Data de corte da cobrança`. Pergunte o nome, o motivo, a técnica e o que mais o banco pede, e exija a foto. Não invente o que a foto não mostra.

Sem a foto, a aplicação fica pendente: diga o que falta. A aplicação criada antes da data de corte não é cobrada e o que falta nela não vira pendência, porque muitas já estão aplicadas nas variantes e não têm foto isolada.

### Passo 5

Na resposta, dê o link de cada aplicação criada ou mudada e de cada variante ligada, e diga o que ficou pendente.

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Aplicação ligada ao produto

Se você ligar a aplicação ao produto, todas as variantes parecem tê-la, inclusive a que não tem.

1. Ligue a aplicação à variante.
2. Uma variante sem aplicação fica com a propriedade vazia.

### Aplicação criada sem buscar

Se você criar a aplicação sem buscar, o banco fica com duas para o mesmo bordado.

1. Leia o banco de novo pelo nome e pelo motivo.
2. Busque com `identificar-duplicata`.
3. Reaproveite a que existe.

### Foto inventada

Se você gravar a aplicação sem a foto como se estivesse completa, o cadastro parece pronto sem estar.

1. Cobre a foto.
2. Deixe a aplicação pendente até ela chegar.

### Nome de banco inventado

Se você usar um nome de banco que o projeto não definiu, a escrita cai no banco errado.

1. Leia `Banco de aplicações` nas instruções do projeto.
2. Vazio, procure o banco no workspace conectado.
3. Com mais de um parecido, confirme. Sem nenhum, peça ou sugira criar.
4. Não invente um nome.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Este colete tem uma aplicação de flores bordadas

Busquei a aplicação pelo nome e pelo motivo e não achei. Perguntei o nome, o motivo, a técnica e o que a foto não mostra, cadastrei a aplicação com a foto e a liguei à variante. A variante sem bordado do mesmo colete ficou sem aplicação.

### A mesma aplicação vai em duas variantes

Li o banco pelo nome e pelo motivo. A aplicação existia: reaproveitei e liguei às duas variantes, sem criar outra.

## Casos-limite

- A variante não tem aplicação: deixe vazio. Não exija uma.
- A aplicação é antiga e não tem foto: não cobre, se for anterior à data de corte.
- A aplicação serve a mais de uma variante: corrija com aviso, porque a correção vale para todas.
- Um parâmetro de banco ou de campo está vazio nas instruções do projeto: procure no workspace conectado, confirme se houver ambiguidade e, sem nada, peça ou sugira criar.

## Pegadinhas

- O produto parece o dono da aplicação. O dono é a variante.
- Aplicação e estampa do mesmo motivo parecem uma coisa só. São registros independentes.
- Uma flor parece sempre estampa. Pode ser aplicação, e a aplicação de uma variante pode parecer a estampa do tecido de outra: confira qual é.
- A aplicação sobre o tecido parece parte dele. Ela não é tecido nem vira linha de composição de tecido. Se vai na etiqueta, a pessoa decide.
- O override parece rotina. É exceção, e o padrão do projeto vale quando o campo está vazio.
- A foto da peça pronta não mostra a aplicação isolada. Muitas aplicações antigas só têm a foto da peça.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
