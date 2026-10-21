---
name: definir-link-utm
description: Monta, revisa ou corrige os parâmetros UTM de um link, do jeito que o padrão define, sem dado interno nem pessoal. Usada quando alguém vai divulgar um link e quer medir de onde vêm os acessos, ou quando um link, um gerador ou um código monta UTM fora do padrão. Não serve para encurtar o link, criar o post nem ler o relatório do Analytics.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  related:
    - evoluir-habilidade
---

# Definir link UTM

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Origens": []
"Meios": []
"Domínios próprios": []
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Receba o link de destino, onde ele vai ser divulgado e o que a pessoa quer medir. Sem destino ou sem canal, pergunte. Se o destino estiver num dos `Domínios próprios` e o link sair de uma página desses mesmos domínios, não monte UTM: diga que o link interno fica sem UTM.

### Passo 2

Monte cada parâmetro com o significado do padrão:

- `utm_source`: de onde vem o acesso, de `Origens`.
- `utm_medium`: o tipo de canal, de `Meios`.
- `utm_campaign`: a campanha ou a ação, com um nome público.
- `utm_content`: a peça, a variação ou a posição do link na peça.
- `utm_term`: só a palavra-chave de mídia paga ou a palavra que a pessoa digitou numa automação. Fora disso, fica vazio.
- `utm_id`: o id da campanha numa plataforma externa, como o id do evento na tiqueteira ou o id da campanha de anúncio. Sem id externo, fica vazio.

Origem ou meio fora das listas: pergunte. Não invente um valor novo.

### Passo 3

Confira o link antes de entregar:

- [ ] Nenhum parâmetro leva identificador interno: id de página, de banco, de registro, de usuário ou de CRM. No lugar, use o nome público, como o slug do evento, ou o id externo em `utm_id`.
- [ ] Nenhum parâmetro leva dado pessoal: nome, e-mail ou telefone.
- [ ] Valores em minúsculas, sem acento, com hífen no lugar de espaço.
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

### UTM em link interno

Se você puser UTM num link de uma página para outra do mesmo site, o Analytics abre uma visita nova e troca a origem real pela UTM interna.

1. Tire a UTM do link interno.
2. Meça o clique com um evento do Analytics.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### o botão de ingressos da página do artista manda o id do evento em utm_term

O id interno do evento sai de `utm_term`. O id do evento na tiqueteira, quando existe, vai em `utm_id`, e a posição do botão continua em `utm_content`. O id interno fica só no evento de clique do Analytics.

## Casos-limite

- O destino é do mesmo site da página: sem UTM.
- A campanha não tem nome público: pergunte o nome. Não use o id.
- O link já chega com UTM de outra campanha: preserve, e não sobrescreva sem pedido.
- Gerador ou código que preenche um parâmetro com id interno por padrão: o padrão sai, e o campo fica vazio ou recebe o nome público.

## Pegadinhas

- `utm_id` parece liberar qualquer id. Ele só aceita o id de uma plataforma externa, nunca o id de um registro interno.
- Um id parece inofensivo porque não diz nada. Ele identifica o registro e abre caminho para quem tenta acessar a estrutura interna.
- `utm_term` parece sobra. No padrão, é só palavra-chave.
- O Analytics não precisa da UTM para saber o evento quando o próprio site mede o clique.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
