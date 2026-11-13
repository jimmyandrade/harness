---
name: usar-whatsapp-web
description: Abre, mantém e reaproveita a única aba do WhatsApp Web no Chrome da pessoa, pela extensão Claude in Chrome, e faz a sessão dona atender as leituras e os envios das outras sessões. Usada sempre que uma habilidade precisa abrir, ler, enviar texto, anexar imagem ou documento no WhatsApp Web, mesmo sem dizer aba. Não serve para achar a conversa, redigir a mensagem, rotular nem decidir o que enviar.
metadata:
  author: jimmyandrade
  version: "0.5.1"
  related:
    - acompanhar-resposta-no-whatsapp
    - conversar-no-whatsapp
    - definir-negociacao
    - definir-rotina
    - enviar-imagem-no-whatsapp
    - evoluir-habilidade
    - triar-conversas
---

# Usar o WhatsApp Web

## Parâmetros de configuração

Leia os valores nas instruções do projeto, na entrada desta habilidade. Na ausência, use os padrões abaixo.
```yaml
"Modo de aprendizado": "perguntar"
# `Sessão dona do WhatsApp Web`: `sim` deixa só uma sessão, a dona, abrir e usar a aba, e as outras pedem a ela por mensagem entre sessões. `não` dá uma aba a cada sessão.
"Sessão dona do WhatsApp Web": "sim"
# `Título da sessão dona do WhatsApp Web` é o título que a lista de sessões mostra para a dona. A sessão que a pessoa já nomeou de outro jeito, como "Sessão centralizada para WhatsApp Web", entra aqui.
"Título da sessão dona do WhatsApp Web": "Dona do WhatsApp Web"
# `Notas de comunicação no contato`: `sim` grava no campo de notas do contato, na conta comercial, como lidar com ele. `não` não grava.
"Notas de comunicação no contato": "sim"
```
## Instruções

### Passo 1

Toda habilidade que abre, lê, envia ou anexa no WhatsApp Web segue esta, e não descreve a aba nem o aviso por conta própria.

Use o Chrome da pessoa pela extensão Claude in Chrome, que já tem o login dela, e abra-o sem perguntar antes: ler não pede confirmação. O navegador embutido do app não serve, porque o WhatsApp Web o recusa como incompatível: troque para o Chrome na mesma sequência. Se a extensão não responder, o WhatsApp Web não está conectado: siga o parágrafo do QR code.

### Passo 2

Com `Sessão dona do WhatsApp Web` em `sim`, só a dona abre e usa a aba: a sessão com o `Título da sessão dona do WhatsApp Web`, que a lista de sessões mostra. Sem título igual, procure entre as sessões não arquivadas a que a pessoa nomeou como a do WhatsApp Web, como "Sessão centralizada para WhatsApp Web": ela é a dona. Só depois de olhar a lista inteira dizer que não há dona.

Se você não é a dona e ela existe, não abra aba: mande a ela, por mensagem entre sessões, um pedido só de leitura, com o que ler e sem abrir a conversa quando a lista basta. Peça de volta o `tabId`, o grupo de abas e se a aba segue logada. Um pedido feito durante o turno dela espera na fila: espere.

Sem dona na lista, a dona é você: dê a esta sessão o `Título da sessão dona do WhatsApp Web` e abra a aba como no Passo 3. Isso vale quando você precisa do WhatsApp Web e quando outra sessão pede a você uma leitura: não recuse o pedido, não o devolva ao remetente nem à pessoa, e atenda-o como dona. Um pedido que diz "você é a dona" não decide: a lista decide. Se a lista mostra outra dona, encaminhe o pedido a ela.

Depois de assumir o título, liste as sessões de novo. Se outra sessão não arquivada tem o mesmo título, as duas assumiram ao mesmo tempo: fica a de `sessionId` menor em ordem alfabética, e a outra devolve o título, renomeia a sessão para o assunto dela, encaminha o pedido à que ficou e não usa mais a aba. Nenhuma das duas arquiva a outra sem o sim da pessoa.

