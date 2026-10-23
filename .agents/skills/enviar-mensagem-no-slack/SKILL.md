---
name: enviar-mensagem-no-slack
description: Redige uma mensagem de Slack, num canal, thread ou DM, e entrega o rascunho com o link do destino. Só envia com a autorização explícita da pessoa e, depois do envio, compara o proposto com o aplicado para alimentar o vocabulário. Usada quando a pessoa pede uma mensagem ou resposta no Slack. Não serve para achar conversa antiga nem cadastrar pessoa.
metadata:
  author: jimmyandrade
  version: "0.3.0"
  internal: true
  notion: "false"
  related:
    - definir-pessoa
    - definir-vocabulario
    - evoluir-habilidade
    - redigir-com-tom-de-voz
---

# Enviar mensagem no Slack

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um parâmetro vazio não impõe regra.

```yaml
"Limite de rascunhos por canal": "1"
"Retroalimentar o vocabulário": "sim"
"Modo de aprendizado": "perguntar"
"Estrutura do post em canal": ""
"Estrutura da mensagem": ""
"Estilo de escrita": ""
"Formato de menção e de nome": ""
"Formato de link": ""
"Destaque no texto": ""
"Saudação": ""
"Resposta em DM": ""
"Correção de mensagem publicada": ""
"Contexto compartilhado": ""
"Assuntos que não se resolvem no Slack": ""
```

## Instruções

### Passo 1

Peça o destino e o assunto: canal, thread ou DM, para quem e o que dizer. Leia a thread inteira antes de responder nela, e as threads e os links que ela cita.

Se o assunto é um dos `Assuntos que não se resolvem no Slack`, como uma decisão ou dúvida de código que pertence ao pull request, não redija resposta de mérito: diga a quem usa a habilidade para onde o assunto vai e, se couber, redija só uma frase de status.

Mensagem nova num canal, que não é resposta, tem o assunto conferido com o propósito do canal. Use o que o Slack informa do canal, ou o registro de canais do projeto. Se o assunto não bate com o propósito, diga isso e pergunte uma vez em qual canal postar. Não escolha o canal só porque a conversa anterior foi lá.

### Passo 2

Resolva cada pessoa citada pelo ID dela no Slack, buscando no Slack. Uma pessoa que não está no registro de pessoas do projeto vai para `definir-pessoa`. Não adivinhe o ID nem o nome.

### Passo 3

Escreva o texto com `redigir-com-tom-de-voz`, e passe o contexto: canal ou DM, e a pessoa ou o canal, para a consulta do vocabulário usar as tags certas. Aplique os parâmetros de escrita que estiverem preenchidos: `Estrutura do post em canal`, `Estrutura da mensagem`, `Estilo de escrita`, `Saudação`, `Destaque no texto`, `Contexto compartilhado` e, em DM, `Resposta em DM`.

Termos proibidos e alternativas vêm do vocabulário, não desta habilidade.

### Passo 4

Ajuste o formato do Slack, valendo para qualquer texto:

- Troque o nome de quem é citado pela menção real, com o ID do Passo 2. Aplique `Formato de menção e de nome`.
- Todo PR, issue ou recurso citado por número ou chave leva link de verdade em cima do identificador, em markdown padrão. Aplique `Formato de link`.
- Um texto com link nunca segue a sintaxe `<url|rótulo>`: o editor do Slack não a interpreta e mostra tudo cru.
- Emoji padrão do Slack vai no formato `:nome:`, nunca o caractere unicode.
- Identificador técnico, como nome de projeto, de branch ou de label, vai entre crases.
- Resposta a uma mensagem vai na thread dela. Aplique `Resposta em DM` quando for DM.

### Passo 5

Mostre o texto inteiro no chat, com o link direto da thread ou da mensagem onde ele vai. Não diga só que o rascunho está pronto. O link tem a forma de um endereço absoluto do Slack, com o canal e o horário da mensagem, e, numa resposta, o da thread-pai.

Crie o rascunho no Slack. Antes, conte os rascunhos que você já criou nesse canal nesta sessão. Com a conta no `Limite de rascunhos por canal`, não crie outro: o Slack guarda poucos rascunhos por canal e o novo apagaria um existente sem avisar. Avise isso e entregue o texto pronto para colar, com o link da thread. Diga que a menção colada vira texto puro e precisa ser digitada de novo no compositor, escolhendo a pessoa na lista.

Se o Slack recusar criar o rascunho, como num canal compartilhado com outra organização, entregue o texto pronto do mesmo jeito. Nunca diga que existem vários rascunhos no mesmo canal.

### Passo 6

Envie só com a autorização explícita da pessoa a esse texto e a esse destino. O sim vale para uma mensagem: outra mensagem pede outro sim. Nunca envie por conta própria, nunca agende e nunca mande fora do horário que a pessoa deu.

Em execução agendada ou automática, não envie: deixe o rascunho e o texto no resumo, com o link da thread. Um texto de resposta a uma pessoa passa antes pela leitura de quem usa a habilidade.

