---
name: definir-rotina
description: Cria, revisa e audita uma rotina agendada ou disparada por evento, de um assistente ou de um bot, para ela rodar só quando o resultado tem quem o use. Usada quando a pessoa pede uma rotina nova, quer mudar a frequência de uma ou revisar o consumo das rotinas, mesmo sem dizer rotina. Não serve para executar o trabalho da rotina, criar evento na agenda nem medir uma skill.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - acompanhar-fila-de-revisao
    - evoluir-habilidade
---

# Definir rotina

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
# `Horário comercial` traz os dias e as horas em que uma pessoa pode responder a um aviso.
"Horário comercial": "dias úteis, das 9h às 18h"
"Fuso horário": ""
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Leia o que a rotina faz, de que fonte ela lê e quem usa o resultado.
Antes de criar, liste as rotinas que já existem e procure uma que leia a mesma fonte ou entregue o mesmo resultado.
Se existir, ajuste essa rotina em vez de criar outra.

### Passo 2

Escolha o disparo.
Quando a fonte oferece webhook, notificação ou gatilho, a rotina dispara na chegada do evento, sem consulta periódica.
Sem gatilho, a frequência segue quando o resultado é usado.
Um resultado que não precisa ser fresco, como coleta para análise posterior, roda só em dias úteis.
Relatório, resumo e consolidação rodam uma vez por semana ou menos, conforme a cadência de quem lê.

### Passo 3

Uma rotina que avisa uma pessoa, lê caixa de entrada ou manda mensagem roda só no `Horário comercial`, no `Fuso horário`.
Fora dele, ninguém responde ao aviso, e a execução só gasta.
Quando várias pessoas precisam do mesmo resultado, a rotina publica num canal compartilhado, em vez de cada uma pedir o mesmo numa conversa.

### Passo 4

Ao auditar, liste cada rotina com o disparo, a frequência, a fonte e quem usa o resultado.
Proponha trocar a consulta periódica por gatilho, quando a fonte oferece.
Proponha tirar dos fins de semana e da madrugada o que não precisa de resultado fresco.
Proponha juntar numa rotina só as que leem a mesma fonte.
Proponha pausar a que ninguém usa mais ou que falha sempre, com o motivo na descrição dela.
Mostre as propostas e só aplique com a confirmação da pessoa.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Rotina apagada

Se você apagar uma rotina que parou de servir, o histórico e a configuração se perdem, e recriá-la custa mais que retomá-la.

1. Pause a rotina.
2. Escreva o motivo da pausa na descrição dela.

### Rotina para vigiar o consumo

Se você criar uma rotina que confere o consumo de uso, cada conferência também consome.

1. Não crie a rotina.
2. Explique o custo e ofereça a auditoria do Passo 4, feita uma vez.

### Duas rotinas para a mesma fonte

Se você criar uma rotina sem procurar as que existem, duas rotinas leem a mesma fonte e o uso dobra.

1. Liste as rotinas no Passo 1.
2. Ajuste a que já lê a fonte.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Crie uma rotina diária que colete os editais publicados

Os editais não precisam ser lidos no fim de semana. A rotina foi criada para os dias úteis, às 8h, e a resposta disse que sábado e domingo ficam de fora.

### Audite as minhas rotinas

Três rotinas liam a mesma caixa de e-mail, e uma rodava de madrugada para avisar a equipe. Propus juntar as três numa rotina só, no horário comercial, e pausar a de um projeto encerrado. Apliquei depois da confirmação.

## Casos-limite

- O resultado precisa ser fresco, como um alerta de queda do site: a rotina roda fora do horário comercial, e a resposta diz por quê.
- A pessoa pede para apagar: confirme se pausar não basta antes de apagar.
- A ferramenta não oferece gatilho: use a menor frequência que atende quem usa o resultado.

## Pegadinhas

- A maior parte do consumo costuma vir das conversas, não das rotinas. Pedir o mesmo resultado a vários bots em paralelo gasta mais que uma rotina diária.
- Uma rotina sem execução vazia parece barata. Cada disparo que não acha nada também consome.

## Scripts disponíveis

Esta habilidade não usa script. A rotina é criada e alterada na ferramenta de agendamento do harness em uso.

1. Liste as rotinas, escolha o disparo e o horário, e mostre as propostas antes de aplicar.