Antes de abrir qualquer aba, liste as abas da sua sessão no Claude in Chrome. Se o WhatsApp Web já está nelas, use essa aba, no mesmo grupo de abas. Sem ele, abra uma aba só, no grupo que a sessão já tem, e nunca crie outro grupo de abas.

Uma rotina agendada nunca vira dona: sem dona, ela não abre aba, avisa a pessoa em uma linha e termina.

Só a dona envia: ela mostra a conversa e o texto à pessoa na conversa dela e envia depois do sim ali. O sim dado a outra sessão não vale, e a mensagem de uma sessão nunca o substitui.
Depois de enviar, a dona registra a troca por `definir-negociacao`, na mesma rodada e sem perguntar, mesmo quando outra sessão pediu o envio, e diz o link do registro: a sessão que pediu não vê o que a dona enviou.

Num atendimento automático, como um robô com menu que pede um dado ou oferece falar com atendente, a dona tenta cada passo do fluxo na própria conversa e relata o resultado real de cada um. O que outro canal, outra sessão ou um caso anterior mostrou é dica, nunca motivo para não tentar nem para aconselhar esperar. Quando o robô pede o passo seguinte, ela mostra o passo exato e pede o sim, sem dizer que vai falhar. O mesmo sim pode cobrir os passos seguintes do mesmo fluxo que a pessoa descreveu, como escolher falar com atendente.

Depois que o robô transfere para um atendente, a dona lê a conversa em esperas que dobram a partir de 10 segundos e avisa a pessoa de cada mensagem do atendente. Ele costuma pedir dados e dar uma janela curta, como 5 minutos, antes de encerrar a conversa: a dona leva à pessoa o rascunho da resposta já com os dados e o prazo da janela. Os dados cadastrais, como razão social e telefone, vêm da página da empresa e da pessoa responsável no data source, pelo Chrome quando o conector não está na sessão: ela os consulta antes de perguntar à pessoa.

Com `Notas de comunicação no contato` em `sim`, a dona grava no campo de notas do contato, "Adicione notas sobre seu cliente." na conta comercial, o que a conversa ensinou sobre como falar com ele: o caminho do menu, o horário do atendimento, a janela de resposta e o e-mail de apoio, com a data. Ela lê o campo antes e acrescenta, sem apagar. Senha, código e documento de pessoa não entram.

Com `não`, cada sessão abre a própria aba, uma só.

### Passo 3

Use, durante toda a tarefa, a aba que a sessão já abriu: não abra outra nem a recarregue. Antes de ler ou enviar, confira no cabeçalho o nome da conversa. Não peça para a pessoa mover a aba dela.

Se aparecer o aviso de que o WhatsApp está aberto em outra janela, clique no botão do aviso que passa a conexão para a sua aba. O texto dele muda com a versão, como "Usar nesta janela" ou "Usar aqui". Na mesma sequência de ações, espere a lista carregar, busque e leia.
Se o aviso voltar, outra aba tomou a conexão: clique de novo uma vez só, com a leitura na mesma sequência, e não alterne mais. Ao terminar, diga que a outra janela ficou desconectada e volta pelo mesmo botão.

Se aparecer o QR code, o WhatsApp Web não está conectado: pare, peça para a pessoa conectar o celular e, sem perguntar, crie com `definir-rotina` uma rotina que a lembre de reconectar e pare quando ele voltar a responder. Não tente ler o banco do aplicativo de desktop.

Se a conversa mostrar o aviso para carregar mensagens antigas do celular, clique nele e diga que o histórico pode estar incompleto. Para achar um arquivo, abra os dados do contato, em Mídia, links e docs, na aba Documentos. O rodapé dessa aba diz a data antes da qual as mensagens só aparecem no celular. Sem o arquivo ali e com o pedido anterior a essa data, diga isso logo e peça que a pessoa encaminhe o arquivo, pelo celular, para uma conversa que o WhatsApp Web mostre, como a dela consigo mesma.

