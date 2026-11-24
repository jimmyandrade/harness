---
name: inscrever-na-oportunidade
description: Preenche o cadastro ou o formulário que a organização de uma oportunidade pede para a inscrição, com os dados da empresa, no formato de cada campo, e envia só com o sim da pessoa. Usada quando a inscrição ou o cadastro de uma oportunidade está para ser feito. NÃO serve para registrar a inscrição no Notion, ler o regulamento, escrever à organização, salvo a resposta que confirma o envio, nem escrever o projeto que a inscrição pede.
metadata:
  author: jimmyandrade
  version: "0.5.2"
  related:
    - acompanhar-retornos-pendentes
    - analisar-regulamento-da-oportunidade
    - definir-empresa
    - definir-reserva
    - definir-roteiro-de-video
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
Prazo vencido, mesmo o que o comunicado diz: diga isso na hora, abra o formulário e, se ele ainda aceita respostas, preencha mesmo assim e, se o envio for recusado, proponha perguntar à organização se ainda aceita. Formulário fechado: diga e não preencha.

Antes de preencher, de pré-inscrever ou de aceitar o convite, leia para quem a oportunidade se declara, como um público por gênero, porte ou local. Se a descrição restringe o público e a pessoa dona da empresa pode não se enquadrar, não inscreva: diga a restrição, não suponha a identidade de ninguém e proponha à pessoa perguntar à organização se a marca pode participar.

Quando a exigência pede um projeto escrito, o texto vem pronto da produção cultural, pela tarefa que `analisar-regulamento-da-oportunidade` criou. Confira se a tarefa está feita e leia o texto entregue. Sem ele, não escreva o projeto aqui: prepare o resto, deixe o campo do projeto como pendência, diga o prazo e pare antes do envio.

Quando a exigência pede um vídeo, o roteiro segue `definir-roteiro-de-video`, com a história da marca lida no cadastro da marca e os critérios que o regulamento dá para a seleção. A gravação fica com a pessoa. Não peça o vídeo como um dado do formulário: prepare o resto, entregue o roteiro e deixe o anexo como pendência, com o prazo.

Um convite da organização por mensagem, que a marca vai aceitar, segue o mesmo caminho antes do rascunho da resposta: confira a agenda nos dias e nos horários do evento e, com reserva «a confirmar» de outra feira nas mesmas datas, siga `definir-reserva` para criar o evento desta e registrar a concorrência nas duas, e garanta a oportunidade cadastrada com os dados, por `procurar-oportunidade` e, sem cadastro, `criar-oportunidade`. Com `Estrutura de exposição a perguntar` preenchida e a estrutura fora do convite, a resposta de aceite pergunta isso à organização.

### Passo 2

Os dados vêm do cadastro, sem perguntar à pessoa.
O responsável pela marca é a pessoa dona da empresa do negócio: leia no cadastro de pessoas o nome, o apelido, a data de nascimento, o endereço, os pronomes e tudo o mais que o formulário pedir dela.
O que o cadastro tem nunca vai para a lista do que falta, nem como pergunta à pessoa.
O nome da marca, o telefone, o WhatsApp e o e-mail vêm do cadastro da empresa. Com mais de uma dona, pergunte qual responde.
O contato de uma inscrição é sempre o da empresa, nunca o telefone nem o e-mail pessoal de um sócio, mesmo quando o campo é do responsável. Sem o contato da empresa no cadastro, pare e peça, e não complete com o da pessoa.
Diga em qual página do cadastro cada dado está, com o link, e o que o cadastro não tem. O dado que falta vira recomendação de campo, sem criá-lo.

O dado de uma conta de plataforma que o formulário pede e o cadastro não tem, como o e-mail da conta no Pinterest, o link do perfil ou se a conta está conectada a outra rede, se lê no navegador, na conta que a pessoa já deixou logada, antes de supor e antes de perguntar. Abra a plataforma numa aba, leia o menu da conta ou a página de configurações e mostre o que leu, com a fonte, na conferência do Passo 6. Não troque de conta, não altere nada e não digite senha. Sem sessão logada, ou com o dado fora da tela, pergunte à pessoa e diga o que tentou.

