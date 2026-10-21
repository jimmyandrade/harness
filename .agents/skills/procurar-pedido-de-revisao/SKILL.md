---
name: procurar-pedido-de-revisao
description: Acha os pull requests que alguém pediu para a pessoa revisar, na conversa do time e no GitHub, sem repetir um já visto. Marca os que não estão prontos, abre nova rodada num PR já revisado e propõe a pergunta de acompanhamento de um PR em andamento. Não serve para revisar nem para enviar mensagem.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  notion: "false"
  related:
    - definir-pessoa
    - enviar-mensagem-no-slack
    - evoluir-habilidade
---

# Procurar pedido de revisão

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra.

```yaml
"Organização do GitHub": ""
"Fontes de pedido de revisão": "conversa, pedidos no GitHub"
"Canais lidos direto": ""
"Canais ignorados": ""
"Canais de anúncio de bot": ""
"Autores acompanhados": ""
"Repositórios acompanhados": ""
"Autores ignorados": ""
"Regras de relevância por repositório": ""
"Equipes que valem como a pessoa": ""
"Grupos da pessoa": ""
"Etiqueta de pronto para revisão": ""
"Repositórios que exigem a etiqueta": ""
"Marcadores de trabalho em andamento": "WIP, [WIP], wip, do not merge"
"Etiquetas de não pronto": ""
"Intervalos de pergunta sobre PR em andamento": "1, 1, 2, 3, 5, 8, 13"
"Registro de PRs conhecidos": ""
"Modo de aprendizado": "perguntar"
```

`Fontes de pedido de revisão` lista, em ordem, o que varrer: `conversa`, `pedidos no GitHub`, `autores acompanhados`, `repositórios acompanhados` e `anúncios de bot`. `Intervalos de pergunta sobre PR em andamento` são dias úteis entre as perguntas, e depois do último valor cada intervalo é a soma dos dois anteriores. `Registro de PRs conhecidos` diz onde guardar o que já foi visto, com a data da última varredura de cada fonte. Sem registro, a habilidade só enxerga esta execução e não reconhece um PR já visto. `Grupos da pessoa` lista os grupos de conversa cuja menção vale como menção a ela, por identificador. `Etiquetas de não pronto` lista etiquetas do PR que o marcam como não pronto, além dos marcadores no título. `Regras de relevância por repositório` diz, por repositório ou padrão de nome, se vale revisar: sempre, nunca, ou só com condição (por exemplo, só com pedido na conversa que marque a pessoa ou um dos `Grupos da pessoa`).

## Instruções

### Passo 1

Leia o registro de PRs conhecidos e a data da última varredura de cada fonte. A varredura é incremental: cada fonte lê só o que veio depois da própria data e atualiza essa data no fim. Nunca releia o passado inteiro.

### Passo 2

Varra a conversa, se `conversa` está nas fontes. Procure mensagens com link de PR da `Organização do GitHub`, em mensagem direta, em canal privado e em canal público, e leia direto os `Canais lidos direto`. Pule os `Canais ignorados`. O pedido pode vir sem menção nenhuma: todo PR achado é candidato, e a menção só muda a prioridade.

Dê a cada candidato um nível de fonte, do mais ao menos prioritário:

1. mensagem direta;
2. menção direta à pessoa, em canal privado;
3. menção a um grupo dela, em canal privado;
4. menção direta, em canal público;
5. menção a um grupo dela, em canal público;
6. sem menção, com o canal do time antes de um canal qualquer.

Uma busca ampla por link de PR perde mensagens diretas. Busque-as à parte, e descarte as mensagens da própria pessoa e os links que não são de PR. A menção a um dos `Grupos da pessoa` conta como menção a um grupo dela.

### Passo 3

Varra o GitHub pelas fontes pedidas:

- **Pedidos no GitHub:** os PRs abertos em que a pessoa, ou uma das `Equipes que valem como a pessoa`, foi pedida como revisora. Um pedido individual conta como pedido explícito. Um pedido só de time passa pelo Passo 6, porque costuma ser adicionado sozinho.
- **Autores acompanhados:** os PRs abertos de cada autor, com o login no registro da pessoa, via `definir-pessoa`. Se o login não estiver registrado, não adivinhe: pergunte uma vez.
- **Repositórios acompanhados:** todo PR aberto do repositório, de qualquer autor e de qualquer data. Repositório arquivado nunca entra.

Ignore os PRs dos `Autores ignorados`, em qualquer fonte, e não diga o motivo em lugar nenhum.

Aplique as `Regras de relevância por repositório` a todo candidato, de qualquer fonte. Um PR de repositório que a regra manda ignorar sai da lista. Uma regra condicional, como "só com pedido que marque a pessoa", só deixa passar o PR cujo pedido cumpre a condição: um PR achado só no GitHub, ou pedido sem a marcação, sai. Diga na lista quantos PRs saíram e por qual regra, sem citar o motivo de uma regra pessoal.

### Passo 4

Leia os `Canais de anúncio de bot`, se `anúncios de bot` está nas fontes. O anúncio de um bot não é um pedido: não coloca o PR na fila nem gera resposta. Leia o canal no formato detalhado: o texto do anúncio vem em anexo, e a leitura resumida devolve a mensagem vazia. A data do anúncio não é a do PR. Guarde o endereço da mensagem e o estado do PR, reconfira o estado a cada execução e use a conversa do anúncio como lugar para falar do PR quando precisar.

### Passo 5

Junte as fontes. O mesmo PR vindo de duas fontes é um só, identificado pelo endereço, e fica com o nível mais prioritário.