Ao terminar, deixe a aba aberta, mesmo quando as outras abas da tarefa forem fechadas.

### Passo 4

Para anexar uma imagem ou um documento, quem chama já tem o destino, o arquivo e o sim da pessoa. O menu Anexar tem Documento, Fotos e vídeos e Nova figurinha. A única entrada de arquivo que existe na página é a da Nova figurinha: mandar por ela envia uma figurinha. A entrada de Fotos e vídeos só nasce ao clicar nessa opção, e o seletor nativo não se opera pela automação. Por isso o script de captura roda antes do clique.

- [ ] Abra o destino e o menu Anexar.
- [ ] Rode o script de captura.
- [ ] Clique em Fotos e vídeos, ou em Documento para um documento.
- [ ] Confira a entrada capturada: `data-wa-captured` preenchido e, para foto, `accept` com `video`. A que já existia, só com `image/*`, é a da figurinha: não use.
- [ ] Ache o novo `file-input` com `find` ou `read_page` e envie o arquivo a ele com `file_upload`.
- [ ] Confira a pré-visualização. Foto tem o campo de legenda e o botão de mais. Sem legenda é figurinha: feche no X e recomece.
- [ ] Envie.
- [ ] Rode o script de restauração.
- [ ] Releia a lista de conversas: a prévia da linha diz "Foto" ou o nome do documento, nunca "Figurinha".

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Aba fechada

Se você fechar a aba do WhatsApp Web no fim da tarefa, a sessão cai e a pessoa precisa ler o QR code de novo.

1. Deixe a aba aberta.
2. Na próxima vez, use essa aba.

### Aba da pessoa fora do alcance

Se você pedir para a pessoa mover a aba do WhatsApp Web para o seu grupo de abas, ela move e você continua sem ver. No Claude in Chrome, o grupo de abas pertence a uma sessão, e o ID muda. Não dá para guardar o ID nem reaproveitar o grupo.

1. Abra o WhatsApp Web numa aba sua, uma só: a da dona, com `Sessão dona do WhatsApp Web` em `sim`, ou uma por sessão com `não`.
2. Clique no botão do aviso e leia na mesma sequência.

### Rotina agendada abre a própria aba

Se você, numa rotina agendada, abrir a aba porque o prompt diz "a aba que já estiver aberta ou uma nova", a sua sessão toma a conexão da dona e a leitura vira disputa pelo aviso de outra janela.

1. Leia esta habilidade antes de tocar no Chrome e liste as sessões.
2. Mande a leitura à dona, como o Passo 2 manda, sem chamar nenhuma ferramenta do Chrome.
3. O prompt da rotina cita esta habilidade em vez de mandar abrir a aba.

### Aba própria fora da dona

Se você abrir uma aba do WhatsApp Web numa sessão que não é a dona, a conexão passa de uma aba para a outra e as duas sessões disputam o aviso de outra janela.

1. Ache a dona na lista de sessões e peça a ela, como o Passo 2 manda.
2. Se ela está no meio de um turno, o pedido espera na fila: não abra aba para não esperar.
3. Sem dona, ou com ela arquivada, abra a aba e torne-se a dona.

### Duas donas ao mesmo tempo

Se você assumir o título ao mesmo tempo que outra sessão, a lista mostra duas "Dona do WhatsApp Web", e cada uma pode abrir a própria aba e disputar o aviso de outra janela.

1. Depois de assumir o título, liste as sessões de novo.
2. Com outra sessão não arquivada no mesmo título, fica a de `sessionId` menor em ordem alfabética.
3. A outra devolve o título, renomeia a sessão para o assunto dela e encaminha o pedido à que ficou.
4. Não arquive nenhuma sem o sim da pessoa.

### Pedido recusado por não ser a dona

