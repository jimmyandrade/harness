---
name: enviar-mensagem-no-slack
description: Redige uma mensagem de Slack, num canal, thread ou DM, e entrega o rascunho com o link do destino. Só envia com a autorização explícita da pessoa e, depois do envio, compara o proposto com o aplicado para alimentar o vocabulário. Usada quando a pessoa pede uma mensagem ou resposta no Slack. Não serve para achar conversa antiga nem cadastrar pessoa.
metadata:
  author: jimmyandrade
  version: "0.11.0"
  related:
    - definir-agenda
    - definir-pessoa
    - definir-vocabulario
    - entregar-rascunho-de-mensagem
    - escrever-link
    - evoluir-habilidade
    - pedir-revisao-de-pr-no-slack
    - redigir-com-tom-de-voz
---

# Enviar mensagem no Slack

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um parâmetro vazio não impõe regra.
```yaml
"Retroalimentar o vocabulário": "sim"
"Modo de aprendizado": "perguntar"
# `Emoji do título do post` é o shortcode que abre o título de um post novo, ou vazio para não ter emoji.
"Emoji do título do post": ""
# `PS no post novo` é `sim`, `não` ou `por canal`, e diz se o post termina com um PS pedindo para responder na thread.
"PS no post novo": "não"
"Itálico em estrangeirismo": "sim"
# `Termos sem itálico` lista as palavras estrangeiras que ficam sem itálico, como siglas que já são de uso comum.
"Termos sem itálico": []
# `Artigo antes de nome` é `livre`, que segue o tom de voz, ou `nunca`.
"Artigo antes de nome": "livre"
# `Linha de link em post novo` descreve uma linha de link isolada ao fim de um post novo, ou fica vazio.
"Linha de link em post novo": ""
# `Saudação em resposta de thread` é `livre` ou `menção`.
"Saudação em resposta de thread": "livre"
# `Transmitir resposta de DM` é `sim` quando a resposta numa DM também vai para o canal da conversa.
"Transmitir resposta de DM": "não"
# `Estilo de escrita`: regra extra do projeto, como um tratamento que a organização evita.
"Estilo de escrita": ""
# `Formato de link`: regra extra do projeto, como um endereço que se encurta.
"Formato de link": ""
# `Contexto compartilhado`: regra extra do projeto, como a lista de canais privados.
"Contexto compartilhado": ""
"Assuntos que não se resolvem no Slack": ""
# `Aviso ao canal inteiro` é `post único` ou `título curto em post novo, detalhe em respostas na thread`.
"Aviso ao canal inteiro": "post único"
# `Emoji do título de aviso ao time` é um shortcode, ou vazio para usar o do post.
"Emoji do título de aviso ao time": ""
# `Título do aviso ao time` é a regra do título, ou vazio.
"Título do aviso ao time": ""
# `Menção ao canal em aviso ao time` é `livre` ou `nunca`.
"Menção ao canal em aviso ao time": "livre"
# `Pedido de ciência por reação em aviso ao time` é `sim` ou `não`.
"Pedido de ciência por reação em aviso ao time": "não"
# `Pessoa do caso em aviso ao time` é como citar quem o aviso envolve, ou vazio.
"Pessoa do caso em aviso ao time": ""
# `Material de apoio em aviso ao time` é onde vai o link de apoio, ou vazio.
"Material de apoio em aviso ao time": ""
# `Rascunho de aviso ao time` é o que vira rascunho, ou vazio.
"Rascunho de aviso ao time": ""
```
## Instruções

### Passo 1

Peça o destino e o assunto: canal, thread ou DM, para quem e o que dizer. Leia a thread inteira antes de responder nela, e as threads e os links que ela cita.

Se o assunto é um dos `Assuntos que não se resolvem no Slack`, como uma decisão ou dúvida de código que pertence ao pull request, não redija resposta de mérito: diga a quem usa a habilidade para onde o assunto vai e, se couber, redija só uma frase de status.

Mensagem nova num canal, que não é resposta, tem o assunto conferido com o propósito do canal. Use o que o Slack informa do canal, ou o registro de canais do projeto. Se o assunto não bate com o propósito, diga isso e pergunte uma vez em qual canal postar. Não escolha o canal só porque a conversa anterior foi lá.

### Passo 2

Resolva cada pessoa citada pelo ID dela no Slack, buscando no Slack. Uma pessoa que não está no registro de pessoas do projeto vai para `definir-pessoa`. Não adivinhe o ID nem o nome.

### Passo 3

