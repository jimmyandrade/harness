---
name: perfilar-tom-de-voz
description: Perfila o tom de voz de uma pessoa ou de um canal a partir de uma amostra real de mensagens e registra os padrões no vocabulário, com a etiqueta da pessoa ou do canal. Usada quando a pessoa pede para perfilar como alguém conversa ou o tom de um canal, e sempre que entrega o histórico de uma conversa. Não serve para escrever texto, cadastrar um termo solto nem perfilar sem pedido nem entrega de histórico.
metadata:
  author: jimmyandrade
  version: "0.5.0"
  related:
    - definir-negociacao
    - definir-vocabulario
    - evoluir-habilidade
    - redigir-com-tom-de-voz
    - rotular-item
---

# Perfilar tom de voz

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra.
```yaml
# `Fonte da amostra` diz onde ler as mensagens, como o histórico da conversa privada ou o de um canal.
"Fonte da amostra": ""
"Mensagens excluídas": "as de quem pede o perfil e as de bot"
# `Tamanho da amostra` diz quantas mensagens ou que período ler.
"Tamanho da amostra": ""
# `Onde guardar o resumo do tom` diz onde fica o resumo curto de cada pessoa ou canal.
"Onde guardar o resumo do tom": ""
# `Rótulo de perfilamento em andamento` marca a conversa enquanto o perfil ainda aprende com cada mensagem nova. Liga ao começar e desliga ao finalizar. Vazio, não rotula.
"Rótulo de perfilamento em andamento": ""
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Perfile a pedido explícito da pessoa, para uma pessoa ou um canal que ela nomear, ou quando ela entrega o histórico de uma conversa, como uma exportação, um zip, um print ou um texto colado. A entrega é um pedido implícito de duas coisas na mesma rodada, sem perguntar: o perfil do tom de quem fala com a pessoa e o registro do histórico, que segue `definir-negociacao`. Entregar só para ajustar um rascunho não tira nenhuma das duas. Nunca perfile por conta própria sem pedido nem entrega. Se a pessoa pediu o perfil de si mesma, trate como cadastro de termo com `definir-vocabulario`.

Rascunhar uma mensagem para quem já escreveu na conversa não é perfilar, tenha ela perfil ou não. Leia as últimas mensagens dela e acompanhe a saudação, o calor e o emoji, devolvendo o mesmo tratamento carinhoso que ela usa conosco, como "queridos" ou um apelido afetuoso, sem perguntar à pessoa se pode. Um texto seco para quem escreve com carinho soa distante. O fim também acompanha o calor: com quem acolheu a marca, feche com um agradecimento carinhoso, e não com o próximo passo ou a disponibilidade.

Quando ela já tem perfil, usar o perfil dela é aplicar os termos que ele registra, como "te", e também o calor das últimas mensagens da conversa de agora, que o perfil não guarda. Os termos do perfil sozinhos não bastam, e citar o perfil no pedido não é chamar a pessoa pelo nome. Sem perfil e sem histórico entregue, diga que ele falta e proponha perfilar. O registro nasce a pedido ou com a entrega do histórico.

Quando a pessoa pede para ir aprendendo com cada mensagem da conversa, o perfil fica em andamento. Com `Rótulo de perfilamento em andamento` preenchido, aplique-o à conversa por `rotular-item` ao começar.

### Passo 2

Leia a amostra na `Fonte da amostra`, no `Tamanho da amostra`. Com histórico entregue, a amostra é todo o histórico. Exclua as `Mensagens excluídas`, que num histórico entregue incluem as mensagens nossas. Num canal, as mensagens de quem pede enviesam a leitura, porque o que se quer é o tom dos outros. As de bot não representam o tom humano do canal. Numa conversa privada entre as duas pessoas, a amostra é essa conversa.

### Passo 3

Extraia os padrões observáveis, só os que se repetem. De uma pessoa: saudações, abreviações, uso de risada e de emoji, alongamento de vogais, formalidade e o jeito de pedir as coisas. De um canal, o tom ambiente: formalidade, se as pessoas contextualizam antes do pedido ou vão direto ao ponto, saudação e despedida, densidade de emoji e extensão média das mensagens.

### Passo 4

Escreva um resumo curto do tom em `Onde guardar o resumo do tom`. Registre com `definir-vocabulario` só os padrões concretos e recorrentes, com a etiqueta da pessoa ou do canal, e prefira termos pequenos e reutilizáveis a frases inteiras: se uma frase decompõe em fragmentos, cada fragmento vira o próprio termo. Mantenha a frase inteira só quando ela é uma expressão fixa que perde o sentido se partida.

O resumo fica onde `Onde guardar o resumo do tom` manda, como as notas do contato no WhatsApp e o cadastro da pessoa. Com histórico entregue, grave o resumo nas notas do contato e na página da pessoa, e use-o nos próximos rascunhos. Quem for escrever para ela consulta esse resumo, por `redigir-com-tom-de-voz`.

### Passo 5

Perfil em andamento: leia cada mensagem nova da pessoa na conversa e acrescente só o padrão novo e recorrente ao termo e ao resumo. O perfil só é final quando a pessoa disser que finalizou: nesse momento, tire o rótulo por `rotular-item` e diga que o resumo é o definitivo.

Anote a origem do perfil: quantas mensagens, de que período, que as de quem pediu foram excluídas e o que ficou de fora, como um áudio não transcrito. Mostre à pessoa o que foi derivado, para ela corrigir se não bateu.

### Passo 6

Conteúdo de conversa privada só serve para derivar o padrão. Nunca reproduza um trecho literal dele em outro contexto. Um link da amostra nunca entra no termo nem no exemplo: no lugar dele vai um marcador, como `[link da tarefa]`.

### Passo 7

Com histórico entregue, registre-o na mesma rodada, por `definir-negociacao`, sem duplicar o que já está. Ao terminar, diga o que o perfil registrou, o que o histórico persistiu e o que ficou de fora, com o motivo.

### Passo 8

Siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Perfil enviesado pelo próprio estilo

Se você incluir as mensagens de quem pediu ao perfilar um canal, o tom ambiente sai parecido com o dela e não com o do canal.

1. Exclua as mensagens de quem pediu.
2. Exclua as de bot.
3. Anote a exclusão na origem.

### Frase inteira cadastrada

Se você cadastrar uma frase completa como termo, o vocabulário vira um catálogo de frases e não serve em outro texto.

1. Decomponha a frase em fragmentos reutilizáveis.
2. Cadastre cada fragmento.
3. Mantenha a frase inteira só se ela for fixa.

### Rascunho seco para quem escreve com calor

Se você rascunhar para quem já escreveu na conversa sem ler como ela escreve, o texto sai correto e frio, e a pessoa percebe o contraste com a conversa. Ter o perfil dela não muda isso: aplicar só os termos do perfil, como "te", deixa o texto frio.

1. Leia as últimas mensagens dela antes de rascunhar, com ou sem perfil.
2. Acompanhe a saudação, o calor e o emoji, e devolva o tratamento carinhoso que ela usa conosco, dentro do vocabulário. Feche com um agradecimento carinhoso.
3. Com perfil, some a isso os termos dele. Sem perfil, diga que o perfil falta e proponha perfilar, sem registrar nada por conta própria.

### Histórico entregue só lido

Se você ler o histórico que a pessoa entregou só para ajustar o rascunho, o tom não fica perfilado, o histórico não vai para o Notion e a pessoa tem de cobrar, de novo, o que a entrega já pedia.

1. Perfile o tom na mesma rodada, com o histórico todo como amostra, e grave o resumo nas notas do contato e na página da pessoa.
2. Registre o histórico por `definir-negociacao`, sem perguntar.
3. Diga o que persistiu e o que ficou de fora, com o motivo.

### Rótulo de perfilamento esquecido

Se você deixar o rótulo ligado depois de a pessoa finalizar, a conversa parece ainda em perfilamento e o agente segue acrescentando padrão a um perfil fechado.

1. Ao finalizar, tire o rótulo por `rotular-item`.
2. Diga que o resumo é o definitivo.
3. Sem `Rótulo de perfilamento em andamento`, não rotule.

### Trecho privado reproduzido

Se você citar uma mensagem da conversa privada para justificar um termo, o conteúdo privado aparece em outro contexto.

1. Descreva o padrão com suas palavras.
2. Não cole trecho literal.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Perfile o tom do canal de suporte

Li as últimas 200 mensagens do canal, sem as suas e sem as de bot, e anotei isso na origem. O tom é informal, vai direto ao ponto, com pouca saudação e emoji só em agradecimento. Registrei dois termos pequenos com a etiqueta do canal e um resumo de três linhas. Mostrei o que derivei.

### Segue o zip da conversa com a Bia

Li o histórico inteiro, sem as nossas mensagens, e anotei o alcance: de março a setembro, com dois áudios não transcritos de fora. Gravei o resumo do tom nas notas do contato e na página da Bia, e registrei os blocos de conversa e de combinados por `definir-negociacao`, um comentário por bloco, sem a chave Pix. Disse o que ficou de fora e por quê.

### Perfile como a Ana conversa comigo

Li o histórico da nossa conversa privada. Ela alonga as vogais, abrevia "pra" e "tá" e pede as coisas em forma de pergunta. Registrei termos curtos com a etiqueta dela e um resumo. Não citei nenhuma mensagem literal.

## Casos-limite

- A pessoa não pediu o perfil nem entregou um histórico: não perfile. Entregou um histórico: perfile e registre na mesma rodada, sem perguntar. Ao rascunhar para quem já escreveu na conversa, acompanhe o calor das mensagens dela, com ou sem perfil. Sem perfil, proponha perfilar.
- A amostra tem poucas mensagens: diga isso e registre só o que se repete.
- O canal só tem mensagens de bot: diga isso e pare.
- Um padrão apareceu uma vez só: não registre.
- O histórico traz áudio, imagem ou trecho que não dá para ler: perfile o que se lê e diga o que ficou de fora.
- `Rótulo de perfilamento em andamento` vazio: perfile e acompanhe sem rotular.

## Pegadinhas

- Um texto correto e sem erro parece pronto. Para quem escreve com carinho, ele soa seco: compare o tom do rascunho com o das mensagens dela.
- Usar o perfil de uma pessoa parece ser só aplicar os termos dele. O perfil não guarda o calor de agora: leia as últimas mensagens dela, e o perfil nunca vira o nome com que a chamamos.
- O perfil de uma pessoa não vale para outra, nem o de um canal para uma pessoa.
- Uma frase que a pessoa disse uma vez parece um padrão. Só vira termo o que se repete.
- A conversa privada serve para derivar o padrão, nunca para ser citada.
- O histórico entregue parece só contexto para o rascunho. Ele pede o perfil e o registro no Notion na mesma rodada.
- Uma conversa com o rótulo ligado parece perfil pronto. Ela ainda aprende: só a pessoa a finaliza.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
