---
name: acompanhar-resposta-no-whatsapp
description: Acompanha, por uma rotina que lê as conversas com a etiqueta de ação esperada, se o contato respondeu a uma mensagem enviada no WhatsApp, avisa quando a resposta chega e troca a etiqueta. Usada quando a mensagem espera resposta, como uma pergunta, um pedido ou um prazo, ou quando a pessoa pergunta se alguém já respondeu. Não serve para ler, redigir nem enviar a mensagem.
metadata:
  author: jimmyandrade
  version: "0.7.5"
  related:
    - rascunhar-mensagem
    - acompanhar-retornos-pendentes
    - conversar-no-whatsapp
    - definir-negociacao
    - definir-rotina
    - evoluir-habilidade
    - rotular-item
    - usar-whatsapp-web
---

# Acompanhar resposta no WhatsApp

## Parâmetros de configuração

Leia os valores nas instruções do projeto, na entrada desta habilidade. Na ausência, use os padrões abaixo. As etiquetas vêm de `Etiquetas de status`, nas instruções do projeto: `Ação esperada` marca a conversa que espera resposta e `Respondida` marca a que já recebeu.
```yaml
"Modo de aprendizado": "perguntar"
# `Canal da rotina de resposta` é onde a rotina lê as conversas: `navegador`, um cliente aberto no computador da pessoa, como o WhatsApp Web, ou `API`, que roda na nuvem. Um cliente não oficial pode bloquear o número e só entra a pedido da pessoa.
"Canal da rotina de resposta": "navegador"
# `Ao conferir a resposta` é `ler a lista`, que lê a prévia e o contador sem marcar como lida, ou `abrir a conversa`, que abre e marca como lida.
"Ao conferir a resposta": "ler a lista"
# `Dias sem resposta para avisar` é depois de quantos dias sem resposta a rotina avisa, uma vez, que o contato ainda não respondeu. Vazio, não avisa.
"Dias sem resposta para avisar": 3
# `Primeira espera com prazo no dia` é quanto a sessão que enviou espera antes da primeira conferência da conversa, em segundos, quando o prazo vence hoje. Cada espera seguinte é o dobro da anterior.
"Primeira espera com prazo no dia": 10
```
## Instruções

### Passo 1

Quando a mensagem espera resposta, como uma pergunta, um pedido ou um prazo, a conversa leva a etiqueta `Ação esperada`, por `rotular-item`. `rascunhar-mensagem` já a aplica ao enviar.
Mensagem que não espera nada, como um agradecimento ou um aviso, não leva a etiqueta.
Uma rotina, que segue `definir-rotina`, lê todas as conversas com essa etiqueta. Acompanhar ou deixar de acompanhar um contato muda a etiqueta, nunca a rotina.
Há uma rotina só por canal: antes de criar, liste as rotinas e, se uma já lê o WhatsApp Web, use essa.

A rotina do WhatsApp, que `acompanhar-retornos-pendentes` define, lê esta etiqueta e entrega cada resposta à sessão que espera.
A sessão que enviou a mensagem acrescenta uma linha ao registro das pendências, com o código dela.
Ela roda onde está o `Canal da rotina de resposta`: com `navegador`, na máquina da pessoa, com o cliente aberto; com `API`, na nuvem.
A pergunta que pede o sim do envio, em `rascunhar-mensagem`, já diz que a resposta vai ser acompanhada, e o mesmo sim vale para a etiqueta.

### Passo 2

A rotina filtra a lista de conversas pela etiqueta `Ação esperada` e segue `Ao conferir a resposta` em cada conversa do filtro. Com `ler a lista`, ela lê só a prévia e o contador de não lidas, sem abrir a conversa. Com `abrir a conversa`, ela abre, lê as mensagens novas e as marca como lidas, e a pergunta do sim diz isso.
A resposta chegou quando a prévia da linha do contato não tem os vistos de enviada, chegou depois da mensagem e traz texto que não é cópia do que enviamos, ou quando há contador de não lidas com esse texto novo.

