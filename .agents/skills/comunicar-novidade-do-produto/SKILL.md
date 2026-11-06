---
name: comunicar-novidade-do-produto
description: Use essa habilidade sempre que um PR for mesclado, alguém perguntar o que há de novo no produto para quem o usa ou for rodar um reparo ou migração de dados que o público usa, mesmo sem dizer novidade, para decidir se há o que contar e escrever o comunicado sem termos técnicos. NÃO use para a descrição do PR, o changelog nem release notes técnicas.
metadata:
  author: jimmyandrade
  version: "0.12.0"
  related:
    - evoluir-habilidade
    - redigir-com-tom-de-voz
---

# Comunicar novidade do produto

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Repositório` vem do remoto `origin` quando as instruções não dizem.
"Repositório": ""
"Branch base": "main"
"Fontes do comunicado":
  - "pull requests mesclados na base"
  - "commits na base fora de pull request"
"Público do comunicado": ""
"Quem publica o comunicado": ""
"Canal do comunicado": ""
"Idioma do comunicado": "português"
# De preferência, `Habilidade de tom de voz` vem preenchida nas instruções do projeto. Vazia, ela só não foi informada: não quer dizer que o projeto não tem uma.
"Habilidade de tom de voz": ""
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Junte o que entrou, um PR mesclado, vários ou um período, de cada uma das `Fontes do comunicado`, na ordem da lista. A base das fontes é a `Branch base`.

De um PR, leia o título, a descrição, os arquivos alterados e as issues ligadas. Um commit está fora de PR quando o GitHub não liga nenhum PR a ele; desse commit, leia a mensagem e o diff.

Uma fonte de outra ferramenta, como páginas do Notion criadas ou editadas pela pessoa, entra filtrada pelo período e pela autoria que ela diz. Quando o pedido cita uma fonte fora da lista, junte essa também.

Procure, nos comentários de cada PR, o registro de comunicado publicado. Com registro, diga que a novidade já foi comunicada, com o canal e a data, e não escreva outro comunicado dela.

### Passo 2

Decida se há novidade para o `Público do comunicado`. Sem público definido, o público é o time.

```mermaid
flowchart LR
  A{A mudança aparece para quem usa?} -->|não| B[Diga que não há novidade e que não precisa comunicar]
  A -->|sim| C[Escreva o comunicado]
