---
name: enviar-email
description: Monta e envia um e-mail em nome de uma pessoa, com a assinatura certa, o destinatário principal e as cópias, o anexo vindo do Notion e o envio só com o sim. Usada quando uma pessoa contata uma organização por e-mail, inclusive com comprovante. Não serve para escrever no tom da marca, achar um e-mail nem triar a caixa.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  related:
    - definir-pessoa
    - definir-vocabulario
    - evoluir-habilidade
    - lancar-despesa-da-empresa
    - lancar-despesa-pessoal
    - organizar-emails
    - procurar-email
    - redigir-com-tom-de-voz
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

Antes de redigir, confira nas configurações da ferramenta se o envio está liberado e, se não estiver, peça a liberação logo, com o nome da ferramenta. A liberação não dispensa o sim da pessoa ao texto e aos destinatários.

### Passo 2

Quem fala é a pessoa que contata a organização, e não a empresa dona da caixa. Escreva em primeira pessoa e assine com o nome completo dela, como `definir-pessoa` diz que ela é chamada. Assinar com o nome da empresa só vale quando a empresa é quem fala.
Se a organização conhece a pessoa por outro endereço, como o endereço do cadastro de associado, ponha esse endereço em cópia, para a resposta chegar a ela.

### Passo 3

O destinatário principal é o endereço da área que cuida do assunto, como o setor que pediu a vistoria. Todos os outros endereços que já escreveram à pessoa sobre o assunto entram em cópia, para as áreas ficarem a par.
Só entra em cópia o endereço de um domínio que se sabe ser da organização. Domínio que ninguém confirmou é verificado antes, pela verificação de origem do link. O e-mail que a pessoa só encaminhou não é resposta: o novo e-mail vai à organização, e não a quem encaminhou.

### Passo 4

Anexo de pagamento vem do Notion. Todo comprovante fica na despesa antes de ir por e-mail, como `lancar-despesa-pessoal` e `lancar-despesa-da-empresa` mandam. Sem o comprovante na despesa, grave-o lá primeiro e só depois anexe.
O conector de e-mail aceita anexo só com o conteúdo em base64 dentro da chamada, grande demais para uma imagem. Crie o rascunho sem anexo, abra-o no navegador da pessoa, anexe o arquivo pelo campo de arquivo escondido da página e confira na tela que o anexo aparece, com o nome e o tamanho.

### Passo 5

Aproveite o e-mail para tratar todos os pontos de uma vez, em vez de mandar um e outro depois: o que a pessoa envia, o que pede e o que ainda não sabe, como valores a cotar. Quando o assunto é uma viagem, diga a ida e a volta, com os dias, para a organização saber o período inteiro e, se for o caso, cotar a extensão do serviço.
Uma data limite ou um prazo vira urgência, e não limite: "preciso do serviço ativo o quanto antes, de preferência antes de sábado", e não "preciso do serviço ativo até sábado", que parece dizer que a necessidade acaba no sábado. O `definir-vocabulario` guarda cada correção dessas.

### Passo 6

O texto passa por `redigir-com-tom-de-voz`. Mostre o rascunho inteiro, com o remetente, o Para, as cópias, o assunto, o anexo e a assinatura, e pergunte se pode enviar. O sim vale para esse texto e esses destinatários. Depois do envio, leia a conversa para confirmar que saiu, etiquete como `organizar-emails` manda e, se a mensagem espera resposta, anote quando conferir.

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

### Resposta a um e-mail encaminhado

Se você responder a um e-mail que a pessoa só encaminhou, a resposta volta para quem encaminhou e não chega à organização.

1. Pegue o endereço original da organização.
2. Crie um e-mail novo para ela.
3. Cite as datas dos e-mails que a organização mandou.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a pessoa pagou a mensalidade e quer mandar o comprovante à associação, que já a cobrou por três endereços

Gravei o comprovante na despesa, escrevi em primeira pessoa e assinei com o nome da pessoa. O setor que pediu a vistoria ficou em Para. Os outros dois endereços da associação, de domínio confirmado, e o endereço do cadastro de associado ficaram em cópia. O rascunho foi criado sem anexo e o comprovante foi anexado pelo navegador. Mostrei tudo e esperei o sim.

## Casos-limite

- A empresa é quem fala, e não uma pessoa: assine com o nome da empresa e fale em primeira pessoa do plural.
- O domínio de um endereço não é confirmado: não ponha em cópia sem a verificação de origem.
- O comprovante não existe no Notion e a pessoa só tem o arquivo: grave-o na despesa e anexe depois.
- A ferramenta de envio não está liberada: entregue o rascunho pronto e diga o nome da ferramenta a liberar.

## Pegadinhas

- O aviso do e-mail sobre destinatário de fora da organização é esperado quando a pessoa escreve a uma empresa. Ele não indica problema.
- Um endereço de e-mail que escreveu em nome da organização pode ser só de envio automático e não receber resposta. Verifique antes de pô-lo em cópia.
- O nome do arquivo anexado é lido pelo destinatário. Use um nome que diga o que é e a data.
- O e-mail da empresa pode ser o de contato de uma pessoa, e a organização cadastrou outro endereço dela. Sem o endereço do cadastro em cópia, a resposta pode ir para o lugar errado.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
