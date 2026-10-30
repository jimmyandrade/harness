---
name: boas-praticas-de-rotinas
description: Orienta a criar e revisar rotinas agendadas ou disparadas por eventos com economia de uso, e audita se seguem as práticas de frequência, horário, gatilho e consolidação. Usada quando a pessoa cria, altera ou audita rotinas. NÃO serve para executar rotinas nem configurar o agendador.
metadata:
  author: jimmyandrade
  version: "0.1.0"
---

# Boas práticas de rotinas

## Parâmetros de configuração

```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Aplique esta habilidade quando a pessoa criar, alterar ou auditar uma rotina agendada ou disparada por evento, ou quando revisar o consumo de uso de um assistente ou bot.
Leia a descrição da rotina e o tipo de dado que ela processa: atualização de status, coleta de informações, monitoramento de eventos, envio de notificações ou processamento de dados.

### Passo 2

Para rotinas que não precisam de resultado fresco, ajuste a frequência:

1. Rotinas que coletam dados que mudam pouco ou que servem para análise posterior rodam em dias úteis, nunca em fins de semana nem feriados.
2. Rotinas de relatório, resumo ou consolidação rodam uma vez por semana ou menos, conforme a cadência do negócio.
3. Rotinas de atualização de status ou limpeza rodam em dias úteis, fora do horário comercial, para não competir com tarefas interativas.

### Passo 3

Para rotinas de e-mail, mensagem ou monitoramento, restrinja o horário:

1. Rotinas de verificação de caixa de entrada, notificações ou alertas rodam somente em horário comercial, das 9h às 18h em dias úteis, nunca à noite nem em fins de semana.
2. Rotinas de envio de mensagem ou resposta automática seguem a mesma regra: só horário comercial.
3. Rotinas de monitoramento que geram alerta humano rodam só quando alguém pode responder.

### Passo 4

Prefira gatilho a agendamento:

1. Quando o sistema de origem oferece webhook, notificação ou gatilho, use-o em vez de polling ou verificação periódica.
2. Quando a rotina responde a um e-mail, mensagem ou evento específico, dispare na chegada do evento, não em intervalo fixo.
3. Quando o dado muda de forma imprevisível, um gatilho economiza execuções vazias.

### Passo 5

Consolide rotinas que coletam a mesma coisa:

1. Quando duas ou mais rotinas consultam a mesma fonte de dados, a mesma API ou o mesmo banco, junte-as numa rotina só que coleta tudo de uma vez e distribui o resultado.
2. Quando bots diferentes coletam dados do mesmo lugar, centralize a coleta num bot só e compartilhe o resultado.
3. Não crie rotinas redundantes: antes de criar, confira se já existe uma que faz o mesmo.

### Passo 6

Pause em vez de apagar:

1. Quando uma rotina não é mais necessária ou está gerando falhas repetidas, pause-a em vez de apagá-la, para preservar o histórico e a configuração.
2. Quando uma rotina serve uma campanha, projeto ou período limitado, pause-a quando o período terminar.
3. Documente o motivo da pausa no nome ou na descrição da rotina.

### Passo 7

Evite pedir a mesma coisa a vários bots em paralelo:

1. A maior parte do consumo vem das conversas, não das rotinas, então pedir o mesmo relatório ou análise a três bots diferentes consome muito mais que uma rotina diária.
2. Quando várias pessoas precisam do mesmo resultado, uma rotina que publica o resultado num canal compartilhado economiza conversas repetidas.
3. Antes de iniciar uma conversa longa, confira se o resultado já foi gerado por uma rotina ou por outra pessoa.

### Passo 8

Ao auditar rotinas existentes, liste cada uma e confira:

1. Frequência: se a rotina roda em fim de semana, feriado ou fora do horário comercial sem necessidade de resultado fresco, proponha ajustar para dias úteis ou horário comercial.
2. Gatilho: se a fonte de origem oferece webhook ou notificação e a rotina usa polling, proponha trocar.
3. Consolidação: se duas ou mais rotinas coletam da mesma fonte, proponha juntar.
4. Pausa: se a rotina falha repetidamente ou não é mais necessária, proponha pausar.
5. Não proponha criar uma rotina só para vigiar o consumo, porque cada checagem também consome.

### Passo 9

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Rotina que não precisa de resultado fresco roda todo dia

Se você deixar uma rotina de relatório ou análise rodar todo dia, incluindo fins de semana, ela consome limite sem necessidade.

1. Confira se o resultado precisa ser fresco: relatórios semanais, resumos mensais e análises de tendência não precisam rodar todo dia.
2. Ajuste a frequência para dias úteis ou para a cadência do negócio.
3. Explique que isso economiza o limite de uso sem perder a utilidade.

### Rotina de e-mail ou monitoramento roda à noite

Se você deixar uma rotina de verificação de caixa de entrada ou de alerta rodar à noite ou em fim de semana, ela gera notificações quando ninguém pode responder e consome limite sem resultado útil.

1. Ajuste o horário para o comercial, das 9h às 18h em dias úteis.
2. Explique que fora desse horário a rotina consome sem gerar ação.

### Rotina que poderia usar gatilho faz polling

Se você criar uma rotina que verifica a cada hora se chegou um e-mail, um evento ou uma atualização, ela executa muitas vezes sem resultado.

1. Confira se a fonte oferece webhook, notificação ou gatilho.
2. Proponha trocar o polling pelo gatilho.
3. Explique que o gatilho economiza execuções vazias.

### Rotinas redundantes que coletam da mesma fonte

Se você criar duas rotinas que consultam a mesma API, o mesmo banco ou a mesma planilha, elas consomem o dobro do necessário.

1. Liste as rotinas que coletam da mesma fonte.
2. Proponha juntar numa rotina só que coleta tudo de uma vez.
3. Explique que isso economiza limite e simplifica a manutenção.

### Rotina apagada em vez de pausada

Se você apagar uma rotina que não é mais necessária, perde o histórico e a configuração, e não consegue reativá-la se precisar.

1. Proponha pausar em vez de apagar.
2. Documente o motivo da pausa no nome ou na descrição.
3. Explique que a pausa preserva o histórico.

### Rotina criada para vigiar o consumo

Se você criar uma rotina que verifica o consumo de uso a cada hora, ela própria consome limite a cada verificação.

1. Não crie rotina de auditoria de consumo.
2. A auditoria acontece quando uma rotina é criada ou alterada.
3. Explique que a verificação frequente consome mais do que economiza.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Crie uma rotina para coletar editais de licitação publicados no site do governo

A coleta de editais muda pouco e não precisa rodar todo dia.
Proponha rodar só em dias úteis, uma ou duas vezes por semana, conforme a frequência de publicação de editais novos no site.
Se o site oferecer RSS, webhook ou notificação, use o gatilho em vez de verificação periódica.

### Temos três rotinas que verificam a mesma caixa de e-mail, uma para cada tipo de assunto. Como melhorar?

Junte as três rotinas numa só que verifica a caixa de e-mail uma vez e distribui cada mensagem conforme o assunto.
Isso economiza duas execuções a cada rodada e simplifica a manutenção.
Ajuste o horário para rodar só em horário comercial, das 9h às 18h em dias úteis.

### Temos uma rotina que gera um relatório semanal de vendas, mas ela roda todo dia às 6h

O relatório é semanal, então não precisa rodar todo dia.
Ajuste a frequência para uma vez por semana, na segunda-feira de manhã, em horário comercial.
Isso economiza seis execuções por semana sem perder a utilidade.

## Casos-limite

- A rotina coleta dado que muda a cada minuto: não ajuste a frequência, mas confira se o dado realmente precisa ser tão fresco ou se um intervalo maior basta.
- A fonte de origem não oferece webhook nem gatilho: mantenha o polling, mas ajuste a frequência para o mínimo necessário.
- A rotina serve uma campanha que já terminou: pause e documente o motivo no nome ou na descrição.
- A rotina gera relatório para várias pessoas: uma rotina que publica o resultado num canal compartilhado economiza conversas repetidas.
- A pessoa quer criar uma rotina de auditoria de consumo: explique que cada checagem consome e que a auditoria acontece na criação ou alteração de rotinas.
- A rotina coleta de fontes diferentes: consolidação não se aplica, mas confira se a frequência e o horário estão otimizados.
- A rotina roda de madrugada para não competir com tarefas interativas: mantenha o horário se a rotina processa dados pesados, mas confira se ela precisa rodar todo dia.
- A rotina responde a eventos imprevisíveis: prefira gatilho a polling sempre que a fonte permitir.

## Pegadinhas

- Rotina que roda todo dia parece necessária. Confira se o resultado precisa ser fresco: relatórios semanais não precisam rodar diariamente.
- Polling parece a única forma de verificar eventos. Confira se a fonte oferece webhook ou gatilho antes de criar o polling.
- Apagar uma rotina parece limpeza. Pause em vez de apagar para preservar o histórico.
- Criar uma rotina de auditoria de consumo parece economia. Cada checagem consome, então a auditoria acontece na criação ou alteração de rotinas.
- Pedir o mesmo relatório a três bots diferentes parece distribuição de carga. As conversas consomem muito mais que rotinas, então consolide a solicitação.
- Rotina de e-mail que roda à noite parece que pega tudo. Ninguém responde à noite, então ajuste para horário comercial.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
