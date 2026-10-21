---
name: preparar-tarefa-do-pull-request
description: Garante que uma demanda tenha uma tarefa no rastreador do projeto antes de virar pull request, ou depois, quando o PR já existe. Procura a tarefa existente, sugere a criação e pede o contexto, monta a tarefa e liga a chave ao PR. Não cria sozinha e não cria tarefa vazia. Não serve para escrever bem uma tarefa nem para abrir o PR.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  notion: "false"
  related:
    - definir-tarefa
    - evoluir-habilidade
    - levantar-contexto-do-pull-request
    - priorizar-itens
    - procurar-tarefa
---

# Preparar tarefa do pull request

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra. Se as instruções do projeto ou de usuário têm uma seção com o nome desta habilidade, leia-a e aplique cada regra no passo que ela cita.

```yaml
"Onde ficam as tarefas": ""
"Projeto da tarefa por repositório": ""
"Tipos de tarefa e regra de escolha": ""
"Projeto de reserva sem permissão": ""
"Chave da tarefa no nome da branch": "recomendada"
"Chave da tarefa no título do PR": "recomendada"
"Formato dos critérios de aceitação": ""
"Critério de validação da mudança": ""
"Mapa de permissões": ""
"Modelos de descrição": ""
"Formato da descrição": ""
"Regras de bloqueio": ""
"Evidência de visibilidade da tarefa de reserva": ""
"Registro dos vínculos": ""
"Lentes de revisão": ""
"Modo de aprendizado": "perguntar"
```

`Onde ficam as tarefas` diz qual rastreador o projeto usa, como o Jira ou o Notion. Vazio, o projeto não usa um e a habilidade não faz nada. `Projeto da tarefa por repositório` liga cada repositório ao projeto ou à lista das tarefas dele. `Tipos de tarefa e regra de escolha` descreve como escolher o tipo. `Chave da tarefa no nome da branch` e `Chave da tarefa no título do PR` são `obrigatória`, `recomendada` ou `proibida`, e a convenção do repositório vale mais que o parâmetro. `Critério de validação da mudança` é o último critério de uma tarefa que muda código de um app com ambiente de teste por PR. `Mapa de permissões` diz onde ler e gravar o que a pessoa pode fazer em cada projeto (criar, editar, comentar, atribuir, transicionar), com `sim`, `não` ou `desconhecido`. `Modelos de descrição` diz onde ficam os modelos por tipo de tarefa e, se houver, os reforços por projeto. `Formato da descrição` diz como o rastreador grava link e caixa de seleção. `Regras de bloqueio` diz como registrar que uma tarefa bloqueia outra. `Evidência de visibilidade da tarefa de reserva` diz o que a tarefa criada no projeto de reserva precisa ter para o time do projeto verdadeiro enxergá-la, como uma mensagem num canal. `Registro dos vínculos` diz onde guardar os endereços do PR, da tarefa e da evidência. `Lentes de revisão` lista critérios que você aplica ao redigir, sem citá-los no texto.

## Instruções

### Passo 1

Veja em qual modo você está. Na criação adiantada, existe só a demanda e ainda não há PR, e este é o fluxo certo: a tarefa nasce antes do PR. Na verificação retroativa, o PR já existe e falta a tarefa, e isso é a exceção. O resto do fluxo é igual nos dois.

Com PR, confira o estado dele agora, antes de redigir qualquer texto sobre ele. O estado pode ter mudado desde que a demanda foi identificada.

### Passo 2

Se `Onde ficam as tarefas` está vazio, diga que o projeto não usa rastreador e pare. Resolva o projeto ou a lista da tarefa pelo repositório, com `Projeto da tarefa por repositório`. Sem mapeamento, pergunte uma vez e grave a resposta.

