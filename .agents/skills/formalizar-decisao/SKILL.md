---
name: formalizar-decisao
description: Leva uma decisão de comportamento a quem decide, com a dúvida, a hipótese e o que já está definido, e formaliza a resposta na tarefa e no pull request, em qualquer canal e em qualquer momento, do refinamento ao desk check. Usada quando surge uma dúvida ou uma escolha de comportamento que não é sua, mesmo sem dizer decisão. Não serve para dúvida de código, status de entrega nem para escrever o texto da mensagem.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  aliases:
    - abrir-thread-de-decisao
  related:
    - enviar-mensagem-no-slack
    - conversar-no-whatsapp
    - definir-registro-de-reuniao
    - preparar-tarefa-do-pull-request
    - criar-pull-request
---

# Formalizar decisão

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um parâmetro vazio não impõe regra.
```yaml
# `Título da thread própria` descreve o título do post que abre a thread no Slack. Vazio, o título leva a chave da tarefa, a pessoa e o assunto.
"Título da thread própria": ""
```
## Instruções

### Passo 1

Reconheça a decisão: uma dúvida, uma hipótese ou uma escolha entre opções sobre o comportamento, como o visual, um limite, um token ou uma regra de negócio, que não é sua. Diga quem decide. Ela surge em qualquer momento: no refinamento, depois dele, numa demonstração no meio da tarefa ou no desk check. Dúvida de código vai para o pull request. Status de entrega fica fora.

### Passo 2

Monte o pedido: o que já está definido, a dúvida ou a hipótese, as opções e a sua recomendação quando houver, e a evidência de cada caso, como uma imagem ou um número. Faça uma pergunta só, no fim.

### Passo 3

Leve o pedido a quem decide, no canal que o momento pede:

- Reunião ou refinamento: pergunte ao vivo e registre o que foi decidido, como diz `definir-registro-de-reuniao`.
- Depois do refinamento, na demonstração ou no desk check: leve a pergunta quando a dúvida aparece. Não espere o próximo refinamento.
- Slack: abra uma thread nova só dessa decisão, com o título de `Título da thread própria`, e nunca use a thread de status de uma entrega. Responda em mensagens curtas, uma ideia por mensagem, cada caso com a sua imagem, e a pergunta na última. O texto segue `enviar-mensagem-no-slack`.
- Chat sem thread, como WhatsApp ou mensagem direta: uma mensagem curta, com a imagem e a pergunta. O texto segue `conversar-no-whatsapp` quando o canal é esse.

### Passo 4

Diga a quem participa que a conversa serve para decidir e que a decisão será formalizada na tarefa e no pull request.

### Passo 5

Quando a resposta chegar, em qualquer canal, formalize:

1. Atualize os critérios de aceite da tarefa, como manda `preparar-tarefa-do-pull-request`.
2. Escreva a decisão e o porquê na descrição do pull request, como manda `criar-pull-request`.
3. Atualize o teste, a story e a evidência que a decisão muda.
4. Linke a origem, que pode ser a ata, a thread ou a mensagem, na tarefa e no pull request.
5. Diga a quem participou onde a decisão ficou registrada.

A conversa nunca é o registro.

### Passo 6

Sem resposta ainda, marque a decisão como pendente na tarefa e no pull request, com quem decide e o que depende dela.

## Problemas comuns

### Decisão só na conversa

Se você deixar a resposta só na conversa, quem abrir a tarefa ou o pull request depois não encontra a decisão.

1. Atualize os critérios de aceite da tarefa e a descrição do pull request.
2. Linke a origem nos dois.
3. Diga a quem participou onde a decisão ficou.

### Pergunta sem hipótese nem evidência

Se você perguntar "o que acha?" sem dizer o que já está definido e sem mostrar o caso, a pessoa responde de memória ou pede para ver.

1. Diga o que já está definido, a dúvida e as opções.
2. Mostre cada caso com a imagem ou o número.
3. Termine com uma pergunta só.

### Decisão numa thread geral

Se você levar a consulta para a thread de status de uma entrega, a decisão se perde no meio do resto.

1. Abra uma thread nova, com a chave da tarefa, a pessoa e o assunto no título.
2. Faça as perguntas ali.
3. Depois da resposta, formalize na tarefa e no pull request.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o divisor entre a barra de aviso e o cabeçalho some no tema sazonal, pergunte à Ana

Abri uma thread nova no canal, com a chave da tarefa, a pessoa e o assunto no título. Escrevi que a conversa serve para decidir e que o resultado vai para a tarefa e para o pull request. Mostrei o tema padrão, com a linha entre os dois, e o tema sazonal, sem ela, cada um com a sua imagem, e terminei com uma pergunta: segue assim ou entra um divisor? Não usei a thread de status da entrega. Depois da resposta da Ana, atualizo o critério da tarefa e a descrição do pull request e linko a thread.

## Casos-limite

- A decisão sai numa reunião: formalize pela ata e pela tarefa, sem abrir thread.
- O canal não tem thread, como o WhatsApp: uma mensagem curta, com a imagem e a pergunta, e a formalização igual.
- O canal já tem uma thread própria sobre a tarefa e a pessoa: responda nela.
- A decisão aparece perto do fim da tarefa: formalize antes de fechar o pull request, com o critério e a evidência atualizados.
- A tarefa ainda não existe: siga `preparar-tarefa-do-pull-request` antes de formalizar.
- A dúvida é de código: ela vai para o pull request, não para esta habilidade.

## Pegadinhas

- Uma thread geral de status parece o lugar mais rápido para perguntar. A decisão se perde nela.
- A resposta na conversa parece registrar a decisão. O registro é a tarefa e o pull request.
- A decisão tomada no desk check parece pequena demais para formalizar. Ela muda o critério e a evidência do mesmo jeito.
- Um post novo parece barulho no canal. Uma thread por assunto mantém cada decisão achável.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
