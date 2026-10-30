---
name: registrar-evidencia-visual
description: Registra o que a pessoa passa a ver quando um trabalho termina, no pull request e no card. Usada quando a entrega muda a tela, no Storybook, no ambiente local, na pré-produção ou na produção, mesmo sem dizer print. NÃO serve para mudança sem percepção visual, para medir performance, para ler texto de imagem nem para mandar a mensagem.
metadata:
  author: jimmyandrade
  version: "0.12.1"
  related:
    - criar-pull-request
---

# Registrar evidência visual

## Parâmetros de configuração

```yaml
# `Variações de tema` lista os temas do projeto que a evidência e as stories cobrem, como o tema padrão e o sazonal ativo. Vazio, descubra os temas no repositório.
"Variações de tema": ""
"Confirmação antes de gravar": "sim"
"Fuso horário da legenda": "America/Sao_Paulo"
"Pasta das evidências": "tmp/evidencias-visuais"
"Habilidade de mensagem": ""
# `Sobreposições a fechar` lista o que cobre a tela sem fazer parte da mudança, como o aviso de cookies, o cartão de promoção e o bate-papo. Vazio, procure na primeira captura.
"Sobreposições a fechar": ""
```

## Instruções

### Passo 1

Decida se o trabalho terminado muda o que uma pessoa vê.
Atualização de dependência, documentação e mudança técnica sem diferença na tela ficam de fora.
Diga que não há evidência visual e pare.
Quando existirem, escreva isso na descrição do pull request e na issue do rastreador.
Medir se algo ficou mais rápido, como um commit de performance, é outra evidência.
Um print estático não serve para isso.
Grave um vídeo do carregamento ou uma tabela que compare os tempos.

### Passo 2

Liste só a superfície que este trabalho realmente tem, e cada cenário que uma pessoa pediu ou prometeu mostrar num comentário do PR: um estado como hover ou foco, uma variante como com e sem link.
Cada superfície aparece em cada variação de tema do projeto, o tema padrão e os sazonais ou variações ativos, como diz `Variações de tema`.
Um efeito que aparece com o ponteiro, como o sublinhado ou a cor do hover, pede também a captura do foco por teclado, aberta com a tecla Tab, e o mesmo efeito tem de existir nos dois.
Cada cenário é uma captura própria, legendada com o que ele prova.
Quando o componente que mudou vive junto de outros, como uma barra acima de um cabeçalho, mostre-o na composição, com o que está em volta, para dar para comparar.
Uma mudança de cor, de espaço ou de tamanho só se avalia ao lado do vizinho.
A composição entra em cada tema e em cada largura, e a story da composição confere as duas cores lado a lado.
Um comentário que promete a evidência, como "vou deixar uma evidência visual", chama esta habilidade, e a resposta na thread leva o link para ela.
A ordem é o ambiente local, o Storybook, a pré-produção e a produção.
A pré-produção só entra se o repositório ou a pessoa já tiver o endereço.
A produção só entra se a mudança já estiver no ar e a página tiver sido aberta.
Não invente endereço de pré-produção.
Não diga que está em produção sem ter aberto a página.

```mermaid
flowchart LR
  A{Muda o que a pessoa vê?} -->|não| B[Para]
  A -->|sim| C[Guarda o conjunto na pasta do trabalho]
  C --> D[Mostra a primeira tela e o link da página]
  D --> E{A pessoa confirma o conjunto?}
  E -->|não| B
  E -->|sim| F[Grava no card e no pull request]
  F --> G{Pediu para mandar a alguém?}
  G -->|sim| H[habilidade de mensagem do negócio]
  G -->|não| B
```

### Passo 3