Antes de propor qualquer escrita na tarefa, em qualquer projeto, leia o `Mapa de permissões`. Uma ação `não` não é proposta nem tentada: diga à pessoa que ela não tem essa permissão lá e ofereça o contorno registrado, como mandar o texto pronto a quem é dono da tarefa. Uma ação `desconhecido` pode ser proposta, com o aviso de que é a primeira tentativa. Sem entrada para o projeto, descubra ao menos a permissão de criar e registre as outras como `desconhecido`. Depois de cada escrita, grave o resultado: `sim` se foi aceita, `não` se foi recusada com mensagem de permissão. Um erro de validação da própria ferramenta não é recusa de permissão e não vira `não`: avise que é problema da ferramenta e sugira tentar numa sessão nova.

Toda demanda tem uma tarefa. Não pule por causa do estado do PR, como rascunho ou em andamento, por ser um ajuste de ferramenta ou de documentação, nem por ainda não haver PR.

### Passo 3

Siga `procurar-tarefa` antes de sugerir qualquer criação, com palavras da demanda e, quando houver PR, o nome da branch. Se achar uma tarefa que plausivelmente cobre a demanda, mostre-a com o nome, o status e o link, e pare. Não sugira uma nova.

### Passo 4

Se não achou nada, sugira a criação e peça o contexto que falta: o resumo real da demanda, o tipo e o projeto, se ficou ambíguo. No chat, se a pessoa está na frente. No resumo da execução, se foi chamada por uma automação. Nunca crie sem a resposta, e nunca crie uma tarefa vazia, genérica ou copiada de um título técnico sem revisão. Sem contexto suficiente, pergunte de novo.

### Passo 5

Escreva o conteúdo a partir da demanda. Com PR, use `levantar-contexto-do-pull-request` e o que o PR e o diff propõem. Nunca monte o objetivo e os critérios em volta de um comentário de revisão: a discussão do código acontece no PR, e a tarefa recebe no máximo um comentário à parte.

Escolha o tipo pelos `Tipos de tarefa e regra de escolha`, percorrendo-a em ordem, sem um tipo padrão fixo. Se nenhuma regra bater, pergunte o tipo e o motivo, e proponha gravar a resposta na regra.

### Passo 6

Monte a tarefa com `definir-tarefa`, que cuida da boa escrita: título, prazo, definição de concluído. Acrescente o que é daqui:

- O objetivo diz o valor para o cliente ou para o negócio e como o resultado será medido. Não invente a métrica: o que a pessoa não disse vira pergunta.
- O escopo é fatiado, e cada parte entrega valor cedo. Separe o obrigatório do que fica de fora agora, com `priorizar-itens`, para cada subtarefa caber num PR.
- Os critérios de aceitação seguem o `Formato dos critérios de aceitação`. Uma tarefa que muda código de um app com ambiente de teste por PR termina com o `Critério de validação da mudança`. O registro diz o que foi procurado e o que foi encontrado, nunca só que não há regressão.
- Os `Modelos de descrição` valem por tipo. Um reforço do projeto soma ao modelo do tipo e nunca o substitui, e não vale numa tarefa criada no projeto de reserva.
- O `Formato da descrição` manda na gravação: link e caixa de seleção no formato próprio do rastreador, conferidos lendo a tarefa de volta.
- Aplique as `Lentes de revisão` ao decidir título, escopo e tipo: cada afirmação se apoia no PR, no diff ou no que a pessoa disse, o que for hipótese vai marcado como hipótese, e a habilidade diz o que não conseguiu confirmar.
- Sem rodapé nem assinatura de ferramenta.

Os textos seguem `redigir-com-tom-de-voz`.

### Passo 7

Mostre a tarefa montada e espere o sim. Só então crie. Sem permissão de criação no projeto, use o `Projeto de reserva sem permissão` e diga que usou. Garanta a `Evidência de visibilidade da tarefa de reserva`: pergunte primeiro se já existe uma, e só sem nenhuma proponha criá-la, sem postar sozinha. Sem reserva, diga que falta permissão e pare.

### Passo 8

