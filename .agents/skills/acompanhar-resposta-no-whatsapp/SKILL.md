---
name: acompanhar-resposta-no-whatsapp
description: Acompanha, por uma rotina, se o contato respondeu a uma mensagem enviada no WhatsApp, avisa quando a resposta chega e para na primeira resposta ou no prazo. Usada quando a mensagem espera resposta, como uma pergunta, um pedido ou um prazo, ou quando a pessoa pergunta se alguém já respondeu. Não serve para ler, redigir nem enviar a mensagem.
metadata:
  author: jimmyandrade
  version: "0.2.1"
  related:
    - conversar-no-whatsapp
    - definir-rotina
    - evoluir-habilidade
    - rotular-item
---

# Acompanhar resposta no WhatsApp

## Parâmetros de configuração

Leia os valores nas instruções do projeto, na entrada desta habilidade. Na ausência, use os padrões abaixo.
```yaml
"Modo de aprendizado": "perguntar"
# `Canal da rotina de resposta` é onde a rotina lê as conversas: `navegador`, um cliente aberto no computador da pessoa, como o WhatsApp Web, ou `API`, que roda na nuvem. Um cliente não oficial pode bloquear o número e só entra a pedido da pessoa.
"Canal da rotina de resposta": "navegador"
# `Ao conferir a resposta` é `ler a lista`, que lê a prévia e o contador sem marcar como lida, ou `abrir a conversa`, que abre e marca como lida.
"Ao conferir a resposta": "ler a lista"
```
## Instruções

### Passo 1

Quando a mensagem espera resposta, como uma pergunta, um pedido ou um prazo, acompanhe a conversa com uma rotina que segue `definir-rotina`.
Mensagem que não espera nada, como um agradecimento ou um aviso, não ganha rotina.
A pergunta que pede o sim do envio, em `conversar-no-whatsapp`, já diz que a resposta vai ser acompanhada, com a frequência e até quando, e o mesmo sim vale para a rotina.
Há uma rotina só por canal: se uma rotina já lê o WhatsApp Web, acrescente o contato a ela em vez de criar outra.
Ela roda onde está o `Canal da rotina de resposta`: com `navegador`, na máquina da pessoa, com o cliente aberto; com `API`, na nuvem.

### Passo 2

A rotina segue `Ao conferir a resposta`. Com `ler a lista`, ela lê só a lista de conversas, a prévia e o contador de não lidas, sem abrir a conversa. Com `abrir a conversa`, ela abre, lê as mensagens novas e as marca como lidas, e a pergunta do sim diz isso.
A resposta chegou quando a prévia da linha do contato não tem os vistos de enviada e chegou depois da mensagem, ou quando há contador de não lidas.
Ache a conversa e trate a aba como `conversar-no-whatsapp` manda: a mesma aba, o mesmo botão do aviso, o mesmo QR code.

### Passo 3

Ela avisa a pessoa quando a resposta chega e para na primeira resposta ou no fim do prazo, do jeito que `definir-rotina` manda parar. Quando a resposta de uma outra pessoa ou empresa chega, quem age agora é este negócio: troque o rótulo de estado da conversa usando a habilidade `rotular-item`.
Uma mensagem que espera resposta e saiu sem rotina, porque a pergunta do sim não citou o acompanhamento ou porque a rotina ficou para depois, não sai dos próximos passos da resposta até a rotina existir ou a pessoa recusar. Ao perceber a falta, confira antes a lista de conversas: a resposta pode já ter chegado.

Ao terminar, deixe a aba do WhatsApp Web aberta.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Duas rotinas no mesmo WhatsApp Web

Se você criar uma rotina de resposta ao lado de outra que já lê o WhatsApp Web, as duas disparam no mesmo horário: cada execução abre a própria aba e clica no botão do aviso, e uma toma a conexão da outra. As duas alternam sem ler nada.

1. Antes de criar a rotina, liste as rotinas e procure uma que já leia o WhatsApp Web.
2. Se existir, acrescente o contato, a mensagem e o prazo a essa rotina.
3. Tire o contato dela quando ele responder ou o prazo acabar.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### A Ana já respondeu sobre o acesso?

A rotina leu a lista de conversas, com `Ao conferir a resposta` em `ler a lista`. A linha da Ana mostra a prévia "Consegui entrar!", às 10h12, sem os vistos de enviada, e 2 não lidas. Avisei a pessoa e tirei a Ana da rotina.

## Casos-limite

- O QR code aparece na execução: pare e avise que o WhatsApp Web precisa ser conectado.
- O prazo acabou sem resposta: avise a pessoa e tire o contato da rotina.
- A pessoa recusa a rotina: a mensagem sai dos próximos passos.

## Pegadinhas

- Abrir a conversa para ver se chegou resposta parece inofensivo. Marca as mensagens como lidas no celular de quem mandou. Com `Ao conferir a resposta` em `ler a lista`, a rotina não abre a conversa.
- Perguntar se cria a rotina parece deixar a decisão com a pessoa. Quando a conversa segue para outro assunto, a pergunta some e a resposta do contato espera sem ninguém ver.
- A rotina agendada roda numa sessão nova, sem as abas da sessão anterior, e sempre abre a própria aba.
- Na lista, "Você:" antes da prévia só aparece em grupo. Na conversa individual, a mensagem que você enviou tem os vistos antes da prévia, e a do contato não tem.
- A lista mostra o horário só nas mensagens de hoje. De ontem em diante, mostra "Ontem", o dia da semana ou a data, sem a hora.
- A prévia mostra só a última mensagem. Com mais de uma não lida, o contador diz quantas são, e o conteúdo das outras só aparece com a conversa aberta.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
