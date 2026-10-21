---
name: definir-link-rastreavel
description: Monta, revisa ou corrige os parâmetros UTM de um link, do jeito que o padrão define, sem dado interno nem pessoal. Usada quando alguém vai divulgar um link e quer medir de onde vêm os acessos, ou quando um link, um gerador ou um código monta UTM fora do padrão. Não serve para encurtar o link, criar o post nem ler o relatório do Analytics.
metadata:
  author: jimmyandrade
  version: "0.7.0"
  aliases:
    - definir-link-utm
    - definir-parametros-utm
    - definir-rastreio-de-link
    - gerar-link-com-parametros-utm
  related:
    - evoluir-habilidade
---

# Definir link rastreável

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Nome do data source de origens": ""
"Campo de origem": ""
"Origens": []
"Nome do data source de meios": ""
"Campo de meio": ""
"Meios": []
"Domínios próprios": []
"UTM em link no mesmo site": "não"
"Separador": "_"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Receba o link de destino, onde ele vai ser divulgado e o que a pessoa quer medir. Sem destino ou sem canal, pergunte. Link no mesmo site é o que sai de uma página dos `Domínios próprios` para outra página deles. Link para outro site leva a um domínio fora dessa lista. Com `UTM em link no mesmo site` igual a `não`, o link no mesmo site fica sem UTM. Com `sim`, ele leva UTM, porque a página seguinte repassa as UTMs ao outro site.

Com `Nome do data source de origens` preenchido, as origens são os valores do `Campo de origem` nesse data source. Com `Nome do data source de meios` preenchido, os meios são os valores do `Campo de meio` nesse outro. Procure os data sources no workspace conectado e use-os sem perguntar. Sem o data source na conexão, pare e peça. Não use um banco de outro workspace. Com o nome vazio, use a lista `Origens` ou `Meios`.

### Passo 2

Monte cada parâmetro com o significado do padrão:

- `utm_source`: de onde vem o acesso, entre as origens do Passo 1.
- `utm_medium`: o tipo de canal, entre os meios do Passo 1.
- `utm_campaign`: a campanha ou a ação, com um nome público.
- `utm_content`: a peça, a variação ou a posição do link na peça.
- `utm_term`: só a palavra-chave de mídia paga ou a palavra que a pessoa digitou numa automação. Fora disso, fica vazio.
- `utm_id`: o id público da campanha, quando ele existe. Vem da plataforma de anúncio, como o Google Ads ou o Meta Ads, ou de um id que o projeto gera para a campanha e que pode combinar o evento com quem divulga: a marca, um artista ou um influencer. Sem esse id, fica vazio.

Origem ou meio que não está no data source nem na lista: pergunte. Não invente um valor novo nem grave a linha no data source.

Em todo valor, as palavras se separam com `Separador`. O projeto usa um separador só, em todo lugar que monta link: o site, o gerador na tela, a API, o MCP e a linha de comando. O slug que chega com outro separador troca para o `Separador`.

### Passo 3

Confira o link antes de entregar:

- [ ] Nenhum parâmetro leva identificador interno: UUID, id de página, de banco, de registro, de usuário ou de CRM, nem o id que a API do próprio site devolve. No lugar, use o nome público, como o slug do evento, ou o id público da campanha em `utm_id`.
- [ ] Nenhum parâmetro leva dado pessoal: nome, e-mail ou telefone.
- [ ] Valores em minúsculas, sem acento, com `Separador` entre as palavras, inclusive no slug.
- [ ] `utm_term` vazio, salvo palavra-chave paga ou de automação.
- [ ] Os parâmetros que o destino já tinha ficaram no link.

Falhou um item: corrija e confira de novo. Ao revisar um link, um gerador ou um código, diga cada item que falhou, onde está e o valor certo.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Id interno na UTM

Se você puser o id de um registro numa UTM, ele sai da empresa: a URL vai para a plataforma de destino, para o relatório e para quem compartilha o link, e mostra a estrutura interna a quem não devia ver.

1. Tire o id de todos os parâmetros.
2. Use o nome público, como o slug, em `utm_campaign`.
3. Se o site precisa do id para medir, ele vai no evento do Analytics, não na URL.

### `utm_term` como campo livre

Se você usar `utm_term` para guardar o que não coube nos outros, o relatório de palavra-chave mistura coisas que não são palavra-chave.

1. Deixe `utm_term` vazio.
2. A peça ou a posição vai em `utm_content`.

### UTM em link no mesmo site

Se você decidir sozinho se o link no mesmo site leva UTM, quebra a regra do negócio: sem UTM, a página seguinte não tem o que repassar ao outro site; com UTM, o Analytics abre uma visita nova e troca a origem real.

1. Siga `UTM em link no mesmo site`.
2. Com `não`, meça o clique com um evento do Analytics.

### Separador misturado

Se você misturar hífen e sublinhado, o Analytics divide a mesma origem, o mesmo meio ou a mesma campanha em duas linhas.

1. Use só o `Separador`.
2. Troque o separador do slug e do valor que já existe.
3. Ao trocar um valor que já está no ar, diga que o relatório mostra o valor antigo e o novo separados a partir da data da troca.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o botão de ingressos da página do artista manda o id do evento em utm_term

O id interno do evento sai de `utm_term`. `utm_id` leva o id público da campanha quando o projeto gera um, e fica vazio sem ele. A posição do botão continua em `utm_content`. O id interno fica só no evento de clique do Analytics.

## Casos-limite

- O destino é do mesmo site da página: siga `UTM em link no mesmo site`.
- A linha do data source de origens ou de meios está com o campo vazio: não use o nome da linha no lugar. Diga qual linha está vazia e pergunte o valor.
- A campanha é de um evento divulgado por um artista ou um influencer, e o projeto ainda não gera id para essa combinação: `utm_id` fica vazio. Não monte o id com o UUID.
- A campanha não tem nome público: pergunte o nome. Não use o id.
- O link já chega com UTM de outra campanha: preserve, e não sobrescreva sem pedido.
- Gerador ou código que preenche um parâmetro com id interno por padrão: o padrão sai, e o campo fica vazio ou recebe o nome público.
- Gerador de links, na tela, na API, no MCP ou na linha de comando: `utm_id` é opcional e recebe só o id da campanha. Não o preencha com o id do evento.

## Pegadinhas

- `utm_id` parece liberar qualquer id. Ele só aceita o id público da campanha, nunca o UUID nem o id que a API devolve: com ele, alguém mal-intencionado tenta consultar a API ou o site para coletar dados.
- "Link interno" parece o link no mesmo site, mas o time também chama assim a área interna do site. Diga link no mesmo site e link para outro site.
- Um id parece inofensivo porque não diz nada. Ele identifica o registro e abre caminho para quem tenta acessar a estrutura interna.
- `utm_term` parece sobra. No padrão, é só palavra-chave.
- O Analytics não precisa da UTM para saber o evento quando o próprio site mede o clique.
- O exemplo da ajuda do Google usa hífen, e o gerador de URL do Google sugere sublinhado. O Analytics aceita os dois. O que quebra o relatório é misturar.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