Pergunta de autodeclaração, como gênero, orientação, raça, deficiência ou morar em favela ou periferia, leva só o que o cadastro ou a pessoa já declarou. Não suponha a identidade de ninguém. O que só a pessoa pode declarar e o cadastro não tem vai numa pergunta única, depois de ler o cadastro.
O território não se responde pelo nome do bairro: compare o endereço do cadastro com o critério que a organização publica e com as fontes oficiais, como a lista de vilas, favelas e ZEIS da prefeitura, e mostre a evidência com o link. A resposta é da pessoa.

### Passo 3

Dado de identidade de pessoa que o formulário pede, como RG e CPF, a pessoa digita. O agente não o digita, mesmo que ele esteja no cadastro.
Ele também não entra na lista do que falta antes do preenchimento: diga que o cadastro o tem e que a pessoa o digita na aba.
Peça à pessoa que o digite na aba e avise, e siga para o campo seguinte.
O CNPJ é da empresa, não da pessoa: leia-o no cadastro da empresa e digite você mesmo, só com os dígitos quando o campo valida assim. Campo que aceita CPF ou CNPJ recebe o CNPJ da empresa. Campo que só aceita CPF segue a regra do CPF.

### Passo 4

Preencha numa aba da sessão. Se a pessoa arrastar a aba dela para o grupo e o contexto de abas disser que o grupo não existe, peça o contexto criando o grupo antes de dar a aba por perdida: ela pode aparecer nele.
O Google Formulários guarda o rascunho na conta: reabrir o link antes do envio mostra o que já foi preenchido, inclusive o que a pessoa digitou. Depois do envio, o mesmo link abre um formulário em branco.
Leia a dica e a mensagem de erro de cada campo e escreva no formato que ele valida, como um telefone só com os dígitos e o DDD, sem o código do país nem pontuação.
Confira cada campo depois de preencher e não avance com erro na tela.
O campo que pede os produtos da marca recebe a lista dos produtos específicos ou, no mínimo, das famílias de produtos que a marca leva, lida do catálogo de produtos do negócio, nas peças ativas e só nas da própria marca. Descrever a marca ou a empresa não responde o campo. A organização pode pedir a retirada do que não está listado, então a lista cobre tudo o que vai à feira.
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
O print da confirmação é seu: tire-o na própria aba, assim que o formulário confirmar o recebimento, e anexe o arquivo à inscrição pelo caminho de arquivos que a lista aceita. Nunca peça à pessoa o print nem que ela o anexe.
Quem fez a inscrição é a pessoa que pediu, e a data da confirmação fica vazia até a organização responder.
O envio só está concluído com a página lida e o link dito.
Quando a mesma conversa trata de mais de uma inscrição, como duas edições da mesma feira, cada uma tem a própria página. A resposta que fala de uma delas lista todas, com o link, o status e o comprovante de cada uma, e diz o que não foi feito e por quê, como um formulário fechado. Não fale só da última.
A aba de confirmação do formulário guarda o link para editar a resposta. Não a feche antes de conferir os campos enviados e de guardar esse link na inscrição. Corrigir uma resposta já enviada é editar essa resposta, na aba da pessoa ou pelo link guardado, nunca enviar o formulário de novo: o link do formulário abre em branco e criaria uma segunda inscrição.
Quando o convite ou o pedido de inscrição chegou por e-mail da organização, responda esse e-mail logo depois do envio, confirmando a inscrição, com o print da tela de confirmação colado no corpo da mensagem e não só anexo, sem pedir o sim. O texto segue `redigir-com-tom-de-voz`, e a conversa recebe o rótulo de quem espera o retorno.
O conector de e-mail pede a imagem em base64: recorte o print só na confirmação e reduza as cores antes de enviar, e leia a mensagem enviada para conferir que o anexo ficou com o tamanho do arquivo.
Depois, marque a tarefa da exigência como feita com o aval da pessoa e, se a organização deve responder, siga `acompanhar-retornos-pendentes`.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Dado do cadastro pedido à pessoa

