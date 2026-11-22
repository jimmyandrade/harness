---
name: procurar-email
description: Use essa habilidade sempre que for achar um ou mais e-mails sobre um assunto, ou saber o que a mensagem diz, mesmo sem dizer caixa de entrada. NÃO use para responder, encaminhar ou apagar a mensagem, nem para decidir se a tarefa existe. O resultado de seleção que o e-mail traz é gravado por `definir-inscricao`.
allowed-tools: notion:notion-ai-search
compatibility: Precisa de internet. A busca no e-mail conectado usa notion-ai-search no servidor notion.
metadata:
  author: jimmyandrade
  version: "0.9.1"
  related:
    - procurar-inscricao
    - definir-inscricao
    - redigir-com-tom-de-voz
    - definir-grafia
    - analisar-regulamento-da-oportunidade
    - rotular-item
---

# Procurar e-mail

## Parâmetros de configuração

```yaml
{}
```

## Instruções

### Passo 1

A pergunta é se chegou mensagem sobre um assunto, ou o que uma ou mais mensagens dizem. A fonte é o e-mail conectado ao workspace. Não existe lista de e-mails. Não busque na lista de inscrições nem na de tarefas. Se o e-mail não estiver nessa conexão, pare. Não use a caixa de outro workspace.

### Passo 2

Antes de buscar um nome, siga `definir-grafia`. A busca conectada não entende o operador from:. Não mande from:. Esse operador devolve páginas que citam o texto e deixa a mensagem dela de fora. Busque, como texto, o primeiro nome que a variação marca como correto, e esse primeiro nome, ponto, e o sobrenome do nome completo. Se o registro diz que Bia é apelido de Beatriz, busque Beatriz e beatriz.lima, não só Bia. Bia Lima e Beatriz Lima são a mesma pessoa. O e-mail vazio no registro não dispensa essas buscas. O primeiro nome também devolve outra pessoa com esse nome. Essa mensagem não é dela. Busque o assunto uma vez no e-mail conectado, sem usar o nome dela como única consulta. Não limite a busca a uma lista do Notion, porque isso deixa a caixa de fora. Não exija o assunto inteiro. Um resultado só conta se o tipo for e-mail.

### Passo 3

Leia cada resultado cujo tipo é e-mail. Uma página do Notion não é a mensagem, mesmo quando ela diz que a pessoa enviou mensagem. Para cada e-mail, diga o assunto, quem enviou, a data e o fato que responde à pergunta. Se houver mais de uma, liste cada uma. Não junte num sim só. Na frase, escreva a forma correta do nome. O primeiro nome correto, quando a variação o marca como o dela, é a mesma pessoa. Não escreva que a busca pelo primeiro nome não achou e-mail do apelido. Uma mensagem é dessa pessoa se o remetente ou o endereço do e-mail casa com o registro dela, mesmo quando o nome exibido é outro. O primeiro nome sozinho não basta quando outro registro tem esse primeiro nome. Se a pessoa entregar um link da caixa de e-mail, ou já tiver dito que o e-mail existe, esse relato é a mensagem. Diga o fato de cada uma e se ela fala do que foi perguntado. Um e-mail sobre o evento que não pede inscrição nem ingresso de novo continua sendo e-mail dela. Não responda que não há e-mail enviado diretamente por ela. Não abra o link como página do Notion.

Quando o e-mail traz um contrato ou outro documento para assinar ou conferir, a resposta leva o link do e-mail ou do documento, clicável, e a abertura dele segue `analisar-regulamento-da-oportunidade`.

### Passo 4

Não copie o corpo inteiro, código, número do pedido nem link com token, a menos que a pessoa peça. Não crie tarefa. Não responda, encaminhe nem apague a mensagem.

Aplique rótulos sempre usando a habilidade `rotular-item` em cada conversa de e-mail que você leu, com quem age agora e o contexto entre `Etiquetas de contexto`. Sem uma ferramenta que rotule e-mail na sessão, diga quais conversas ficaram sem rótulo.

Quando o e-mail que você leu traz o resultado de uma seleção, como aprovada, não selecionada ou lista de espera, grave o resultado no mesmo turno, seguindo `definir-inscricao`, na inscrição da edição de que o e-mail fala. Não pergunte se a pessoa quer gravar: o e-mail é a prova, e ela já espera a lista atualizada. Se a inscrição não existe na lista, diga isso e não crie uma só por esse e-mail. Se casam várias, nomeie e pergunte, como `definir-inscricao` manda. A resposta diz o que foi gravado, com o link da página.

Quando o resultado é uma recusa ou uma não seleção, trate-o também como uma contestação interna, sem perguntar se a pessoa quer: grave o status de em contestação no lugar de só registrar a recusa, e rascunhe a resposta ao e-mail com `redigir-com-tom-de-voz`, pedindo um parecer técnico sobre o que pesou e um encaixe se alguém desistir. O texto não usa a palavra contestação nem soa como recurso. Ele só sai com o sim da pessoa ao texto e ao destino.