O contato pode responder copiando as nossas mensagens, inteiras ou em trechos, com a resposta dele junto de cada cópia. A prévia e o contador não distinguem a cópia da resposta: compare o texto dele com o que enviamos, tire o que é cópia e decida só pelo que sobra. Cópia sem texto novo não é resposta: a conversa mantém `Ação esperada`.

Prévia que repete o nosso texto não decide, porque mostra só a última mensagem. Peça à dona que abra a conversa, expanda a mensagem longa em "Ler mais", leia as mensagens do contato desde a nossa e diga à pessoa que a conversa ficou marcada como lida. A resposta costuma vir marcada, como "Resposta:", entre as cópias.
Antes de qualquer ferramenta do Chrome, leia `usar-whatsapp-web` e liste as sessões. A rotina não é a dona: ela pede a leitura da lista à dona, por mensagem entre sessões, e não abre aba. O prompt da rotina não manda abrir aba nem usar "uma nova".
Ache a conversa e siga `usar-whatsapp-web` para o resto: o botão do aviso e o QR code são da dona.

### Passo 3

Quando a resposta chega, a rotina avisa a pessoa, com a data inteira e o dia da semana calculado como a regra do dia da semana manda, e troca `Ação esperada` por `Respondida`, por `rotular-item`. A conversa sai do filtro, e a rotina segue como está.
A conversa que passa de `Dias sem resposta para avisar` sem resposta ganha um aviso, uma vez, e mantém a etiqueta.
Sem nenhuma conversa na etiqueta, a rotina diz isso em uma linha.
Uma resposta que fecha o assunto, como uma confirmação ou um ok, não é a última palavra: para fechar o loop, a última mensagem de toda conversa é nossa, com um agradecimento curto. Ao avisar a pessoa que a resposta chegou, a sessão propõe essa mensagem, como `conversar-no-whatsapp` manda para o texto e o sim, com a janela de contato conferida como `rascunhar-mensagem` manda, e a conversa só ganha a etiqueta de assunto concluído depois que ela sai.
A mensagem de fechamento só agradece. Se citar dia, horário ou compromisso, usa o que a conversa e o cadastro confirmaram, com o dia conferido na conversa: nunca acrescenta uma data que ninguém confirmou.
Uma mensagem que espera resposta e saiu sem a etiqueta, porque a pergunta do sim não citou o acompanhamento ou porque a etiqueta ficou para depois, não sai dos próximos passos da resposta até a conversa ser etiquetada ou a pessoa recusar. Ao perceber a falta, confira antes a lista de conversas: a resposta pode já ter chegado.

Depois de enviar a pedido da pessoa, a sessão que enviou não pergunta se acompanha nem se lê a resposta: o pedido de envio já autoriza as duas coisas. Ela confere a conversa no mesmo turno e, com resposta nova do contato, abre a conversa e lê sozinha, mesmo com `Ao conferir a resposta` em `ler a lista`, que vale para a rotina sem ninguém na sessão.

Abrir só marca a conversa como lida, e a resposta diz isso. Na mesma resposta ela traz o que o contato pede e o que falta fazer, já com o próximo passo adiantado quando é leitura ou registro, como o registro da conversa por `definir-negociacao` e a agenda, e propõe o texto da próxima mensagem pronto para o sim. Pergunta só o que exige decisão da pessoa ou envia a terceiros, paga, aceita termos ou apaga algo.

O mesmo vale para qualquer conversa ou grupo da conta que mostre mensagem não lida ou prévia nova e tenha relação com um assunto aberto da pessoa, mesmo que não seja resposta a uma mensagem nossa: a sessão abre e lê sozinha, sem perguntar "quer que eu abra?". Ela cruza o que leu com as outras fontes do assunto, como o e-mail, a agenda e o cadastro, e traz o que precisa ser feito, com o próximo passo pronto.