Se você listar nome, nascimento, endereço, marca ou contato como dados que faltam, a pessoa responde o que o cadastro já diz e a inscrição para à espera dela.

1. Leia a página da pessoa dona e a da empresa antes de dizer o que falta.
2. Mostre cada dado com o link da página onde está.
3. Pergunte só o que o cadastro não tem e só a pessoa pode declarar, numa pergunta única.

### Dado de conta de plataforma suposto

Se você supuser o e-mail ou o perfil da conta de uma plataforma, ou perguntar à pessoa antes de olhar, o formulário segue com um dado que pode estar errado e a pessoa responde o que a tela já mostra.

1. Abra a plataforma no navegador, na conta que a pessoa já deixou logada.
2. Leia o menu da conta ou a configuração e mostre o dado com a fonte.
3. Sem sessão logada, ou com o dado fora da tela, pergunte e diga o que tentou.

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

### CNPJ pedido à pessoa

Se você pedir à pessoa que digite o CNPJ, ela faz um trabalho que era seu, e o formulário fica parado por um dado da empresa que o cadastro já tem.

1. Leia o CNPJ no cadastro da empresa.
2. Digite no campo, no formato que ele valida, e confira o campo antes de avançar.
3. Peça à pessoa só o CPF e o RG.

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

### Marca descrita no lugar dos produtos

Se você preencher o campo dos produtos com a descrição da marca ou da empresa, a organização não sabe o que a marca leva e pode pedir a retirada de peças.

1. Leia o catálogo de produtos do negócio e ponha no campo as famílias de produtos, ou os produtos específicos, das peças ativas.
2. Deixe de fora o produto de outra marca que divide o catálogo.
3. Releia o campo antes do envio e confira que a lista cobre o que vai à feira.

### Comprovante pedido à pessoa

Se você deixar a inscrição sem o comprovante e pedir à pessoa o print ou o anexo, ela faz um trabalho que era seu, e a inscrição fica incompleta até ela mandar.

1. Tire o print da tela de confirmação na própria aba, logo que o formulário confirmar.
2. Anexe o arquivo à inscrição, releia a página e confira que o comprovante apareceu.
3. Só peça a imagem se nenhuma captura da aba for possível, e diga o que falhou.

### Só a última inscrição na resposta

Se você falar só da inscrição que acabou de fechar, a pessoa acha que as outras da mesma conversa não foram registradas e pergunta por elas.

1. Liste todas as inscrições da conversa, cada uma com o link, o status e o comprovante.
2. Diga o que não foi feito e por quê, como um formulário fechado.
3. Diga qual comprovante ainda falta.

### Resposta corrigida numa aba nova

Se você abrir o link do formulário para corrigir uma resposta já enviada, ele abre em branco, e a correção vira uma segunda inscrição.

1. Edite pela aba de confirmação da pessoa ou pelo link de edição que a inscrição guarda.
2. Sem nenhum dos dois, peça à pessoa a aba ou o link. Não envie de novo.
3. Não feche a aba de confirmação antes de guardar o link de edição.

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

### Inscrição sem conferir o público

Se você pré-inscrever numa oportunidade que se declara para um público e só depois ler a descrição, a marca pode estar inscrita onde não cabe e a pessoa descobre depois.

1. Leia o público que a oportunidade declara antes de preencher.
2. Restrição que a marca pode não atender: pare e proponha perguntar à organização.
3. Inscreva só depois da resposta dela.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o convite do plano de assinatura chegou por e-mail e o formulário foi enviado

Depois do envio, registrei a inscrição e respondi o e-mail do convite, confirmando a inscrição, com o print da tela de confirmação no corpo. Não pedi o sim para essa resposta. A conversa ficou como à espera de retorno.

### o grupo da feira mandou o formulário de cadastro de expositores

