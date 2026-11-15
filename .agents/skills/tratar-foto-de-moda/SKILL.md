---
name: tratar-foto-de-moda
description: Trata e recria a foto de uma peça ou look a partir da foto enviada, preservando a fidelidade do produto, a identidade da pessoa modelo e a apresentação profissional. Usada ao gerar, tratar, corrigir ou revisar uma imagem de moda, mesmo sem dizer tratar. NÃO serve para registrar ou classificar a foto nem para publicá-la.
metadata:
  author: jimmyandrade
  version: "0.1.1"
  related:
    - evoluir-habilidade
---

# Tratar foto de moda

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Fonte dos tipos de fotografia de moda` aponta a lista dos tipos e das orientações de cada um. Vazia, pergunte e pare.
"Fonte dos tipos de fotografia de moda": ""
# `Tipos que não servem a um conjunto de peças` lista os tipos de apresentação inadequados para uma foto que combina duas ou mais peças vendidas juntas.
"Tipos que não servem a um conjunto de peças": "Packshot, produto isolado, manequim, flat lay"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Exija a foto da peça enviada pela pessoa, como anexo, do produto isolado ou de alguém usando. Sem ela, peça os anexos antes de devolver uma imagem. A foto amadora é matéria-prima, não a imagem final: não a reprove por fundo, luz, parede, enquadramento, simetria ou caimento no manequim, e não assuma que há estúdio, manequim ideal ou fotógrafo.

Diga se a foto serve de referência e o que será corrigido. Peça uma foto complementar só do trecho que impede a leitura fiel da peça, com uma orientação simples e viável.

### Passo 2

Antes de gerar, analise as imagens e leia a peça: modelagem, materiais, cores, estampa, caimento, categoria, ocasião de uso e detalhes de construção. Preserve cor, estampa, textura, escala e posição como estão. Não invente característica que não aparece na imagem nem foi dita.

Confirme o fechamento, se é botão, zíper, os dois ou outro aviamento, e não os confunda mesmo com a imagem pouco nítida. Na dúvida sobre fechamento, bolso, gola ou decote, pergunte se há bolso, quantos e onde, e se a gola é assimétrica. Enquanto não houver confirmação, não crie bolso nem simetria.

### Passo 3

Numa foto que combina duas ou mais peças, pergunte o tipo de apresentação, lendo `Fonte dos tipos de fotografia de moda`, e não presuma. Um conjunto vendido junto não usa os `Tipos que não servem a um conjunto de peças`. Se a pessoa pedir um deles, explique e redirecione para o estilo de vida ou o editorial, que mostram todas as peças do conjunto.

Um tipo com pessoa modelo exige a foto de uma pessoa real fornecida. Nunca gere nem entregue modelo humano fictício. Sem a pessoa, ofereça o produto isolado, a composição das peças isoladas ou o manequim.

### Passo 4

Na imagem de produto isolado, troque o fundo por branco puro `#FFFFFF` ou por transparência real, e remova parede marcada, tomada, cabo, objeto, sombra dura e luz irregular. Não peça nova foto só por causa de parede ou sombra.

Aceite o manequim preto como suporte. Torne o manequim e a sombra interna o menos visíveis possível sem confundi-los com a transparência real da peça: a trama, os vazados e a profundidade continuam legíveis, e a área vazada não vira preto sólido.

### Passo 5

Remover o manequim de uma peça com gola ou decote exige uma foto do acabamento interno da gola, em flat lay ou em outro arranjo simples. Salve-a como detalhe, com a função dela nas observações, e use-a na geração e na revisão. Sem a foto, não finalize nem aprove. Dispense-a só quando o acabamento já aparece em outra referência, registrando a justificativa.

Nunca entregue só o fundo removido sobre a mesma silhueta torta. Reconstrua a apresentação como uma produção de moda faria: alinhe cós, fechamento, barra, mangas e ombros, centralize e equilibre a peça, sem alterar comprimento, largura, modelagem, volume, assimetria real, bolso, fechamento ou textura. Na dúvida se um desvio é da peça ou da montagem, pergunte.

### Passo 6

Em peça vazada ou transparente, o fundo branco ou claro é o padrão para publicação. O fundo preto ou escuro é teste ou variação editorial: gere-o como teste, avalie se ele achata a renda ou esconde os vazados, e mantenha `Precisa revisar` até a comparação humana. Não troque a versão branca pela preta sem confirmação explícita, e guarde as duas quando a pessoa pediu comparar.

Registre nas observações qual fundo foi usado e os riscos visuais abertos.

### Passo 7

