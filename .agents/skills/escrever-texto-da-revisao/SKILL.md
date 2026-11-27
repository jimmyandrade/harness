---
name: escrever-texto-da-revisao
description: Escreve o texto de uma revisão de pull request, o corpo e os comentários inline, no idioma da pessoa que recebe, com a postura de pergunta e o `@login` de quem abriu. Usada por quem publica uma revisão. Não serve para achar os problemas, decidir a ação da revisão nem publicar.
metadata:
  author: jimmyandrade
  version: "0.1.2"
  related:
    - definir-idioma-da-conversa
    - evoluir-habilidade
    - publicar-resposta-de-revisao
    - publicar-revisao-de-codigo
    - redigir-com-tom-de-voz
---

# Escrever o texto da revisão

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra.
```yaml
# `Postura dos comentários` é `pergunta` ou `veredito`: com `pergunta`, nenhum achado vira "isto é um erro", e sim o que você viu e uma pergunta.
"Postura dos comentários": "pergunta"
"Revelar que a revisão foi automática": "sim"
"Idioma da revisão sem preferência conhecida": "o idioma do projeto"
"Tradução recolhível": "não"
"Idioma pelo histórico": "o idioma que predomina"
"Gravar o idioma levantado": "não"
"Voz em PR aberto por bot": ""
"Frase sobre o idioma": "sim"
"Rótulo de prioridade no texto": "não"
# `Abertura da revisão`: `versão curta e versão longa` escreve o par com os rótulos do vocabulário. `versão única` ou vazio escreve uma vez, sem rótulos. O vocabulário não cobre essa escolha.
"Abertura da revisão": ""
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Siga `definir-idioma-da-conversa` para a pessoa que recebe a revisão, passando `Idioma da revisão sem preferência conhecida`, `Idioma pelo histórico`, `Gravar o idioma levantado` e `Frase sobre o idioma`, com as revisões que ela publicou como histórico, nos PRs de outras pessoas e nos seus.
O idioma sai desse perfil, com o histórico dos textos dela, e nunca do idioma do corpo do PR.

### Passo 2

Antes de escrever, inclusive no rascunho agendado, consulte o vocabulário com `redigir-com-tom-de-voz`: agradecimento e fecho vêm dele, nunca de memória. Um comentário de achado diz o que você viu, por que importa e o que muda para quem usa ou mantém o código, e termina convidando a pessoa a responder.

Antes de mostrar ou publicar, classifique o corpo, cada comentário e a tradução como `redigir-com-tom-de-voz` manda, e troque o que vier proibido.
Um texto que não passou pela classificação não é mostrado.

Uma aprovação sem achado não é a descrição do PR: abre com o `@login` de quem abriu, agradece a ajuda concreta deste PR, diz que a revisão não achou nada bloqueante e só então lista, em tópicos, o que o PR faz.

O agradecimento é por uma ajuda concreta deste PR, nunca por algo trivial, como avisar na descrição o que qualquer PR já diz. Sem ajuda concreta, agradeça só o PR, com a frase do vocabulário.

Conte os comentários inline publicados, nenhum, um ou mais, e use a frase do vocabulário dessa quantidade. A de idioma fica num PS no fim, com a redação do vocabulário buscada por `lookup_terms`, nunca de memória. Sem frase para essa quantidade, não invente. PR aberto por bot não leva `@`.

- Com `Postura dos comentários` em `pergunta`, não declare erro confirmado e não dê ordem: separe o fato da decisão e termine em pergunta.
- Todo ponto sobre uma linha de código vai inline, ancorado na linha do diff mais próxima. O corpo geral não cita arquivo, função nem chamada. Só fica no corpo o que não é sobre linha.
- Escreva em palavras, não pelo rótulo: com `Rótulo de prioridade no texto` em `não`, o nome da categoria nunca aparece.
- Com `Revelar que a revisão foi automática` em `não`, não mencione automação, ferramenta nem nome de habilidade, e não deixe rodapé de ferramenta.
- Siga `Abertura da revisão`. O par só entra com `versão curta e versão longa`, também na tradução.
- Cada comentário que fala com uma pessoa abre com o `@login` do GitHub dela. Quem mais entra no ponto também leva `@login`. O primeiro nome sozinho não marca a pessoa.
- Com `Voz em PR aberto por bot` em `nós`, num PR aberto por um bot, nunca escreva "você", "seu" nem @menção ao autor: use a primeira pessoa do plural, "nós", como se o ponto fosse para a discussão do time. Vale no corpo, nos comentários, nas respostas em thread e na tradução. Essa voz não leva `@`.
- Seja curto. Não escreva frase que uma pessoa não escreveria.
- Um comentário de revisão é curto e trata do próprio PR. Uma proposta que vai além dele, como mudar o processo ou a integração contínua, ou reunir várias ideias com blocos de código, vira uma proposta escrita à parte, numa issue ou numa página, no formato que o repositório usa, e o comentário só traz o link.

### Passo 3

Devolva a quem chamou o corpo e cada comentário inline, com a linha de cada um, e o idioma escolhido com a base dele.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Aprovação que só descreve o PR

Se você publicar uma aprovação sem achado que não marca quem abriu, não diz que a revisão aprovou e só repete o que o PR faz, a pessoa não é avisada e o texto parece um resumo do diff.

1. Abra com o `@login` do GitHub de quem abriu o PR.
2. Agradeça a ajuda concreta deste PR, diga que a revisão não achou nada bloqueante e só então liste, em tópicos, o que o PR faz. As frases vêm do vocabulário.
3. A frase de idioma fica num PS no fim, com a redação do vocabulário, e segue a quantidade.
4. Corrija o comentário já publicado.
5. PR aberto por bot segue `Voz em PR aberto por bot` e não leva `@`.

### Texto mostrado sem classificação

Se você mostrar o texto da revisão só com as frases do vocabulário e sem classificar, um termo proibido chega ao pedido de ajuste e a pessoa corrige depois.

1. Classifique o corpo, cada comentário e a tradução antes de mostrar.
2. Troque o que vier proibido e classifique de novo.
3. Só então mostre ou publique.

### Código no corpo da review

Se você citar arquivo ou função no corpo geral, o ponto perde a linha onde a pessoa o veria.

1. Ancore cada ponto de código num comentário inline.
2. Se nenhuma linha alterada se relaciona, diga isso numa frase no corpo.

### Idioma tirado do corpo do PR

Se você usar o idioma do corpo do PR sem perfilar a pessoa, a revisão sai no idioma errado.

1. Siga o Passo 1.
2. Diga no resumo o idioma e a base.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Escreva a aprovação do PR da Ana, sem nenhum achado.

O corpo abriu com o `@login` da Ana, agradeceu a ajuda concreta do PR, disse que a revisão não achou nada bloqueante e só então listou, em tópicos, o que o PR faz. As frases vieram do vocabulário, e a de idioma ficou num PS no fim.

### Escreva os comentários do PR aberto pelo bot de dependências.

O texto usou "nós" e nenhuma `@menção`, porque `Voz em PR aberto por bot` estava em `nós`. Cada ponto de código ficou num comentário inline, e o corpo não citou arquivo.

## Casos-limite

- Não achou o registro da pessoa: use o histórico dela, e depois o idioma padrão.
- Sem frase no vocabulário para a quantidade de comentários: não invente a frase.
- PR aberto por bot sem `Voz em PR aberto por bot`: o texto fala com o autor e não leva `@`.

## Pegadinhas

- O primeiro nome parece marcar a pessoa. Só `@` mais o login do GitHub avisa. Um corpo que só descreve o PR não é a aprovação sem achado.
- Uma review sem comentários inline não cobre um ponto de código: ele precisa de uma linha.
- O corpo não repete o inline. A frase segue a quantidade, sem número.
- Aprovação sem texto não conta como o que a pessoa escreveu revisando, ao levantar o idioma.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
