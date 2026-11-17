---
name: rascunhar-mensagem
description: Escreve, mostra e envia a mensagem de WhatsApp depois de a conversa ser lida, com o destino, o texto, a divisão e o comprovante conferidos. Usada quando a pessoa quer responder, mandar ou corrigir uma mensagem. NÃO serve para ler a conversa, redigir no tom de voz, criar a tarefa nem cadastrar a pessoa.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  aliases:
    - entregar-rascunho-de-mensagem
    - rascunhar-mensagem-no-whatsapp
  related:
    - acompanhar-resposta-no-whatsapp
    - anexar-arquivo-no-whatsapp
    - conversar-no-whatsapp
    - definir-tarefa
    - definir-viagem
    - definir-vocabulario
    - dividir-mensagem
    - enviar-email
    - escrever-link
    - evoluir-habilidade
    - procurar-agenda
    - redigir-com-tom-de-voz
    - rotular-item
    - usar-whatsapp-web
---

# Rascunhar mensagem

## Parâmetros de configuração

Leia os valores nas instruções do projeto, na entrada desta habilidade. Na ausência, use os padrões abaixo.
```yaml
# `Formato da data na mensagem` vale para o texto que vai a uma pessoa: por extenso, sem zero no dia, não deixa dúvida entre dia e mês.
"Formato da data na mensagem": "terça-feira, 1 de setembro de 2026"
"Modo de aprendizado": "perguntar"
# `Entrega dos rascunhos` é `chat` ou `artefato`. Com `artefato`, os rascunhos pendentes ficam numa página única, aberta no painel da sessão, com uma caixa de marcar o que já foi enviado.
"Entrega dos rascunhos": "chat"
# `Canal do comprovante` é `e-mail na mesma conversa` (e-mail em resposta à organização, com o arquivo anexado; o WhatsApp só avisa), `WhatsApp` (arquivo na conversa) ou `e-mail e WhatsApp` (nos dois).
"Canal do comprovante": "WhatsApp"
# `Página de instruções do WhatsApp` é o endereço da página com as regras da conta, como a ferramenta comercial por onde a mensagem sai. Vazio pula a leitura.
"Página de instruções do WhatsApp": ""
# `Horário de trabalho`: o da entrada `Global`. Fora dele, a mensagem pede desculpa pelo horário. Vazio, não pede.
"Horário de trabalho": ""
```
## Instruções

### Passo 1

A leitura da conversa é de `conversar-no-whatsapp`. Receba dela a conversa de destino, quem mandou a última mensagem e o que o contato respondeu, com as palavras dele e o horário. Sem a leitura, volte a ela.

O destino do rascunho é quem mandou a mensagem respondida, na conversa que a pessoa indicou. Diga "para X, na conversa Y" antes do texto.

No WhatsApp Web, todo acesso segue `usar-whatsapp-web`: antes de enviar, confira no cabeçalho o nome da conversa. O texto, o destino e o sim do envio são daqui.

### Passo 2

Uma empresa que a pessoa só conhece pelo site ou pela busca pode já estar salva no WhatsApp dela, com histórico. Antes do primeiro contato, procure a conversa pelo nome e pelo número. Achada, leia o histórico e continue a conversa, em vez de escrever como se fosse a primeira.

Antes de rascunhar, leia a conversa de destino desde a última mensagem lida, como `conversar-no-whatsapp` manda, e confira cada pergunta do rascunho contra ela inteira, inclusive a mensagem citada. A pergunta já respondida sai, mesmo quando outra fonte mais antiga diverge: mostre a divergência à pessoa, não ao contato. Sai também a que o site ou o cadastro da empresa já responde, como o horário de funcionamento.

Tire também o que já foi dito e diga antes o que o texto acrescenta. O dado que o contato ou a oportunidade já traz, como a chave de pagamento de antes, entra no texto para confirmar, e não como pergunta aberta. Se tudo já foi dito, diga isso e não rascunhe.

Leia cada resposta como resposta à pergunta como foi escrita. Uma pergunta sem dia, sem janela e sem condição, respondida com "pode" ou "sim", vale para tudo o que ela cobria. Não estreite a resposta com uma condição que a pergunta não tinha, e não repita a pergunta para pedir mais detalhe.

Antes de qualquer rascunho, diga à pessoa o que o contato respondeu, com as palavras dele e o horário, para ela não ter de abrir a conversa.

