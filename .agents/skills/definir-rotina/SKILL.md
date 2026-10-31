---
name: definir-rotina
description: Cria, revisa e audita rotinas agendadas ou por evento, para rodarem só quando o resultado tem uso. Usada ao pedir, mudar ou auditar uma rotina, ou antes de pedir de novo um resultado que uma rotina já gerou, mesmo sem dizer rotina. Não serve para executar o trabalho da rotina, criar evento na agenda nem medir uma skill.
metadata:
  author: jimmyandrade
  version: "0.3.0"
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
# `Janela de manutenção` traz os dias e as horas da limpeza, da atualização de status e do processamento pesado, fora do `Horário comercial`.
"Janela de manutenção": "dias úteis, das 0h às 6h"
"Fuso horário": ""
# `Cadência de relatório` é `diária`, `semanal`, `mensal` ou outra que a pessoa der.
"Cadência de relatório": "semanal"
# `Ao fim do período` é `pausar`, que pausa a rotina de uma campanha ou de um projeto quando o período acaba, ou `perguntar`.
"Ao fim do período": "pausar"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Leia o que a rotina faz, de que fonte ela lê e quem usa o resultado.
Antes de criar a rotina, e antes de pedir um resultado numa conversa longa ou a outro bot, procure se uma rotina ou outra pessoa já o gerou, como na saída da rotina ou num canal compartilhado.
Se já existe, aponte esse resultado em vez de gerar outro.
Liste as rotinas que já existem e procure uma que leia a mesma fonte ou entregue o mesmo resultado.
Se existir, ajuste essa rotina em vez de criar outra.
Quando bots diferentes leem a mesma fonte, um bot coletor por fonte coleta e organiza, e repassa cada item ao bot especialista naquele tipo de comunicação.

### Passo 2

Meça a temperatura do dado antes de escolher a frequência: com que frequência a fonte muda de fato.
Leia as datas das últimas atualizações, como o `Last-Modified`, as datas do feed ou o histórico de versões, e calcule o intervalo entre elas.
O dado quente muda em minutos ou horas, o morno muda por dia, e o frio muda por semana ou mais.
A rotina não roda com mais frequência que a fonte muda, e a resposta mostra a temperatura e as datas usadas.
Sem datas, comece pela menor frequência que atende quem usa o resultado e meça de novo depois de algumas execuções.

### Passo 3

Escolha o disparo.
Quando a fonte oferece webhook, RSS, notificação ou gatilho, a rotina dispara na chegada do evento, sem consulta periódica.
Uma página sem esses gatilhos é vigiada por diff quando há um monitor de mudança de página: ele guarda a última versão, compara com a atual e só avisa quando muda.
A rotina dispara pelo aviso e lê só o trecho que mudou, em vez de reler a página inteira.
A frequência do monitor segue a temperatura do Passo 2.
Sem monitor, a página entra na consulta periódica, e a resposta diz que um monitor por diff dispensaria a releitura.
Sem gatilho, a frequência segue a temperatura do Passo 2 e quando o resultado é usado.
Um resultado que não precisa ser fresco, como coleta para análise posterior, roda só em dias úteis.
Relatório, resumo e consolidação rodam na `Cadência de relatório`.

### Passo 4

Uma rotina que avisa uma pessoa, lê caixa de entrada ou manda mensagem roda só no `Horário comercial`, no `Fuso horário`.
Fora dele, ninguém responde ao aviso, e a execução só gasta.
Limpeza, atualização de status e processamento pesado que não avisam ninguém rodam na `Janela de manutenção`, para não disputar com o trabalho das pessoas.
Quando várias pessoas precisam do mesmo resultado, a rotina publica num canal compartilhado, em vez de cada uma pedir o mesmo numa conversa.
A rotina de uma campanha, de um projeto ou de outro período limitado leva a data de fim.
Quando o período acaba, siga `Ao fim do período`: com `pausar`, pause a rotina com o motivo na descrição dela; com `perguntar`, pergunte à pessoa.

### Passo 5

A auditoria é avulsa e procura oportunidades de economia.
Liste cada rotina com o disparo, a frequência, a temperatura da fonte e quem usa o resultado.
Proponha trocar a consulta periódica por gatilho, quando a fonte oferece, ou por monitor por diff, quando a fonte é uma página.
Proponha baixar a frequência que passa da temperatura medida.
Proponha tirar do fim de semana o que não precisa de resultado fresco, e levar para a `Janela de manutenção` o que é pesado e não avisa ninguém.
Proponha juntar numa rotina só as que leem a mesma fonte, com um bot coletor que repassa ao especialista.
Proponha pausar a que ninguém usa mais, que falha sempre ou cujo período acabou, com o motivo na descrição dela.
Cada proposta diz quanto economiza, como o número de execuções a menos por semana.
Mostre as propostas e só aplique com a confirmação da pessoa.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Rotina apagada

Se você apagar uma rotina que parou de servir, o histórico e a configuração se perdem, e recriá-la custa mais que retomá-la.

1. Pause a rotina.
2. Escreva o motivo da pausa na descrição dela.

### Rotina para vigiar o consumo

Se você criar uma rotina que confere o consumo de uso, cada conferência também consome.

1. Não crie a rotina.
2. Explique o custo e ofereça a auditoria avulsa do Passo 5.

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

A rotina é criada e alterada na ferramenta de agendamento do harness em uso.

- `curl -sI <endereço> | grep -i '^last-modified'`: data da última mudança de uma página, no Passo 2.
- `curl -s <endereço do feed> | grep -o -E '<(pubDate|updated)>[^<]*'`: datas das últimas entradas de um feed, no Passo 2.

1. Procure o resultado já gerado, meça a temperatura, escolha o disparo e a janela, e mostre as propostas antes de aplicar.