Capture cada superfície que foi aberta.
Antes de guardar cada captura, olhe a imagem inteira e procure o que cobre a tela sem fazer parte da mudança, como `Sobreposições a fechar` lista.
Feche cada um pelo próprio botão e confira no DOM que saiu. Recuse o aviso de cookies, não o esconda por estilo.
Esse tipo de elemento pode nascer depois da primeira rolagem ou do primeiro toque: espere o elemento aparecer, procurando pelo seletor e não pelo texto, e feche de novo depois de rolar.
Feche as mesmas sobreposições no antes e no depois, para os dois mostrarem a mesma tela.
Uma captura com algo por cima não entra no conjunto, e a legenda não explica o que está por cima.
A captura do depois vem do código da mudança, rodando no ambiente local, no Storybook ou no ambiente de teste do pull request.
O efeito da mudança aplicado à mão noutro ambiente, como a produção, é uma simulação e não substitui essa captura.
Quando a simulação é a única imagem possível, a legenda diz que é simulação e a resposta diz que a captura da mudança ainda falta.
Numa correção de bug, a evidência refaz o caminho do relato, antes e depois.
Quando o bug acontece numa interação, como rolar e tocar, grave um vídeo curto desse caminho.
Antes de capturar, confira que a story cobre cada tema da lista.
Se faltar, acrescente a story do tema, porque ela também dá a base da regressão visual, e só então capture.
A imagem de um tema sem story não substitui a story.
Antes de capturar, leia o texto que a tela vai mostrar.
Ele vem do negócio ou do conteúdo real, nunca inventado por você.
Uma story com frase de exemplo sua troca pela frase que o negócio mandou.
Quando só um texto de teste serve, como o que chega ao limite de caracteres, a legenda diz que é texto de teste.
A evidência guarda a página inteira e o que cabe na primeira tela, sem rolar.
Quando a mudança não aparece nessa primeira tela, guarde também um recorte com altura perto da largura, com o bloco novo e o que está em volta.
O componente isolado pode ir na pasta, com a legenda de que é só o bloco.
Ele não substitui a página.
No Storybook, ache a story da tela e, no script do projeto, o número da porta de rede do servidor.
Abra a story sem a barra do Storybook.
Se a página disser que não há preview, espere o bundle e leia o texto de novo.
Capture a largura do layout.
Capture a mesma tela na largura de um computador e na largura de um telefone.
Numa mudança de interface, abra a mesma story em mais de um navegador, no ambiente local: Chrome, Firefox e WebKit, pelo Playwright.
Meça e capture o hover, o foco por teclado e a altura em cada um.
Só entra como testado o navegador que abriu.
Não fotografe só o painel visível.
Use `Pasta das evidências` só quando o Git já ignora esse caminho.
Se o Git não ignora, grave na pasta temporária do sistema, com a mesma subpasta do trabalho.
Não crie uma pasta nova na raiz do repositório.
O nome da subpasta é a chave do card ou o número do pull request.
Sem os dois, use o dia e um nome curto do trabalho.
Diga o caminho absoluto da subpasta.
Não faça commit da imagem.

### Passo 4

Cada print leva uma legenda no idioma do destino.
A legenda diz o lugar e o dia, no `Fuso horário da legenda`.
No Storybook, a legenda também diz o branch e se aquele commit está no branch principal.
Estar no branch principal não é estar em produção.
A produção só entra na legenda quando a página foi aberta lá.
Em alguns negócios a produção só muda num release.
Se a story trava o relógio ou usa produto de fixture, a legenda diz isso.
Se o texto da tela é de teste, a legenda também diz.
Com mais de um navegador, a legenda diz qual e a versão.
WebKit é o motor do Safari, não o Safari: a legenda escreve WebKit.
A legenda e a descrição dizem que o teste foi local, sem o serviço de regressão visual pago, para ninguém achar que ele gastou crédito.
Não guarde no conjunto, nem mostre para confirmação, o print cujo contador ou dado vem de uma data de fixture distante do dia.
Prefira a story cujo relógio fica perto de um intervalo real.
Sem essa story, diga que essa superfície ficou sem evidência.

### Passo 5

