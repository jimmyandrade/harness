---
name: acompanhar-fila-de-revisao
description: Roda o ciclo da fila de revisão de pull requests. Confere o horário, cuida primeiro dos seus PRs, acha os pedidos, fecha o laço dos já revisados, escolhe o próximo, revisa um por execução e prepara o aviso a quem pediu. Os avisos ficam só como rascunho, com o link. Não serve para revisar sozinha nem achar pedidos por conta própria.
metadata:
  author: jimmyandrade
  version: "0.6.2"
  related:
    - enviar-mensagem-no-slack
    - evoluir-habilidade
    - procurar-pedido-de-revisao
    - publicar-revisao-de-codigo
    - atender-revisao-de-pull-request
---

# Acompanhar fila de revisão

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra.
```yaml
# `Modo de execução` é `interativo`, numa sessão aberta com a pessoa, ou `agendado`, sem ninguém na frente.
"Modo de execução": "interativo"
# `Horário de funcionamento` traz os dias e as horas em que o ciclo roda.
"Horário de funcionamento": ""
"Fuso horário": ""
"Respeitar a agenda": "não"
# `Ordem da fila` lista os critérios de desempate, do mais forte ao mais fraco.
"Ordem da fila": "laço de revisões, repositório, nível da fonte, saída de andamento, pessoa, chegada"
"Prioridade por repositório": ""
"Prioridade por pessoa": ""
"Teto de nível por pessoa": ""
"Revisões por execução": "1"
# `Checks exigidos` lista os checks que precisam ter terminado antes da revisão, e vazio exige todos.
"Checks exigidos": ""
# `Política de checks` diz, por check, se ele precisa passar, se uma falha é aceita e se a revisão pode seguir com a confirmação da pessoa; um check sem regra segue `Checks exigidos`.
"Política de checks": ""
# `Sinais de status` diz que marca colocar na mensagem do pedido em cada estado: na fila, em revisão, pausado, esperando checks, com resultado, mesclado depois da revisão e mesclado na chegada.
"Sinais de status": ""
"Publicar em execução agendada": "não"
"Avisar quem pediu": "sim"
"Canais sem aviso": ""
# `Regras de aviso a terceiros` é uma lista de regras, cada uma com a condição (autor, repositório, texto do PR ou resultado da revisão) e o texto do aviso.
"Regras de aviso a terceiros": ""
"Prazo para avisar demora": ""
"Onde guardar o estado da fila": ""
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Confira o horário no `Fuso horário`. Fora do `Horário de funcionamento`, encerre sem fazer nada. Só em modo interativo, e só quando a pessoa pedir, pule esta conferência.

Com `Respeitar a agenda` em `sim`, veja se a pessoa está agora em ausência ou em foco. Numa ausência, não varra nada novo e encerre. Se a ausência vai até o fim do dia ou além, proponha, uma única vez, um aviso a quem está esperando revisão. Em foco, o ciclo também pausa.

### Passo 2

Cuide primeiro dos PRs da própria pessoa que precisam de ação, antes de qualquer outro item. Precisam de ação: mudanças pedidas, comentários abertos, check exigido falhando. Só avise, sem agir, o PR aprovado e pronto para mesclar e o PR bloqueado por etiqueta ou por dependência. Avise com o link, no chat ou no resumo, e trate os comentários com `atender-revisao-de-pull-request`. Esses PRs não entram na fila.

### Passo 3

Chame `procurar-pedido-de-revisao` e use a lista dele: os candidatos, o nível de cada um, as novas rodadas, os que esperam confirmação e as perguntas propostas.

### Passo 4

Feche o laço antes de qualquer PR novo. O laço são os PRs abertos de outras pessoas que a pessoa já revisou e não aprovou, lidos só no GitHub:

- Entra todo PR com review dela que não tem aprovação de pé. Uma aprovação descartada devolve o PR ao laço.
- Algo precisa ter mudado depois da última review para ele voltar a ela: um commit que não seja só a atualização da base, uma resposta de pessoa, um novo pedido de revisão ou uma aprovação descartada. Sem mudança, ele só espera.
- A ordem é da review mais antiga para a mais recente. Uma review nova manda o PR para o fim: a fila é cíclica.
- Quem está no laço não entra em nenhuma outra lista.

### Passo 5

Passe para a frente da fila o PR que ainda espera um dos `Checks exigidos` terminar: ele não é revisado agora, fica como esperando checks e o ciclo segue para o próximo. Um check cuja `Política de checks` exige que passe, e que falhou, também trava a revisão: avise a pessoa, no chat ou no resumo, e peça a confirmação de que passou ou de que vale seguir com a falha já conhecida. Guarde a confirmação junto do commit a que ela vale, porque um commit novo pede de novo. Um check que a política deixa falhar não trava nada. Ordene o resto da fila pela `Ordem da fila`, com a `Prioridade por repositório` e a `Prioridade por pessoa`. O `Teto de nível por pessoa` limita o nível da fonte de PRs de certas pessoas. O laço do Passo 4 vem sempre primeiro, e os PRs que saíram de andamento ficam na frente dos outros do mesmo nível.

### Passo 6

Revise o primeiro item da fila, até o número de `Revisões por execução`, chamando `publicar-revisao-de-codigo`. Não revise um PR que a skill de achar pedidos marcou como não pronto. Quem revisa trata do estado do PR, da cópia separada e da limpeza.

Em modo agendado, repasse `Publicar em execução agendada` a `publicar-revisao-de-codigo`: com `não`, a revisão é preparada e o texto e o link do PR vão para o resumo. Com `sim`, ela é publicada, e o resumo diz o que saiu.

### Passo 7

Com `Avisar quem pediu` em `sim`, depois de uma revisão publicada, prepare o aviso de status na mesma thread em que o pedido foi feito, com `enviar-mensagem-no-slack`. Reagir à mensagem não substitui o aviso.

Com `Sinais de status` preenchido, marque a mensagem do pedido com o sinal do estado: ao entrar na fila, ao começar a revisão, ao ficar parado por ausência ou foco, ao ficar esperando checks, ao publicar com o resultado, ao ser mesclado depois da revisão e ao ser achado já mesclado na chegada. Um canal que recusa reação não recebe insistência, e a recusa não vira aviso à pessoa.

- O aviso diz só o status e o link do PR. Nunca discute código e nunca soa como reprovação.
- Pedido que veio por mensagem direta é revisado do mesmo jeito, mas não gera aviso por mensagem direta: diga no resumo que ele veio por lá, com o link, para a pessoa decidir.
- Nos `Canais sem aviso`, o comentário no PR é o único aviso.
- Aplique as `Regras de aviso a terceiros`. Cada regra que bate gera um texto, com o endereço completo do PR e o resultado em uma frase, e nunca com código nem com o que foi combinado em privado. Uma regra não se repete na mesma rodada.
- Com `Prazo para avisar demora`, um pedido direto sem resposta depois do prazo ganha uma proposta de mensagem de demora, com a posição na fila.

Nunca envie, nunca agende e nunca mande em mensagem direta. Entregue o rascunho com o link direto da thread. O limite de rascunhos por canal é o de `enviar-mensagem-no-slack`: no limite, entregue o texto pronto para colar.

### Passo 8

Guarde o estado da fila e as datas das varreduras em `Onde guardar o estado da fila`. Duas execuções não escrevem no estado ao mesmo tempo: use uma trava de arquivo e espere. Uma falha de ferramenta ou de rede não derruba o ciclo: diga qual fonte falhou, siga com as outras e nunca diga que fez o que não fez.

### Passo 9

Termine com um resumo de uma coisa de cada vez: abra só com o item que precisa da decisão da pessoa agora, em até cinco linhas e com uma única pergunta, e ofereça o próximo. O resto (o que foi achado, os pedidos cujo PR já estava mesclado ou fechado, os PRs que esperam checks, os rascunhos com o link da thread de cada um, as falhas e as pendências) fica guardado no estado da fila e só aparece quando a pessoa pedir. Uma fonte que falhou, como a agenda, ganha uma linha no resumo e é tentada de novo na execução seguinte, sem perguntar. Em modo agendado, uma pergunta de calibração, de grupo, de canal ou de login nunca vai por mensagem direta: fica no resumo, uma de cada vez, e se repete a cada execução até a pessoa responder no chat. Em modo interativo, a mesma pergunta é feita no chat.

Todo PR citado leva o endereço lido do campo `url` do próprio PR, nunca montado de cabeça nem com o login da pessoa como dono.

Só conclua quando nenhum subagente estiver em execução.

### Passo 10

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### PR novo antes do laço

Se você revisar um PR novo antes de fechar o laço dos já revisados, os PRs que mais voltam para a pessoa ficam parados.

1. Feche o laço no Passo 4 antes de escolher o primeiro item.
2. Mantenha o laço fora das outras listas.

### Check pendente travando a fila

Se você parar o ciclo porque o primeiro item espera um check, os outros PRs ficam parados por um deles.

1. Marque o PR como esperando checks.
2. Siga para o próximo da fila.

### Aviso por mensagem direta

Se você avisar por mensagem direta que revisou, a pessoa de quem pediu fica sem o canal certo e a conversa se espalha.

1. Revise o pedido normalmente.
2. Diga no resumo que ele veio por mensagem direta, com o link.
3. Não avise por lá.

### Pergunta feita sem ninguém na frente

Se você fizer uma pergunta por mensagem direta numa execução agendada, ela chega a quem não pediu e não tem resposta.

1. Guarde a pergunta no resumo, uma de cada vez.
2. Repita até a pessoa responder no chat.

### Ciclo concluído com subagente rodando

Se você encerrar com um subagente ainda em execução, o resultado dele se perde.

1. Espere os subagentes terminarem.
2. Só então escreva o resumo.

### Envio por conta própria

Se você enviar um aviso porque a regra bateu, a pessoa perde a chance de revisar e de escolher o horário.

1. Prepare o rascunho.
2. Devolva o texto e o link da thread.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Rode a fila agora

Estava dentro do horário e sem ausência. Dois PRs seus tinham comentários abertos, e eu os avisei. Achei cinco pedidos. Fechei o laço: um PR que você já tinha revisado teve um commit novo e foi o primeiro. Revisei esse, e a revisão ficou como rascunho no resumo, porque a execução é agendada. Preparei o aviso para a Ana, na thread do pedido dela, com o link. Um pedido veio por mensagem direta: revisei do mesmo jeito e não avisei por lá, e o link está no resumo.

### Rode a fila fora do horário

Eram dez da noite, fora do horário de funcionamento. Encerrei sem varrer nada.

## Casos-limite

- Fora do horário: encerre sem fazer nada.
- Ausência até o fim do dia: não varra, e proponha uma vez o aviso a quem espera.
- O laço tem PRs: nenhum PR novo é revisado.
- A fila está vazia: diga isso no resumo.
- Uma fonte não abriu: diga qual e siga com as outras.
- Um pedido direto sem resposta depois do prazo: proponha a mensagem de demora, sem enviar.
- Execução agendada: os avisos são sempre só rascunho. A revisão é publicada ou só preparada conforme `Publicar em execução agendada`.

## Pegadinhas

- A fila é cíclica: uma review nova manda o PR para o fim.
- O laço lê só o GitHub. Não depende de pedido na conversa nem de mensagem direta.
- Um canal compartilhado com outra organização pode recusar reação e envio. Não insista nem avise por isso.
- O aviso de status nunca traz o conteúdo dos achados.
- Dois rascunhos no mesmo canal se apagam. Entregue o segundo como texto pronto.
- Dia de ausência inteira pode contar como dia útil nos intervalos de acompanhamento, se as instruções do projeto disserem.
- Todo PR citado vai como link clicável, `[#123](url)`, nunca `#123` solto nem só a URL.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