Escreva o texto com `redigir-com-tom-de-voz`, e passe o contexto: canal ou DM, e a pessoa ou o canal, para a consulta do vocabulário usar as tags certas. Siga as regras de redação abaixo e os parâmetros de escrita que estiverem preenchidos.

Termos proibidos e alternativas vêm do vocabulário, não desta habilidade.

**Estrutura da mensagem**

- Uma mensagem, uma finalidade. Agradecer a alguém e posicionar o grupo são duas mensagens: a primeira menciona a pessoa, a de posicionamento geral não menciona ninguém.
- Uma mensagem com mais de um parágrafo de conteúdo abre com um resumo curto, rotulado como o vocabulário define, e depois a versão completa. Ficam sem resumo a reação, a resposta de uma frase e o pedido que cabe em uma frase mais as linhas de link.
- Cada pedido aparece uma vez, na mensagem de quem ele se dirige. A mensagem de contexto não repete o pedido da seguinte. O pedido que fecha a mensagem fica em parágrafo próprio.
- Em thread com várias pessoas, quando cada uma perguntou ou pediu algo, escreva uma mensagem por destinatário, com a menção real. Um aviso de status a quem acompanha a thread é uma mensagem só: o fato, a consequência provável e o próximo passo, sem resumir o conteúdo e sem pedir permissão.
- Nunca assuma compromisso nem ofereça ajuda que a pessoa não pediu. Concordar e agradecer basta. Na dúvida, use o plural ou deixe de fora.
- Status de revisão ou aprovação: a menção e o status numa frase. Elogio ou comentário pessoal vai em parágrafo separado; sem elogio, sem o parágrafo.
- Aviso de status numa thread que já tem a decisão: abra pelo que foi feito e quando, sem repetir o que a thread já mostra, e diga depois quem está com a bola e o que a pessoa fará.
- Acompanhamento no essencial: o que existe (o card), o bloqueio concreto e a consequência para quem lê. O detalhe técnico fica no card ou no pull request. Uma proposta paralela vai no fim: pergunte se já existe algo, ofereça-a como opção e devolva a decisão.
- Resposta numa thread em que alguém reportou um bug: diga só o que foi feito, como a issue aberta e linkada, e uma estimativa em hedge. Não explique a causa nem prometa a correção, a menos que perguntem. Uma decisão que não é de quem escreve vai a quem decide, com uma pergunta só.
- Uma decisão de escopo anunciada leva o porquê em uma frase, em primeira pessoa.
- Pedir o trabalho de alguém: a menção, o pedido direto, o que você estava fazendo e o valor do trabalho da pessoa. Enquadre como ajuda, nunca como comparação com o que você fez.
- Pergunta ao time sobre prazo: um parágrafo curto que termina na pergunta, e um segundo com o que se quer fazer, a data que pressiona e o que você faz se der certo.
- Pedido simples de acesso ou favor: um parágrafo, com o que você está fazendo, o que precisa e quem pode ajudar, sem justificativa. Numa thread que já existe, só o contexto e o pedido.
- Em DM, um recado com partes (contexto, pedido, combinado) vai em mensagens curtas e sequenciais, uma ideia por mensagem. Corte o detalhe técnico que não ajuda a identificar o assunto: o link leva ao detalhe.
- Follow-up atrasado em DM: abra retomando o assunto, dê o status e o pedido, mande um link por mensagem e deixe o motivo do atraso por último, em uma frase no nível do assunto. Uma atualização a quem acompanha o assunto traz o que foi feito e o que está sem resposta numa mensagem curta, e a pergunta numa segunda.

**Post novo em canal**

- A primeira linha é o título em negrito, numa frase, com o `Emoji do título do post`, seguida de uma linha em branco e do corpo. O conector recebe markdown: o negrito é `**título**`, e com `*título*` ele vira itálico. Cada mensagem de um lote leva o próprio título.
- Com `PS no post novo` em `sim`, o post termina, depois de uma linha em branco, com um PS pedindo para responder na thread, na frase do vocabulário. Com `por canal`, leia no registro de canais do projeto se aquele canal incentiva a resposta na thread. Sem essa informação, pergunte antes de redigir e grave a resposta no registro do canal, para não perguntar de novo. Em DM nunca há PS. Num lote de mensagens seguidas no mesmo canal, a saudação vai só na primeira e o PS só na última.
- Uma resposta dentro de uma thread existente nunca leva título nem PS. Antes de abrir um post novo, confira se o canal já tem uma thread sobre o assunto e responda nela.
- Quando a pessoa confirma a participação numa call combinada na conversa, a resposta traz o link da chamada, o dia e a hora. O evento fica na agenda por `definir-agenda`.
- Um aviso ao time inteiro segue `Aviso ao canal inteiro`: com a thread, o post novo leva só o título, com o `Emoji do título de aviso ao time` (vazio usa o do post) e o `Título do aviso ao time`, e cada assunto do detalhe vai numa resposta. Siga `Pessoa do caso em aviso ao time` e `Material de apoio em aviso ao time`. Com `Menção ao canal em aviso ao time` em `nunca`, não use `@channel`, `@here` nem grupo. Com `Pedido de ciência por reação em aviso ao time` em `não`, não peça reação. `Rascunho de aviso ao time` diz o que vira rascunho, e a entrega segue `entregar-rascunho-de-mensagem`.
- O pedido de revisão de pull request segue `pedir-revisao-de-pr-no-slack`.

