---
name: procurar-email
description: Use essa habilidade sempre que for achar um ou mais e-mails sobre um assunto, ou saber o que a mensagem diz, mesmo sem dizer caixa de entrada. NÃO use para responder, encaminhar ou apagar a mensagem, nem para decidir se a inscrição foi confirmada ou se a tarefa existe.
allowed-tools: notion:notion-ai-search
compatibility: Precisa de internet. A busca no e-mail conectado usa notion-ai-search no servidor notion.
metadata:
  author: jimmyandrade
  version: "0.4.0"
  related:
    - procurar-inscricao
---

# Procurar e-mail

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. `Habilidade de grafia` vazia quer dizer que a busca usa o nome como a pessoa escreveu, com e sem acento.

```yaml
"Habilidade de grafia": ""
```

## Instruções

### Passo 1

A pergunta é se chegou mensagem sobre um assunto, ou o que uma ou mais mensagens dizem. A fonte é o e-mail conectado ao workspace. Não existe lista de e-mails. Não busque na lista de inscrições nem na de tarefas. Se o e-mail não estiver nessa conexão, pare. Não use a caixa de outro workspace.

### Passo 2

Antes de buscar um nome, siga a `Habilidade de grafia`, quando as instruções do projeto indicarem uma. A busca conectada não entende o operador from:. Não mande from:. Esse operador devolve páginas que citam o texto e deixa a mensagem dela de fora. Busque, como texto, o primeiro nome que a variação marca como correto, e esse primeiro nome, ponto, e o sobrenome do nome completo. Se o registro diz que Bia é apelido de Beatriz, busque Beatriz e beatriz.lima, não só Bia. Bia Lima e Beatriz Lima são a mesma pessoa. O e-mail vazio no registro não dispensa essas buscas. O primeiro nome também devolve outra pessoa com esse nome. Essa mensagem não é dela. Busque o assunto uma vez no e-mail conectado, sem usar o nome dela como única consulta. Não limite a busca a uma lista do Notion, porque isso deixa a caixa de fora. Não exija o assunto inteiro. Um resultado só conta se o tipo for e-mail.

### Passo 3

Leia cada resultado cujo tipo é e-mail. Uma página do Notion não é a mensagem, mesmo quando ela diz que a pessoa enviou mensagem. Para cada e-mail, diga o assunto, quem enviou, a data e o fato que responde à pergunta. Se houver mais de uma, liste cada uma. Não junte num sim só. Na frase, escreva a forma correta do nome. O primeiro nome correto, quando a variação o marca como o dela, é a mesma pessoa. Não escreva que a busca pelo primeiro nome não achou e-mail do apelido. Uma mensagem é dessa pessoa se o remetente ou o endereço do e-mail casa com o registro dela, mesmo quando o nome exibido é outro. O primeiro nome sozinho não basta quando outro registro tem esse primeiro nome. Se a pessoa entregar um link da caixa de e-mail, ou já tiver dito que o e-mail existe, esse relato é a mensagem. Diga o fato de cada uma e se ela fala do que foi perguntado. Um e-mail sobre o evento que não pede inscrição nem ingresso de novo continua sendo e-mail dela. Não responda que não há e-mail enviado diretamente por ela. Não abra o link como página do Notion.

### Passo 4

Não copie o corpo inteiro, código, número do pedido nem link com token, a menos que a pessoa peça. Não altere a lista de inscrições. Não crie tarefa. Não responda, encaminhe nem apague a mensagem.

### Passo 5

Se a pessoa já disse que o e-mail existe, não diga que a busca não devolveu e-mail dela. Diga o que essa mensagem afirma. Se a busca conectada não devolver o e-mail e a pessoa não tiver falado dele, diga que a busca conectada não devolveu as mensagens. Diga as buscas que rodaram, sem from:. Não diga que ela não enviou nada. Não diga que a caixa está vazia. Liste à parte as mensagens do assunto que não são dela, com assunto, remetente e data. Não peça para a pessoa nomear a habilidade. Não crie tarefa. Não crie inscrição.

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
3. Não crie tarefa nem inscrição.

### Um sim para várias mensagens

Se você responder sim porque uma mensagem existe, as outras sobre o mesmo assunto somem.

1. Liste cada mensagem, com assunto, remetente e data.
2. Diga o fato de cada uma.
3. Não feche com um sim só.

### Ingresso disponível como aprovação

Se você tratar uma mensagem de ingresso disponível como aprovação de outra inscrição, dois fatos viram um.

1. Diga o que o texto afirma.
2. Não aprove outra inscrição por causa dessa mensagem.
3. O status da inscrição fica em `procurar-inscricao`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### chegou e-mail da bilheteria sobre o Rota Sul?

no e-mail conectado, a mensagem sobre ingressos do Festival Rota Sul 2026 veio da bilheteria em 15/09/2026 e diz que os ingressos já estavam disponíveis. Não tratei isso como aprovação de outra inscrição. Não copiei o corpo nem o número do pedido.

### Bia falou alguma coisa no e-mail sobre ter que fazer inscrição de novo?

Bia Lima e Beatriz Lima são a mesma pessoa. Busquei Beatriz e beatriz.lima, como texto, e o assunto. Há e-mail dela sobre o evento. Não diz para fazer inscrição de novo. Não disse que não havia e-mail direto de Bia Lima. Não pedi para nomear a habilidade.

## Casos-limite

- Há mais de uma mensagem: liste cada uma, com assunto, remetente e data.
- O primeiro nome devolve outra pessoa: diga que é outra. Não responda com essa mensagem.
- A busca conectada não devolve e-mail dela e a pessoa não falou dele: diga que a busca não devolveu. Não diga que ela não enviou nada. Não diga que a caixa está vazia.
- A pessoa já disse que o e-mail existe: esse relato é a mensagem. Diga se ele fala do que foi perguntado. Não diga que não há e-mail direto dela.
- A pessoa entregou um link da caixa: esse link é a mensagem. Diga o fato de cada uma.
- A busca devolveu página do Notion: isso não é o e-mail.
- O e-mail não está conectado: pare. Não use outra caixa.
- Sem `Habilidade de grafia` nas instruções do projeto: busque o nome como a pessoa escreveu, com e sem acento, e o primeiro nome, ponto, e o sobrenome.
- Nada com esse pedaço: diga que a busca conectada não devolveu a mensagem. Não crie tarefa nem inscrição.
- A pergunta é se a inscrição foi confirmada: diga o que a mensagem afirma. Não altere a lista de inscrições.

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
