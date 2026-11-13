---
name: entregar-rascunho-de-mensagem
description: Entrega à pessoa o rascunho de uma mensagem que ela vai enviar, no chat ou numa página aberta no painel com uma caixa de marcar o que já foi enviado, e cria o rascunho no Slack. Usada quando o texto já está escrito e falta entregá-lo. Não serve para redigir o texto, enviar a mensagem nem comparar com o publicado.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - enviar-mensagem-no-slack
    - evoluir-habilidade
---

# Entregar rascunho de mensagem

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Entrega dos rascunhos` é `chat` ou `artefato`. Com `chat`, o texto inteiro vai na resposta. Com `artefato`, os rascunhos pendentes ficam numa página única, aberta no painel da sessão, com uma caixa de marcar para o que já foi enviado.
"Entrega dos rascunhos": "chat"
# `Limite de rascunhos por canal` é quantos rascunhos você cria num mesmo canal nesta sessão, porque o Slack guarda poucos por canal.
"Limite de rascunhos por canal": "1"
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Receba o texto já escrito, o destino e, quando a mensagem é agendada, o horário.
O texto é de quem o redigiu: não o reescreva aqui.
O destino é o link direto da thread ou da mensagem onde o texto vai.
O link é o endereço absoluto do Slack, com o canal e o horário da mensagem e, numa resposta, o da thread-pai.
Não diga só que o rascunho está pronto.

### Passo 2

Entregue o texto como `Entrega dos rascunhos` manda.
Com `chat`, mostre o texto inteiro na resposta, com o link do destino.

Com `artefato`, o rascunho nunca fica só no chat.
Uma página única fica aberta no painel da sessão com todos os rascunhos pendentes.
Cada rascunho tem o texto exato, o destino com link, o horário quando agendado, uma nota curta e uma caixa de marcar como enviado.
A página guarda cada rascunho como um registro num banco dela, com a ordem, o título, o destino, o texto, a nota, se foi enviado e quando.
Assim você acrescenta, muda ou marca um rascunho sem publicar a página de novo.
Um rascunho novo entra no fim da lista.
Depois de enviado, ele desce para a seção `Já enviados`.
A caixa é da pessoa: se ela já marcou como enviado, não desmarque.
Atualize a mesma página quando um rascunho nasce ou é enviado, em vez de abrir outra.
Use o estilo padrão da página, sem esforço de design.
A resposta cita a página.
Sem a ferramenta de página na sessão, entregue no chat e diga isso.

### Passo 3

Crie o rascunho no Slack.
Antes, conte os rascunhos que você já criou nesse canal nesta sessão.
Com a conta no `Limite de rascunhos por canal`, não crie outro: o Slack guarda poucos rascunhos por canal e o novo apagaria um existente sem avisar.
Avise isso e entregue o texto pronto para colar, com o link da thread.
Diga que a menção colada vira texto puro e precisa ser digitada de novo no compositor, escolhendo a pessoa na lista.

Se o Slack recusar criar o rascunho, como num canal compartilhado com outra organização, entregue o texto pronto do mesmo jeito.
Nunca diga que existem vários rascunhos no mesmo canal.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Segundo rascunho no mesmo canal

Se você criar um segundo rascunho num canal que já tem um, o Slack aceita e apaga o primeiro sem erro. A pessoa não acha o que esperava.

1. Conte os rascunhos que você criou no canal.
2. No limite, avise e entregue o segundo texto pronto para colar.
3. Mude o limite só quando a pessoa disser que o Slack passou a aceitar mais de um.

### Menção colada como texto

Se você entregar um texto pronto para colar com `<@ID>` ou `@Nome`, a pessoa cola e o Slack mostra texto puro, sem notificar ninguém.

1. Avise que as menções precisam ser digitadas de novo.
2. Prefira o rascunho criado pela ferramenta, que converte a menção.

### Link no formato do rótulo

Se você entregar um link como `<url|rótulo>` para colar, o editor mostra o link gigante e os símbolos `<`, `|` e `>`.

1. Use markdown padrão, `[rótulo](url)`.
2. Com mais de um link, entregue o texto como rascunho.

### Rascunho sem o link do destino

Se você entregar o texto sem o link da thread, a pessoa procura onde responder.

1. Devolva sempre o endereço absoluto da thread ou da mensagem, junto do texto.

### Rascunho só no chat

Se você deixar o rascunho só na resposta com `Entrega dos rascunhos` em `artefato`, ele sobe com a conversa e a pessoa perde o que falta enviar.

1. Ponha o texto na página, com o destino e a caixa de marcar.
2. Cite a página na resposta.
3. Sem a ferramenta de página, entregue no chat e diga isso.

### Caixa desmarcada

Se você atualizar a página e regravar a lista sem ler o que a pessoa marcou, ela perde a marca de um rascunho que já enviou.

1. Leia o registro de cada rascunho antes de mudar a lista.
2. Mude só o rascunho que nasceu ou foi enviado.
3. Não desmarque o que a pessoa marcou.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Mande o mesmo aviso ao Caio no mesmo canal

O canal já tem um rascunho meu desta sessão e o limite é 1.
Não criei outro, porque apagaria o primeiro.
O texto do Caio está pronto para colar, com o link da thread dele.
As menções precisam ser digitadas de novo no compositor.

### Deixe os rascunhos da revisão para eu enviar, com `Entrega dos rascunhos` em `artefato`

A página já estava aberta no painel com um rascunho pendente.
Acrescentei os dois novos no fim da lista, cada um com o texto exato, o link da thread, a nota e a caixa de marcar.
O primeiro, que a pessoa já tinha marcado como enviado, ficou em `Já enviados` e a marca ficou como estava.
A resposta cita a página.

## Casos-limite

- Canal compartilhado com outra organização, onde o Slack recusa o rascunho: entregue o texto pronto para colar, com o link da thread.
- Sem a ferramenta de página na sessão e com `artefato`: entregue no chat e diga isso.
- A pessoa pede o texto de uma mensagem que ainda não está escrito: a redação é de `enviar-mensagem-no-slack`, que volta aqui com o texto pronto.

## Pegadinhas

- Um rascunho de resposta numa thread conta como rascunho do canal inteiro, não só da thread.
- O endereço de uma mensagem usa o horário dela sem o ponto, depois de um `p`. Numa resposta, a thread-pai vai junto no endereço.
- O chat parece um bom lugar para o rascunho, mas ele sobe com a conversa. A página aberta no painel fica no lugar.
- A caixa de marcar parece só do agente. A pessoa também a marca, e a marca dela não se desfaz.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
