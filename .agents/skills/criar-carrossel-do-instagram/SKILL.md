---
name: criar-carrossel-do-instagram
description: Use essa habilidade sempre que for criar, revisar ou cadastrar um carrossel ou um post de imagem única no Instagram, inclusive os slides, a legenda, os créditos e as collabs, mesmo sem dizer carrossel. NÃO use para Reel, Story, cadastrar só a ideia, planejar o calendário, nem publicar o post.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  related:
    - criar-ideia-de-conteudo
    - evoluir-habilidade
    - planejar-calendario-de-conteudo
---

# Criar carrossel do Instagram

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Formato do carrossel` e `Formato da imagem única` são os nomes dos registros na lista de formatos. Vazio quer dizer que a skill busca o formato do canal Instagram nessa lista e pergunta quando acha mais de um.
"Formato do carrossel": ""
"Formato da imagem única": ""
# As especificações abaixo valem quando o registro do formato não traz o valor. Um valor definido nas instruções do projeto substitui o do registro.
"Máximo de slides": 10
"Proporção da imagem": "3:4"
"Largura mínima (px)": 1080
"Altura mínima (px)": 1440
# `Área inferior livre (%)` é a faixa da base de cada imagem que fica sem texto nem elemento importante, porque a interface do Instagram a cobre.
"Área inferior livre (%)": 20
# `Ajuste de foto fora da proporção` é o ajuste que o negócio já decidiu para uma foto do acervo que não tem a proporção do formato, como faixas laterais, fundo ou recorte. Vazio quer dizer que a skill sugere e a pessoa escolhe.
"Ajuste de foto fora da proporção": ""
# `Cor do fundo do ajuste` é a cor das faixas ou do fundo. Vazio quer dizer que a skill sugere uma cor da identidade visual do perfil e a pessoa escolhe.
"Cor do fundo do ajuste": ""
# `Habilidade de tom de voz` vazia quer dizer que a legenda e os textos dos slides seguem só esta habilidade.
"Habilidade de tom de voz": ""
# `Autorias que viram collab` lista quem produz o material visual e entra como collab quando produziu sozinho todas as fotos e os vídeos do post.
"Autorias que viram collab":
  - "fotógrafo"
  - "videomaker"
  - "agência"
  - "coletivo"
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

A lista de posts, a lista de formatos de conteúdo e o nome de cada propriedade vêm do mapeamento de dados do projeto, definido uma vez para todas as habilidades de postagem.
Se uma das listas não estiver no mapeamento, pare e diga qual falta.

Confirme o formato do post: carrossel, com dois slides ou mais, ou imagem única.
Reel e Story ficam fora desta habilidade.
Antes de criar, busque o assunto na lista de posts.
Se o post já existe, revise essa página.

### Passo 2

Leia o registro do formato na lista de formatos: `Formato do carrossel` ou `Formato da imagem única`.
O máximo de slides, a proporção, a largura, a altura e a área inferior livre saem desse registro, que é a fonte da verdade.
Um valor de `Máximo de slides`, `Proporção da imagem`, `Largura mínima (px)`, `Altura mínima (px)` ou `Área inferior livre (%)` definido nas instruções do projeto substitui o do registro.
Quando o registro não traz um desses valores, vale o padrão do parâmetro.
Diga na resposta cada valor que não veio do registro e de onde veio.

### Passo 3

Num carrossel, a quantidade de slides sai do raciocínio, dentro do máximo do formato: os dois slides da dobradinha de retenção, um slide para cada ponto do raciocínio, a conclusão e o CTA final.
Não complete slides para chegar ao máximo, nem corte um ponto para chegar a um número.
Diga na resposta quantos slides o carrossel tem e o que cada um carrega.

Estruture a narrativa partindo de uma tendência, pauta cultural, notícia ou comportamento do mundo real, e traduza esse contexto para o público-alvo.
Responda "O que isso significa para o meu público?" na capa ou nos primeiros slides.
Os dois primeiros slides funcionam como dobradinha de retenção: dois ganchos complementares que levam a pessoa a passar os slides, sem gastar o conteúdo principal no início.

Numa imagem única, a imagem é o gancho, e a legenda desenvolve o recorte.

### Passo 4

Construa o raciocínio ativando três gatilhos:

1. Identificação: "eu também estava percebendo isso".
2. Alívio: "então não sou só eu, faz sentido".
3. Autoridade: a sensação de que o perfil enxerga antes e explica melhor.

Escolha pelo menos um eixo narrativo para ancorar a tendência: mercado, cases, cultura, notícias ou produto.
Evite conteúdo educativo genérico.
Entregue um recorte específico, com contexto, vocabulário e implicações práticas para o público.

### Passo 5

O último slide do carrossel é um CTA direto, com uma ação clara e única.
Nenhum slide do meio leva botão de CTA.
Na imagem única, o CTA fica na legenda.

### Passo 6

Confira cada imagem pelas especificações do Passo 2:

- A proporção e a resolução mínima do formato.
- Uma foto do acervo fora da proporção segue `Ajuste de foto fora da proporção` e `Cor do fundo do ajuste`, e, com os dois vazios, a sugestão espera a escolha da pessoa.
- Nada sobreposto na área inferior livre do formato, para não conflitar com a interface do Instagram.
- Texto sempre legível, sem prints de sites.
- Na grade de prévia do perfil, os números de página do Instagram ficam fora das imagens, então não reserve espaço para eles.

### Passo 7

Com `Habilidade de tom de voz` preenchida, os textos dos slides e a legenda seguem essa habilidade, com o perfil autor como contexto.
Sem ela, pergunte qual perfil publica o post.
Perfil institucional ou coletivo escreve em terceira pessoa.
Perfil pessoal segue o tom da pessoa.

### Passo 8

Dê crédito a quem criou o material: na legenda, marque cada pessoa ou perfil que fez as fotos, os vídeos ou a arte.
Quando uma só autoria de `Autorias que viram collab` produziu todas as fotos e os vídeos do post, ela entra também como collab.
O fotógrafo é só um exemplo: a autoria pode ser quem produziu o vídeo, uma agência que gravou ou um coletivo.
Sem saber quem produziu o material, pergunte antes de finalizar.
Marcação e collab novas entram só com o sim da pessoa.

### Passo 9

Registre o post na lista de posts, com as propriedades do mapeamento: assunto, legenda, texto e orientação visual de cada slide, formato, perfil autor, créditos, collabs, hashtags e local quando houver, e o status.

### Passo 10

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Carrossel acima do máximo do formato

Se você criar mais slides do que o máximo do formato, o post perde a elegibilidade para patrocínio.

1. Reduza os slides até o máximo.
2. Concentre o conteúdo principal em menos slides, mantendo a dobradinha de retenção e o CTA final.

### CTA no meio do carrossel

Se você puser CTA num slide do meio, a narrativa e a retenção caem.

1. Tire o CTA dos slides do meio.
2. Deixe o CTA só no último slide.

### Especificação tirada de memória

Se você usar a proporção ou a resolução de memória, o post sai fora do formato que o negócio definiu.

1. Leia o registro do formato.
2. Use o parâmetro só como substituição, e diga que usou.

### Texto na área inferior

Se você puser texto ou elemento gráfico na área inferior livre do slide, a interface do Instagram pode esconder parte dele.

1. Tire os elementos importantes da área inferior livre do formato.
2. Confira a legibilidade na tela do celular.

### Autoria sem crédito

Se você usar fotos ou vídeos de alguém sem marcar essa pessoa, quem criou fica sem crédito.

1. Pergunte quem produziu o material.
2. Marque na legenda e, com uma só autoria, proponha a collab.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Criar carrossel sobre uma tendência cultural, com fotos de um só fotógrafo

Saída:

- O carrossel tem 8 slides, abaixo do máximo do formato, porque o raciocínio tem quatro pontos: os três gatilhos e um case do eixo cultura.
- Slide 1, a capa: o gancho principal da tendência.
- Slide 2: o complemento do gancho, que leva a passar os slides.
- Slide 3: a identificação.
- Slide 4: o alívio.
- Slide 5: o case que mostra a tendência acontecendo.
- Slide 6: a autoridade, com a leitura que o perfil faz do case.
- Slide 7: a conclusão ou a implicação prática.
- Slide 8: o CTA direto.
- A proporção e a resolução saíram do registro do formato do carrossel.
- O fotógrafo está marcado na legenda e proposto como collab.

### Revisar uma imagem única com a resolução abaixo do formato

Saída:

- A imagem foi refeita na proporção e na resolução do registro da imagem única.
- O texto saiu da área inferior livre do formato.
- O CTA foi para a legenda.

## Casos-limite

- O post tem um slide só: siga como imagem única.
- O carrossel passa do máximo do formato: reduza ou confirme que ele não será patrocinado.
- O perfil é institucional e o pedido está em primeira pessoa: confirme o perfil e escreva em terceira pessoa.
- O carrossel não tem CTA: pergunte se o objetivo é só informar ou se ele leva CTA.
- As fotos do acervo que vão compor o slide não têm a proporção do formato, como uma foto vertical 2:3, uma horizontal ou uma quadrada: siga `Ajuste de foto fora da proporção` e `Cor do fundo do ajuste`. Vazios, sugira o ajuste que preserva a foto sem corte e sem reduzir a resolução, como faixas laterais ou um fundo, com uma cor da identidade visual do perfil, e espere a pessoa escolher.
- Duas autorias produziram o material: as duas recebem crédito na legenda, e a collab fica para a pessoa decidir.
- O negócio não usa o Notion: a lista de formatos e a de posts vêm da fonte que o mapeamento de dados aponta.

## Pegadinhas

- O Instagram pode reexibir um carrossel no feed abrindo no segundo slide quando a pessoa não interage com o primeiro, por isso a dobradinha de retenção é obrigatória.
- Os números de página do Instagram ficam fora das imagens na grade de prévia.
- Carrossel e sequência de stories são formatos diferentes, com regras diferentes.
- Perfil institucional ou coletivo escreve em terceira pessoa, mesmo quando o conteúdo é sobre uma pessoa.
- Crédito e collab são coisas diferentes: todo autor recebe crédito na legenda, e só a autoria única do material vira collab.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
