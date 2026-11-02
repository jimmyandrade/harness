---
name: criar-carrossel-do-instagram
description: >
  Cria ou revisa um carrossel para publicação no Instagram, garantindo
  conformidade com as especificações técnicas, regras de design e práticas
  editoriais do formato. Usada quando o agente precisa estruturar slides,
  redigir textos, validar imagens ou revisar um carrossel existente antes da
  publicação. NÃO serve para criar conteúdos de outros formatos como Reel,
  Story ou post único, nem para planejar calendário editorial.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  models:
  related:
    - evoluir-habilidade
---

# Criar carrossel do Instagram

## Parâmetros de configuração

```yaml
# `Largura mínima (px)` define a resolução horizontal mínima aceita para cada slide.
"Largura mínima (px)": 1080
# `Altura mínima (px)` define a resolução vertical mínima aceita para cada slide.
"Altura mínima (px)": 1440
# `Proporção da imagem` define a proporção de aspecto obrigatória dos slides.
"Proporção da imagem": "3:4"
# `Máx. slides` define a quantidade máxima de slides para permitir patrocínio.
"Máx. slides": 10
# `Tom de voz por perfil` define se o carrossel deve seguir tom de voz específico de um perfil.
"Tom de voz por perfil": "sim"
# `Incluir colaboradores obrigatórios` define se há tipos de colaborador que devem sempre ser incluídos (ex.: fotógrafo).
"Incluir colaboradores obrigatórios": "sim"
# `Modo de aprendizado` define se o agente deve perguntar feedback ao finalizar.
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Valide o formato do conteúdo solicitado. Se o pedido mencionar outros formatos (como Story ou Reel) que conflitem com carrossel, confirme qual é o formato correto antes de prosseguir.
Pare se o formato não for Carrossel no Instagram.

### Passo 2

Defina a quantidade de slides. Pergunte quantos slides o carrossel terá ou infira do contexto.
O carrossel deve ter no máximo a quantidade definida em `Máx. slides` para ser elegível a patrocínio.
Inclua a capa e o CTA final nessa contagem.

### Passo 3

Estruture a narrativa do carrossel partindo de uma tendência, pauta cultural, notícia ou comportamento do mundo real, e traduza esse contexto para o público-alvo.
Responda "O que isso significa para o meu público?" logo na capa ou nas primeiras páginas.
As duas primeiras páginas devem funcionar como dobradinha de retenção: ambas devem ser ganchos complementares que provocam a pessoa a continuar passando os slides, sem gastar o conteúdo principal logo no início.

### Passo 4

Construa o raciocínio ao longo dos slides ativando três gatilhos:
1. Identificação: "eu também estava percebendo isso".
2. Alívio: "então não sou só eu, faz sentido".
3. Autoridade: a sensação de que o perfil enxerga antes e explica melhor.

### Passo 5

Escolha pelo menos um eixo narrativo para ancorar a tendência: mercado (mudanças no setor), cases (histórias de sucesso ou erro), cultura (comportamentos e tendências), notícias (o que aconteceu e o que significa) ou produto (como o que você oferece resolve ou encaixa nisso).
Evite conteúdo educativo genérico.
Entregue um recorte específico, com contexto, vocabulário e implicações práticas para o público.

### Passo 6

Coloque o CTA no último slide. O último slide deve sempre ser um call-to-action direto, pedindo uma ação clara e única.
Nunca coloque botão de CTA nos slides do meio.

### Passo 7

Verifique as especificações técnicas de cada slide:
- Formato: `Proporção da imagem` (padrão 3:4).
- Resolução mínima: `Largura mínima (px)` x `Altura mínima (px)` (padrão 1080x1440).
- Nada sobreposto nos 20% inferiores do slide, para evitar conflito com a interface do Instagram.
- Texto sempre legível: não use prints de sites ou textos ilegíveis.
- Na grade de prévia do perfil, os números de página do Instagram ficam fora das imagens, então não reserve espaço para eles.

### Passo 8

Se `Tom de voz por perfil` for `sim`, consulte ou pergunte qual perfil publicará o carrossel e qual tom de voz deve ser usado.
Posts de perfis institucionais ou coletivos devem usar terceira pessoa.
Posts de perfis pessoais seguem o tom de voz da pessoa.
Aplique o tom de voz obrigatoriamente nos textos de todos os slides e na legenda.

### Passo 9

Se `Incluir colaboradores obrigatórios` for `sim`, pergunte quais tipos de colaborador devem ser incluídos no post.
Exemplo: se o carrossel usar fotos, o fotógrafo deve entrar como collab.

### Passo 10

Registre o conteúdo no banco de posts do projeto com: título, legenda, descrição dos slides (texto de cada slide e orientação visual), formato, tipo de conteúdo, perfis autores, colaboradores, hashtags (quando aplicável), local (quando aplicável) e status.

### Passo 11

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Carrossel excede limite de slides

Se você criar um carrossel com mais slides do que o definido em `Máx. slides`, o post não será elegível para patrocínio.

1. Reduza o número de slides até o limite definido.
2. Concentre o conteúdo principal em menos slides, mantendo a retenção e o CTA final.

### CTA colocado no meio do carrossel

Se você colocar botão de CTA em slides intermediários, isso prejudica a narrativa e a retenção.

1. Remova o CTA dos slides do meio.
2. Coloque o CTA apenas no último slide.

### Texto ilegível ou sobreposto na área inferior

Se você sobrepor texto ou elementos gráficos nos 20% inferiores do slide, a interface do Instagram pode ocultar parte do conteúdo.

1. Reposicione todos os elementos importantes para fora dos 20% inferiores.
2. Teste a legibilidade em diferentes dispositivos.

### Tom de voz inconsistente

Se você usar tom de voz pessoal em perfil institucional ou vice-versa, o conteúdo fica desalinhado com a identidade do perfil.

1. Confirme o perfil que publicará o carrossel.
2. Aplique o tom de voz correto em todos os slides e na legenda.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Criar carrossel sobre tendência cultural com 8 slides

Saída:
- Slide 1 (capa): gancho principal da tendência.
- Slide 2: complemento do gancho, provocando continuação.
- Slides 3-6: desenvolvimento do raciocínio, ativando identificação, alívio e autoridade.
- Slide 7: conclusão ou implicação prática.
- Slide 8: CTA direto.
- Formato: 3:4, 1080x1440px.
- Texto fora dos 20% inferiores.
- Tom de voz aplicado em todos os slides.

### Revisar carrossel existente com problema de resolução

Saída:
- Imagens redimensionadas para 1080x1440px.
- Proporção ajustada para 3:4.
- Textos reposicionados fora dos 20% inferiores.
- CTA movido para o último slide.
- Tom de voz revisado e aplicado em todos os slides.

## Casos-limite

- O carrossel tem menos de 2 slides: valide se o formato correto é post único.
- O carrossel tem mais de 10 slides: reduza para o limite ou confirme que não será patrocinado.
- O perfil é institucional, mas o pedido usa primeira pessoa: confirme o perfil e aplique terceira pessoa.
- O carrossel não tem CTA: pergunte se o objetivo é apenas informar ou se deve incluir CTA.
- As imagens são verticais 2:3 (não 3:4): adicione faixas brancas laterais para chegar a 3:4, sem corte e sem reduzir resolução.
- As imagens são horizontais ou quadradas: avalie caso a caso se encaixa em fundo branco 3:4 ou se precisa de novo tratamento.
- O colaborador obrigatório não foi informado: pergunte antes de finalizar.

## Pegadinhas

- O Instagram pode reexibir um carrossel no feed abrindo diretamente na segunda página quando a pessoa não interage com a primeira, por isso a dobradinha de retenção nas páginas 1 e 2 é obrigatória.
- Não reserve espaço para os números de página do Instagram: eles ficam fora das imagens na grade de prévia.
- Não confunda post de carrossel com sequência de stories: são formatos diferentes, com regras diferentes.
- Perfis institucionais ou coletivos sempre usam terceira pessoa, mesmo que o conteúdo seja sobre uma pessoa específica.
- O fotógrafo sempre entra como collab quando o carrossel usar fotos, independentemente de outras regras de colaboração.

## Scripts disponíveis

Nenhum.