Li o cadastro da empresa e preenchi o nome do responsável, o apelido, a marca e o WhatsApp da empresa, em dígitos. O RG e o CPF a pessoa digitou, e o CNPJ da empresa eu li no cadastro e digitei. O veículo veio do cadastro. Respondi que não precisava de mesa, balcão nem cadeira extra, porque a empresa leva a própria. Mostrei tudo e esperei o sim antes de enviar.

### o formulário da feira pediu os produtos e a resposta enviada só descrevia a marca

Li o catálogo de produtos e corrigi o campo com as famílias das peças ativas, como camisas, coletes, regatas e shorts, sem as de outra marca. Editei a resposta pela aba de confirmação da pessoa, sem abrir o formulário de novo, e conferi que não saiu uma segunda inscrição.

## Casos-limite

- O campo pede CPF ou CNPJ: digite o CNPJ da empresa. Se só aceita CPF, a pessoa digita.
- A resposta enviada saiu errada e o link de edição se perdeu: com o sim da pessoa, envie de novo, atualize a mesma inscrição com a hora e o comprovante novos, e diga que a primeira resposta continua com a organização.
- A conversa tem mais de uma inscrição: a resposta lista todas, com link, status e comprovante, e o que ficou de fora.
- O formulário pede os produtos: liste as famílias, ou os produtos específicos, do catálogo. Descrição da marca não basta.
- A resposta já foi enviada e precisa de correção: edite pelo link de edição ou pela aba da pessoa. Sem eles, peça. Não envie o formulário de novo.
- O formulário pede pagamento: o pagamento não é desta habilidade. Pare e peça à pessoa.
- O cadastro não tem o contato da empresa: pare e recomende o campo.
- A inscrição é por e-mail e não por formulário: o texto da mensagem segue `redigir-com-tom-de-voz`, e o envio, a skill de e-mail.
- O formulário pede um dado da conta de uma plataforma e o cadastro não o tem: leia no navegador, na conta já logada, e mostre a fonte. Sem sessão logada, pergunte.
- A pessoa já preencheu à mão: leia o rascunho e só registre.
- O projeto ainda não foi entregue pela produção cultural: prepare o resto e pare antes do envio, com o prazo da pendência.
- O formulário pede um vídeo: o roteiro segue `definir-roteiro-de-video`, a pessoa grava, e o anexo fica como pendência com o prazo.
- O formulário pergunta se a pessoa mora em favela ou periferia: mostre o endereço do cadastro, o critério da organização e a fonte oficial do território. A pessoa decide.
- O convite não veio por e-mail, como num link da bio: não há e-mail para responder, e a organização só é avisada se a pessoa pedir.

## Pegadinhas

- O telefone do responsável pela marca parece ser o da pessoa. Numa inscrição, o contato é o da empresa, e o do sócio fica no cadastro dele.
- O campo de telefone parece aceitar qualquer formato legível. O formulário pode validar só os dígitos com o DDD.
- A aba arrastada pela pessoa parece perdida quando o grupo da sessão some do contexto. O preenchimento fica salvo como rascunho no formulário.
- O formulário pede RG e CPF do responsável. O agente não os digita.
- Os dados pessoais do responsável parecem coisa a perguntar. Eles estão no cadastro de pessoas, e só o que ele não tem vira pergunta.
- O nome do bairro parece dizer se é periferia. Um bairro de classe média pode conter uma vila listada pela prefeitura, e o critério é o da organização.
- O e-mail da conta de uma plataforma parece igual ao da empresa. Só a conta logada diz qual é, e a conferência mostra de onde veio.
- O CNPJ parece dado sensível como o CPF. É da empresa: o agente o lê no cadastro e o digita.
- O campo dos produtos parece aceitar a descrição da marca. Ele pede o que a marca vende, em famílias ou peças.
- O print da confirmação parece trabalho da pessoa, porque ela vê a tela. Quem tira e anexa é você, na aba, no mesmo instante.
- O link do formulário parece o caminho para corrigir a resposta. Depois do envio ele abre em branco. A correção é o link de edição da confirmação.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
