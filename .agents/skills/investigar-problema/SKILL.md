---
name: investigar-problema
description: Conduz a investigação de um problema relatado, como um acesso bloqueado, um erro ou um dado errado, com tarefa, fatos, hipóteses e retorno a quem relatou, e oferece artigo e post-mortem. Use essa habilidade sempre que alguém relatar um problema, como um preço errado, antes de oferecer ou começar a investigar, mesmo sem dizer investigar. NÃO use para escrever o artigo, o post-mortem nem corrigir código.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  related:
    - procurar-tarefa
    - definir-tarefa
    - definir-artigo-da-base-de-conhecimento
    - definir-post-mortem
    - evoluir-habilidade
---

# Investigar problema

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
# `Registros ao fim da investigação` lista o que a habilidade oferece ao terminar. Cada item é feito só com o sim da pessoa.
"Registros ao fim da investigação":
  - "artigo da base de conhecimento"
  - "post-mortem"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Receba o problema: o que acontece, quem relatou, quando e onde.
Carregue esta habilidade antes de ler código ou de perguntar se a pessoa quer que você investigue: a pergunta já é o começo da investigação.
Quando o relato é uma mensagem ou thread do Slack, reaja a ela com o emoji de olhos (`eyes`) antes de ler os detalhes, para quem acompanha ver que alguém assumiu. Se a reação já estiver lá, não repita.
Siga `procurar-tarefa` com esse assunto. Sem tarefa, crie uma com `definir-tarefa`, com quem relatou e a data do relato.
Todo aviso de andamento a quem relatou leva o link da tarefa.

### Passo 2

Reúna os fatos antes de supor: a mensagem e os prints de quem relatou, o que a ferramenta mostra, os avisos recebidos e o que mudou antes do problema.
Leia a imagem que a pessoa mandou. Ela costuma trazer o aviso exato.
Corte os dados por página, origem de tráfego, dispositivo e versão antes de dizer que o volume é estável: a média do site inteiro esconde um aumento numa página só.
Separe o que foi visto do que se supõe.
Procure uma investigação que outro agente ou ferramenta já fez sobre o mesmo problema, como a de um agente do sistema de monitoramento na thread do alerta ou numa mensagem logo abaixo, e leia a causa, as evidências e os próximos passos dela.
A investigação paralela pode ainda estar rodando ou ter acabado depois do seu primeiro retorno. Releia a thread e o canal antes de encerrar.

### Passo 3

Liste as hipóteses, da que a evidência mais apoia para a que menos apoia.
Confira cada uma na fonte: a tela da ferramenta, o registro, a configuração ou quem administra.
Só leia nesse passo. Uma correção que muda algo, como uma permissão, um pagamento ou uma configuração, espera o sim da pessoa, com o que muda e o risco.
Sem acesso a uma fonte, diga qual falta e quem tem.
Cruze a sua conclusão com a da investigação paralela: diga onde concordam, onde divergem e o que cada uma viu que a outra não viu.
Quando a outra achou algo que você perdeu, corrija a sua conclusão e diga que mudou. Não proteja a primeira resposta.
Confira na fonte o que só a outra afirma antes de repetir como fato.

### Passo 4

Grave na tarefa o que achou: a causa, a evidência de cada conclusão, o que foi feito e o próximo passo com quem o faz.
Dê o retorno a quem relatou, com a causa em palavras simples, o que muda para ela e o link da tarefa.

### Passo 5

Ao terminar, pergunte se a pessoa quer cada item de `Registros ao fim da investigação`.
O artigo segue `definir-artigo-da-base-de-conhecimento` e o post-mortem segue `definir-post-mortem`.
Escreva só o que a pessoa escolher. Investigação sem causa achada também pergunta: o post-mortem registra o que se sabe.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Investigação sem registro

Se você investigar sem tarefa, o andamento fica na conversa e quem relatou não tem onde acompanhar.

1. Crie a tarefa antes de começar.
2. Ponha o link em todo aviso.

### Hipótese tratada como fato

Se você responder com a primeira hipótese sem conferir, a causa errada vira o registro.

1. Confira cada hipótese na fonte.
2. Diga o que foi visto e o que ainda é suposição.

### Investigação sem a habilidade

Se você oferecer investigar, ou começar a ler código, sem carregar esta habilidade, o roteiro de tarefa, fatos e retorno não acontece.

1. Carregue a habilidade assim que alguém relatar um problema, mesmo sem a palavra investigar.
2. Só depois pergunte se a pessoa quer que você investigue.

### Investigação paralela ignorada

Se você concluir sem ler o que outro agente ou ferramenta já investigou, a resposta pode contradizer a dele sem ninguém perceber.

1. Procure na thread e no canal a investigação paralela.
2. Cruze as conclusões e corrija a sua quando a outra viu algo que você perdeu.

### Aprendizado perdido

Se você encerrar sem perguntar pelos registros, a próxima pessoa com o mesmo problema começa do zero.

1. Pergunte pelos itens de `Registros ao fim da investigação`.
2. Escreva só o que a pessoa escolher.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o gestor disse que os anúncios foram bloqueados, investiga?

Não havia tarefa: criei e respondi a quem relatou com o link. O print mostrava que um administrador precisava aprovar o anúncio. Conferi na tela de pessoas da conta quem administra e gravei a causa na tarefa. Perguntei se a pessoa queria um artigo, um post-mortem ou os dois.

## Casos-limite

- A causa não aparece: grave o que foi descartado e o próximo passo, e pergunte pelos registros do mesmo jeito.
- A correção depende de outra pessoa, como quem administra a conta: diga quem e o que pedir.
- Já existe artigo sobre o problema: proponha atualizá-lo em vez de criar outro.

## Pegadinhas

- O print parece só ilustrar o relato. Ele costuma trazer o aviso exato da ferramenta.
- Ler uma tela parece seguro em qualquer ferramenta. Uma tela de configuração pode salvar ao fechar: abra, leia e cancele.
- A thread lida no começo parece completa. Uma investigação paralela pode postar a conclusão minutos depois: releia antes de encerrar.
- Uma investigação curta parece não pedir registro. A pergunta pelos registros vale para toda investigação.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
