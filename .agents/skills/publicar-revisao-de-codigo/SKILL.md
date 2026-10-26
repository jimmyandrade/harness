---
name: publicar-revisao-de-codigo
description: Revisa um pull request e publica a revisão numa única review, com os comentários inline, no idioma de quem recebe e no tom do projeto. Usada quando a pessoa pede uma revisão ou outra habilidade precisa publicar uma. Não serve para tratar os comentários que você recebeu no seu PR.
metadata:
  author: jimmyandrade
  version: "0.13.0"
  aliases:
    - post-code-review
  related:
    - definir-pessoa
    - enviar-mensagem-no-slack
    - evoluir-habilidade
    - levantar-contexto-do-pull-request
    - priorizar-itens
    - redigir-com-tom-de-voz
---

# Publicar revisão de código

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
"Ação com Deve ter": "solicitar mudanças"
"Ação com Deveria ter": "comentar sem aprovar"
"Ação só com Poderia ter": "aprovar com os comentários"
"Ação sem achados": "aprovar"
# `Nível de detalhe` é `enxuta`, só Deve ter e Deveria ter, ou `completa`, com tudo.
"Nível de detalhe": "enxuta"
# `Critério de revisão completa` diz quando a revisão sai completa mesmo com `Nível de detalhe` em `enxuta`, como uma pessoa que pediu assim ou um PR de criticidade alta, e lista o que conta como criticidade alta; na dúvida, fica enxuta.
"Critério de revisão completa": ""
# `Limite de Poderia ter publicado` diz até quantos achados de Poderia ter entram numa revisão enxuta, por exemplo só quando Deve ter mais Deveria ter publicados somam no máximo 2 e o total fica em até 5, e o que passa do limite vai só para o resumo.
"Limite de Poderia ter publicado": ""
# `Prioridade por tema` liga um tema do achado a uma categoria, como acessibilidade a Deve ter ou desvio da convenção de testes a Deveria ter.
"Prioridade por tema": "acessibilidade: Deve ter, com sugestão de código"
"Prova visual em PR de interface": "sim"
"Validar rodando o comportamento": "não"
"Cobertura integrada em comportamento crítico": "não"
"Tamanho de PR que pede divisão": ""
"Rótulo de prioridade no texto": "não"
# `Abertura da revisão` descreve o que abre cada texto, como um resumo curto.
"Abertura da revisão": ""
# `Lentes de revisão` lista critérios que você aplica antes de publicar sem citá-los no texto.
"Lentes de revisão": ""
# `Ler o texto antes de publicar`: `sim` mostra o texto e espera o sim. `não` publica na hora, inclusive um ajuste pedido depois.
"Ler o texto antes de publicar": "sim"
# `Publicar em execução agendada` é `sim` ou `não` e só vale quando ninguém está na frente: com `não`, a habilidade prepara a revisão e não publica.
"Publicar em execução agendada": "não"
# `Pasta das cópias separadas` diz onde criar a cópia de trabalho de cada repositório, e vazio usa a pasta temporária do sistema, com uma subpasta por repositório.
"Pasta das cópias separadas": ""
"Idade máxima da trava": "2 horas"
# `Comentário de início da revisão` e `Etiqueta de revisão em andamento` avisam quem acompanha o PR de que a revisão começou: vazios, a habilidade não posta nem etiqueta nada.
"Comentário de início da revisão": ""
# `Comentário de início da revisão` e `Etiqueta de revisão em andamento` avisam quem acompanha o PR de que a revisão começou: vazios, a habilidade não posta nem etiqueta nada.
"Etiqueta de revisão em andamento": ""
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Peça o número ou o link do pull request. Confira o estado dele agora, mesmo que a fila que o trouxe já o tenha conferido. Mesclado ou fechado: diga isso a quem chamou e pare, sem revisar. Um PR com conflito de merge também não se revisa: diga que o conflito precisa ser resolvido e pare. Funciona do mesmo jeito se a pessoa pediu direto ou se outra habilidade chamou.

### Passo 2