Quando o prazo da mensagem vence hoje, a conferência não espera a resposta aparecer na lista. Ela confere a conversa no mesmo turno, pela dona, a cada espera que dobra a partir de `Primeira espera com prazo no dia`, e diz cada mudança, como uma resposta que chegou ou uma pergunta que ficou sem resposta. A conferência segue `Ao conferir a resposta`. Passado o prazo, ou o tempo que o sim disse, confira a lista de conversas por outro caminho antes de encerrar o turno, e diga o estado da conversa e o que a pessoa decide a seguir.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Duas rotinas no mesmo WhatsApp Web

Se você criar uma rotina de resposta ao lado de outra que já lê o WhatsApp Web, as duas disparam no mesmo horário: cada execução abre a própria aba em vez de pedir à dona e clica no botão do aviso, e uma toma a conexão da outra. As duas alternam sem ler nada.

1. Antes de criar a rotina, liste as rotinas e procure uma que já leia o WhatsApp Web.
2. Se existir, use-a: ela já lê a etiqueta `Ação esperada`.
3. Etiquete a conversa e não mexa na rotina.

### Rotina editada a cada contato

Se você trocar o contato ou o prazo no texto da rotina a cada mensagem, cada troca é uma edição que pode pedir aprovação, e o contato anterior fica sem acompanhamento sem ninguém avisar.

1. Aplique `Ação esperada` na conversa, por `rotular-item`.
2. Não edite a rotina.
3. Quando o contato responder, a rotina troca a etiqueta por `Respondida`.

### Acompanhamento ou leitura perguntados depois do envio

Se você perguntar "quer que eu volte a olhar?" ou "leio a resposta agora?" ou "quer que eu abra o grupo?" depois de enviar uma mensagem, a pessoa precisa dizer sim a algo que já tinha aprovado, o prazo corre sem ninguém olhar a conversa e ela fica fazendo o trabalho de confirmar.

1. Não pergunte: o sim do envio vale para o acompanhamento e para a leitura da resposta.
2. Confira a conversa no mesmo turno, em esperas que dobram a partir de `Primeira espera com prazo no dia` quando o prazo é hoje.
3. Com resposta nova, abra, leia e traga na mesma resposta o que ela pede, o que falta fazer e o texto da próxima mensagem pronto para o sim.
4. Diga cada mudança e, ao fim, o estado da conversa.

### Resposta que copia a nossa mensagem

Se você tratar como resposta a mensagem em que o contato copiou o texto que enviamos, a conversa sai de `Ação esperada` e a pergunta continua sem resposta.

1. Compare cada trecho da mensagem dele com o que enviamos.
2. Tire a cópia e leia o que sobra: ele responde cada pergunta, só algumas ou nenhuma.
3. Troque a etiqueta só quando o texto novo responde. Diga à pessoa quais perguntas ficaram sem resposta.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### A Ana já respondeu sobre o acesso?

A rotina filtrou a lista pela etiqueta `Ação esperada` e leu a prévia de cada conversa, com `Ao conferir a resposta` em `ler a lista`. A linha da Ana mostra a prévia "Consegui entrar!", às 10h12, sem os vistos de enviada, e 2 não lidas. Avisei a pessoa e troquei `Ação esperada` por `Respondida`.

### Uma empresa parceira precisa responder até hoje, e a mensagem acabou de sair

Não perguntei se acompanho. Conferi a prévia da conversa pela dona a cada 10 s, 20 s, 40 s e 80 s, sem abrir a conversa, e disse a cada passo que a última mensagem ainda era a minha, sem resposta. Ao fim, confirmei na lista que nada tinha chegado e disse a hora, o prazo e o que a pessoa decide a seguir.

### A Bia respondeu logo depois do envio

A lista mostrou a Bia com 1 não lida logo depois do meu envio. Não perguntei se podia ler: abri a conversa, li a resposta, disse que ela ficou marcada como lida e contei na mesma mensagem que a Bia pedia o orçamento até sexta. Registrei a conversa, adiantei o que faltava e deixei o texto do envio do orçamento pronto para o sim da pessoa.