O destino dessa resposta é o endereço de uma pessoa com quem já trocamos mensagem, achado nas conversas enviadas e sem recusa de entrega do servidor. O remetente de um disparo automático, como um subdomínio de envio, não é o destino: confira antes de enviar e diga qual endereço usou e por quê.

Se a lista não tem o status do resultado, como o de não selecionada, grave um comentário datado na inscrição, diga a opção que falta e não adapte outro status.

Rotule antes de relatar o que achou, mesmo quando a pessoa só pediu para conferir o e-mail.
A resposta diz o estado e o contexto de cada conversa, junto do fato dela.

A escolha do estado vem de quem age agora, depois de ler o corpo de cada mensagem, e o como é de `rotular-item`.
No e-mail de um portal ou de um atendimento, o aviso automático que um fato posterior superou e a confirmação que o portal repete são concluídos.
O aviso que pede um passo do negócio, como assinar um contrato ou pagar, é ação pendente.
A conversa em que o negócio respondeu e a outra parte já agiu é respondida, e o estado anterior sai, como a etiqueta de espera.

### Passo 5

Se a pessoa já disse que o e-mail existe, não diga que a busca não devolveu e-mail dela. Diga o que essa mensagem afirma. Se a busca conectada não devolver o e-mail e a pessoa não tiver falado dele, diga que a busca conectada não devolveu as mensagens. Diga as buscas que rodaram, sem from:. Não diga que ela não enviou nada. Não diga que a caixa está vazia. Liste à parte as mensagens do assunto que não são dela, com assunto, remetente e data. Não peça para a pessoa nomear a habilidade. Não crie tarefa.

## Problemas comuns

### Busca só pelo nome do registro

Se você buscar só pelo apelido, ou mandar from:, a mensagem enviada com o primeiro nome some.

1. Busque o primeiro nome marcado como correto, como texto.
2. Busque esse primeiro nome, ponto, e o sobrenome do registro, como texto.
3. Não mande from:. Na frase, use a forma correta.

### Operador from:

Se você mandar from: na busca conectada, o operador não filtra o remetente e a mensagem dela fica de fora.

1. Busque o primeiro nome correto e o primeiro nome com ponto e o sobrenome, como texto.
2. Não mande from:.
3. Um resultado só é e-mail dela se o tipo for e-mail e o remetente for o registro dela.

### Outra pessoa com o primeiro nome

Se você tratar toda mensagem que cita o primeiro nome como dela, a mensagem de outra pessoa com esse nome vira a resposta.

1. Diga que é outra pessoa quando o registro não é o dela.
2. Não use essa mensagem para dizer o que ela falou.
3. A mensagem do assunto fica numa lista à parte.

### Só o remetente

Se você parar no nome e não buscar o assunto, as mensagens do assunto que não são dela somem.

1. Busque o assunto uma vez no e-mail conectado.
2. Liste essas mensagens à parte, com assunto, remetente e data.
3. Não diga que são dela.

### Caixa vazia

Se você disser que não há e-mail dela na caixa porque a busca conectada não devolveu o remetente, a caixa que a pessoa vê some.

1. Diga que a busca conectada não devolveu as mensagens dela.
2. Diga as buscas que rodaram, sem from:.
3. Não diga que a caixa está vazia. Não diga que ela não enviou nada.

### Primeiro nome no lugar de outra pessoa

Se você escrever que a busca pelo primeiro nome não devolveu e-mail do apelido, a mesma pessoa vira duas.

1. O primeiro nome marcado como correto é ela.
2. Na frase, use a forma correta do nome.
3. Não diga que não há e-mail dela porque a busca usou o primeiro nome.

### Relato da pessoa

Se você negar o e-mail depois que a pessoa disse que ele existe, o relato dela some.

1. O que ela já disse sobre a mensagem vale.
2. Diga se essa mensagem fala do que foi perguntado.
3. Um e-mail sobre o evento que não pede inscrição nem ingresso de novo continua sendo e-mail dela.

### E-mail relatado sem rótulo

Se você ler os e-mails de um portal e só contar o que dizem, as conversas ficam sem estado e a pessoa precisa perguntar por que não foram rotuladas.

1. Leia o corpo de cada mensagem e decida quem age agora.
2. Passe cada conversa por `rotular-item` na mesma rodada, com o estado e o contexto.
3. Diga o rótulo de cada conversa junto do fato.

### Pedir o nome da habilidade

Se você pedir para a pessoa nomear a habilidade na próxima consulta, a resposta desvia do e-mail.

1. Responda o que a mensagem diz.
2. Não peça para nomear a habilidade.
3. Não diga que nomear deixa a busca mais precisa.

### Link aberto na caixa

Se você responder que não há e-mail depois que a pessoa abriu a mensagem na caixa, a mensagem que ela achou some.

1. O link que ela entregou é a mensagem.
2. Diga o fato de cada uma.
3. Não diga que não há e-mail dela.