Ligue a tarefa ao PR. Entregue a chave nova para o nome da branch e para o título do PR, conforme os parâmetros e a convenção do repositório. Com o PR já aberto, proponha o ajuste do título e do corpo, sem alterar sozinha. Registre o link do PR na tarefa e o da tarefa no PR, e guarde os endereços no `Registro dos vínculos`. Se um endereço obrigatório não puder ser resolvido, pergunte em vez de deixá-lo em branco, e reconheça o vínculo já registrado em vez de sugerir tarefa nova.

Quando a tarefa é bloqueada por outra, registre o bloqueio pelas `Regras de bloqueio`. Ao desbloquear, desfaça o que for marca e mantenha o vínculo como histórico.

Devolva a chave e o endereço da tarefa a quem chamou.

### Passo 9

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Tarefa criada sem a pessoa pedir

Se você criar a tarefa assim que não achar nenhuma, ela nasce com um contexto que você inventou e a pessoa perde a chance de dizer o que falta.

1. Sugira a criação e peça o contexto.
2. Espere a resposta.
3. Mostre a tarefa montada e espere o sim.

### Tarefa montada em volta de um comentário

Se você escrever o objetivo a partir de um comentário de revisão, a tarefa descreve a opinião de uma pessoa e não o que o PR propõe.

1. Leia o que o PR e o diff propõem.
2. Deixe o comentário no PR.
3. Registre na tarefa, no máximo, um comentário à parte.

### Demanda pulada por ser pequena

Se você não propuser tarefa para um PR em rascunho, um ajuste de ferramenta ou uma documentação, a demanda fica sem rastro.

1. Proponha tarefa para toda demanda.
2. Escolha o tipo pela regra do projeto.

### Estado do PR desatualizado

Se você escrever sobre o PR com o estado de uma leitura antiga, o texto diz que está aberto um PR que já foi mesclado.

1. Confira o estado do PR logo antes de redigir.
2. Releia depois de uma pausa.

### Chave na branch contra a convenção

Se você puser a chave da tarefa no nome da branch num repositório que a proíbe, o check da branch falha.

1. Leia a convenção do repositório.
2. Ela vale mais que o parâmetro.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Preciso adicionar a exportação de relatórios

Procurei no rastreador e não achei tarefa para isso. Sugeri criar e perguntei o impacto para quem usa o relatório e se exportar em PDF entra agora. Você respondeu: CSV é obrigatório, PDF fica para depois. Montei a tarefa com `definir-tarefa`, com o escopo em duas partes, cada uma num PR, e mostrei. Depois do seu sim, criei. A chave vai no nome da branch e no título do PR.

### O PR da Ana já está aberto e não tem tarefa

O PR está aberto, em rascunho. Procurei e não achei. Sugeri criar a tarefa a partir do que o PR propõe, sem usar o comentário de revisão do Caio. Depois do sim, criei, liguei o PR à tarefa e propus o ajuste do título do PR.

## Casos-limite

- O projeto não usa rastreador: diga isso e pare.
- Uma tarefa que plausivelmente cobre a demanda já existe: mostre e pare.
- O repositório não está mapeado para um projeto: pergunte uma vez e grave.
- Nenhuma regra de tipo bate: pergunte o tipo e o motivo.
- Falta permissão de criação: use o projeto de reserva, ou diga e pare.
- A pessoa não deu contexto suficiente: pergunte de novo, sem criar.
- O repositório proíbe a chave no nome da branch: a convenção vale, e a chave fica só no corpo do PR.

## Pegadinhas

- A tarefa deve existir antes do PR. Criar depois é a exceção.
- O rastreador pode usar um formato próprio para caixas de seleção, e o texto simples de lista não vira caixa marcável. Confira como o rastreador do projeto grava.
- Uma tarefa de projeto de reserva pode precisar de uma segunda tarefa no projeto certo, depois de uma migração.
- A busca por palavras acha a tarefa de outra pessoa: confira se é a mesma demanda.
- A discussão de código fica no PR, e a tarefa guarda o que o PR propõe.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