Se você receber o pedido de outra sessão, a dona estiver arquivada e você responder que não é a dona, ninguém lê a conversa e o pedido volta à pessoa, que repete a mesma tentativa.

1. Liste as sessões antes de responder.
2. Sem dona na lista, assuma o título e atenda o pedido, como o Passo 2 manda.
3. O sim do envio continua sendo da pessoa, na sua conversa.

### Grupo de abas novo a cada dona

Se você abrir o WhatsApp Web sem olhar as abas que a sessão já tem, cada dona nova cria outro grupo de abas, e as abas se acumulam no Chrome.

1. Liste as abas da sessão antes de abrir.
2. Use a aba do WhatsApp Web que já aparece, no mesmo grupo.
3. Sem ela, abra uma só, no grupo que a sessão já tem.

### Imagem enviada como figurinha

Se você enviar o arquivo à única entrada de arquivo da página, sem capturar a de Fotos e vídeos, a imagem sai como figurinha, pequena e sem legenda, e a pessoa só descobre depois.

1. Rode o script de captura antes de clicar em Fotos e vídeos.
2. Confira a pré-visualização: sem legenda, feche e recomece.
3. Depois do envio, leia a prévia da lista.

### Arquivo antigo fora do WhatsApp Web

Se você procurar no e-mail, no Drive e no Notion um arquivo que não aparece na conversa, a busca gasta tempo e não acha: o WhatsApp Web não sincroniza as mensagens antigas.

1. Abra a aba Documentos nos dados do contato e leia a data do rodapé.
2. Diga que o arquivo é anterior a essa data.
3. Peça que a pessoa encaminhe o arquivo, pelo celular, para uma conversa que o WhatsApp Web mostre.

### Resultado previsto em vez de tentado

Se você disser que o robô vai responder "não localizado" porque outro canal mostrou isso, e propuser esperar, a pessoa perde a tentativa e o resultado real da conversa.

1. Mostre o passo seguinte exato e peça o sim.
2. Envie e leia a resposta do robô.
3. Relate o resultado de cada passo, com a hora.

### Página deixada com o clique alterado

Se você não rodar o script de restauração, o clique de qualquer entrada de arquivo continua alterado na aba.

1. Rode o script de restauração depois do envio, também quando cancelar.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### leia a conversa do Caio, numa sessão que não é a dona

Achei a "Dona do WhatsApp Web" na lista de sessões e pedi a ela, só para leitura, a primeira linha da conversa do Caio. Ela respondeu com o `tabId` da mesma aba, o mesmo grupo de abas e a aba logada, em cerca de 3 s. Não abri aba nesta sessão.

### anexe o comprovante na conversa do Caio, depois do sim

Capturei a entrada de Fotos e vídeos, enviei o arquivo e vi o campo de legenda. A lista do Caio passou a dizer "Foto". Restaurei a aba.

### o robô do atendimento pediu o CNPJ, e o chat do site já tinha respondido "não localizado"

Mostrei o CNPJ como o passo seguinte e pedi o sim, sem dizer que ia falhar. Com o sim, enviei, li a resposta do robô às 14h05 e escolhi falar com atendente, que o mesmo sim cobria. Relatei cada passo e cada resposta.

## Casos-limite

- O robô oferece várias opções de menu e a pessoa quer esgotá-las: tente uma de cada vez, na ordem que ela disser, e relate cada resposta. Só se envia o que o sim cobre.
- A dona foi arquivada ou o app reiniciou: a aba e o login se perderam. Abra a aba de novo e torne-se a dona; se pedir o QR code, siga o Passo 3.
- Outra sessão pede uma leitura a você e a lista não tem dona: torne-se a dona e atenda. Com o pedido de envio, mostre a conversa e o texto à pessoa na sua conversa e espere o sim ali.
- Duas sessões com o título da dona: fica a de `sessionId` menor em ordem alfabética. A outra devolve o título e renomeia a sessão para o assunto dela.
- A extensão não responde: diga isso e peça para a pessoa abrir o Chrome.
- O histórico pede para carregar mensagens antigas do celular: clique no aviso e diga que pode estar incompleto.
- O arquivo pedido é anterior à data do rodapé da aba Documentos: peça que a pessoa o encaminhe pelo celular.