**Escrita**

- Com `Itálico em estrangeirismo` em `sim`, toda palavra de outro idioma solta numa frase fica em itálico, como `_deploy_` e `_bug_`, também dentro de um título em negrito (`**Revisão do _deploy_**`) e num produto com nome estrangeiro. As palavras de `Termos sem itálico` ficam como estão. Varra o texto antes de entregar. Um texto em outro idioma não leva termo em português solto, só nome próprio entre aspas.
- Funda as frases que fluem juntas num parágrafo e separe os pontos distintos. Uma atualização com várias partes abre com uma linha terminada em dois-pontos, e cada parte vai em parágrafo próprio. Um relato de problema tem sintoma, evidência e abrangência, cada um num parágrafo.
- Uma frase longa com oração relativa encadeada vira duas curtas. Um pronome ambíguo vira o substantivo. Não repita a mesma palavra na mesma frase.
- Negrito fica para o título do post e para cabeçalhos, não para o rótulo de cada item de lista.
- Correção de erro de digitação numa mensagem já publicada: um asterisco depois da palavra corrigida, como "documentação*", só na edição. Pelo conector, um asterisco solto pode abrir negrito, então confira.
- Não use tratamento de gênero marcado nem ele ou ela com quem não declarou pronomes. Cite a pessoa sem pronome e sem adjetivo ou particípio de gênero.
- Com `Artigo antes de nome` em `nunca`, não ponha artigo antes de nome nem de menção ("com Ana", "para Caio"). Desfaça a contração com a preposição e, se a frase ficar estranha, ponha o nome como sujeito. A menção não dispensa a varredura.

**Menção e link**

- Quem é citado vira menção real, como manda `definir-pessoa`.
- O destinatário de uma DM 1:1 não precisa de menção, os terceiros citados nela e todos em canal levam.
- A mesma pessoa citada duas vezes leva a menção real na primeira, e a segunda pode ser só o nome.
- Sem o ID, mantenha o nome em texto e avise.
- Nunca invente.
- Cada link, inclusive o texto do link de um card e o rascunho que falha em canal compartilhado, segue `escrever-link`.
- Com `Linha de link em post novo` preenchida, o post novo termina com essa linha, com linha em branco antes e depois, e o link também continua no identificador do texto. Fora do Slack, nenhum shortcode de emoji aparece certo, então a linha não vai.

**Saudação e resposta**

- Em DM, cumprimente só na primeira mensagem do dia. Leia o histórico desde o início do dia, no fuso da pessoa: se já houve mensagem de qualquer um dos dois, não use saudação. Para retomar o fio com um assunto novo, abra direto ou com a abertura do vocabulário.
- Com `Saudação em resposta de thread` em `menção`, uma resposta numa thread de canal dirigida a uma pessoa abre com a menção dela, sem saudação, mesmo longa. A saudação continua em post novo de canal e na primeira DM do dia.
- Responda na thread em que a pessoa mandou o assunto, com o `thread_ts` da mensagem original. Em DM, com `Transmitir resposta de DM` em `sim`, passe também `reply_broadcast: true`.

**Contexto compartilhado**

- Quando o motivo da mensagem é uma mensagem de outra thread ou canal, além do link, encaminhe a original ao canal. A ferramenta não encaminha: avise a pessoa de que ela faz isso à mão. Se o link é só referência secundária, fica só o link.
- Uma mensagem a alguém nunca cita reunião ou conversa com gente de fora do assunto, nem o tema dela.
- Texto público nunca revela que algo foi alinhado em DM ou em conversa privada. Justifique pelo lado da pessoa. Ao citar um alinhamento, diga quando aconteceu e apresente a regra como recomendação de quem a defende, não como aprovação de terceiro. Se o momento não importa a quem lê, omita.
- Um canal privado nunca é nomeado em texto público: descreva-o ("um canal de Vendas") ou omita. Confira a visibilidade do canal no registro de canais do projeto.
- Em canal de um time, não use a convenção de outro time como contraponto, a menos que a comparação seja o assunto.