Um PR já revisado e ainda aberto, com um pedido novo depois da última revisão, volta como nova rodada. O pedido novo pode ser uma mensagem mais recente ou um pedido individual de revisão no GitHub feito depois da última review. A nova rodada recalcula o nível pelo pedido novo, não pelo original.

Confira o estado de cada candidato agora. Um PR já mesclado ou fechado não entra na lista de candidatos: devolva-o à parte, como mesclado ou fechado na chegada, com o endereço da mensagem do pedido, para quem chamou sinalizar e avisar se quiser.

### Passo 6

Aplique o gate de pronto para revisão. Um PR não está pronto quando é rascunho, tem um dos `Marcadores de trabalho em andamento`, tem uma das `Etiquetas de não pronto`, ou está sem a `Etiqueta de pronto para revisão` num dos `Repositórios que exigem a etiqueta`.

- Um PR que não está pronto não é revisado nem enfileirado como pronto. Se veio só do GitHub, fica em acompanhamento e entra quando a condição deixar de valer.
- Se veio com um pedido explícito na conversa, marque-o como esperando confirmação e proponha uma pergunta única na thread do pedido, marcando quem abriu: o PR está pronto para revisão? Não discuta código.
- Um PR que sai de trabalho em andamento sobe para o nível dos pedidos do GitHub, na frente dos outros desse nível, mas atrás de um pedido explícito na conversa.

### Passo 7

Para cada PR de outra pessoa em andamento, calcule quando perguntar. A primeira pergunta conta a partir de quando ele entrou em andamento, e as seguintes a partir da pergunta anterior, em dias úteis, pelos `Intervalos de pergunta sobre PR em andamento`. No máximo uma pergunta por PR por execução. Um PR em andamento só entra na fila se houver um pedido individual no GitHub ou um pedido explícito na conversa.

Proponha a pergunta com `enviar-mensagem-no-slack`, e não a envie. Ela é curta e marca quem abriu o PR: pretendemos seguir com ele e há algum apoio de que a pessoa precise? Escolha o lugar onde a pessoa já falou do PR: a resposta à mensagem dela, senão a conversa do anúncio do bot, senão um comentário no PR. Não soa como cobrança, não discute código e não revela que é uma sequência de lembretes. Um PR com acompanhamento suprimido, por algo já combinado diretamente, não recebe pergunta.

### Passo 8

Atualize o registro e entregue a lista: cada candidato com o endereço, o autor, a fonte, o nível, se é nova rodada, se está pronto, e as perguntas propostas. Quem chamou decide a ordem da fila, o que revisar e o que enviar. Diga quais fontes não abriram e o que não foi lido.

### Passo 9

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Mensagem direta que não apareceu

Se você varrer só com uma busca ampla por link de PR, as mensagens diretas ficam de fora e o pedido some.

1. Busque as mensagens diretas e os grupos de mensagem direta à parte.
2. Junte o resultado antes do Passo 5.

### Anúncio de bot tratado como pedido

Se você enfileirar um PR só porque um bot o anunciou, a pessoa recebe uma revisão que ninguém pediu.

1. Guarde o anúncio como mapa do PR.
2. Enfileire só com um pedido de verdade.

### PR em andamento revisado

Se você revisar um PR em rascunho ou com marcador de andamento, a revisão chega antes da hora e atrapalha quem ainda trabalha nele.

1. Aplique o gate do Passo 6.
2. Acompanhe o PR e pergunte nos intervalos.

### Mesmo PR em duas fontes

Se você tratar o pedido da conversa e o do GitHub como dois, o PR é revisado duas vezes.

1. Identifique o PR pelo endereço.
2. Fique com o nível mais prioritário.

### Login adivinhado

Se você deduzir o login de um autor pelo nome, acompanha a pessoa errada.

1. Leia o login no registro da pessoa.
2. Sem login registrado, pergunte uma vez.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Ache os pedidos de revisão desde ontem

Achei quatro PRs. Dois vieram por mensagem direta, nível 1. Um veio por menção num canal público, nível 4, e o mesmo PR também foi pedido no GitHub, então é um só. O quarto é um rascunho da Ana com um pedido explícito na conversa: ficou esperando confirmação, com uma pergunta proposta na thread dele. Nenhuma fonte deixou de abrir.

### O Caio pediu de novo a revisão de um PR que você já revisou

O PR do Caio está aberto e foi revisado na semana passada. Ele pediu uma nova revisão hoje por mensagem. Voltou como nova rodada, com o nível do pedido novo, que é mensagem direta.

## Casos-limite

- Nenhum registro de PRs conhecidos: leia só esta execução e diga que não reconhece o que já viu.
- Uma fonte exige acesso que você não tem: diga qual e siga com as outras.
- O pedido individual no GitHub é mais recente que a última review: nova rodada.
- Um PR sem pedido num repositório acompanhado, e sem a etiqueta onde ela é exigida: acompanhe e proponha uma pergunta única na conversa do anúncio, se houver.
- O PR é do próprio usuário: não entra aqui. É assunto de quem atende a revisão recebida.
- Um PR em andamento tem um pedido individual no GitHub: o pedido vale mais que o marcador, e ele entra na fila.

## Pegadinhas

- O pedido a um time pode ser adicionado sozinho, sem a pessoa estar pronta. Passa pelo gate, e o individual não.
- A busca por link de PR não traz mensagem de bot, e por isso os canais de anúncio são lidos à parte.
- Dia de ausência inteira da pessoa pode contar como dia útil nos intervalos, se as instruções do projeto disserem.
- Um PR aberto antes da regra de acompanhamento existir também é candidato.
- O anúncio de um bot guarda a conversa do PR, mas não é prova de que alguém pediu revisão.
- Uma mensagem sem menção, num canal do time, tem nível 6, mas continua sendo candidata.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