Com a mesma pessoa ou empresa pode haver mais de um pedido aberto, como duas coisas a imprimir em materiais diferentes. Antes de rascunhar, liste os pedidos abertos com ela. A mensagem diz de qual pedido trata, pelo material e pelo uso. Com mais de um, numere cada um, com o material e o que precisa agora, como o prazo. Resposta que não diz a qual pedido responde: confirme de qual ele falava, antes de seguir.

Confira no manual da oportunidade cada exigência do organizador, como a janela de montagem, e use a que ele dá.

A resposta que confirma interesse diz de qual oferta fala, pela organização e pelo formato. Duas ofertas parecidas, no mesmo lugar ou perto das mesmas datas, não entram na mesma frase.

Antes de rascunhar uma mensagem que propõe, aceita ou combina data, hora, lugar, retirada, coleta, entrega, encontro ou prazo, confira a agenda, seguindo `procurar-agenda`, e a viagem ativa ou a próxima, seguindo `definir-viagem`: saída, chegada, a cidade de cada dia e os compromissos que batem.

Se a proposta conflita, como uma retirada numa cidade de onde a pessoa já saiu naquele horário, diga o conflito antes do texto e ofereça o que cabe: outro dia ou horário, outra pessoa ou o correio. Sem acesso à agenda ou à viagem, pare e peça o dado.

Abra com a frase de contexto e, se nenhuma mensagem nossa já saudou hoje, a saudação do período, lida no relógio. Fora do `Horário de trabalho`, peça desculpa pelo horário.

Palavra de tempo relativo no rascunho, como "ontem", "hoje" e "agora há pouco", conta a partir do dia e da hora da mensagem que ele responde, comparados com o relógio de agora. Responda à última mensagem do contato, e não a uma anterior. Na dúvida sobre o dia, cite o conteúdo da mensagem, sem dizer quando ela chegou.

Com `Página de instruções do WhatsApp` preenchida, leia a página antes de rascunhar e siga a conta e as regras dela. Se ela não abrir na conexão, pare e peça.

Numa conversa que não está fluindo, veja também o e-mail com o mesmo contato desde a última mensagem e alinhe os pedidos com ele.

### Passo 3

Todo rascunho de mensagem aparece na resposta do chat. Mostre a conversa de destino, uma linha do que o rascunho acrescenta ao que já foi dito e, em cada mensagem que responde a algo, a mensagem citada, com a data. Fecha o rascunho a pergunta que pede o sim para esta conversa e este texto, com a frequência e o prazo do acompanhamento quando a mensagem espera resposta.
O texto vai na mensagem de fechamento do turno, junto com o pedido do sim: o escrito antes de um quadro de próximo passo pode ser cortado.
Uma mensagem que diz que um trabalho está em andamento, foi registrado ou foi feito leva o link da tarefa, da página ou do pull request que mostra esse registro. Sem esse registro, crie-o antes, como `definir-tarefa` manda, ou pergunte onde ele está.
Com a ferramenta de widget na sessão, o widget vem sempre, além dos blocos: o destinatário, um campo editável por mensagem com a altura do texto inteiro, um botão para copiar e um botão que manda o texto aprovado de volta ao chat. Se a pessoa editar, a versão dela substitui o rascunho e aparece de novo antes do sim.
Com `Entrega dos rascunhos` em `artefato`, o rascunho nunca fica só no chat: uma página única, aberta no painel, guarda cada rascunho como registro num banco dela, com a ordem, o título, o destino com link, o texto, uma nota, se foi enviado e quando, e uma caixa de marcar como enviado. O rascunho novo entra no fim e o enviado desce para `Já enviados`. Atualize a mesma página, leia a marca de cada registro antes de mudar a lista e nunca desmarque o que a pessoa marcou. A resposta cita a página. Sem a ferramenta de página, entregue no chat e diga isso.

O texto não usa Markdown: negrito é um asterisco de cada lado, itálico é sublinhado, e não há título nem link entre colchetes.

Depois de escrever o texto, siga `dividir-mensagem` para decidir como ele sai, em mensagens curtas, numa só ou em partes numeradas pelo limite. O sim da pessoa vale para o texto mostrado, com todas as partes numeradas. Envie na mesma ordem, uma de cada vez.

