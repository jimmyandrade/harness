# Enviar imagem no WhatsApp Web

O menu Anexar tem Documento, Fotos e vídeos e Nova figurinha. No WhatsApp Web aberto pelo Claude in Chrome, só a entrada de arquivo da Nova figurinha existe na página, com `accept="image/*"`. Enviar por ela manda a imagem como figurinha: sem fundo de mensagem, sem legenda, e a lista de conversas mostra "Figurinha". A entrada de Fotos e vídeos só nasce quando se clica nessa opção, e o seletor de arquivos nativo não se opera pela automação.

## Passos

1. Use PNG ou JPEG. Converta o WebP antes, por exemplo com `sips -s format png <arquivo> --out <pasta da sessão>/<nome>.png`.
2. Abra o menu Anexar da conversa.
3. Antes de clicar na opção, capture a entrada que o WhatsApp vai criar, na aba:

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

4. Clique em Fotos e vídeos. Confira a entrada capturada: `data-wa-captured` preenchido e `accept` com `image/*,video/...`. A que tem só `image/*` e já existia é a da figurinha: não use.
5. Ache o novo `file-input` com `find` ou `read_page` e envie o arquivo para ele com `file_upload`.
6. Confira a pré-visualização. Foto tem o campo de legenda ("Digite uma mensagem") e o botão de mais. Sem legenda é figurinha: feche no X e recomece.
7. Com o sim da pessoa a essa imagem e a essa conversa, envie.
8. Restaure a aba e remova as entradas capturadas:

```js
HTMLInputElement.prototype.click = window.__origClick;
document.querySelectorAll('input[data-wa-captured]').forEach(e => e.remove());
```

9. Releia a lista de conversas: a prévia da linha deve dizer "Foto". Se disser "Figurinha", diga isso à pessoa, proponha apagar para todos e reenviar como foto, e só apague com o sim dela.

Documento segue o mesmo caminho, pela opção Documento.