Chame `levantar-contexto-do-pull-request` e use a ficha dele: convenções, comentários existentes, card e conversas, propósito e trabalho parecido. Não refaça a leitura. Quando a ficha traz o refinamento técnico, confronte o PR com o que ficou decidido e em aberto: uma decisão que o PR contraria, ou uma dúvida em aberto que ele resolve sem discutir, vira ponto da revisão, em forma de pergunta.

Não revise com um check pendente: diga qual e espere terminar. Um check que falhou não impede a revisão, mas leia o registro dele antes de perguntar sobre ele.

### Passo 3

Este passo só depende do repositório e pode virar uma habilidade própria. Pule-o quando a revisão só lê o diff, sem baixar o código. Quando for preciso executar código, como rodar testes ou o lint:

1. Procure uma trava do repositório: uma revisão em andamento em outra execução, que é a cópia separada dele em `Pasta das cópias separadas`. Se existir, não comece: diga qual PR e há quanto tempo. Uma trava mais velha que `Idade máxima da trava` não se apaga em silêncio: avise e pergunte.
2. Crie a cópia separada a partir do PR antes de tocar em qualquer arquivo. A cópia é a trava.
3. Trabalhe só nela. Nunca use o clone da pessoa: não troque a branch dele, não guarde as alterações dele e não escreva nada nele.

### Passo 4

Com `Comentário de início da revisão` preenchido, poste esse comentário no PR. Com `Etiqueta de revisão em andamento` preenchida e a etiqueta ainda fora do PR, aplique-a. Guarde o que você fez: no fim, só desfaz o que fez.

### Passo 5

Rode a `code-review` do Claude, com o mesmo alvo e o mesmo nível de esforço recebidos, passando a ficha como contexto: convenções, o propósito, o que já foi comentado. Não reimplemente a análise. A categoria e a confiança que ela devolve são dados de trabalho, nunca texto publicado.

Ajuste o esforço ao risco do PR: baixo para documentação e renomeação, alto para o que mexe em pagamento, segurança, dados ou integração. A `code-review` nunca é pulada, nem em diff pequeno.

### Passo 6

Chame `priorizar-itens` com os achados e junte o resultado com a ficha:

- Um achado que coincide com um comentário já existente e ainda aberto vira resposta na thread dele, com o complemento ou um reforço curto. Não abre comentário novo, e não descarta o achado em silêncio. Em thread que o autor encerrou, ou já resolvida, não responda.
- Um achado fraco, sem cenário concreto de falha, vira pergunta que espera resposta, tratada como importante. Nunca como "não bloqueia".
- Aplique as `Lentes de revisão`. Com `Nível de detalhe` em `enxuta`, publique só Deve ter e Deveria ter, mais o Poderia ter que o `Limite de Poderia ter publicado` permitir. Quando o `Critério de revisão completa` se cumpre, publique tudo.
- Aplique a `Prioridade por tema`: o achado de um tema listado ganha a categoria dada. Um achado de acessibilidade, com o valor padrão, é Deve ter e leva sugestão de código.
- Teste novo ou alterado confere a convenção de testes que o repositório define, só nas linhas tocadas.
- Com `Validar rodando o comportamento` em `sim`, num PR que muda fluxo de interface ou comportamento observável, indique ou faça o teste local do branch quando for viável, e não conclua só pela leitura do código.
- Com `Cobertura integrada em comportamento crítico` em `sim`, num PR que muda comportamento crítico, confira se há cobertura integrada ou de ponta a ponta dos cenários afetados e sinalize quando faltar, mesmo com os testes unitários passando.
- Com `Tamanho de PR que pede divisão` preenchido, um PR acima desse tamanho é sinalizado ao autor, com a sugestão de dividir em partes menores quando fizer sentido, antes da revisão ponto a ponto.

### Passo 7

Este passo só depende do PR e do registro da pessoa, e pode virar uma habilidade própria. Escolha o idioma de quem recebe a revisão:

1. Leia a preferência dela no registro da pessoa, com `definir-pessoa`: um idioma só, ou um idioma com a tradução recolhível em outro.
2. Sem preferência, levante o que ela escreveu revisando PRs, nos de outras pessoas e nos seus, ignorando código, crases e links. Use o idioma que predomina.
3. Sem histórico, use `Idioma da revisão sem preferência conhecida`.

