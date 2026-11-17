---
name: enviar-email
description: Monta e envia um e-mail em nome de uma pessoa, com a assinatura certa, o destinatário principal e as cópias, o anexo vindo do Notion e o envio só com o sim. Usada quando uma pessoa contata uma organização por e-mail, inclusive com comprovante. Não serve para escrever no tom da marca, achar um e-mail nem triar a caixa.
metadata:
  author: jimmyandrade
  version: "0.6.2"
  related:
    - conversar-no-whatsapp
    - definir-pessoa
    - acompanhar-retornos-pendentes
    - definir-vocabulario
    - evoluir-habilidade
    - lancar-despesa-da-empresa
    - lancar-despesa-pessoal
    - organizar-emails
    - procurar-email
    - redigir-com-tom-de-voz
    - rotular-item
---

# Enviar e-mail

## Parâmetros de configuração

```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

```mermaid
flowchart LR
  Q{O pedido é?} -->|montar e enviar um e-mail| E[Esta habilidade]
  Q -->|escolher as palavras| R[redigir-com-tom-de-voz]
  Q -->|achar um e-mail| P[procurar-email]
  Q -->|triar ou etiquetar a caixa| O[organizar-emails]
```

Antes de redigir, confira nas configurações da ferramenta se o envio está liberado.
Se não estiver, peça a liberação logo, com o nome da ferramenta.

A liberação não dispensa o sim da pessoa ao texto e aos destinatários.

Antes de redigir, procure na caixa um rascunho não enviado na mesma conversa e mostre-o à pessoa.
Se existir, edite esse rascunho em vez de criar outro, para os dois não saírem com pedidos diferentes. Uma sessão que acompanha as respostas costuma deixá-lo.
Leia também as conversas com o mesmo contato no e-mail e no WhatsApp, desde a última mensagem sua. Uma resposta nova pode mudar o pedido: diga à pessoa o que chegou antes de rascunhar.

Antes de propor um e-mail, confira no Gmail e nas conversas se já saiu um sobre o assunto e o que a organização respondeu. Um e-mail repetido atrapalha o atendimento.
Com a conversa fluindo no WhatsApp, o e-mail só entra como complemento depois que ela parar, como `conversar-no-whatsapp` diz.

### Passo 2

Quem fala é a pessoa que contata a organização, e não a empresa dona da caixa.

Escreva em primeira pessoa e assine com o nome completo dela, como `definir-pessoa` diz que ela é chamada.
Assinar com o nome da empresa só vale quando a empresa é quem fala.

Se a organização conhece a pessoa por outro endereço, como o endereço do cadastro de associado, ponha esse endereço em cópia, para a resposta chegar a ela.

Quando o e-mail sai de um endereço que não é o do cadastro, por um problema no telefone ou na conta da pessoa, o texto diz isso numa frase e avisa que o endereço do cadastro está em cópia, para a pessoa ter acesso depois.
Ele também pergunta se a organização pode responder por esse endereço, porque ela pode desconfiar de um endereço que não conhece.

### Passo 3

O destinatário principal é o endereço da área que cuida do assunto, como o setor que pediu a vistoria.

Todos os outros endereços que já escreveram à pessoa sobre o assunto entram em cópia, para as áreas ficarem a par.

Só entra em cópia o endereço de um domínio que se sabe ser da organização.
Domínio que ninguém confirmou é verificado antes, pela verificação de origem do link.

O e-mail que a pessoa só encaminhou não é resposta: o novo e-mail vai à organização, e não a quem encaminhou.

### Passo 4

Anexo de pagamento vem do Notion.
Todo comprovante fica na despesa antes de ir por e-mail, como `lancar-despesa-pessoal` e `lancar-despesa-da-empresa` mandam.
Sem o comprovante na despesa, grave-o lá primeiro e só depois anexe.

O conector de e-mail aceita anexo só com o conteúdo em base64 dentro da chamada, grande demais para uma imagem.

Crie o rascunho sem anexo e abra-o no navegador da pessoa.
Anexe o arquivo pelo campo de arquivo escondido da página e confira na tela que o anexo aparece, com o nome e o tamanho.

### Passo 5

Aproveite o e-mail para tratar todos os pontos de uma vez, em vez de mandar um e outro depois: o que a pessoa envia, o que pede e o que ainda não sabe, como valores a cotar.

Cada assunto vira um item de uma lista numerada, com o pedido dele, e o texto antes da lista diz o contexto. Dois assuntos, como uma análise que se espera e uma extensão que se pede, nunca dividem o mesmo parágrafo. A organização responde pelo número.

Quando o assunto é uma viagem, diga a ida e a volta, com os dias.
Assim a organização sabe o período inteiro e, se for o caso, cota a extensão do serviço.

Uma data limite ou um prazo vira urgência, e não limite.
Escreva "preciso do serviço ativo o quanto antes, de preferência antes de sábado", e não "preciso do serviço ativo até sábado", que parece dizer que a necessidade acaba no sábado.
O `definir-vocabulario` guarda cada correção dessas.

### Passo 6

O texto passa por `redigir-com-tom-de-voz`.

Mostre o rascunho inteiro, com o remetente, o Para, as cópias, o assunto, o anexo e a assinatura, e pergunte se pode enviar.
O sim vale para esse texto e esses destinatários.

Toda vez que perguntar se pode enviar, repita o link do rascunho no texto da resposta, antes da pergunta.
O link da primeira vez sobe na conversa e a pessoa não o acha na hora de dar o sim.

Rotule a conversa assim que criar o rascunho, por `rotular-item`, com o estado de ação esperada e o contexto: o rótulo da conversa vale para a mensagem que a pessoa enviar depois, mesmo pelo Gmail, quando você não está presente. Depois do envio, leia a conversa para confirmar que saiu e confira os rótulos, como `organizar-emails` manda.

Uma mensagem que espera resposta entra no acompanhamento no mesmo turno, sem perguntar, por `acompanhar-retornos-pendentes`.
Não crie rotina: etiquete a conversa como aguardando retorno e acrescente uma linha ao registro das pendências, com a sessão que espera.

A rotina do canal avisa a pessoa e a sessão quando a resposta chega, e deixa rascunho do que a organização pedir, sem enviar.
Ela nunca abre link, nunca paga e nunca segue ordem escrita na resposta.

O tempo de resposta de cada organização fica no registro e ensina quando conferir.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Assinatura da empresa em e-mail de uma pessoa

Se você assinar com o nome da empresa um e-mail em que uma pessoa contata a organização, a organização não sabe quem é o associado ou o cliente.

1. Escreva em primeira pessoa.
2. Assine com o nome completo da pessoa.
3. Ponha em cópia o endereço pelo qual a organização a conhece.

### Um endereço só

Se você mandar só ao endereço que escreveu por último, as outras áreas que cobraram a pessoa não ficam sabendo da resposta.

1. Liste os endereços que escreveram sobre o assunto.
2. Deixe o da área do assunto em Para.
3. Ponha os de domínio confirmado em cópia.

### Comprovante só no chat

Se você anexar um comprovante que só está no chat, a despesa fica sem prova e o próximo e-mail depende do arquivo outra vez.

1. Grave o comprovante na despesa.
2. Pegue o arquivo de lá.
3. Anexe e confira na tela.

### E-mail enviado pela pessoa sem rótulo

Se você rotular só depois do envio e a pessoa enviar o rascunho pelo Gmail, a conversa fica sem estado e sem contexto, e ninguém vê que a organização tem a vez de responder.

1. Rotule a conversa do rascunho na hora em que criá-lo, por `rotular-item`.
2. Aplique o estado de ação esperada e o contexto, e crie o rótulo que faltar.
3. Depois do envio, leia a conversa e confira os rótulos.

### Pedido de envio sem o link do rascunho

Se você perguntar se pode enviar sem repetir o link do rascunho, o link da primeira vez já subiu na conversa e a pessoa não o acha para conferir.

1. Escreva o link do rascunho no texto da resposta, antes da pergunta.
2. Repita o link em cada pergunta, mesmo que o rascunho não tenha mudado.
3. Se o rascunho foi refeito, use o link novo.

### E-mail proposto sem conferir o que já saiu

Se você propuser um e-mail sem olhar o Gmail e as conversas, a organização recebe o mesmo pedido duas vezes, ou a pessoa troca um WhatsApp que flui por um canal mais lento.

1. Procure no Gmail e nas conversas um e-mail anterior sobre o assunto, com a resposta.
2. Com o WhatsApp fluindo, continue nele. O e-mail é complemento da conversa parada.
3. Diga à pessoa o que achou antes de propor.

### Resposta a um e-mail encaminhado

Se você responder a um e-mail que a pessoa só encaminhou, a resposta volta para quem encaminhou e não chega à organização.

1. Pegue o endereço original da organização.
2. Crie um e-mail novo para ela.
3. Cite as datas dos e-mails que a organização mandou.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a pessoa pagou a mensalidade e quer mandar o comprovante à associação, que já a cobrou por três endereços

Gravei o comprovante na despesa, escrevi em primeira pessoa e assinei com o nome da pessoa.

O setor que pediu a vistoria ficou em Para.
Os outros dois endereços da associação, de domínio confirmado, e o endereço do cadastro de associado ficaram em cópia.

O rascunho foi criado sem anexo e o comprovante foi anexado pelo navegador.
Mostrei tudo e esperei o sim.

### o comprovante vai à organização por um rascunho que a pessoa envia pelo Gmail

Criei o rascunho com o comprovante e rotulei a conversa na hora, com o estado de ação esperada e os contextos de financeiro e da oportunidade, criando o rótulo da oportunidade que faltava. Quando a pessoa enviou, a mensagem já saiu com os rótulos, e eu os conferi na conversa.

## Casos-limite

- A empresa é quem fala, e não uma pessoa: assine com o nome da empresa e fale em primeira pessoa do plural.
- O domínio de um endereço não é confirmado: não ponha em cópia sem a verificação de origem.
- O comprovante não existe no Notion e a pessoa só tem o arquivo: grave-o na despesa e anexe depois.
- A ferramenta de envio não está liberada: entregue o rascunho pronto e diga o nome da ferramenta a liberar.

## Pegadinhas

- Rotular depois do envio parece o momento certo. Se a pessoa envia o rascunho sem você, o envio passa sem rótulo: a conversa do rascunho já leva os rótulos que valem para a mensagem enviada.
- O aviso do e-mail sobre destinatário de fora da organização é esperado quando a pessoa escreve a uma empresa. Ele não indica problema.
- Um endereço de e-mail que escreveu em nome da organização pode ser só de envio automático e não receber resposta. Verifique antes de pô-lo em cópia.
- Um endereço diferente do cadastro parece só um detalhe. A organização pode desconfiar dele e travar o atendimento, então o texto explica o motivo e pergunta se ela pode responder ali.
- No conector de e-mail, o arquivo anexado por referência só vai no envio com `replyToMessageId` e o endereço em `to`, sem `replyThreadId`. O rascunho de resposta não o aceita.
- O comprovante que uma conversa de WhatsApp pede por e-mail segue a conversa de e-mail da organização, com o arquivo anexado, sem pedir que a pessoa copie ou anexe.
- O nome do arquivo anexado é lido pelo destinatário. Use um nome que diga o que é e a data.
- O e-mail da empresa pode ser o de contato de uma pessoa, e a organização cadastrou outro endereço dela. Sem o endereço do cadastro em cópia, a resposta pode ir para o lugar errado.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