### Passo 4

Ajuste o formato do Slack, valendo para qualquer texto:

- Troque o nome de quem é citado pela menção real, com o ID do Passo 2, como em `Menção e link`.
- Todo PR, issue ou recurso citado por número ou chave leva link de verdade em cima do identificador, em markdown padrão. Aplique `Formato de link`.
- Um texto com link nunca segue a sintaxe `<url|rótulo>`: o editor do Slack não a interpreta e mostra tudo cru.
- Emoji padrão do Slack vai no formato `:nome:`, nunca o caractere unicode.
- Identificador técnico, como nome de projeto, de branch ou de label, vai entre crases.
- Resposta a uma mensagem vai na thread dela, como em `Saudação e resposta`.

### Passo 5

Entregue o texto inteiro, com o link direto da thread ou da mensagem onde ele vai, como diz `entregar-rascunho-de-mensagem`.

### Passo 6

Envie só com a autorização explícita da pessoa a esse texto e a esse destino. O sim vale para uma mensagem: outra mensagem pede outro sim. Nunca envie nem agende por conta própria: com agendamento, o sim vale para esse texto e esse horário. Nunca mande fora do horário que a pessoa deu.

Em execução agendada ou automática, não envie: deixe o rascunho e o texto no resumo, com o link da thread. Um texto de resposta a uma pessoa passa antes pela leitura de quem usa a habilidade.

Depois de enviar, leia a mensagem publicada, confira que aparece no destino certo e devolva o link dela.

### Passo 7

Quando a pessoa disser que enviou, ou que mandou do jeito que ela editou, leia a mensagem publicada, pelo link ou pela thread. Compare com o rascunho que você propôs, trecho por trecho. O conector do Slack pode acrescentar um rodapé de ferramenta depois do envio: não conte isso como mudança da pessoa.

Antes de atribuir autoria a qualquer trecho, em nota ou em registro, leia a mensagem publicada e confira, trecho por trecho, o que veio do rascunho e o que a pessoa escreveu. Um trecho que está na mensagem publicada e não está no rascunho é da pessoa: escreva "a pessoa acrescentou X", nunca "o rascunho dizia X". Se não conseguiu ler a mensagem publicada, não atribua: diga que não conferiu.

A mensagem pode ser editada depois do envio: releia a versão atual e a nota de edição antes de registrar. O motivo de uma troca só entra no registro quando a pessoa o deu.

Sem diferença, diga que o rascunho foi aceito como estava e pare. Com diferença, e com `Retroalimentar o vocabulário` em `sim`, passe o que mudou para `definir-vocabulario`, que registra os termos trocados com as tags da pessoa ou do canal, e para `redigir-com-tom-de-voz`, que aprende os padrões de estilo. Diga o que foi registrado.

Conteúdo de DM serve só para derivar um padrão. Não copie um trecho literal dele para outro contexto.

### Passo 8

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Mensagem enviada sem sim

Se você enviar uma mensagem porque a pessoa pediu o texto, ela perde a chance de revisar e de escolher o horário.

1. Mostre o texto e o destino.
2. Espere o sim a essa mensagem.
3. Depois de enviar, devolva o link.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Avise a Ana na thread do pedido que os ajustes saíram

Li a thread inteira e achei a mensagem da Ana. Resolvi a menção dela pelo ID do Slack e escrevi o texto no tom de voz. O rascunho foi entregue e criado na thread, com o endereço da mensagem da Ana. Não enviei: espero o seu sim a esse texto.

### Eu enviei, pode comparar

Li a mensagem publicada na thread e comparei com o rascunho. Você trocou duas expressões e tirou uma frase. Passei as trocas para o vocabulário, com a tag da Ana, e o padrão de frase mais curta para o tom de voz. O rodapé do conector não contou como mudança.

## Casos-limite

- A pessoa pede para agendar o envio: mostre o texto e o horário e, com o sim a esse texto e a esse horário, agende com a ferramenta de agendamento do Slack. Uma mensagem agendada não é resposta numa thread que ainda não existe.
- A pessoa citada não aparece na busca do Slack: pergunte uma vez, ou use `definir-pessoa` se ela é nova no projeto.
- O destino é uma DM: use só as regras de DM, e não o tom ambiente de um canal.

## Pegadinhas

- A busca de pessoa por e-mail completo pode não achar ninguém. Procure pelo nome.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