O card recebe a evidência, porque quem é de produto pode não ter acesso ao repositório nem à ferramenta de desenho.
No texto do card, mostre só a primeira tela, ou o recorte com altura perto da largura quando a mudança fica abaixo dela.
A página inteira entra como link para o arquivo anexado, não como imagem dentro do texto.
Uma imagem muito alta alonga o card e atrapalha a leitura.
O pull request segue a mesma regra, na seção de imagens que o modelo do repositório já tem.
Não abra outra seção.
Dentro dela, cada captura tem o próprio título, agrupado por superfície: computador, telefone, com e sem link, estados.
Cada captura leva três partes separadas por linha em branco: o título, a imagem e a legenda em itálico.
Sem a linha em branco, a imagem encosta no texto de baixo.
O GitHub remove as tags `figure` e `figcaption` da descrição, então não as use ali. Use-as só onde o destino as mostra.
Se o corpo do card não aceitar arquivo, o recorte vai num comentário e a página inteira continua como link. Se o card já tem um comentário seu com a evidência deste trabalho, edite esse comentário em vez de abrir outro.
Comentário numa issue do rastreador só entra se a pessoa pedir.
Esse comentário leva o link do pull request.
A descrição do pull request é o lugar melhor para o recorte.
Com `Confirmação antes de gravar` em `sim`, mostre a subpasta, o recorte que entra no texto, o link da página inteira e as legendas, e espere um sim para esse conjunto.
Peça esse sim assim que o conjunto fica pronto, antes de abrir o pull request, para ele já nascer com as imagens.
A linha de comando do GitHub não sobe imagem para a descrição.
Depois do sim, suba as imagens pelo navegador em que a pessoa já está logada no GitHub, com o envio de arquivo do editor da descrição.
Sem esse navegador, o pull request fica em rascunho, e a mesma resposta diz que a imagem falta e oferece esse caminho.
Um sim vale para o card e o pull request desse conjunto, e outro destino, como uma mensagem para alguém, pede outro sim.

### Passo 6

Mandar a imagem para uma pessoa segue `Habilidade de mensagem`, depois do sim dela a esse texto.
Com o parâmetro vazio, não chame habilidade nenhuma: pergunte qual é a daquele negócio.
O que vai na mensagem é o mesmo recorte do card, mais o link da página inteira.
Não mande o print da data de fixture distante.
Não abra o canal de mensagem nem a ferramenta de desenho no lugar da captura, e ler o texto que já está numa imagem é outra habilidade: esta não a chama e não tira o print.

## Problemas comuns

### Só o componente

Se você publicar só a story do componente, a pessoa de produto não vê como o bloco fica no resto da tela.

1. Capture a página inteira e a primeira tela.
2. O componente isolado pode ir na pasta, com a legenda de que é só o bloco.
3. Não use o componente isolado como única evidência.
4. Se a mudança é de cor, de espaço ou de tamanho, a composição com o vizinho é a evidência principal, e o componente isolado, só um apoio.

### Print com o relógio da fixture

Se você publicar o print da story cuja data está anos à frente, o contador mostra dezenas de milhares de dias e a pessoa entende que a tela está assim.

1. Troque pela story que trava o relógio perto de um intervalo real.
2. Deixe o print da data distante fora da pasta e fora do conjunto mostrado.
3. Sem essa story, diga que a superfície ficou sem evidência.

### Pasta que o Git pode levar

Se você criar uma pasta nova na raiz do repositório, o próximo commit pode levar as imagens.

1. Use `Pasta das evidências` só quando o Git já ignora esse caminho.
2. Se o Git não ignora, grave na pasta temporária do sistema.
3. Não faça commit da imagem.

### Página inteira dentro do texto

Se você colocar a página inteira como imagem no card ou no pull request, a altura alonga a leitura e o resto do texto se perde.

1. Mostre no texto a primeira tela, ou o recorte com altura perto da largura.
2. Mantenha a página inteira na subpasta e anexe o arquivo.
3. Aponte para ela com um link, não com uma imagem no texto.

