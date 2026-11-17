---
name: inscrever-na-oportunidade
description: Preenche o cadastro ou o formulário que a organização de uma oportunidade pede para a inscrição, com os dados da empresa, no formato de cada campo, e envia só com o sim da pessoa. Usada quando a inscrição ou o cadastro de uma oportunidade está para ser feito. NÃO serve para registrar a inscrição no Notion, ler o regulamento, escrever à organização, salvo a resposta que confirma o envio, nem escrever o projeto que a inscrição pede.
metadata:
  author: jimmyandrade
  version: "0.4.0"
  related:
    - acompanhar-retornos-pendentes
    - analisar-regulamento-da-oportunidade
    - definir-empresa
    - definir-inscricao
    - definir-pessoa
    - definir-tarefa
    - criar-oportunidade
    - evoluir-habilidade
    - acompanhar-itens-do-ponto-de-contato
    - procurar-inscricao
    - procurar-oportunidade
    - redigir-com-tom-de-voz
---

# Inscrever na oportunidade

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
"Modo de aprendizado": "perguntar"
# `Estrutura de exposição a perguntar` diz o que perguntar à organização sobre o que a marca pode levar, quando o convite não traz. Vazio, não pergunta.
"Estrutura de exposição a perguntar": ""
```

## Instruções

### Passo 1

Reúna o link do formulário ou do cadastro, a oportunidade e a exigência de `analisar-regulamento-da-oportunidade`, com o prazo.
Sem o link, peça à pessoa e pare. A inscrição que já foi feita e só falta registrar segue `definir-inscricao`.
Prazo vencido: diga isso na hora, preencha mesmo assim e, se o envio for recusado, proponha perguntar à organização se ainda aceita.

Quando a exigência pede um projeto escrito, o texto vem pronto da produção cultural, pela tarefa que `analisar-regulamento-da-oportunidade` criou. Confira se a tarefa está feita e leia o texto entregue. Sem ele, não escreva o projeto aqui: prepare o resto, deixe o campo do projeto como pendência, diga o prazo e pare antes do envio.

Um convite da organização por mensagem, que a marca vai aceitar, segue o mesmo caminho antes do rascunho da resposta: confira a agenda nos dias e nos horários do evento, e garanta a oportunidade cadastrada com os dados, por `procurar-oportunidade` e, sem cadastro, `criar-oportunidade`. Com `Estrutura de exposição a perguntar` preenchida e a estrutura fora do convite, a resposta de aceite pergunta isso à organização.

### Passo 2

Os dados vêm do cadastro, sem perguntar à pessoa.
O responsável pela marca é a pessoa dona da empresa do negócio: leia o nome e o apelido no cadastro de pessoas.
O nome da marca, o telefone, o WhatsApp e o e-mail vêm do cadastro da empresa. Com mais de uma dona, pergunte qual responde.
O contato de uma inscrição é sempre o da empresa, nunca o telefone nem o e-mail pessoal de um sócio, mesmo quando o campo é do responsável. Sem o contato da empresa no cadastro, pare e peça, e não complete com o da pessoa.
Diga em qual página do cadastro cada dado está, com o link, e o que o cadastro não tem. O dado que falta vira recomendação de campo, sem criá-lo.

### Passo 3

Dado de identidade que o formulário pede, como RG e CPF, a pessoa digita. O agente não o digita, mesmo que ele esteja no cadastro.
Peça à pessoa que o digite na aba e avise, e siga para o campo seguinte.

### Passo 4

Preencha numa aba da sessão. Se a pessoa arrastar a aba dela para o grupo e o contexto de abas disser que o grupo não existe, peça o contexto criando o grupo antes de dar a aba por perdida: ela pode aparecer nele.
O Google Formulários guarda o rascunho na conta: reabrir o link mostra o que já foi preenchido, inclusive o que a pessoa digitou.
Leia a dica e a mensagem de erro de cada campo e escreva no formato que ele valida, como um telefone só com os dígitos e o DDD, sem o código do país nem pontuação.
Confira cada campo depois de preencher e não avance com erro na tela.
O campo ou o anexo do projeto leva o texto entregue pela produção cultural, no formato e no limite que o formulário pede, sem reescrevê-lo. Se o limite não cabe, devolva o texto à produção cultural com o limite.
Quando a pessoa vai de carro, o veículo vem do cadastro de veículos da viagem.

### Passo 5

Item que o formulário oferece para alugar, como mesa, balcão ou cadeira, e que a empresa leva por conta própria, não se aluga: a resposta é que não precisa, e o item entra nos itens do ponto, por `acompanhar-itens-do-ponto-de-contato`.
Item pago só se escolhe com o sim da pessoa.

### Passo 6

Antes de enviar, mostre tudo o que está preenchido, de todas as páginas, sem repetir documento, e peça o sim. Se a inscrição pede um projeto, mostre-o também e não envie sem ele.
Envie só depois dele. O sim vale para esse formulário.
Ao começar a preencher, procure a inscrição dessa oportunidade na lista e, se não existir, crie-a em andamento, ou confirmada se a taxa já foi paga, por `definir-inscricao`: a inscrição nunca depende de lembrar no fim.
Logo depois do envio, antes de qualquer mensagem ao organizador ou tarefa, atualize essa inscrição com a hora do envio e a tela de confirmação do formulário nos comprovantes, sem perguntar, releia a página e dê o link na resposta.
Quem fez a inscrição é a pessoa que pediu, e a data da confirmação fica vazia até a organização responder.
O envio só está concluído com a página lida e o link dito.
Quando o convite ou o pedido de inscrição chegou por e-mail da organização, responda esse e-mail logo depois do envio, confirmando a inscrição, com o print da tela de confirmação colado no corpo da mensagem e não só anexo, sem pedir o sim. O texto segue `redigir-com-tom-de-voz`, e a conversa recebe o rótulo de quem espera o retorno.
O conector de e-mail pede a imagem em base64: recorte o print só na confirmação e reduza as cores antes de enviar, e leia a mensagem enviada para conferir que o anexo ficou com o tamanho do arquivo.
Depois, marque a tarefa da exigência como feita com o aval da pessoa e, se a organização deve responder, siga `acompanhar-retornos-pendentes`.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Contato pessoal no formulário

Se você preencher o telefone que está na página do sócio, a organização passa a falar com o número pessoal dele.

1. Leia o contato no cadastro da empresa.
2. Sem ele, pare e peça.
3. Confira o campo antes do envio.

### Formato recusado

Se você escrever o telefone com código do país e pontuação, o campo pode recusar, e a mensagem só aparece depois de preenchido.

1. Leia a dica de cada campo.
2. Escreva no formato que ele valida.
3. Confira a tela antes de avançar.

### Documento digitado pelo agente

Se você digitar RG ou CPF, a regra de segurança é quebrada, mesmo com o dado no cadastro.

1. Diga onde o dado está.
2. Peça que a pessoa digite.
3. Continue pelo campo seguinte.

### Item pago escolhido por conta própria

Se você escolher mesa, balcão ou cadeira pagos, a empresa paga por algo que ela já tem ou não pediu.

1. Responda que não precisa, quando a empresa leva o item.
2. Item pago só com o sim da pessoa.
3. Deixe o item nos itens do ponto, por `acompanhar-itens-do-ponto-de-contato`.

### Envio sem a inscrição registrada

Se você enviar o formulário e seguir para a mensagem ao organizador sem criar a inscrição, a lista de inscrições da oportunidade fica vazia e a pessoa descobre sozinha.

1. Crie a inscrição em andamento ao começar a preencher.
2. Depois do envio, atualize a hora e o comprovante e releia a página.
3. Dê o link da inscrição antes de tratar qualquer outro assunto.

### Projeto escrito por esta habilidade

Se você escrever a justificativa ou o orçamento que o edital pede, o texto não passa pela produção cultural e a marca envia um projeto sem a revisão do papel responsável.

1. Confira se a tarefa do projeto está feita.
2. Use o texto entregue, no formato e no limite do formulário.
3. Sem o texto, deixe a pendência com o prazo e pare antes do envio.

### Organização sem confirmação do envio

Se você enviar o formulário de um convite que veio por e-mail e não responder esse e-mail, a organização não sabe que a inscrição saiu, e a pessoa precisa pedir a resposta.

1. Depois de registrar a inscrição, responda o e-mail do convite, confirmando.
2. Cole o print da tela de confirmação no corpo, sem pedir o sim.
3. Rotule a conversa como à espera de retorno.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o convite do plano de assinatura chegou por e-mail e o formulário foi enviado

Depois do envio, registrei a inscrição e respondi o e-mail do convite, confirmando a inscrição, com o print da tela de confirmação no corpo. Não pedi o sim para essa resposta. A conversa ficou como à espera de retorno.

### o grupo da feira mandou o formulário de cadastro de expositores

Li o cadastro da empresa e preenchi o nome do responsável, o apelido, a marca e o WhatsApp da empresa, em dígitos. O RG e o CPF a pessoa digitou. O veículo veio do cadastro. Respondi que não precisava de mesa, balcão nem cadeira extra, porque a empresa leva a própria. Mostrei tudo e esperei o sim antes de enviar.

## Casos-limite

- O formulário pede pagamento: o pagamento não é desta habilidade. Pare e peça à pessoa.
- O cadastro não tem o contato da empresa: pare e recomende o campo.
- A inscrição é por e-mail e não por formulário: o texto da mensagem segue `redigir-com-tom-de-voz`, e o envio, a skill de e-mail.
- A pessoa já preencheu à mão: leia o rascunho e só registre.
- O projeto ainda não foi entregue pela produção cultural: prepare o resto e pare antes do envio, com o prazo da pendência.
- O convite não veio por e-mail, como num link da bio: não há e-mail para responder, e a organização só é avisada se a pessoa pedir.

## Pegadinhas

- O telefone do responsável pela marca parece ser o da pessoa. Numa inscrição, o contato é o da empresa, e o do sócio fica no cadastro dele.
- O campo de telefone parece aceitar qualquer formato legível. O formulário pode validar só os dígitos com o DDD.
- A aba arrastada pela pessoa parece perdida quando o grupo da sessão some do contexto. O preenchimento fica salvo como rascunho no formulário.
- O formulário pede RG e CPF do responsável. O agente não os digita.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