Com pessoa modelo, a identidade é a restrição primária, acima da estética de estúdio. Não mude rosto, cabelo, barba, maquiagem, acessórios, tatuagem, marca corporal nem proporção reconhecível, e não embeleze, afine, simetrize nem rejuvenesça. A foto de rosto serve à identidade, a de corpo à pose e ao caimento, a de produto à fidelidade da peça e a de ambiente ao contexto, sem criar uma pessoa híbrida.

Se a ferramenta não preservar o rosto, reduza a ambição: ambiente original, enquadramento de torso, rosto parcial ou nova foto de frente. Ajuste de cabelo só com o aviso e o sim da pessoa, sutil, com fios da mesma cor, densidade e textura, sem peruca nem mudar o rosto.

### Passo 8

Preserve o ambiente original da foto com pessoa. Melhore nitidez, luz, cor, composição e limpeza, e troque o cenário só quando a pessoa pedir, quando ele impedir a leitura fiel ou quando o tipo exigir, registrando o motivo. "Corrigir", "tratar" ou "fazer estilo de vida" mantém o ambiente por padrão.

No conjunto de peças, todas as peças vendidas ficam claras na imagem. Outras peças da marca e objetos de cena autênticos podem ficar, e só saem a pedido ou por ambiguidade comercial que os metadados não resolvem. Sem referência suficiente para todas as peças, peça fotos complementares. Uma tentativa anterior no tipo inadequado é reprovada.

### Passo 9

Revise visualmente antes de salvar como aprovada, com a silhueta no tamanho de publicação e em miniatura. Fidelidade do produto e qualidade da apresentação são avaliadas à parte.

- [ ] Sem resíduo de manequim, sombra interna, massa preta, halo, recorte duro, parte fantasma ou preenchimento artificial, em gola, decote, cava, manga, barra e vazados.
- [ ] Nenhum acabamento, bolso, botão, zíper, costura ou etiqueta inventado.
- [ ] Zíper, puxador, botões e demais aviamentos intactos.
- [ ] O lado da assimetria é o da referência, sem espelhar nem inverter.
- [ ] Cós, fechamento, quadril, pernas, barras e eixo estão alinhados, sem aparência de recorte amador.
- [ ] A pessoa modelo parece a mesma, comparada com a referência.

Corrigir um erro não pode apagar outro detalhe: escreva o novo pedido de geração equilibrando o que corrigir com o que deve ficar intacto. Reprove, regenere e registre cada falha. A imagem não avança para aprovada se uma correção criou outro erro.

### Passo 10

O registro da foto, o status e o histórico seguem `cadastrar-foto-de-moda`. Aqui, uma imagem com falha de fidelidade fica `Precisa revisar`, e uma que a ferramenta só consegue recortar sem deformar a peça fica `Precisa gerar`. Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Recorte vendido como foto profissional

Se você só remover o fundo e colar sobre branco, a peça segue torta e amadora.

1. Reconstrua a apresentação sem mudar a modelagem.
2. Se a ferramenta só recorta, mantenha `Precisa gerar`.

### Correção que apaga outro detalhe

Se você escrever o pedido só com o erro apontado, a nova geração perde zíper, gola ou costura.

1. Liste o que corrigir e o que deve ficar intacto.
2. Revise de novo o conjunto.

### Pessoa que vira outra

Se você priorizar o visual de catálogo, o rosto e o cabelo mudam e a foto parece outra pessoa.

1. Trate a identidade como restrição primária.
2. Reduza o enquadramento ou peça nova referência.

### Detalhe inventado

Se você esconder uma falha de geração com um acabamento, um bolso ou um botão, a imagem promete o que a peça não tem.

1. Trate como falha de fidelidade.
2. Peça referência ou confirmação.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### trate esta foto da calça no manequim preto

Aceitei o manequim preto, perguntei se o fechamento é zíper ou botão, alinhei cós e barras sem mudar a modelagem e gerei sobre fundo branco. A revisão achou um resíduo preto no gancho, regenerei e salvei como `Precisa revisar` até a comparação humana.

## Casos-limite

- A foto vem sem anexo, só descrita: peça o anexo antes de gerar.
- A peça é transparente e a pessoa quer fundo preto: gere como teste e mantenha o branco.
- A ferramenta não preserva o rosto: enquadramento sem rosto ou nova referência, nunca identidade alterada.
- Não há ferramenta de imagem na sessão: diga o que fazer à mão e não simule o resultado.
- A pessoa não confirma o bolso: trate como não confirmado e não o inclua.

## Pegadinhas

- A foto amadora parece motivo para pedir nova foto. Só um trecho que impede a leitura fiel pede foto complementar.
- A assimetria da peça parece erro de montagem. Confirme antes de corrigir.
- Uma imagem bonita parece pronta. Fidelidade e apresentação são avaliadas à parte.
- Uma imagem gerada por IA não prova o produto real. Ela é referência até a validação.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
