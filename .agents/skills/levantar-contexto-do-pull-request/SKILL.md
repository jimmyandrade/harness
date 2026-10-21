---
name: levantar-contexto-do-pull-request
description: Levanta o contexto de um pull request antes de revisar, responder ou ajustar. Cobre o estado, as convenções do repositório, os comentários já feitos, o card e as conversas ligados, o propósito e o trabalho parecido. Usada em PR de outra pessoa e no seu. Não serve para revisar o diff nem publicar texto.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  notion: "false"
  related:
    - definir-registro-de-reuniao
    - evoluir-habilidade
---

# Levantar contexto do pull request

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Fontes do card": ""
"Fontes de conversa": ""
"Fontes de registro de reunião": ""
"Repositórios vizinhos": ""
"Modo de aprendizado": "perguntar"
```

`Fontes do card` diz onde estão os cards, como o rastreador de tarefas do projeto. `Fontes de conversa` diz onde ler as conversas citadas. `Fontes de registro de reunião` diz onde estão os registros de reunião. `Repositórios vizinhos` lista, separados por vírgula, os repositórios onde procurar trabalho parecido. Um valor vazio usa só o que o PR cita.

## Instruções

### Passo 1

Peça o número ou o link do pull request. Veja o estado dele: aberto, mesclado ou fechado, rascunho ou pronto, autor, etiquetas e checks. Diga o estado logo na primeira linha. Um PR mesclado ou fechado muda o que vale a pena fazer: avise quem chamou antes de seguir.

Liste os checks pelo nome, com o resultado de cada um: passou, falhou ou pendente. Não conclua sobre um check pendente.

### Passo 2

Leia as convenções do repositório do PR:

- as instruções do repositório e as seções que elas citam para PR, branch e revisão;
- as habilidades do próprio repositório, em qualquer pasta de agentes, e o template de PR;
- o arquivo de contexto do projeto para esse repositório, se as instruções do projeto o citarem.

Liste a pasta `.github` antes de concluir que o repositório não tem convenções.

### Passo 3

Leia tudo o que já foi dito no PR, de qualquer pessoa e de qualquer bot, inclusive o seu: as threads de revisão com o estado de cada uma (resolvida, desatualizada), as respostas, o corpo de cada revisão e os comentários gerais. Para cada ponto, diga quem falou por último, se o autor respondeu e se ainda está aberto.

O que já foi dito não se repete. Se alguém levantou o mesmo ponto e ele está aberto, quem chamou responde na thread dele.

### Passo 4

Procure a chave do card no título, no corpo e no nome da branch, e os links de conversa no PR e no card. Leia o card pelas `Fontes do card`: descrição, critérios, cards irmãos e decisões registradas. Leia as conversas citadas pelas `Fontes de conversa`. Procure nos registros de reunião pelo nome do repositório e pelo tema, pelas `Fontes de registro de reunião`, e leia o registro inteiro quando achar.

Marque cada fonte como pública ou privada. Conteúdo de conversa privada, de mensagem direta e de registro de reunião só calibra o que quem chamou pergunta. Nunca vai citado nem parafraseado em texto publicado.

Se uma fonte citada não abrir, diga qual e continue. Não invente o contexto que não achou.

### Passo 5

Escreva, só para quem chamou, uma frase: qual problema este PR resolve e para quem, entre quem usa o produto, o time que consome o código e quem o mantém. Depois confronte o PR com ela, sem olhar linha a linha:

- o PR resolve esse problema?
- existe um caminho mais simples?
- ele promete mais ou menos do que entrega?

Pendências declaradas, decisões abertas com outras equipes e divergências com o combinado entram na ficha. Sem contexto para montar a frase, registre uma pergunta aberta para o autor.

### Passo 6

Procure o que existe além do diff, antes de quem chamou concluir:

- PRs abertos do mesmo autor ou do mesmo tema, e os arquivos que eles têm em comum com este;
- implementações parecidas no repositório, procurando pelo nome do componente ou da função;
- PRs abertos parecidos e trabalho parecido já feito nos `Repositórios vizinhos`.

Cite cada achado pelo endereço do PR ou do arquivo. Quando dois PRs criam o mesmo arquivo, diga isso, porque um deles dará conflito ao entrar.

### Passo 7

Entregue a ficha, com uma seção por passo: estado e checks, convenções, comentários existentes, card e conversas com a visibilidade de cada fonte, a frase de propósito com as três perguntas, e o que existe além do diff. Em cada seção que não achou nada, escreva "Não achei".

Comece pelo que muda o que quem chamou vai fazer. A ficha não opina sobre o diff nem escreve texto para publicar.

### Passo 8

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Convenções que parecem não existir

Se você concluir que o repositório não tem convenções porque não achou um arquivo de instruções, passa uma revisão sem as regras que ele tem em outra pasta.

1. Liste a pasta `.github` e as pastas de habilidades.
2. Leia o template de PR.
3. Só então diga que não achou.

### Só o diff

Se você ler só o diff, perde as pendências, as decisões abertas e o trabalho parecido que estão fora dele.

1. Leia o card e as conversas ligados.
2. Escreva a frase de propósito.
3. Procure PRs parecidos antes de entregar.

### Conteúdo privado na ficha pública

Se você misturar conversa privada com pública sem marcar, quem chama cita o que não podia.

1. Marque a visibilidade de cada fonte.
2. Deixe o conteúdo privado só como calibragem.

### Comentários que ficaram de fora

Se você ler só as threads de revisão, perde o resumo que um bot publica no corpo da revisão e os comentários gerais.

1. Leia as threads, os corpos das revisões e os comentários gerais.
2. Inclua o que você mesmo disse antes.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Levante o contexto do PR da Ana que adiciona a exportação de relatórios

O PR está aberto, pronto para revisão, com um check pendente. Ele cita o card de exportação, que pede manter as colunas atuais. Há uma thread aberta do Caio sobre a mensagem de erro e uma resposta da Ana, que ainda não foi resolvida. O propósito é permitir que quem administra exporte o relatório sem pedir ao time. O PR cobre isso, mas também muda o formato da data, que o card não cita. Outro PR aberto da Ana cria o mesmo arquivo de utilidades.

### Levante o contexto do meu PR antes de eu ajustar

O PR é seu e está aberto. Há quatro comentários: dois de pessoas, um de bot, um geral. Dois estão abertos. O card pede mais um critério que o PR ainda não cumpre. Os checks passaram.

## Casos-limite

- O PR não cita card nem conversa: entregue a ficha com "Não achei" e peça o card, se faltar.
- O PR é seu: o roteiro é o mesmo. Aponte o que está aberto para você tratar.
- O PR é um rascunho: diga isso na primeira linha.
- O repositório está fora dos `Repositórios vizinhos`: procure só no próprio repositório.
- A fonte exige acesso que você não tem: diga qual fonte não abriu e siga.

## Pegadinhas

- A chave do card pode estar só no nome da branch.
- O resumo que um bot publica fica no corpo da revisão, não numa thread.
- Uma thread resolvida pode ter a última fala de quem revisou, sem resposta do autor.
- Um check pendente não é um check que falhou.
- Dois PRs que criam o mesmo arquivo a partir da mesma base conflitam no segundo a entrar.
- O mesmo assunto pode estar numa conversa pública e numa privada. Cite só a pública.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