Com tradução recolhível, o texto principal vem no primeiro idioma e a tradução logo abaixo, dentro de um bloco recolhido, com a mesma voz. Código, nomes de arquivo e identificadores ficam iguais.

`Idioma pelo histórico` diz como decidir pelo que a pessoa já escreveu, e uma regra de limiar, como "se o português é metade ou mais, o idioma é inglês com tradução recolhida em português; abaixo disso, só inglês, de forma provisória até ela se posicionar", vale no lugar do idioma que predomina. O histórico sozinho nunca decide que a revisão sai no idioma da própria pessoa com tradução no outro: isso só vem de uma preferência dita por ela. Nunca sobrescreva uma preferência que a pessoa disse ou que já se estabeleceu. Com `Gravar o idioma levantado` em `sim`, grave no registro da pessoa o idioma, que veio do histórico, a proporção e uma amostra, e nunca diga a proporção em texto publicado.

Com `Frase sobre o idioma` em `sim`, diga numa frase, uma vez por rodada, que você escreveu naquele idioma pensando na pessoa. Nunca diga de onde veio a preferência nem que foi combinada em privado.

### Passo 8

Este passo só depende do PR e pode virar uma habilidade própria. Com `Prova visual em PR de interface` em `sim`, um PR que muda tela, componente ou estilo precisa de prova visual: print, vídeo, um exemplo publicado ou o resultado de uma ferramenta de comparação.

Procure a prova em todo lugar antes de pedir: o corpo do PR, os comentários do autor, os checks e o card. Se achar, use e siga. Nunca peça uma prova que já existe. Só se não achar nada, pergunte com gentileza se dá para anexar, sem bloquear.

### Passo 9

Escreva os textos com `redigir-com-tom-de-voz`, para o tom de quem publica. Um comentário de achado diz o que você viu, por que importa e o que muda para quem usa ou mantém o código, e termina convidando a pessoa a responder. Um pedido para aprovar não pula a revisão: rode os critérios atuais antes e aprove só sem bloqueio. Uma aprovação sem achado não é a descrição do PR: abre com o `@login` de quem abriu, agradece a ajuda concreta deste PR, diz que a revisão não achou nada bloqueante e só então lista, em tópicos, o que o PR faz. As frases vêm do vocabulário. A frase de idioma, quando entra, fica num PS no fim. PR aberto por bot não leva `@`.

- Com `Postura dos comentários` em `pergunta`, não declare erro confirmado e não dê ordem: separe o fato da decisão e termine em pergunta.
- Todo ponto sobre uma linha de código vai inline, ancorado na linha do diff mais próxima. O corpo geral não cita arquivo, função nem chamada. Só fica no corpo o que não é sobre linha.
- Escreva em palavras, não pelo rótulo: com `Rótulo de prioridade no texto` em `não`, o nome da categoria nunca aparece.
- Com `Revelar que a revisão foi automática` em `não`, não mencione automação, ferramenta, nome de habilidade nem quantos comentários há, e não deixe rodapé de ferramenta.
- Aplique `Abertura da revisão`.
- Cada comentário que fala com uma pessoa abre com o `@login` do GitHub dela. Quem mais entra no ponto também leva `@login`. O primeiro nome sozinho não marca a pessoa.
- Com `Voz em PR aberto por bot` em `nós`, num PR aberto por um bot, nunca escreva "você", "seu" nem @menção ao autor: use a primeira pessoa do plural, "nós", como se o ponto fosse para a discussão do time. Vale no corpo, nos comentários, nas respostas em thread e na tradução. Essa voz não leva `@`.
- Seja curto. Não escreva frase que uma pessoa não escreveria.
- Um comentário de revisão é curto e trata do próprio PR. Uma proposta que vai além dele, como mudar o processo ou a integração contínua, ou reunir várias ideias com blocos de código, vira uma proposta escrita à parte, numa issue ou numa página, no formato que o repositório usa, e o comentário só traz o link.

### Passo 10