```

Sem novidade: dependência, refatoração, CI, teste, documentação interna, reunião. Com novidade: tela, texto, fluxo, comportamento, desempenho que se nota, correção de algo que alguém sentia, dado novo ou que sumiu, e organização dos dados que o público usa, como cadastros consolidados, bancos reorganizados e páginas antigas retiradas.
Uma operação rodada à mão que muda dado que o público usa, como um reparo, uma migração ou uma carga de dados, também é novidade, mesmo quando o PR que a traz não muda nada sozinho.

### Passo 3

Escreva o comunicado no `Idioma do comunicado`, para quem não é técnico: o que muda na prática, onde a pessoa percebe, quem é afetado, se precisa fazer algo e a partir de quando. Nunca cite PR, commit, biblioteca, arquivo nem ferramenta interna.

Uma operação rodada à mão leva dois comunicados.
O primeiro sai antes de ela começar: o que vai mudar, quando começa, quanto tempo leva e como fica o uso enquanto ela roda, como números que mudam aos poucos, uma consulta mais lenta ou um dado que vale esperar para usar.
O segundo sai quando ela termina: que terminou e o que a pessoa já pode conferir.

Conte a correção pelo problema que a pessoa sentia: "corrigimos um problema que fazia a página demorar", não o novo comportamento isolado.

Um período vira um comunicado só, agrupado por área e com o intervalo corrido no título, como "últimos 15 dias", sem uma seção por semana ou sprint.

O rascunho passa obrigatoriamente pela habilidade de tom de voz antes de ir para a pessoa, com o público e o canal do comunicado. Quem fala é `Quem publica o comunicado`. Vazio, pergunte quem publica, uma vez, junto com o canal quando `Canal do comunicado` também estiver vazio.

Ache essa habilidade pela `Habilidade de tom de voz`. Vazia, ou se a habilidade indicada não aparecer, procure nesta ordem:

1. Uma habilidade da sessão chamada `redigir-com-tom-de-voz`.
2. Uma habilidade da sessão cuja descrição fale de tom de voz, copy ou vocabulário da marca.
3. No Notion, a base de habilidades do workspace, buscando por "tom de voz".

Achou: use e sugira preencher `Habilidade de tom de voz`. Não achou: pergunte se a pessoa quer usar uma. Se ela disser que não, escreva com o vocabulário que conseguir consultar e diga isso na entrega.

### Passo 4

Entregue no `Canal do comunicado`, com a formatação dele. Ao perguntar quem publica ou o canal, as opções saem só das instruções do projeto: nunca sugira um canal que elas não citam. A opção de publicar vem primeiro, e a de não comunicar vem por último.

O comunicado vai numa mensagem só, com parágrafos curtos, mesmo no WhatsApp, onde a conversa costuma ir em mensagens quebradas. Só a novidade entra nessa mensagem: um pedido, uma cobrança ou uma lista de pendências é outro assunto e vai numa mensagem à parte, depois do comunicado.

Mostre o rascunho antes de qualquer pergunta: num widget com o texto editável, um botão para copiar e um para aprovar, quando o cliente desenha widget, ou num bloco de código. Uma pergunta que encerra o turno pode esconder o texto escrito antes dela.

Se houver uma ferramenta para esse canal, leia antes as mensagens dele desde o merge e procure um comunicado da mesma novidade, inclusive o de outra pessoa ou outra sessão. Achou: não publique, mostre quando e por quem ele saiu, e pare. Não achou: publique só depois do ok a esse texto.

Sem essa ferramenta, ou com o canal vazio, o rascunho mostrado é o texto pronto para copiar.

### Passo 5

Depois de publicar, comente em cada PR comunicado o registro: o canal, a data e a hora da publicação. Esse comentário é o que a próxima sessão procura no Passo 1.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Jargão no comunicado

Se você escrever "refatoramos o adaptador", quem não é técnico não sabe o que mudou para ele.

1. Troque pelo efeito que a pessoa percebe.
2. Se não houver efeito, não há novidade.

### Comunicado sem novidade

Se você comunicar uma mudança que ninguém percebe, o público passa a ignorar os comunicados.

1. Classifique pelo Passo 2.
2. Sem novidade, diga em uma frase que não precisa comunicar e pare, mesmo que a pessoa tenha pedido o comunicado.

### Publicação sem ok

Se você publicar no canal sem mostrar o texto, ou mostrar o texto só antes de uma pergunta que encerra o turno, a pessoa perde a chance de ler e corrigir.

1. Mostre o rascunho num widget editável, ou num bloco de código sem widget.
2. Publique só depois do ok a esse texto.

### Correção contada pelo resultado

Se você escrever "a página parou de pedir a localização", a pessoa não reconhece o problema que ela sentia.

1. Comece com "corrigimos um problema que".
2. Descreva o incômodo como a pessoa o percebia.

### Pendência dentro do comunicado

Se você colocar no comunicado a lista do que ainda falta fazer, como os registros sem um campo novo, o anúncio vira cobrança e a pessoa perde a novidade no meio.

1. Deixe no comunicado só o que mudou e o que fazer daqui em diante.
2. Mande a lista de pendências numa mensagem à parte, depois do comunicado.

### Canal suposto

Se você oferecer um canal que as instruções do projeto não citam, como o Slack, a pessoa precisa corrigir a opção antes de responder.

1. Leia `Quem publica o comunicado` e `Canal do comunicado`.
2. Vazios, pergunte sem sugerir canal e ofereça o texto pronto para copiar.
3. Deixe a opção de não comunicar por último.

### Comunicado repetido

Se você publicar sem olhar o canal e o PR, outra sessão pode já ter comunicado a mesma novidade, e o público recebe duas vezes.

1. Procure o registro nos comentários do PR antes de escrever.
2. Leia as mensagens do canal desde o merge antes de publicar.
3. Achou: não publique e mostre o comunicado que já saiu.

### Operação sem aviso

Se você rodar um reparo ou uma migração e só comunicar no fim, o time vê os dados mudando no meio e não sabe se pode confiar neles.

1. Antes de começar, avise o que vai mudar, quanto tempo leva e como fica o uso enquanto roda.
2. Comece só depois do aviso publicado, ou do texto pronto entregue para copiar.
3. Quando terminar, avise que terminou e o que já dá para conferir.

### Ação escondida

Se você deixar de dizer que a pessoa precisa fazer algo, a mudança vira problema para ela.

1. Diga o que fazer e até quando.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o que mudou hoje no site?

Três PRs entraram: duas atualizações de dependência e uma correção no formulário de contato. Só a correção aparece para quem usa. O comunicado diz que o campo de WhatsApp voltou a aceitar números com nono dígito e que nada precisa ser feito.

## Casos-limite

- Vários PRs da mesma frente: um comunicado só, agrupado.
- `Quem publica o comunicado` e `Canal do comunicado` estão vazios: pergunte quem publica. Sem canal, o texto vai pronto para copiar.
- O merge não coloca no ar, como um worker, uma release ou um deploy agendado: diga quando a pessoa vai ver a mudança, não quando o PR entrou. Quando o que coloca no ar é uma operação rodada à mão, como um reparo de dados, são os dois comunicados do Passo 3.
- A mudança tira algo que as pessoas usavam: diga o que usar no lugar.

## Pegadinhas

- A habilidade de tom de voz pode existir e não ser carregada sozinha, como no Notion, quando a página não está marcada como habilidade ou a busca automática não a encontra. Procure antes de concluir que ela não existe.
- WhatsApp não é Markdown: o negrito é `*texto*`, com um asterisco, o itálico é `_texto_`, e não há título, separador nem link `[texto](url)`. Entregue o texto num bloco de código, para a formatação não se perder ao copiar.
- A mensagem do commit não diz se ele veio de um PR: um merge escreve `Merge pull request #`, um rebase pode não citar o número e um commit direto pode citar `(#<número>)`. Pergunte ao GitHub quais PRs estão ligados ao commit.
- O tipo no título do PR engana: um `fix` pode mudar o que a pessoa vê, e um `chore` pode mudar um texto da tela. Classifique pelo diff, não pelo tipo.

## Scripts disponíveis

- `gh pr view <número> --repo <Repositório> --json title,body,files,closingIssuesReferences`: o que mudou no Passo 1.
- `gh pr list --repo <Repositório> --base <Branch base> --state merged --search "merged:>=<data>"`: PRs de um período no Passo 1.
- `git fetch origin && git log origin/<Branch base> --since=<data> --first-parent --format=%H`: commits da base no Passo 1.
- `gh api repos/<Repositório>/commits/<sha>/pulls --jq length`: PRs ligados a um commit no Passo 1. Zero quer dizer fora de PR.

1. Junte cada fonte, leia cada item, classifique, escreva e entregue.
