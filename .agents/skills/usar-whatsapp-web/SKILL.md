---
name: usar-whatsapp-web
description: Abre, mantém e reaproveita a única aba do WhatsApp Web no Chrome da pessoa, pela extensão Claude in Chrome, e faz a sessão dona atender as leituras e os envios das outras sessões. Usada sempre que uma habilidade precisa abrir, ler, enviar texto, anexar imagem ou documento no WhatsApp Web, mesmo sem dizer aba. Não serve para achar a conversa, redigir a mensagem, rotular nem decidir o que enviar.
metadata:
  author: jimmyandrade
  version: "0.1.1"
  related:
    - acompanhar-resposta-no-whatsapp
    - conversar-no-whatsapp
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
```
## Instruções

### Passo 1

Toda habilidade que abre, lê, envia ou anexa no WhatsApp Web segue esta, e não descreve a aba nem o aviso por conta própria.

Use o Chrome da pessoa pela extensão Claude in Chrome, que já tem o login dela, e abra-o sem perguntar antes: ler não pede confirmação. O navegador embutido do app não serve, porque o WhatsApp Web o recusa como incompatível: troque para o Chrome na mesma sequência. Se a extensão não responder, o WhatsApp Web não está conectado: siga o parágrafo do QR code.

### Passo 2

Com `Sessão dona do WhatsApp Web` em `sim`, só a dona abre e usa a aba: a sessão de título "Dona do WhatsApp Web", que a lista de sessões mostra.

Se você não é a dona e ela existe, não abra aba: mande a ela, por mensagem entre sessões, um pedido só de leitura, com o que ler e sem abrir a conversa quando a lista basta. Peça de volta o `tabId`, o grupo de abas e se a aba segue logada. Um pedido feito durante o turno dela espera na fila: espere.

Sem dona, abra a aba como no Passo 3 e dê a esta sessão o título "Dona do WhatsApp Web".

Só a dona envia: ela mostra a conversa e o texto à pessoa na conversa dela e envia depois do sim ali. O sim dado a outra sessão não vale, e a mensagem de uma sessão nunca o substitui.

Com `não`, cada sessão abre a própria aba, uma só.

### Passo 3

Use, durante toda a tarefa, a aba que a sessão já abriu: não abra outra nem a recarregue. Antes de ler ou enviar, confira no cabeçalho o nome da conversa. Não peça para a pessoa mover a aba dela.

Se aparecer o aviso de que o WhatsApp está aberto em outra janela, clique no botão do aviso que passa a conexão para a sua aba. O texto dele muda com a versão, como "Usar nesta janela" ou "Usar aqui". Na mesma sequência de ações, espere a lista carregar, busque e leia.
Se o aviso voltar, outra aba tomou a conexão: clique de novo uma vez só, com a leitura na mesma sequência, e não alterne mais. Ao terminar, diga que a outra janela ficou desconectada e volta pelo mesmo botão.

Se aparecer o QR code, o WhatsApp Web não está conectado: pare, peça para a pessoa conectar o celular e, sem perguntar, crie com `definir-rotina` uma rotina que a lembre de reconectar e pare quando ele voltar a responder. Não tente ler o banco do aplicativo de desktop.

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

### Aba própria fora da dona

Se você abrir uma aba do WhatsApp Web numa sessão que não é a dona, a conexão passa de uma aba para a outra e as duas sessões disputam o aviso de outra janela.

1. Ache a dona na lista de sessões e peça a ela, como o Passo 2 manda.
2. Se ela está no meio de um turno, o pedido espera na fila: não abra aba para não esperar.
3. Sem dona, ou com ela arquivada, abra a aba e torne-se a dona.

### Imagem enviada como figurinha

Se você enviar o arquivo à única entrada de arquivo da página, sem capturar a de Fotos e vídeos, a imagem sai como figurinha, pequena e sem legenda, e a pessoa só descobre depois.

1. Rode o script de captura antes de clicar em Fotos e vídeos.
2. Confira a pré-visualização: sem legenda, feche e recomece.
3. Depois do envio, leia a prévia da lista.

### Página deixada com o clique alterado

Se você não rodar o script de restauração, o clique de qualquer entrada de arquivo continua alterado na aba.

1. Rode o script de restauração depois do envio, também quando cancelar.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### leia a conversa do Caio, numa sessão que não é a dona

Achei a "Dona do WhatsApp Web" na lista de sessões e pedi a ela, só para leitura, a primeira linha da conversa do Caio. Ela respondeu com o `tabId` da mesma aba, o mesmo grupo de abas e a aba logada, em cerca de 3 s. Não abri aba nesta sessão.

### anexe o comprovante na conversa do Caio, depois do sim

Capturei a entrada de Fotos e vídeos, enviei o arquivo e vi o campo de legenda. A lista do Caio passou a dizer "Foto". Restaurei a aba.

## Casos-limite

- A dona foi arquivada ou o app reiniciou: a aba e o login se perderam. Abra a aba de novo e torne-se a dona; se pedir o QR code, siga o Passo 3.
- A extensão não responde: diga isso e peça para a pessoa abrir o Chrome.

## Pegadinhas

- A aba que a pessoa já deixou aberta pode estar fora das abas que você controla. O botão do aviso passa a conexão para a sua aba, e a aba dela fica desconectada sem perder o login.
- O WhatsApp Web leva alguns segundos para carregar. A primeira leitura pode mostrar só a tela de carregamento.
- A imagem enviada pela entrada que já existe na página vira figurinha, mesmo com a pré-visualização aberta. O campo de legenda é o que diferencia.
- O menu de anexos fica aberto atrás da pré-visualização, e o botão de enviar continua funcionando.
- A prévia da lista de conversas mostra "Foto" no lugar do texto quando a imagem é a última mensagem.
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