Antes de publicar, com `Ler o texto antes de publicar` em `sim`, mostre o texto completo e espere o sim da pessoa que chamou. Com `não`, publique na hora, inclusive o ajuste que a pessoa pediu numa review já publicada, e devolva o link. Ela lê depois e pede outro ajuste se quiser. Em execução agendada, com `Publicar em execução agendada` em `não`, não publique: deixe o texto e o link do PR no resumo. Com `Publicar em execução agendada` em `sim`, publique do mesmo jeito, sem esperar a leitura, e diga no resumo o que foi publicado.

Publique numa única review, com todos os comentários inline numa chamada só, e as respostas nas threads existentes. A ação final vem dos parâmetros:

- algum Deve ter: `Ação com Deve ter`;
- Deveria ter em aberto: `Ação com Deveria ter`;
- só Poderia ter: `Ação só com Poderia ter`, e o corpo diz que esses pontos são oportunidades, que podem ir para outro PR;
- nenhum achado: `Ação sem achados`, só depois da revisão deste pedido. O corpo segue a aprovação sem achado do Passo 9. Não publique só o resumo do que o PR faz.

Se uma passada anterior aprovou e esta achou um problema real, publique a correção. Não proteja o veredito anterior.

### Passo 11

Limpe sempre, mesmo se algo falhou antes. Apague o comentário de início e retire a etiqueta, se foi você que os pôs. Remova a cópia separada, o que libera a trava. Confira que o clone da pessoa está como estava, na mesma branch e sem alteração nova. Se a limpeza falhar, diga o que ficou.

### Passo 12

Devolva a quem chamou o endereço direto da review e de cada comentário publicado, e um resumo dos achados por prioridade, com o nível de detalhe usado e quantos Poderia ter ficaram de fora. Avisar a pessoa que pediu a revisão é de quem chamou, com `enviar-mensagem-no-slack`.

### Passo 13

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Revisão sobre um PR já mesclado

Se você revisar um PR sem conferir o estado agora, a revisão chega depois do merge e ninguém a lê.

1. Confira o estado no Passo 1, mesmo que a fila já o tenha conferido.
2. Se mesclou ou fechou, pare e diga.
3. Faça o mesmo com um PR com conflito de merge.

### Confirmação pedida de novo

Se você mostrar o texto e esperar um sim com `Ler o texto antes de publicar` em `não`, ou depois que a pessoa já pediu o ajuste, a review fica parada.

1. Publique na hora.
2. Devolva o link.
3. O próximo ajuste espera ela ler e pedir.

### Aprovação pedida antes da revisão

Se você aprovar porque pediram para aprovar, sem a revisão com os critérios atuais, um achado crítico passa.

1. Rode a revisão mesmo com o pedido de aprovar.
2. Aprove só sem bloqueio. Com bloqueio, publique a ação do achado.

### Aprovação que só descreve o PR

Se você publicar uma aprovação sem achado que não marca quem abriu, não diz que a revisão aprovou e só repete o que o PR faz, a pessoa não é avisada e o texto parece um resumo do diff.

1. Abra com o `@login` do GitHub de quem abriu o PR.
2. Agradeça a ajuda concreta deste PR, diga que a revisão não achou nada bloqueante e só então liste, em tópicos, o que o PR faz. As frases vêm do vocabulário.
3. A frase de idioma, quando entra, fica num PS no fim.
4. Corrija o comentário já publicado.
5. PR aberto por bot segue `Voz em PR aberto por bot` e não leva `@`.

### Ponto já dito repetido

Se você publicar um achado que um comentário existente já levanta, o autor vê o mesmo ponto duas vezes e acha que ninguém leu o que já foi dito.

1. Use a ficha do contexto.
2. Responda na thread existente, com o complemento ou um reforço.
3. Não responda em thread encerrada.

### Código no corpo da review

Se você citar arquivo ou função no corpo geral, o ponto perde a linha onde a pessoa o veria.

1. Ancore cada ponto de código num comentário inline.
2. Se nenhuma linha alterada se relaciona, diga isso numa frase no corpo.

### Prova visual pedida sem procurar

Se você pedir a prova visual antes de olhar o corpo, os comentários e os checks, pede o que já existe.