A mensagem que responde a um áudio usa o Responder dele e quebra a transcrição em trechos, cada um com a resposta logo abaixo. Um `> ` só abre o trecho, que é uma linha, e uma linha em branco o separa da resposta. Tudo o que a pessoa falou entra em algum trecho e recebe resposta: o trecho sem pergunta recebe uma frase curta de retorno.
Numa conversa já aberta com a pessoa, a mensagem não diz quem escreve nem de qual empresa: o nome da conversa já diz. Quem ainda não conhece quem escreve é apresentado uma vez, na primeira mensagem, com o nome e a empresa. Depois, nem a abertura repete a apresentação nem o fim leva assinatura.
A saudação e o texto se dirigem só a quem está na conversa aberta: quem ela não alcança, como a outra pessoa que assina a organização, entra na terceira pessoa. Quem só fica a par recebe, na conversa dele, um aviso curto, sem as perguntas de quem decide.
O comprovante de pagamento segue `Canal do comprovante`. O e-mail do comprovante é o que a organização já mandou para o pagamento, inclusive uma chave Pix em forma de e-mail: a mensagem diz para onde o comprovante vai, sem perguntar se o endereço serve. Pergunte só quando a conversa e o cadastro não trazem nenhum e-mail.
O e-mail sai por `enviar-email`, com o arquivo anexado e o sim da pessoa, e o WhatsApp só avisa que foi por e-mail e pede a confirmação. Com `e-mail e WhatsApp`, o arquivo vai também na conversa, antes do aviso. Sem conversa de e-mail com a organização, mande o arquivo no WhatsApp e diga isso.

Para responder ou enviar, mostre a conversa de destino, o texto exato e, se for resposta, a mensagem citada. Envie só depois do sim da pessoa a esse texto e a essa conversa. O sim vale para o texto mostrado, com todas as partes numeradas. Uma parte nova ou alterada pede outro sim.

Se a conversa estiver com um agente de IA, avise antes de enviar: ele responde à próxima mensagem do contato. No WhatsApp Web, veja isso como `usar-whatsapp-web` manda, inclusive num robô com menu: tente cada passo, não preveja o resultado.

Uma conversa que está fluindo continua no WhatsApp, e a resposta sai rápido. Um e-mail, formulário ou telefone que o atendimento cite é dica, não motivo para trocar de canal: tente cada passo do fluxo na conversa. Só com a conversa parada, depois de dizer o tempo de espera, ofereça outro canal, como complemento.

Toda data no rascunho vai no `Formato da data na mensagem`. Calcule o dia da semana como a regra do dia da semana manda. O link segue `escrever-link`.

Antes de enviar, tire um print do campo e confira o texto, a lista e a mensagem citada. Se a formatação sair diferente do aprovado, limpe o campo e digite de novo.
Imagem e arquivo seguem `anexar-arquivo-no-whatsapp`, depois do sim: a imagem nunca vai pela Nova figurinha.
Depois de enviar, leia a conversa de novo, confira se a mensagem aparece e diga o horário.
Compare o que saiu com o que você mostrou. Cada diferença que a pessoa fez antes de enviar vira termo por `definir-vocabulario`. Se não souber se a diferença é regra ou escolha do momento, pergunte.

O que a pessoa ditou duas vezes sai uma vez, e mensagem que ela não escreveu não entra.

Para corrigir uma mensagem já enviada, edite-a e marque a palavra corrigida com um asterisco no fim, como `Chegaremos*`. Não mande outra mensagem só para corrigir. A edição também pede o sim.

### Passo 4

Quando a mensagem espera resposta, como uma pergunta, um pedido ou um prazo, siga `acompanhar-resposta-no-whatsapp`. A pergunta que pede o sim do Passo 3 já diz que a resposta vai ser acompanhada, com a frequência e até quando.

Depois do envio, atualize os rótulos de cada conversa em que enviou, e rotule a do e-mail do comprovante. Passe quem age agora e o contexto entre `Etiquetas de contexto`. Diga na resposta os rótulos que ficaram.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Dia da semana errado

Se você converter "sexta-feira" contando a partir de outro dia que não hoje, ou escrever "vale até quarta" calculando de cabeça, a data sai um dia errada e a pessoa perde o prazo.

1. Conte a partir de hoje e pegue o último dia com esse nome antes de hoje.
2. Escreva a data no `Formato da data na mensagem`, com o dia da semana calculado como a regra manda.
3. Confira o rascunho antes de pedir o sim.


### Pedidos misturados com o mesmo contato

Se você escrever a pergunta sem dizer de qual pedido ela trata, o contato responde pensando em outro.

1. Liste os pedidos abertos com ele e diga na mensagem de qual trata.
2. Com mais de um, numere cada um, com o material e o que precisa agora.
3. Resposta que não diz a qual pedido responde: confirme de qual ele falava.


### Resposta lida como incompleta

Se você disser que a resposta não cobre o dia ou a janela, e a pergunta não os citava, o rascunho repete a pergunta e a pessoa vai ler a conversa à mão.