### Painel corta a página

Se você fotografar só o painel do navegador, o contador à direita some e o resto da página fica de fora.

1. Capture a largura do layout e a altura da página, no computador e no telefone.
2. Confira que o bloco novo e o que está em volta entraram no arquivo da página.
3. Só então use o arquivo.

### Preview que não existe

Se você montar um endereço de pré-produção ou disser que a tela está em produção, a evidência afirma um ambiente que não foi aberto.

1. Use só o endereço que o repositório ou a pessoa já passou.
2. Abra a página em produção antes de dizer que ela está no ar. O branch principal não basta, e em alguns negócios a produção só muda num release.
3. Sem o endereço, a legenda fica no Storybook ou no ambiente local.

### Card sem a imagem

Se você escrever no card só uma frase, quem não tem acesso ao repositório continua sem ver a tela.

1. Mostre no texto a primeira tela ou o recorte.
2. Coloque o link da página inteira no mesmo lugar.
3. Não feche sem esses dois no card.

### Texto inventado na captura

Se você capturar a story com uma frase que a IA escreveu, a evidência mostra um texto que o negócio nunca usou, e quem revisa entende que ele é real.

1. Leia o texto que a tela mostra antes de capturar.
2. Troque pela frase que o negócio mandou. Sem frase do negócio, peça uma.
3. Quando só um texto de teste serve, a legenda diz que é texto de teste.

### Só o tema padrão

Se você mostrar a mudança só no tema padrão, ninguém vê como ela fica no tema sazonal, e a regressão visual não cobre o tema.

1. Liste os temas do projeto em `Variações de tema`, ou descubra no repositório.
2. Garanta uma story por tema e capture cada uma.
3. Legende cada imagem com o tema.

### Hover sem foco por teclado

Se você mostrar só o hover, quem navega pelo teclado pode não receber o mesmo efeito, e a evidência não mostra isso.

1. Abra a story, aperte Tab até o elemento e leia o estilo de `:focus-visible`.
2. O efeito do hover tem de existir também no foco. Se faltar, diga e proponha corrigir.
3. Capture o foco por teclado como cenário próprio.

### Um navegador só

Se você testar só no Chrome, a descrição afirma mais do que foi aberto.

1. Abra a story em Chrome, Firefox e WebKit, localmente.
2. Marque na descrição só o que abriu e diga que o teste foi local.
3. Escreva WebKit, não Safari, e deixe sem marca o que não abriu, como o Edge.

### Pull request sem a imagem

Se você abrir o pull request com a seção de imagens vazia e deixar a confirmação ou o envio para depois, quem abre o pull request não vê a mudança e pergunta por que não há imagem.

1. Mostre o conjunto e peça o sim antes de abrir o pull request.
2. Depois do sim, suba as imagens pelo navegador em que a pessoa está logada no GitHub.
3. Sem esse navegador, deixe em rascunho e ofereça o caminho na mesma resposta.

### Captura com a tela coberta

Se você guardar a captura com o aviso de cookies, um cartão de promoção ou um bate-papo por cima, e explicar isso na legenda, quem lê vê o aviso e não a mudança.

1. Olhe a imagem inteira antes de guardar.
2. Feche o elemento pelo botão, procurando pelo seletor, que pode nascer só depois da rolagem, e confira que saiu.
3. Refaça as duas capturas. A legenda não conserta uma tela coberta.

### Imagem encostada no texto

Se você pôr a imagem logo abaixo do título e logo acima da legenda, sem linha em branco, a descrição fica confusa e não mostra o que cada captura prova.

1. Dê um título a cada captura, agrupado por superfície.
2. Separe título, imagem e legenda em itálico com uma linha em branco.
3. Não use `figure` nem `figcaption` no GitHub: ele remove as tags e a legenda vira texto colado à imagem.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### A pessoa de produto pediu o print e não tem acesso ao repositório

