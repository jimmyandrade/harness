---
name: dividir-mensagem
description: Decide como o rascunho de uma mensagem sai, em mensagens curtas por ideia, numa só ou em partes numeradas pelo limite de caracteres, e devolve as mensagens na ordem do envio com a contagem de cada uma. Usada quando um texto de WhatsApp vai ser mostrado ou enviado, ou quando passa do limite. Não serve para escrever o texto, enviar a mensagem nem decidir o tom.
metadata:
  author: jimmyandrade
  version: "0.1.1"
  related:
    - comunicar-novidade-do-produto
    - conversar-no-whatsapp
    - evoluir-habilidade
---

# Dividir mensagem

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Dividir em mensagens curtas`: `sim` divide o rascunho em mensagens, uma por ideia. `não` não divide por ideia: o rascunho vai inteiro, até o `Limite de caracteres por mensagem`.
"Dividir em mensagens curtas": "sim"
# `Vários assuntos no rascunho` vale quando o rascunho tem mais de um assunto que pede resposta. `lista numerada` manda uma mensagem, dentro do `Limite de caracteres por mensagem`, com a abertura e um item numerado por assunto, para a pessoa responder pelo número. `mensagens separadas` manda uma mensagem por assunto.
"Vários assuntos no rascunho": "lista numerada"
# `Mensagem única para` lista os tipos de mensagem que não se dividem por ideia e vão numa mensagem, dentro do `Limite de caracteres por mensagem`, como um status de demanda para alguém do time.
"Mensagem única para": []
# `Comunicado numa mensagem só`: `sim` não divide o comunicado de produto por ideia, e ele vai numa mensagem dentro do `Limite de caracteres por mensagem`. `não` segue `Dividir em mensagens curtas`.
"Comunicado numa mensagem só": "sim"
# `Fechamento em mensagem separada`: `sim` manda a despedida numa mensagem própria, depois das outras. `não` deixa a despedida no fim da última mensagem.
"Fechamento em mensagem separada": "sim"
# `Limite de caracteres por mensagem` é o tamanho acima do qual o canal corta a mensagem com "Ler mais" e quem lê perde o fim. Cada mensagem enviada cabe nele, e o padrão vale quando o projeto não muda o número. O limite vale para todo tipo de rascunho.
"Limite de caracteres por mensagem": 600
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Com `Dividir em mensagens curtas` em `sim`, como as pessoas costumam escrever no WhatsApp, divida o rascunho em mensagens, uma por ideia.

Dois assuntos que pedem resposta, como uma análise que se espera e uma extensão que se pede, nunca dividem o mesmo parágrafo. Eles seguem `Vários assuntos no rascunho`, e não a divisão por ideia.

Um rascunho de um tipo listado em `Mensagem única para` não se divide por ideia: vai numa mensagem, com uma linha em branco entre as ideias, até o limite.

Com `Comunicado numa mensagem só` em `sim`, o comunicado de produto também não se divide por ideia, como `comunicar-novidade-do-produto` manda. Um pedido que acompanha o anúncio vai em outra mensagem, depois do comunicado.

Com `Fechamento em mensagem separada` em `sim`, a despedida vai numa mensagem própria, a última.

### Passo 2

Conte os caracteres de cada mensagem do texto aprovado. Acima de `Limite de caracteres por mensagem`, divida em partes que cabem no limite, na mesma ordem, cortando só entre parágrafos ou entre itens de lista, nunca no meio de uma frase nem de um item numerado. Numa lista numerada, cada parte mantém o número do item.

A saudação fica na primeira parte, e o fechamento pode ser uma parte à parte.

O limite vale para todo rascunho, inclusive os de `Mensagem única para`, o comunicado e a lista numerada, e mesmo quando o pedido diz "uma mensagem só" ou "sem dividir". Nesse caso avise uma vez, antes do sim, que o texto passa do limite e vai em partes. Envie como mensagem única só se a pessoa insistir por escrito depois do aviso.

### Passo 3

Devolva as mensagens na ordem do envio, numeradas (Mensagem 1, Mensagem 2), com a contagem de caracteres de cada uma, para o sim da pessoa valer para elas. Cada parte sai inteira, depois da anterior, uma de cada vez.

Mostre cada mensagem num bloco de código próprio, na ordem do envio, para o texto inteiro ficar à vista e a formatação do canal sobreviver à cópia. Uma mensagem por assunto quando o texto vai dividido. Um texto em partes leva "Mensagem N de M" e a contagem de caracteres de cada bloco.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Texto acima do limite enviado inteiro

Se você mandar numa mensagem só o texto que passa do limite, o canal corta o fim com "Ler mais" e a pessoa que lê perde o pedido.

1. Conte os caracteres de cada mensagem antes de pedir o sim.
2. Acima do limite, divida entre parágrafos ou itens de lista.
3. Mostre as partes numeradas com a contagem de cada uma.

### Dois assuntos no mesmo parágrafo

Se você juntar um pedido de resposta com outro no mesmo parágrafo, a pessoa responde um e esquece o outro.

1. Siga `Vários assuntos no rascunho`.
2. Na lista numerada, abra com o contexto e dê um item por assunto.
3. Em mensagens separadas, mande uma por assunto.

### Pedido junto do comunicado

Se você puser o pedido na mesma mensagem do comunicado de produto, o comunicado perde a leitura limpa e o pedido passa despercebido.

1. Mande o comunicado numa mensagem só.
2. Mande o pedido em outra mensagem, depois.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### um aviso de pagamento, o comprovante e um pedido de confirmação, com despedida

Dividi por ideia: o aviso numa mensagem, o pedido noutra e a despedida sozinha, a última. Todas cabiam no limite. Mostrei as quatro numeradas, com a contagem de cada uma.

### um texto de 900 caracteres com saudação, três parágrafos e despedida

Passava do limite. Cortei entre parágrafos em duas partes, deixei a saudação na primeira e a despedida à parte. Mostrei as três com a contagem, para o sim valer para as três.

## Casos-limite

- O pedido diz "uma mensagem só" e o texto passa do limite: avise uma vez, antes do sim, e envie em partes. Só envie inteiro se a pessoa insistir por escrito.
- O rascunho é de um tipo em `Mensagem única para` e passa do limite: o limite vale, e ele vai em partes.
- A lista numerada passa do limite: corte entre itens e mantenha o número de cada item.
- Uma frase sozinha passa do limite: corte no fim de uma frase anterior, nunca no meio.

## Pegadinhas

- "Uma mensagem só" parece pedir para ignorar o limite. O limite vale para todo rascunho, e o aviso vem uma vez, antes do sim.
- O comunicado numa mensagem só parece isento do limite. Ele também vai em partes quando passa.
- A despedida sozinha parece mensagem à toa. Com `Fechamento em mensagem separada` em `sim`, ela é a última mensagem.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