1. Compare a resposta com a pergunta como foi escrita, e não com o que você gostaria de saber.
2. Diga à pessoa a resposta do contato, com as palavras dele e o horário.
3. Pergunte de novo só o que a pergunta anterior não cobria.


### Rascunho fora da vista

Se você disser que o rascunho está pronto sem mostrar o texto, a pessoa não confere nem corrige antes do envio.

1. Mostre o texto inteiro na resposta do chat, num bloco de código.
2. Com a ferramenta de widget na sessão, mostre sempre também o texto editável, com copiar e aprovar. O widget não substitui o bloco.
3. Pergunte se pode enviar só depois do texto, na mesma resposta.


### Andamento sem o link

Se você escrever que a investigação já começou sem o link da tarefa, quem pediu não tem onde acompanhar e volta a perguntar.

1. Ponha na mensagem o link do registro do trabalho.


### Mensagem cortada com "Ler mais"

Se você mandar um texto acima de `Limite de caracteres por mensagem` numa mensagem só, o fim some atrás de "Ler mais".

1. Conte os caracteres e, acima do limite, divida em partes numeradas, com a contagem de cada uma.


### Palavra de tempo errada na mensagem

Se você escrever "ontem" ou "hoje" sem comparar com o dia da mensagem que responde, o texto responde a uma mensagem anterior e mostra que você não leu a conversa até o fim.

1. Compare o dia e a hora da mensagem respondida com o relógio de agora.
2. Responda à última mensagem do contato.
3. Na dúvida sobre o dia, cite o conteúdo, sem dizer quando chegou.

### E-mail do comprovante perguntado

Se você perguntar à organização se o e-mail que ela mandou para o pagamento serve para o comprovante, repete o que ela já disse e atrasa a formalização.

1. Use o e-mail que a organização mandou, inclusive uma chave Pix em forma de e-mail.
2. Diga na mensagem para onde o comprovante vai.
3. Pergunte só quando a conversa e o cadastro não trazem nenhum e-mail.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Responda ao Caio que podemos falar às 15h

Mostrei a conversa do Caio e o texto "Podemos falar 15h00?". Enviei depois do sim. A conversa estava com o agente de IA da conta comercial, e avisei antes. Li a conversa de novo e a mensagem aparece às 14h05.


### Mande uma mensagem só com as duas perguntas e o resumo da conversa (800 caracteres)

Contei 800 caracteres, acima do limite de 600. Avisei antes do sim que vai em duas partes, cortadas entre os itens: a Mensagem 1 com a saudação e o item 1 (410 caracteres) e a Mensagem 2 com o item 2 e o fechamento (390). Enviei uma depois da outra, com o sim às duas.


### escrevi chegamos, mas a gente ainda não chegou

Mostrei a edição "Chegaremos*" e editei depois do sim, sem outra mensagem.


### o Pedro respondeu "Pode sim, já adicionamos aqui" à pergunta sobre o carro entrar na montagem, sem citar o dia

Li a resposta como a da pergunta: o carro pode entrar na montagem, em qualquer janela. Disse à pessoa as palavras dele e o horário, e tirei a pergunta do carro do rascunho. Perguntei só o que a conversa ainda não respondia.


## Casos-limite

- A resposta é "pode" ou "sim" a uma pergunta sem dia nem condição: vale para tudo o que a pergunta cobria. Não rascunhe a pergunta de novo.
- Uma frase ou um item numerado sozinho passa do limite: não corte no meio. Proponha encurtar o texto.
- A leitura da conversa não foi feita: volte a `conversar-no-whatsapp` antes de rascunhar.

## Pegadinhas

- Uma resposta curta parece incompleta quando não repete o detalhe que a conversa já traz. Ela responde a pergunta como foi escrita: confira o texto da pergunta antes de achar que falta algo.
- O rascunho de ontem parece valer. A conversa pode ter mudado: leia antes e rascunhe só o que falta.
- Ao dividir uma lista numerada, o campo pode renumerar o item solto e a parte que continua a lista voltar para "1.". Confira no print e, no WhatsApp Web, siga `usar-whatsapp-web`.
- A caixa de marcar parece só do agente. A pessoa também a marca, e a marca dela não se desfaz.
- A mensagem parece pedir assinatura como um e-mail. A conversa já mostra quem escreve.
- "Vimos seu aviso de ontem" parece educado. Se a mensagem mais recente do contato é de hoje, a frase responde à anterior: confira a data de cada mensagem citada e use a última.
- Uma chave Pix em forma de e-mail parece só um destino de pagamento. Quando a organização a mandou para pagar, o comprovante vai para esse endereço, e perguntar se ele serve repete o que ela já disse.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
