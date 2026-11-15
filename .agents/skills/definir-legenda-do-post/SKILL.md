---
name: definir-legenda-do-post
description: Escreve e revisa a legenda de um post de qualquer rede, com limite de caracteres, hashtags, CTA principal, dados de evento e créditos. Usada quando se cria, revisa ou finaliza a legenda de um Reel, carrossel ou foto, mesmo sem dizer legenda. NÃO serve para escolher as palavras no tom de voz, escrever o roteiro nem publicar o post.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-reel-do-instagram
    - criar-carrossel-do-instagram
    - redigir-com-tom-de-voz
    - evoluir-habilidade
  models:
    - legenda-do-post
---

# Definir legenda do post

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Habilidade de tom de voz` vazia quer dizer que as palavras da legenda seguem só esta habilidade.
"Habilidade de tom de voz": ""
# `Referências da estratégia de conteúdo` lista a página e outras referências com a estratégia de conteúdo da marca. Uma referência que a pessoa der no pedido vale junto. Sem nenhuma, o objetivo vem só da pessoa.
"Referências da estratégia de conteúdo": []
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Tenha a rede, o formato, o perfil autor, o objetivo do post e o material que a legenda acompanha: o roteiro, os slides, a foto ou o texto. O que não der para inferir com segurança, pergunte uma vez. Não invente perfil, data, horário, local, objetivo nem limite.

O máximo de caracteres, a quantidade ideal e o máximo de hashtags saem do registro do formato na lista de formatos do projeto, pelo mapeamento de dados. Sem o registro ou sem o valor, pergunte e pare, salvo o que o Passo 7 diz do Instagram. Outra rede não herda número do Instagram.

O perfil autor é o perfil que publica. Collab e perfil convidado não entram nele.

### Passo 2

A legenda complementa o post. Conta o que o vídeo, a imagem ou os slides não contaram e não repete o roteiro nem o texto da arte.

Escreva para quem ainda não conhece o perfil: sem "como vocês já sabem", jargão interno nem referência a post anterior. Corte o que não acrescenta informação, desejo ou prova.

Marcação de tom, ação de cena e direção de gravação nunca entram na legenda, e a contagem de caracteres também não as conta.

### Passo 3

A legenda cabe no máximo de caracteres do formato, contando espaços e emojis. Diga a contagem, no modelo `N de M`.

### Passo 4

A legenda fecha com um CTA principal, ligado ao objetivo do post. Ele diz a ação e onde fazer, como comentar, compartilhar, salvar, mandar uma palavra no Direct ou abrir o link da bio, e pode ser medido. "Curta e siga" não é CTA.

O CTA da legenda e o do vídeo ou da imagem levam ao mesmo caminho. O destino existe quando o post sai: o link está na bio, a palavra no Direct tem quem responda. Um CTA secundário só entra se não competir com o principal.

O CTA respeita o nível de permissão do termo no vocabulário. A consulta e as palavras seguem a `Habilidade de tom de voz`, com o perfil autor como contexto.

### Passo 5

Num post de evento, tire o nome, a data, o horário e o endereço da página do evento. Sem essa página, pergunte. A data do post é anterior à do evento.

A legenda segue três blocos, nesta ordem: o que, quando e onde, com o horário de início e o de fim, quando houver; por que vale ir, em duas ou três provas concretas; e o CTA. Ela diz tudo sozinha: nenhuma informação depende de comentário, de outro post nem de contexto externo.

Num carrossel de evento, o horário e o endereço aparecem na legenda e na imagem.

### Passo 6

As hashtags vão no campo de hashtags, não no texto. A quantidade segue a ideal do formato, sem passar do máximo. Diga a contagem.

Cada hashtag liga o tema ao nicho do perfil. Hashtag genérica, só pelo volume, fica de fora. Hashtag que a lista do projeto ainda não tem entra só com o sim da pessoa.

Dê crédito a quem fez as fotos, os vídeos ou a arte, marcando cada pessoa ou perfil na legenda. Marcação e collab novas entram só com o sim da pessoa. Sem saber quem produziu o material, pergunte antes de finalizar.

### Passo 7

Instagram:

- Sem máximo de hashtags no formato, o limite é 5, o do Instagram para Reel, post único e carrossel. Sugira preencher o campo no registro do formato.
- No carrossel, convide a salvar de modo explícito e elegante, como "salva para consultar depois", quando o conteúdo for consultável.
- No Reel, a legenda não repete a fala e o CTA aponta para o perfil autor, como o link da bio dele.

Outras redes seguem só o registro do formato delas. Sem registro, pergunte e não aplique regra do Instagram.

### Passo 8

Quando a lista de posts separa a legenda da IA, a legenda humana e a legenda consolidada, escreva só na da IA. Nunca edite, apague nem reescreva a humana: se ela tiver desvio de tom ou de regra, mostre a sugestão e espere a pessoa.

A legenda consolidada é a final: prioriza a humana quando preenchida e, senão, usa a da IA. Confira o limite, a prontidão e a consistência por ela. Não repita a legenda no corpo da página.

Ao revisar, leia a legenda e o que a pessoa escreveu antes de mudar. Para cada trecho que muda, mostre o antes, o depois e o ganho. Trecho humano só muda com o sim para aquele trecho.

### Passo 9

Valide antes de mostrar. Corrija e repita até passar.

- [ ] A legenda cabe no máximo de caracteres, e a contagem foi dita.
- [ ] Há um CTA principal com ação e destino, coerente com o do post.
- [ ] As hashtags estão no campo, na quantidade ideal e dentro do máximo, e a contagem foi dita.
- [ ] Nenhuma marcação de tom, ação de cena ou direção de gravação está na legenda.
- [ ] Num evento, a legenda tem data, horário e endereço, e não depende de comentário.
- [ ] As palavras passaram pela `Habilidade de tom de voz`.
- [ ] Nenhum texto humano foi apagado sem o sim para aquele trecho.

Leia o modelo de saída `legenda-do-post` quando for gerar a saída.

### Passo 10

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Legenda que repete a fala

Se você copiar o roteiro ou o texto dos slides para a legenda, quem já viu o post lê duas vezes a mesma coisa.

1. Conte o que o post não contou.
2. Deixe a fala e a arte no que elas já dizem.

### Hashtag no meio do texto

Se você escrever as hashtags dentro da legenda, elas estouram a contagem do campo e o texto fica poluído.

1. Tire as hashtags do texto.
2. Coloque no campo de hashtags e diga a contagem.

### CTA genérico

Se você fechar com "curta e siga", ninguém sabe o que fazer nem como medir.

1. Escolha uma ação e um destino.
2. Confira que o destino existe quando o post sai.

### Evento sem endereço

Se você escrever "o endereço está nos comentários", o post depende de uma informação que pode sumir ou não ser lida.

1. Escreva a data, o horário e o endereço na legenda.
2. Num carrossel, repita o horário e o endereço na imagem.

### Número de outra rede

Se você usar o limite ou a regra de hashtag do Instagram numa rede sem registro, a legenda sai fora do formato dela.

1. Leia o registro do formato da rede.
2. Sem registro, pergunte e pare.

### Legenda humana sobrescrita

Se você gravar na legenda escrita por pessoas, o que ela escreveu se perde.

1. Escreva só na legenda da IA.
2. Mostre a sugestão e espere o sim para mudar a humana.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### escreva a legenda deste Reel de bastidor, com hashtags e CTA

A legenda contou o que a fala não contou e fechou com um CTA para salvar. A resposta trouxe 240 de 2.200 caracteres e 4 hashtags no campo, sem passar do máximo. A legenda humana ficou como estava.

### escreva a legenda do carrossel que divulga a feira deste sábado

A legenda abriu com o que, quando e onde, com horário e endereço, seguiu com duas provas de por que ir e fechou com o CTA. O horário e o endereço também entraram na imagem. A data do post ficou antes da do evento.

## Casos-limite

- O post é de uma rede sem registro de formato: pergunte o limite e as hashtags, e pare.
- O formato não tem máximo de hashtags e a rede é o Instagram: use 5 e sugira preencher o campo.
- A legenda humana já está preenchida e tem desvio de tom: mostre a sugestão e não grave.
- A pessoa dá o evento sem horário: pergunte antes de escrever. Não ponha horário de memória.
- O post não tem objetivo claro: pergunte, porque o CTA depende dele.
- O vocabulário proíbe um termo que a pessoa quer na legenda: avise o conflito, não troque em silêncio.

## Pegadinhas

- O limite do Instagram parece valer em toda rede. Cada rede lê o registro do formato dela.
- A contagem parece ignorar emojis e espaços. Eles contam.
- A marcação de tom parece fazer parte da legenda quando o roteiro a traz. Ela é direção e nunca entra, nem na contagem.
- A legenda consolidada parece só um espelho. Ela é a versão final e prioriza a humana.
- O endereço nos comentários parece bastar. A legenda precisa dizer sozinha.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