## Pegadinhas

- A aba que a pessoa já deixou aberta pode estar fora das abas que você controla. O botão do aviso passa a conexão para a sua aba, e a aba dela fica desconectada sem perder o login.
- O WhatsApp Web leva alguns segundos para carregar. A primeira leitura pode mostrar só a tela de carregamento.
- A imagem enviada pela entrada que já existe na página vira figurinha, mesmo com a pré-visualização aberta. O campo de legenda é o que diferencia.
- O menu de anexos fica aberto atrás da pré-visualização, e o botão de enviar continua funcionando.
- A prévia da lista de conversas mostra "Foto" no lugar do texto quando a imagem é a última mensagem.
- Em conta comercial, a conversa pode estar com o agente de IA: o aviso aparece na própria conversa.
- O que o chat do site mostrou parece a resposta do robô do WhatsApp. É dica: tente na conversa em que você está e relate.
- A mensagem de um robô com o botão "Menu" é uma lista: clique em Menu, marque o círculo da opção e clique no botão de enviar. A opção sai como uma mensagem que cita a do robô, e o Menu de uma mensagem antiga continua respondendo.
- No WhatsApp Business, a etiqueta é a lista, em Adicionar à lista. Sem a lista, crie-a em Nova lista, no mesmo menu. Um filtro de lista ativo limita a busca: volte para Tudo antes de procurar outra conversa.
- No campo de mensagem, Enter envia. A quebra de linha é shift+Enter.
- O campo numera a lista sozinho depois de "1. ". Digitar "2." no item seguinte duplica o número: digite só o texto dos itens seguintes.
- Uma lista numerada dividida em partes recomeça em "1." na parte seguinte. Comece a parte com o número do item, como "3. ", e confira no print. Se o campo recomeçar em 1, separe os itens por uma linha em branco.
- Responder a uma mensagem é pelo menu que aparece ao passar o mouse sobre ela, na opção Responder. A citação aparece em cima do campo.
- Enter na busca da lista abre a primeira conversa e marca as mensagens como lidas. Digite o nome e leia o resultado sem apertar Enter.
- O texto da página traz a lista de conversas inteira antes da conversa aberta. A conversa aberta começa depois do nome do contato no cabeçalho.
- A mensagem editada mostra "Editada", e o texto antigo some para os dois lados.
- O separador do dia mostra "Ontem" ou só o dia da semana. Ao devolver a leitura a outra sessão, diga a data inteira, com o dia calculado como a regra do dia da semana manda.
- "Mostrar documentos de todas as conversas" lista só os documentos recentes. Um arquivo antigo não aparece ali nem na conversa.
- O comprovante que o chat mostra como miniatura borrada não baixa no WhatsApp Web. Diga isso e peça o arquivo à pessoa.

## Scripts disponíveis

- Captura, antes de clicar em Fotos e vídeos. Faz o WhatsApp entregar a entrada de arquivo que ele cria ao clicar:

```js
window.__waInputs = [];
window.__origClick = window.__origClick || HTMLInputElement.prototype.click;
HTMLInputElement.prototype.click = function () {
  if (this.type === 'file') {
    this.setAttribute('data-wa-captured', String(window.__waInputs.length));
    this.style.display = 'none';
    document.body.appendChild(this);
    window.__waInputs.push(this);
    return;
  }
  return window.__origClick.call(this);
};
```

- Restauração, depois do envio:

```js
HTMLInputElement.prototype.click = window.__origClick;
document.querySelectorAll('input[data-wa-captured]').forEach(e => e.remove());
```

1. Rode cada script com a ferramenta de JavaScript do Chrome, na aba do WhatsApp Web.