### Página no lugar do e-mail

Se você responder a partir de uma tarefa ou de uma inscrição, a nota vira a mensagem.

1. Leia o e-mail conectado.
2. A página do Notion não é a mensagem.
3. Não crie tarefa. A inscrição só muda pelo resultado que o e-mail afirma, por `definir-inscricao`.

### Resultado lido e não gravado

Se você ler o e-mail do resultado da seleção e só contar o que ele diz, a inscrição fica com o status antigo e a pessoa precisa pedir a atualização.

1. Grave o resultado no mesmo turno, por `definir-inscricao`, sem perguntar.
2. Sem a inscrição na lista, diga isso e não a crie.
3. A resposta diz o status gravado e o link da página.

### Um sim para várias mensagens

Se você responder sim porque uma mensagem existe, as outras sobre o mesmo assunto somem.

1. Liste cada mensagem, com assunto, remetente e data.
2. Diga o fato de cada uma.
3. Não feche com um sim só.

### Ingresso disponível como aprovação

Se você tratar uma mensagem de ingresso disponível como aprovação de outra inscrição, dois fatos viram um.

1. Diga o que o texto afirma.
2. Não aprove outra inscrição por causa dessa mensagem.
3. O status da inscrição fica em `procurar-inscricao`, e o resultado de seleção que o e-mail afirma é gravado por `definir-inscricao`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### chegou e-mail da bilheteria sobre o Rota Sul?

no e-mail conectado, a mensagem sobre ingressos do Festival Rota Sul 2026 veio da bilheteria em 15/09/2026 e diz que os ingressos já estavam disponíveis. Não tratei isso como aprovação de outra inscrição. Não copiei o corpo nem o número do pedido.

### Bia falou alguma coisa no e-mail sobre ter que fazer inscrição de novo?

Bia Lima e Beatriz Lima são a mesma pessoa. Busquei Beatriz e beatriz.lima, como texto, e o assunto. Há e-mail dela sobre o evento. Não diz para fazer inscrição de novo. Não disse que não havia e-mail direto de Bia Lima. Não pedi para nomear a habilidade.

### a organizadora da feira respondeu por e-mail sobre a montagem?

A mensagem da organizadora diz o horário da montagem e não pede resposta. Apliquei, usando a habilidade `rotular-item`, a etiqueta de respondida e a etiqueta de e-mail que a edição da feira registra.

### a CASE respondeu sobre a seleção?

Sim: o e-mail de 22/11/2026 da VeeCee diz que a startup não foi selecionada para as Rodadas de Negócios do CASE 2026. Gravei o status de não selecionada na inscrição dessa edição, por `definir-inscricao`, e deixei o link da página. Não perguntei antes de gravar.

## Casos-limite

- Há mais de uma mensagem: liste cada uma, com assunto, remetente e data.
- O primeiro nome devolve outra pessoa: diga que é outra. Não responda com essa mensagem.
- A busca conectada não devolve e-mail dela e a pessoa não falou dele: diga que a busca não devolveu. Não diga que ela não enviou nada. Não diga que a caixa está vazia.
- A pessoa já disse que o e-mail existe: esse relato é a mensagem. Diga se ele fala do que foi perguntado. Não diga que não há e-mail direto dela.
- A pessoa entregou um link da caixa: esse link é a mensagem. Diga o fato de cada uma.
- A busca devolveu página do Notion: isso não é o e-mail.
- O e-mail não está conectado: pare. Não use outra caixa.
- Nada com esse pedaço: diga que a busca conectada não devolveu a mensagem. Não crie tarefa nem inscrição.
- O e-mail traz o resultado de uma seleção: grave-o na inscrição pelo `definir-inscricao`, sem perguntar. Sem a inscrição na lista, diga isso e não a crie.
- A pergunta é se a inscrição foi confirmada: diga o que a mensagem afirma e, se ela traz o resultado, grave-o pelo `definir-inscricao`.

## Pegadinhas

- Não existe lista de e-mails no Notion. A mensagem está no e-mail conectado. Busca limitada a uma lista deixa a caixa de fora.
- Uma mensagem de ingresso disponível não aprova outra inscrição. Vale o que o texto diz.
- Uma conversa em outro aplicativo não é e-mail. Esta habilidade não lê essa conversa.
- Apelido e primeiro nome correto do mesmo registro são a mesma pessoa. Não escreva que a busca pelo primeiro nome não achou o apelido. Outro registro com o mesmo primeiro nome é outra pessoa.
- O operador from: não filtra o remetente nesta busca. Ele devolve páginas que citam o texto. Busque o primeiro nome e o primeiro nome, ponto, e o sobrenome como texto, mesmo com o e-mail vazio. Não escreva a forma errada do nome.
- A busca conectada pode não devolver a mensagem que a pessoa vê na caixa. O link que ela abriu é a mensagem. Não diga que a caixa está vazia.
- Não peça para a pessoa nomear a habilidade.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