### Um grupo de organizadores cobra material até hoje

A lista mostrou o grupo com 1 não lida e a prévia "Mandei por e-mail…". Não perguntei se abria: abri o grupo, li a cobrança, cruzei com o e-mail de seleção, que dava o prazo e o que enviar, e trouxe a lista do que ainda falta, com a mensagem de resposta pronta para o sim.

### O contato respondeu copiando o que enviamos

A prévia da linha repetia o nosso texto sobre a montagem. Pedi à dona que abrisse a conversa e li as mensagens dele desde a nossa. Tirei as cópias: o texto novo respondia o cadastro e a montagem, e a entrada do carro seguia sem resposta. Avisei a pessoa e disse que a conversa ficou marcada como lida.

## Casos-limite

- O QR code aparece na execução: pare e avise que o WhatsApp Web precisa ser conectado.
- O contato passou de `Dias sem resposta para avisar` sem responder: avise uma vez e mantenha a etiqueta.
- A mensagem do contato só copia o nosso texto, sem nada novo: não é resposta. Mantenha a etiqueta.
- A pessoa recusa o acompanhamento: a conversa não leva `Ação esperada` e a mensagem sai dos próximos passos.
- Nenhuma conversa com a etiqueta: a rotina diz isso em uma linha e termina.
- O prazo vence hoje e a pessoa já está na sessão: confira a conversa e não pergunte se acompanha.
- Um grupo ou conversa com não lida sobre um assunto aberto, sem mensagem nossa antes: abra e leia sem perguntar, e cruze com as outras fontes do assunto.
- A resposta pede enviar algo a outra pessoa, pagar ou aceitar termos: a leitura e o registro já estão feitos, e só o envio, o pagamento ou o aceite espera o sim, com o texto pronto.

## Pegadinhas

- Abrir a conversa para ver se chegou resposta parece inofensivo. Marca as mensagens como lidas no celular de quem mandou. Com `Ao conferir a resposta` em `ler a lista`, a rotina não abre a conversa.
- Perguntar "quer que eu volte a olhar?" ou "leio a resposta agora?" parece cortesia. O sim do envio já cobre o acompanhamento e a leitura, e a pergunta só atrasa a conferência e passa o trabalho para a pessoa.
- Editar a rotina parece o jeito de acompanhar um contato novo. A etiqueta faz isso, e a rotina fica como está.
- Perguntar se cria a rotina parece deixar a decisão com a pessoa. Quando a conversa segue para outro assunto, a pergunta some e a resposta do contato espera sem ninguém ver.
- A rotina agendada roda numa sessão nova, sem as abas da sessão anterior, e pede a leitura à dona, como `usar-whatsapp-web` manda, em vez de abrir a própria aba. Um prompt que diz "a aba que já estiver aberta ou uma nova" leva a rotina a abrir a própria: a dona pode ter outro título, como "Sessão centralizada para WhatsApp Web", e a rotina deve achá-la pela lista de sessões.
- A cópia do nosso texto na mensagem do contato parece resposta pronta. Quem copia costuma intercalar a resposta entre os trechos, ou não responder tudo: leia o que sobra depois de tirar a cópia, pergunta por pergunta.
- Na lista, "Você:" antes da prévia só aparece em grupo. Na conversa individual, a mensagem que você enviou tem os vistos antes da prévia, e a do contato não tem.
- A lista mostra o horário só nas mensagens de hoje. De ontem em diante, mostra "Ontem", o dia da semana ou a data, sem a hora.
- Se a pessoa já abriu a conversa, em qualquer janela, o contador de não lidas some e a rotina não reconhece a resposta por ele: compare o horário da última mensagem do contato com o da sua.
- A prévia mostra só a última mensagem. Com mais de uma não lida, o contador diz quantas são, e o conteúdo das outras só aparece com a conversa aberta.
- O WhatsApp Business limita o número de listas. A lista nova só entra se couber, como `rotular-item` manda.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
