---
name: publicar-revisao-de-codigo
description: Revisa um pull request e publica a revisão numa única review, com os comentários inline, no idioma de quem recebe e no tom do projeto. Usada quando a pessoa pede uma revisão ou outra habilidade precisa publicar uma. Não serve para tratar os comentários que você recebeu no seu PR.
metadata:
  author: jimmyandrade
  version: "0.26.0"
  aliases:
    - post-code-review
  related:
    - enviar-mensagem-no-slack
    - escrever-link
    - escrever-texto-da-revisao
    - evoluir-habilidade
    - levantar-contexto-do-pull-request
    - priorizar-itens
---

# Publicar revisão de código

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra.
```yaml
"Ação com Deve ter": "solicitar mudanças"
"Ação com Deveria ter": "comentar sem aprovar"
"Ação só com Poderia ter": "aprovar com os comentários"
"Ação sem achados": "aprovar"
# `Nível de detalhe` é `enxuta`, só Deve ter e Deveria ter, ou `completa`, com tudo.
"Nível de detalhe": "enxuta"
# `Critério de revisão completa` diz quando a revisão sai completa mesmo com `Nível de detalhe` em `enxuta`, como uma pessoa que pediu assim ou um PR de criticidade alta, e lista o que conta como criticidade alta; na dúvida, fica enxuta.
"Critério de revisão completa": ""
# `Limite de Poderia ter publicado` diz até quantos achados de Poderia ter entram numa revisão enxuta, por exemplo só quando Deve ter mais Deveria ter publicados somam no máximo 2 e o total fica em até 5, e o que passa do limite não é publicado, só contado no resumo.
"Limite de Poderia ter publicado": ""
# `Prioridade por tema` liga um tema do achado a uma categoria, como acessibilidade a Deve ter ou desvio da convenção de testes a Deveria ter.
"Prioridade por tema": "acessibilidade: Deve ter, com sugestão de código"
"Prova visual em PR de interface": "sim"
"Validar rodando o comportamento": "sim"
"Cobertura integrada em comportamento crítico": "não"
"Tamanho de PR que pede divisão": ""
# `Lentes de revisão` lista critérios que você aplica antes de publicar sem citá-los no texto.
"Lentes de revisão": ""
# `Ler o texto antes de publicar`: `sim` mostra a primeira publicação e espera o sim. `não` publica na hora. Feedback que muda texto já publicado atualiza comentários e respostas sem perguntar.
"Ler o texto antes de publicar": "sim"
# `Publicar em execução agendada` é `sim` ou `não` e só vale quando ninguém está na frente: com `não`, a habilidade prepara a revisão e não publica.
"Publicar em execução agendada": "não"
# `Check em andamento` diz o que fazer quando um check ainda roda: `esperar` não revisa e espera terminar, `não esperar` revisa mesmo assim, `passar para o próximo` devolve a quem chamou o aviso de que o PR espera checks. Quem chama, como a fila, repassa o valor dela.
"Check em andamento": "esperar"
# `Pasta das cópias separadas` diz onde criar a cópia de trabalho de cada repositório, e vazio usa a pasta temporária do sistema, com uma subpasta por repositório.
"Pasta das cópias separadas": ""
# `Cópia de trabalho` é `Global`, mas esta skill pode sobrescrevê-lo.
"Cópia de trabalho": "worktree"
"Idade máxima da trava": "2 horas"
# `Comentário de início da revisão` e `Etiqueta de revisão em andamento` avisam quem acompanha o PR de que a revisão começou: vazios, a habilidade não posta nem etiqueta nada.
"Comentário de início da revisão": ""
"Etiqueta de revisão em andamento": ""
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Peça o número ou o link do pull request. Confira o estado dele agora, mesmo que a fila que o trouxe já o tenha conferido. Mesclado ou fechado: diga isso a quem chamou e pare, sem revisar. Um PR com conflito de merge também não se revisa: diga que o conflito precisa ser resolvido e pare. Funciona do mesmo jeito se a pessoa pediu direto ou se outra habilidade chamou.

### Passo 2

Chame `levantar-contexto-do-pull-request` e use a ficha dele: convenções, comentários existentes, card e conversas, propósito e trabalho parecido. Não refaça a leitura. Quando a ficha traz o refinamento técnico, confronte o PR com o que ficou decidido e em aberto: uma decisão que o PR contraria, ou uma dúvida em aberto que ele resolve sem discutir, vira ponto da revisão, em forma de pergunta.

Siga `Check em andamento` com um check pendente: com `esperar`, diga qual e espere terminar; com `passar para o próximo`, diga qual e devolva o PR a quem chamou como esperando checks, sem revisar; com `não esperar`, revise já. Um check que falhou não impede a revisão, mas leia o registro dele antes de perguntar.

### Passo 3

Siga `Cópia de trabalho`. Com `worktree`, o ideal, abra um worktree novo em `Pasta das cópias separadas`, a partir do PR, antes de ler qualquer linha de código, sem o clone da pessoa e sem reutilizar outra tarefa.
O diff e os arquivos lidos pela API do GitHub não substituem a cópia: ela abre em toda revisão, também em execução agendada e em PR pequeno.
Use `workspace`, cópia independente com a raiz nela, só se o `worktree` falhar e o clone não for seguro.
Com valor vazio, a cópia separada continua sendo o caminho, e vale:

1. Procure uma trava do repositório: uma revisão em andamento em outra execução, que é a cópia separada dele em `Pasta das cópias separadas`. Se existir, não comece: diga qual PR e há quanto tempo. Uma trava mais velha que `Idade máxima da trava` não se apaga em silêncio: avise e pergunte.
2. Crie a cópia separada a partir do PR antes de tocar em qualquer arquivo. A cópia é a trava.
3. Trabalhe só nela. Nunca use o clone da pessoa: não troque a branch dele, não guarde as alterações dele e não escreva nada nele.

### Passo 4

Com `Comentário de início da revisão` preenchido, poste esse comentário no PR. Com `Etiqueta de revisão em andamento` preenchida e a etiqueta ainda fora do PR, aplique-a. Guarde o que você fez: no fim, só desfaz o que fez.

### Passo 5

Rode a `code-review` do Claude, com o mesmo alvo e o mesmo nível de esforço recebidos, passando a ficha como contexto: convenções, o propósito, o que já foi comentado. Não reimplemente a análise. A categoria e a confiança que ela devolve são dados de trabalho, nunca texto publicado. Leia também `references/lente-de-revisao.md`.

Ajuste o esforço ao risco do PR: baixo para documentação e renomeação, alto para o que mexe em pagamento, segurança, dados ou integração. A `code-review` nunca é pulada, nem em diff pequeno.

Com a cópia aberta, rode os testes dos projetos que o PR muda e diga no texto o que rodou e o que apareceu.
Um número ou fato que o autor informou, como uma medida, um "testei" ou um tamanho, não é premissa de achado: confirme medindo ou rodando, e o texto diz o que foi medido.

### Passo 6

Chame `priorizar-itens` com os achados e junte o resultado com a ficha:

- Um achado que coincide com um comentário já existente e ainda aberto vira resposta na thread dele, com o complemento ou um reforço curto. Não abre comentário novo, e não descarta o achado em silêncio. Em thread que o autor encerrou, ou já resolvida, não responda.
- Antes de perguntar ao autor, verifique sozinho o que der: o comportamento no ambiente do PR, o que a dependência ou outro serviço devolve, o dado de um monitor. O comentário traz o que foi rodado e o que apareceu, e pergunta só o que está fora do alcance ou é decisão do autor.
- Não escreva que não conseguiu verificar antes de tentar o caminho alternativo. Um timeout no ambiente do PR pede conferir se a VPN está conectada, e a pessoa conecta. O comportamento de um framework se testa dentro dele. O que um serviço repassa se confirma no código dele e na telemetria.
- Um achado fora do escopo do PR, como a versão de uma dependência com aviso de segurança, não vira pedido ao autor: diga à pessoa que ele merece uma tarefa à parte.
- Um achado fraco, sem cenário concreto de falha, vira pergunta que espera resposta, tratada como importante. Nunca como "não bloqueia".
- Aplique as `Lentes de revisão`. Com `Nível de detalhe` em `enxuta`, publique só Deve ter e Deveria ter, mais o Poderia ter que o `Limite de Poderia ter publicado` permitir. Quando o `Critério de revisão completa` se cumpre, publique tudo.
- Aplique a `Prioridade por tema`: o achado de um tema listado ganha a categoria dada. Um achado de acessibilidade, com o valor padrão, é Deve ter e leva sugestão de código.
- Teste novo ou alterado confere a convenção de testes que o repositório define, só nas linhas tocadas.
- Com `Validar rodando o comportamento` em `sim`, num PR que muda fluxo de interface ou comportamento observável, rode o comportamento na cópia ou no ambiente do PR, e não conclua só pela leitura do código.
- Com `Cobertura integrada em comportamento crítico` em `sim`, num PR que muda comportamento crítico, confira se há cobertura integrada ou de ponta a ponta dos cenários afetados e sinalize quando faltar, mesmo com os testes unitários passando.
- Com `Tamanho de PR que pede divisão` preenchido, um PR acima desse tamanho é sinalizado ao autor, com a sugestão de dividir em partes menores quando fizer sentido, antes da revisão ponto a ponto.

### Passo 7

Siga `escrever-texto-da-revisao` para o idioma da pessoa que recebe a revisão.

### Passo 8

Com `Prova visual em PR de interface` em `sim`, um PR que muda tela, componente ou estilo precisa de prova visual: print, vídeo, um exemplo publicado ou o resultado de uma ferramenta de comparação.

Procure a prova em todo lugar antes de pedir: o corpo do PR, os comentários do autor, os checks e o card. Se achar, use e siga. Nunca peça uma prova que já existe. Só se não achar nada, pergunte com gentileza se dá para anexar, sem bloquear.

### Passo 9

Escreva o texto com `escrever-texto-da-revisao`, passando os achados priorizados. Um pedido para aprovar não pula a revisão: rode os critérios atuais e aprove só sem bloqueio.

### Passo 10

Na primeira publicação, com `Ler o texto antes de publicar` em `sim`, mostre o texto e espere o sim. Com `não`, publique na hora e devolva o link. Feedback que muda o texto já publicado atualiza comentários e respostas sem perguntar. Ela lê depois e pede outro ajuste se quiser. Em execução agendada, com `Publicar em execução agendada` em `não`, não publique: deixe o texto e o link do PR no resumo. Com `Publicar em execução agendada` em `sim`, publique do mesmo jeito, sem esperar a leitura, e diga no resumo o que foi publicado.

Publique numa única review, com todos os comentários inline numa chamada só, e as respostas nas threads existentes. A ação final vem dos parâmetros:

- algum Deve ter: `Ação com Deve ter`;
- Deveria ter em aberto: `Ação com Deveria ter`;
- só Poderia ter: `Ação só com Poderia ter`, e o corpo diz que esses pontos são oportunidades, que podem ir para outro PR;
- nenhum achado: `Ação sem achados`, só depois da revisão deste pedido. O corpo segue a aprovação sem achado de `escrever-texto-da-revisao`. Não publique só o resumo do que o PR faz.

Se uma passada anterior aprovou e esta achou um problema real, publique a ação do achado e diga no corpo que a aprovação veio antes e que a nova revisão achou o problema. Não proteja o veredito anterior.

### Passo 11

Limpe sempre, mesmo se algo falhou antes. Apague o comentário de início e retire a etiqueta, se foi você que os pôs. Remova só a cópia desta tarefa. Confira que o clone da pessoa está como estava, na mesma branch e sem alteração nova. Se a limpeza falhar, diga o que ficou.

### Passo 12

Devolva a quem chamou o link da review e de cada comentário publicado, como manda `escrever-link`, e um resumo dos achados por prioridade, sem repetir o inline, com o nível de detalhe usado, quantos Poderia ter ficaram de fora, o que foi rodado, e o idioma escolhido com a base dele. Avisar a pessoa que pediu a revisão é de quem chamou, com `enviar-mensagem-no-slack`.

### Passo 13

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Revisão sobre um PR já mesclado

Se você revisar um PR sem conferir o estado agora, a revisão chega depois do merge e ninguém a lê.

1. Confira o estado no Passo 1, mesmo que a fila já o tenha conferido.
2. Se mesclou ou fechou, pare e diga.
3. Faça o mesmo com um PR com conflito de merge.

### Confirmação pedida de novo

Se você perguntar antes de aplicar um feedback que muda o texto já publicado, a review fica parada.

1. Atualize comentários e respostas na hora.
2. Devolva o link.
3. Não pergunte se pode atualizar.

### Aprovação pedida antes da revisão

Se você aprovar porque pediram para aprovar, sem a revisão com os critérios atuais, um achado crítico passa.

1. Rode a revisão mesmo com o pedido de aprovar.
2. Aprove só sem bloqueio. Com bloqueio, publique a ação do achado.

### Ponto já dito repetido

Se você publicar um achado que um comentário existente já levanta, o autor vê o mesmo ponto duas vezes e acha que ninguém leu o que já foi dito.

1. Use a ficha do contexto.
2. Responda na thread existente, com o complemento ou um reforço.
3. Não responda em thread encerrada.

### Prova visual pedida sem procurar

Se você pedir a prova visual antes de olhar o corpo, os comentários e os checks, pede o que já existe.

1. Procure em todos os lugares do Passo 8.
2. Peça só se não achar nada, e sem bloquear.

### Achado fraco rebaixado

Se você escrever que algo não bloqueia para rebaixar um achado, a pessoa lê o ponto como opcional e ele some. A frase de que a revisão inteira não achou bloqueio só cabe na aprovação sem achado, com as frases do vocabulário.

1. Publique o achado como pergunta que espera resposta.
2. Comente sem aprovar até ela responder.

### Revisão só pelo diff

Se você ler o diff pela API do GitHub e repetir a medida do autor, a revisão não prova nada do que o PR faz.

1. Abra a cópia no Passo 3, também em execução agendada e em PR pequeno.
2. Rode os testes e confirme medindo o que o autor informou.

### Trava deixada para trás

Se você sair sem remover a cópia desta tarefa, com `Cópia de trabalho` vazio a próxima revisão do repositório não começa.

1. Limpe no Passo 11 mesmo quando algo falhou.
2. Diante de uma trava antiga, avise antes de apagar.

### Clone da pessoa alterado

Se você trocar a branch ou guardar as alterações no clone da pessoa, ela perde o que estava fazendo, às vezes sem perceber.

1. Trabalhe só na cópia desta tarefa.
2. Confira no fim que o clone está como estava.

### Comentário de início esquecido

Se você deixar o comentário de início no PR depois de publicar, quem lê acha que a revisão ainda está em andamento.

1. Apague o comentário no Passo 11.
2. Retire a etiqueta só se foi você que a pôs.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Revise o PR da Ana que adiciona a exportação de relatórios

O PR estava aberto. Deve ter na contagem, Deveria ter no teste, Poderia ter nos nomes. Pedi mudanças, em inglês com tradução em português, com inline e resposta na thread já aberta.

### Revise o PR do Caio que só renomeia variáveis

Não achei Deve ter nem Deveria ter. Os dois nomes ficam como oportunidade. Aprovei com os comentários, e o corpo diz que esses pontos podem ir para outro PR.

### Pedido de aprovar o bump do Node

Rodei a revisão e achei bloqueio. Não aprovei. Avisei que ainda não dá para aprovar o PR porque há bloqueio, e publiquei a ação do achado.

## Casos-limite

- O PR está mesclado ou fechado: pare e diga.
- A pessoa já respondeu a um achado: não repita.
- O PR muda interface e já traz o antes e o depois: use e siga.
- Execução agendada: com `Publicar em execução agendada` em `não`, deixe o texto e o link no resumo, sem publicar. Em `sim`, publique e diga no resumo.
- O contexto veio de conversa privada: use só para calibrar o que você pergunta, sem citar.
- Um check está pendente: siga `Check em andamento`. O padrão é não revisar, dizer qual e esperar.
- Existe uma trava antiga do repositório: avise e pergunte antes de apagar.

## Pegadinhas

- A `code-review` devolve categoria e confiança. Ambas são dado de trabalho, nunca texto.
- Um comentário que toca o mesmo trecho mas aponta outro problema não é um achado repetido.
- Feedback que muda o texto já publicado atualiza comentários e respostas sem perguntar, mesmo com `Ler o texto antes de publicar` em `sim`.
- O clone da pessoa pode ter alterações não salvas. Nunca as guarde nem as mova.
- Um check pendente não é um check que falhou.
- O diff lido pelo `gh` e a medida da descrição parecem bastar. Sem a cópia e sem rodar, a revisão só repete o autor.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