A página, com o bloco novo no meio do resto da tela e o relógio travado em 1 dia, fica na pasta temporária que o Git já ignora, ou na pasta temporária do sistema. O card mostra a primeira tela e um link para a página inteira. O print só do componente, com o contador em dezenas de milhares de dias, fica fora do conjunto.

## Casos-limite

- A mudança não altera o que a pessoa vê: pare, diga que não há evidência visual e, quando existirem, escreva isso na descrição do pull request e na issue do rastreador.
- A mudança é de performance: grave um vídeo do carregamento ou uma tabela que compare os tempos. Não use um print estático.
- Existe story do componente e story da tela: a evidência principal é a tela.
- O contador mostra dezenas de milhares de dias: esse arquivo não entra na pasta nem no conjunto.
- A página inteira é muito alta: o texto leva o recorte, e a página inteira vai como link.
- A pessoa pede para mandar o arquivo a alguém: siga `Habilidade de mensagem` depois do sim, com o recorte e o link. Vazio, pergunte qual é a daquele negócio.
- O repositório não tem pré-produção: não invente o endereço.
- A story ainda mostra "No Preview": espere e leia o texto de novo.
- A descrição do card não aceita imagem: o recorte vai num comentário e a página inteira continua como link. Um comentário seu com a evidência que já está no card é editado, não duplicado.
- O Git não ignora `Pasta das evidências`: grave na pasta temporária do sistema e não crie pasta nova na raiz.
- Não há chave de card nem número de pull request: a subpasta leva o dia e um nome curto do trabalho.
- A pessoa não confirma o conjunto: não grave no card nem no pull request.
- A sobreposição volta depois de fechada: espere, feche de novo e capture em seguida. Sem conseguir, diga que a captura está coberta e não a guarde no conjunto.
- O ambiente com o código da mudança não abre: a simulação entra com a legenda de simulação, e a resposta diz que a captura da mudança falta.

## Pegadinhas

- A story do componente parece a tela e esconde o que fica em volta.
- A imagem só do componente parece prova de cor, mas a cor só se compara ao lado do vizinho.
- Uma pasta nova na raiz parece organizada e o próximo commit pode levar as imagens.
- A página inteira dentro do texto parece completa e alonga o card.
- Uma legenda não conserta o contador de dezenas de milhares de dias. A pessoa lê o número, não a legenda.
- O iframe do Storybook responde que não há preview enquanto o bundle da preview ainda compila. O id da story pode estar certo.
- O print do painel do navegador é mais estreito que o layout. O contador fica à direita da faixa e sai cortado.
- Uma data de fixture anos à frente faz o contador mostrar dezenas de milhares de dias. Esse arquivo não é a tela.
- A seção de imagens é a que o modelo do repositório já tem. Não abra outra.
- A porta do Storybook está no script daquele projeto. Não reaproveite a porta de outro app.
- Uma frase de exemplo parece inofensiva numa story. A evidência mostra o texto como se fosse do negócio.
- Uma mudança que não mexe na cor parece não depender do tema. A página em volta muda com o tema, e a evidência precisa mostrar isso.
- O sublinhado do hover parece cobrir o teclado. O foco tem a regra própria `:focus-visible`, e só o anel de foco não é o mesmo efeito.
- WebKit parece Safari. É o mesmo motor, mas não o aplicativo.
- `figure` e `figcaption` parecem a forma certa de legendar. O GitHub remove as duas tags da descrição do pull request.
- O clique sem erro parece o aviso fechado. Olhe a imagem: um clique que não achou o botão também não falha.
- O aviso de cookies parece estar na tela desde a carga. Em muitos sites ele nasce depois da primeira rolagem.
- A linha de comando do GitHub parece publicar o pull request inteiro. Ela não sobe imagem: o envio passa pelo navegador.
- O efeito da correção aplicado à mão na produção parece o depois. É uma simulação, e o código da mudança pode se comportar diferente.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
