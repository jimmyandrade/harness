---
name: definir-reserva
description: Use essa habilidade sempre que for rever se um evento é reserva, bloqueio provisório, a confirmar ou lembrete, ou se a participação foi confirmada, mesmo sem dizer reserva. NÃO use para gravar o horário do evento, reservar tempo de carreira, sincronizar o cronograma, nem auditar o uso do tempo.
allowed-tools: notion:notion-ai-search notion:notion-fetch notion:notion-create-pages notion:notion-update-page
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.2.5"
  related:
    - definir-agenda
    - definir-agenda-de-popstar
    - revisar-uso-do-tempo
    - sincronizar-cronograma
---

# Definir reserva

## Parâmetros de configuração

```yaml
{}
```

## Instruções

### Passo 1

As listas e o nome de cada propriedade vêm do mapeamento de dados do projeto. Rever reserva, bloqueio provisório, «a confirmar» ou lembrete, e a passagem para participação confirmada, é esta habilidade. A gravação do evento segue `definir-agenda`. A reserva de tempo de carreira, antes da demanda, segue `definir-agenda-de-popstar`. Item com data e sem início e fim confirmados segue `sincronizar-cronograma`. O uso do tempo segue `revisar-uso-do-tempo`.

```mermaid
flowchart LR
  Q{O evento é?} -->|reserva ou bloqueio| A[Define aqui]
  Q -->|a confirmar ou lembrete| A
  Q -->|horário do evento| E[definir-agenda]
  Q -->|carreira antes da demanda| P[definir-agenda-de-popstar]
  Q -->|item sem horário| S[sincronizar-cronograma]
```

### Passo 2

Sem confirmação explícita da pessoa ou da fonte, a natureza provisória permanece. A oportunidade aprovada não converte a reserva em participação confirmada.

```mermaid
flowchart LR
  C{Há confirmação explícita?} -->|não| M[Mantenha provisório]
  C -->|sim, com pendência| U[Título ou descrição marca a pendência]
  C -->|sim, sem pendência| F[Deixa de ser só reserva]
```

### Passo 3

A pessoa confirmou a participação: título e descrição passam a dizer que deixou de ser só reserva. O título continua com o nome canônico. A gravação segue `definir-agenda`.

A reserva é de uma oferta só. O título e a descrição dizem de qual, pela organização e pelo formato. Outra oferta parecida, no mesmo lugar ou perto das mesmas datas, que a marca não disputa, entra na descrição como "não confundir com", e nunca como segundo motivo da reserva.

Quando a marca demonstra interesse em outra feira nas mesmas datas de uma reserva «a confirmar», como uma inscrição, um aceite de convite ou um voto, crie o evento «a confirmar» dessa feira, também de uma oferta só, e atualize a descrição de cada reserva que concorre com ela, dizendo a data e o nome de cada concorrente. Assim a agenda mostra que há mais de uma feira possível nessa data. A concorrência fica na descrição, nunca no título, e não confirma nenhuma.

Participação que ainda depende de estoque, pagamento, curadoria, agenda, deslocamento ou confirmação de terceiros fica na descrição, ou o título mantém um marcador de incerteza. Não trate essa pendência como participação livre de condição.

## Problemas comuns

### Reserva que vira confirmação

Se você converter reserva, bloqueio, «a confirmar» ou lembrete em participação confirmada sem confirmação explícita, ou só porque a oportunidade está aprovada, o desejo vira fato.

1. Mantenha a natureza provisória.
2. A oportunidade aprovada não confirma a participação.
3. Confirme só quando a pessoa ou a fonte confirmar.

### Feira concorrente sem evento

Se você registrar o interesse numa feira só no Notion e deixar a agenda como estava, a data parece ter uma feira só, e a pessoa descobre o conflito perto do dia.

1. Crie o evento «a confirmar» da nova feira, de uma oferta só.
2. Atualize a descrição de cada reserva da mesma data com o nome e a data da concorrente.
3. Mantenha todas provisórias: a concorrência não confirma nenhuma.

### Pendência apagada

Se você tirar o marcador de incerteza quando ainda faltam estoque, pagamento, curadoria, agenda, deslocamento ou confirmação de terceiros, a participação parece livre.

1. Registre a pendência na descrição ou mantenha o marcador no título.
2. Não trate a condição como já resolvida.
3. A gravação segue `definir-agenda`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### revise essa reserva. a oportunidade já foi aprovada.

A reserva continuou provisória. A oportunidade aprovada não virou participação confirmada.

### a pessoa confirmou a participação

Título e descrição deixaram de dizer que era só reserva. A gravação ficou com `definir-agenda`.

### confirmou, mas ainda depende do pagamento

A confirmação ficou registrada. A descrição guardou a pendência de pagamento. O título manteve o marcador de incerteza.

### a pessoa se inscreveu numa feira em São Paulo no mesmo fim de semana de uma reserva «a confirmar» de outra feira

Criei o evento «a confirmar» da feira nova, com a oferta e a fonte. Atualizei a descrição da reserva que já estava, dizendo qual feira concorre e em que datas. Nenhuma virou participação confirmada, e os títulos ficaram como estavam.

## Casos-limite

- A marca demonstra interesse em outra feira nas mesmas datas de uma reserva: crie o evento da feira nova e registre a concorrência na descrição das duas.

- Reserva, bloqueio provisório, «a confirmar» ou lembrete sem confirmação explícita: mantenha a natureza provisória.
- A oportunidade aprovada: não converte a reserva em participação confirmada.
- A pessoa ou a fonte confirmou: atualize título e descrição. A gravação segue `definir-agenda`.
- Ainda depende de estoque, pagamento, curadoria, agenda, deslocamento ou terceiros: registre na descrição ou mantenha o marcador no título.
- Reserva de tempo de carreira, antes da demanda: `definir-agenda-de-popstar`.
- O pedido é o horário do evento: `definir-agenda`.

## Pegadinhas

- A oportunidade aprovada parece participação confirmada. A reserva continua reserva até confirmação explícita.
- «A confirmar» e lembrete parecem compromisso fechado. Sem confirmação explícita, a natureza provisória fica.
- Confirmar parece apagar a pendência. A lista de estoque, pagamento, curadoria, agenda, deslocamento ou terceiros continuam na descrição ou no título.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
