---
name: mensagens-do-whatsapp
description: Formato do rascunho de mensagens de WhatsApp mostrado no chat antes do envio, com a conversa de destino, um bloco por mensagem, a mensagem citada, o fechamento e a pergunta que pede o sim.
metadata:
  version: "0.4.0"
---

## Contexto

Use este modelo para mostrar à pessoa, no chat, o rascunho de uma ou mais mensagens de WhatsApp antes do envio. A habilidade `conversar-no-whatsapp` lê este modelo quando gera o rascunho e decide, pelos parâmetros dela, se o texto vai dividido em mensagens curtas e se o fechamento vai sozinho.

## Formato

**Conversa:** <nome da conversa de destino>

<O que o rascunho acrescenta ao que já foi dito na conversa, numa linha.>

**1.** Responde a: "<trecho da mensagem da outra pessoa que esta responde, com a data>"

```
<texto exato da mensagem 1>
```

**2.**

```
<texto exato da mensagem 2, que não responde a uma mensagem específica>
```

**3.** Fechamento

```
<texto do fechamento>
```

<Pergunta que pede o sim para esta conversa e este texto, com a frequência e o prazo do acompanhamento quando a mensagem espera resposta.>

## Estilo

Um bloco de código por mensagem, na ordem do envio, para o texto inteiro ficar à vista e a formatação do WhatsApp sobreviver à cópia. Uma mensagem por assunto quando o texto vai dividido; com um assunto só, uma mensagem, desde que caiba no `Limite de caracteres por mensagem` de `conversar-no-whatsapp`. Acima do limite, o texto vai em partes numeradas, cada bloco com "Mensagem N de M" e a contagem de caracteres dele, para o sim valer para as partes. Com mais de um assunto que pede resposta, o assunto nunca divide parágrafo com outro: pela `lista numerada`, a mensagem abre com o contexto e traz um item numerado por assunto, cada um com o pedido dele, em linhas próprias (`1.`, `2.`); por `mensagens separadas`, cada assunto tem a sua mensagem. A mensagem que responde a algo diz em cima qual mensagem da outra pessoa ela cita, mesmo que seja de semanas atrás. A que não responde a nada vai sem a linha de citação. O fechamento, como uma despedida, vai num bloco próprio quando vai sozinho, e senão fica no fim da última mensagem.

O texto não usa Markdown: negrito é um asterisco de cada lado, itálico é sublinhado, e não há título nem link entre colchetes. Toda data vai por extenso, com o dia da semana e a data completa, nunca só "até quinta" nem só a data.

Com a ferramenta de widget na sessão, o widget vem sempre, além dos blocos, não no lugar deles, com o destinatário, um campo editável por mensagem, com a altura do texto inteiro, sem rolagem nem linhas escondidas, um botão para copiar e um botão que manda o texto aprovado de volta ao chat. A pergunta que pede o sim vem depois do texto, na mesma resposta. Se a pessoa editar, a versão dela substitui o rascunho e aparece de novo neste formato antes do sim.

## Divisão, limite e apresentação

Com `Dividir em mensagens curtas` em `sim`, como as pessoas costumam escrever no WhatsApp, divida o rascunho em mensagens, uma por ideia.
Dois assuntos que pedem resposta, como uma análise que se espera e uma extensão que se pede, nunca dividem o mesmo parágrafo. Eles seguem `Vários assuntos no rascunho`, e não a divisão por ideia.
Cada mensagem que responde a algo cita a mensagem da outra pessoa que ela responde, mesmo de semanas atrás: ache-a lendo a conversa inteira.
Com `Fechamento em mensagem separada` em `sim`, a despedida vai numa mensagem própria, a última.
Envie na mesma ordem, uma de cada vez.
Um rascunho de um tipo listado em `Mensagem única para` não se divide por ideia: vai numa mensagem, com uma linha em branco entre as ideias, até o limite.
Com `Comunicado numa mensagem só` em `sim`, o comunicado de produto também não se divide por ideia, como `comunicar-novidade-do-produto` manda.
Conte os caracteres de cada mensagem do texto aprovado. Acima de `Limite de caracteres por mensagem`, divida em partes que cabem no limite, na mesma ordem, cortando só entre parágrafos ou entre itens de lista, nunca no meio de uma frase nem de um item numerado. Numa lista numerada, cada parte mantém o número do item.
A saudação fica na primeira parte, e o fechamento pode ser uma parte à parte.
Mostre as partes numeradas (Mensagem 1, Mensagem 2) com a contagem de cada uma, para o sim valer para elas. Cada parte sai inteira, depois da anterior.
O limite vale para todo rascunho, inclusive os de `Mensagem única para`, o comunicado e a lista numerada, e mesmo quando o pedido diz "uma mensagem só" ou "sem dividir". Nesse caso avise uma vez, antes do sim, que o texto passa do limite e vai em partes. Envie como mensagem única só se a pessoa insistir por escrito depois do aviso.
Um pedido que acompanha o anúncio vai em outra mensagem, depois do comunicado, e o comunicado se escreve em `comunicar-novidade-do-produto`.
Numa conversa já aberta com a pessoa, a mensagem não diz quem escreve nem de qual empresa: o nome da conversa já diz. Quem ainda não conhece quem escreve é apresentado uma vez, na primeira mensagem, com o nome e a empresa. Depois, nem a abertura repete a apresentação nem o fim leva assinatura.