Depois de enviar, leia a mensagem publicada, confira que aparece no destino certo e devolva o link dela.

### Passo 7

Quando a pessoa disser que enviou, ou que mandou do jeito que ela editou, leia a mensagem publicada, pelo link ou pela thread. Compare com o rascunho que você propôs, trecho por trecho. O conector do Slack pode acrescentar um rodapé de ferramenta depois do envio: não conte isso como mudança da pessoa.

Antes de atribuir autoria a qualquer trecho, em nota ou em registro, leia a mensagem publicada e confira, trecho por trecho, o que veio do rascunho e o que a pessoa escreveu. Um trecho que está na mensagem publicada e não está no rascunho é da pessoa: nunca escreva que o rascunho trazia esse trecho. Se não conseguiu ler a mensagem publicada, não atribua: diga que não conferiu.

Sem diferença, diga que o rascunho foi aceito como estava e pare. Com diferença, e com `Retroalimentar o vocabulário` em `sim`, passe o que mudou para `definir-vocabulario`, que registra os termos trocados com as tags da pessoa ou do canal, e para `redigir-com-tom-de-voz`, que aprende os padrões de estilo. Diga o que foi registrado.

Conteúdo de DM serve só para derivar um padrão. Não copie um trecho literal dele para outro contexto.

### Passo 8

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

### Mensagem enviada sem sim

Se você enviar uma mensagem porque a pessoa pediu o texto, ela perde a chance de revisar e de escolher o horário.

1. Mostre o texto e o destino.
2. Espere o sim a essa mensagem.
3. Depois de enviar, devolva o link.

### Rascunho sem o link do destino

Se você entregar o texto sem o link da thread, a pessoa procura onde responder.

1. Devolva sempre o endereço absoluto da thread ou da mensagem, junto do texto.

### Autoria atribuída sem conferir a mensagem publicada

Se você escreve na nota que o rascunho dizia certa frase sem ler a mensagem publicada, pode atribuir ao rascunho uma frase que a pessoa escreveu, e o vocabulário aprende o contrário do que aconteceu.

1. Leia a mensagem publicada antes de escrever a nota.
2. Procure cada frase da nota no rascunho que você propôs. Se ela não está lá, é da pessoa.
3. Escreva "a pessoa acrescentou X", nunca "o rascunho dizia X". Sem a leitura, diga que não conferiu.

Exemplo: o rascunho dizia "Segue o relatório." e a mensagem publicada diz "Segue o relatório. Qualquer dúvida, me chama.". A segunda frase é da pessoa. A nota registra que ela acrescentou o convite a perguntar.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Avise a Ana na thread do pedido que os ajustes saíram

Li a thread inteira e achei a mensagem da Ana. Resolvi a menção dela pelo ID do Slack e escrevi o texto no tom de voz. O rascunho está no chat e criado na thread, com o endereço da mensagem da Ana. Não enviei: espero o seu sim a esse texto.

### Mande o mesmo aviso ao Caio no mesmo canal

O canal já tem um rascunho meu desta sessão e o limite é 1. Não criei outro, porque apagaria o primeiro. O texto do Caio está pronto para colar, com o link da thread dele. As menções precisam ser digitadas de novo no compositor.

### Eu enviei, pode comparar

Li a mensagem publicada na thread e comparei com o rascunho. Você trocou duas expressões e tirou uma frase. Passei as trocas para o vocabulário, com a tag da Ana, e o padrão de frase mais curta para o tom de voz. O rodapé do conector não contou como mudança.

## Casos-limite

- Canal compartilhado com outra organização, onde o Slack recusa o rascunho: entregue o texto pronto para colar, com o link da thread.
- A pessoa pede para agendar o envio: não agende. Entregue o rascunho e espere o sim no horário em que ela quiser enviar.
- A pessoa citada não aparece na busca do Slack: pergunte uma vez, ou use `definir-pessoa` se ela é nova no projeto.
- Mensagem enviada sem nenhuma diferença do rascunho: diga que foi aceita como estava e não registre nada.
- Execução agendada: deixe o rascunho e o texto no resumo, com o link da thread. Não envie.
- O destino é uma DM: use só as regras de DM, e não o tom ambiente de um canal.

## Pegadinhas

- Um rascunho de resposta numa thread conta como rascunho do canal inteiro, não só da thread.
- O endereço de uma mensagem usa o horário dela sem o ponto, depois de um `p`. Numa resposta, a thread-pai vai junto no endereço.
- Menção só vira menção quando o texto vai pela ferramenta de rascunho ou de envio. Colada à mão, vira texto puro.
- O conector do Slack pode acrescentar um rodapé de ferramenta depois do envio, fora do texto que você mandou.
- Uma mensagem com um link só pode ir como texto pronto. Com dois ou mais, o rascunho evita o formato do rótulo cru.
- Uma frase que está na mensagem publicada e não está no rascunho é da pessoa, não do rascunho. A autoria só se atribui depois de ler a mensagem publicada.
- A busca de pessoa por e-mail completo pode não achar ninguém. Procure pelo nome.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
