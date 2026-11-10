---
name: acompanhar-resposta-no-whatsapp
description: Acompanha, por uma rotina que lê as conversas com a etiqueta de ação esperada, se o contato respondeu a uma mensagem enviada no WhatsApp, avisa quando a resposta chega e troca a etiqueta. Usada quando a mensagem espera resposta, como uma pergunta, um pedido ou um prazo, ou quando a pessoa pergunta se alguém já respondeu. Não serve para ler, redigir nem enviar a mensagem.
metadata:
  author: jimmyandrade
  version: "0.3.0"
  related:
    - conversar-no-whatsapp
    - definir-rotina
    - evoluir-habilidade
    - rotular-item
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
```
## Instruções

### Passo 1

Quando a mensagem espera resposta, como uma pergunta, um pedido ou um prazo, a conversa leva a etiqueta `Ação esperada`, por `rotular-item`. `conversar-no-whatsapp` já a aplica ao enviar.
Mensagem que não espera nada, como um agradecimento ou um aviso, não leva a etiqueta.
Uma rotina, que segue `definir-rotina`, lê todas as conversas com essa etiqueta. Acompanhar ou deixar de acompanhar um contato muda a etiqueta, nunca a rotina.
Há uma rotina só por canal: antes de criar, liste as rotinas e, se uma já lê o WhatsApp Web, use essa.
Ela roda onde está o `Canal da rotina de resposta`: com `navegador`, na máquina da pessoa, com o cliente aberto; com `API`, na nuvem.
A pergunta que pede o sim do envio, em `conversar-no-whatsapp`, já diz que a resposta vai ser acompanhada, e o mesmo sim vale para a etiqueta.

### Passo 2

A rotina filtra a lista de conversas pela etiqueta `Ação esperada` e segue `Ao conferir a resposta` em cada conversa do filtro. Com `ler a lista`, ela lê só a prévia e o contador de não lidas, sem abrir a conversa. Com `abrir a conversa`, ela abre, lê as mensagens novas e as marca como lidas, e a pergunta do sim diz isso.
A resposta chegou quando a prévia da linha do contato não tem os vistos de enviada e chegou depois da mensagem, ou quando há contador de não lidas.
Ache a conversa e trate a aba como `conversar-no-whatsapp` manda: a mesma aba, o mesmo botão do aviso, o mesmo QR code.

### Passo 3

Quando a resposta chega, a rotina avisa a pessoa e troca `Ação esperada` por `Respondida`, por `rotular-item`. A conversa sai do filtro, e a rotina segue como está.
A conversa que passa de `Dias sem resposta para avisar` sem resposta ganha um aviso, uma vez, e mantém a etiqueta.
Sem nenhuma conversa na etiqueta, a rotina diz isso em uma linha.
Uma mensagem que espera resposta e saiu sem a etiqueta, porque a pergunta do sim não citou o acompanhamento ou porque a etiqueta ficou para depois, não sai dos próximos passos da resposta até a conversa ser etiquetada ou a pessoa recusar. Ao perceber a falta, confira antes a lista de conversas: a resposta pode já ter chegado.

Ao terminar, deixe a aba do WhatsApp Web aberta.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Duas rotinas no mesmo WhatsApp Web

Se você criar uma rotina de resposta ao lado de outra que já lê o WhatsApp Web, as duas disparam no mesmo horário: cada execução abre a própria aba e clica no botão do aviso, e uma toma a conexão da outra. As duas alternam sem ler nada.

1. Antes de criar a rotina, liste as rotinas e procure uma que já leia o WhatsApp Web.
2. Se existir, use-a: ela já lê a etiqueta `Ação esperada`.
3. Etiquete a conversa e não mexa na rotina.

### Rotina editada a cada contato

Se você trocar o contato ou o prazo no texto da rotina a cada mensagem, cada troca é uma edição que pode pedir aprovação, e o contato anterior fica sem acompanhamento sem ninguém avisar.

1. Aplique `Ação esperada` na conversa, por `rotular-item`.
2. Não edite a rotina.
3. Quando o contato responder, a rotina troca a etiqueta por `Respondida`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### A Ana já respondeu sobre o acesso?

A rotina filtrou a lista pela etiqueta `Ação esperada` e leu a prévia de cada conversa, com `Ao conferir a resposta` em `ler a lista`. A linha da Ana mostra a prévia "Consegui entrar!", às 10h12, sem os vistos de enviada, e 2 não lidas. Avisei a pessoa e troquei `Ação esperada` por `Respondida`.

## Casos-limite

- O QR code aparece na execução: pare e avise que o WhatsApp Web precisa ser conectado.
- O contato passou de `Dias sem resposta para avisar` sem responder: avise uma vez e mantenha a etiqueta.
- A pessoa recusa o acompanhamento: a conversa não leva `Ação esperada` e a mensagem sai dos próximos passos.
- Nenhuma conversa com a etiqueta: a rotina diz isso em uma linha e termina.

## Pegadinhas

- Abrir a conversa para ver se chegou resposta parece inofensivo. Marca as mensagens como lidas no celular de quem mandou. Com `Ao conferir a resposta` em `ler a lista`, a rotina não abre a conversa.
- Editar a rotina parece o jeito de acompanhar um contato novo. A etiqueta faz isso, e a rotina fica como está.
- Perguntar se cria a rotina parece deixar a decisão com a pessoa. Quando a conversa segue para outro assunto, a pergunta some e a resposta do contato espera sem ninguém ver.
- A rotina agendada roda numa sessão nova, sem as abas da sessão anterior, e sempre abre a própria aba.
- Na lista, "Você:" antes da prévia só aparece em grupo. Na conversa individual, a mensagem que você enviou tem os vistos antes da prévia, e a do contato não tem.
- A lista mostra o horário só nas mensagens de hoje. De ontem em diante, mostra "Ontem", o dia da semana ou a data, sem a hora.
- A prévia mostra só a última mensagem. Com mais de uma não lida, o contador diz quantas são, e o conteúdo das outras só aparece com a conversa aberta.
- O WhatsApp Business limita o número de listas. A lista nova só entra se couber, como `rotular-item` manda.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