1. Procure em todos os lugares do Passo 8.
2. Peça só se não achar nada, e sem bloquear.

### Achado fraco rebaixado

Se você escrever que algo não bloqueia para rebaixar um achado, a pessoa lê o ponto como opcional e ele some. A frase de que a revisão inteira não achou bloqueio só cabe na aprovação sem achado, com as frases do vocabulário.

1. Publique o achado como pergunta que espera resposta.
2. Comente sem aprovar até ela responder.

### Trava deixada para trás

Se você sair da revisão sem remover a cópia separada, a próxima revisão do repositório não começa.

1. Limpe no Passo 11 mesmo quando algo falhou.
2. Diante de uma trava antiga, avise antes de apagar.

### Clone da pessoa alterado

Se você trocar a branch ou guardar as alterações no clone da pessoa, ela perde o que estava fazendo, às vezes sem perceber.

1. Trabalhe só na cópia separada.
2. Confira no fim que o clone está como estava.

### Comentário de início esquecido

Se você deixar o comentário de início no PR depois de publicar, quem lê acha que a revisão ainda está em andamento.

1. Apague o comentário no Passo 11.
2. Retire a etiqueta só se foi você que a pôs.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Revise o PR da Ana que adiciona a exportação de relatórios

O PR estava aberto. Usei o contexto: o card pede manter as colunas atuais, e o PR também muda o formato da data. Deve ter: uma contagem que perde a última linha. Deveria ter: um teste da lógica nova. Poderia ter: dois nomes pouco claros. Escrevi em inglês com a tradução recolhida em português, porque a Ana revisa em inglês. Publiquei uma review com três comentários inline e uma resposta na thread do Caio, que já levantava o ponto da data. A ação foi pedir mudanças.

### Revise o PR do Caio que só renomeia variáveis

Não achei Deve ter nem Deveria ter. Os dois nomes ficam como oportunidade. Aprovei com os comentários, e o corpo diz que esses pontos podem ir para outro PR.

### Aprove o PR que só sobe o Node, sem achado

Rodei a revisão antes e não achei bloqueio. O corpo abriu com o login de quem abriu, agradeceu a atualização e listou o que o bump faz. A frase de idioma ficou no PS.

## Casos-limite

- O PR está mesclado ou fechado: pare e diga.
- A pessoa já respondeu a um achado: não repita.
- O PR muda interface e já traz o antes e o depois: use e siga.
- Não achou o registro da pessoa: use o histórico dela, e depois o idioma padrão.
- Execução agendada: com `Publicar em execução agendada` em `não`, deixe o texto e o link no resumo, sem publicar. Em `sim`, publique e diga no resumo.
- O contexto veio de conversa privada: use só para calibrar o que você pergunta, sem citar.
- Um check está pendente: não revise, diga qual e espere.
- A revisão só lê o diff: pule a cópia separada.
- Existe uma trava antiga do repositório: avise e pergunte antes de apagar.

## Pegadinhas

- A `code-review` devolve categoria e confiança. Ambas são dado de trabalho, nunca texto.
- Aprovação sem texto não conta como o que a pessoa escreveu revisando, ao levantar o idioma.
- Um comentário que toca o mesmo trecho mas aponta outro problema não é um achado repetido.
- O primeiro nome parece marcar a pessoa. Só `@` mais o login do GitHub avisa. Um corpo que só descreve o PR não é a aprovação sem achado. PR aberto por bot segue `Voz em PR aberto por bot` e não leva `@`.
- Pedir para aprovar parece dispensar a revisão. Sem a revisão, não há aprovação.
- `Ler o texto antes de publicar` em `não` parece ainda pedir o sim. Publique e devolva o link. Um ajuste pedido depois também sai na hora.
- Uma review sem comentários inline não cobre um ponto de código: ele precisa de uma linha.
- O corpo da review não repete o que está inline: diz só que deixou pontos, sem contar quantos.
- A cópia separada é a trava: removê-la libera o repositório.
- O clone da pessoa pode ter alterações não salvas. Nunca as guarde nem as mova.
- Um check pendente não é um check que falhou.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
