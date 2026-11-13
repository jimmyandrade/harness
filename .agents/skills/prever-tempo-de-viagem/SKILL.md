---
name: prever-tempo-de-viagem
description: Prevê o tempo de uma viagem de carro pelo histórico do mesmo trecho, com a hora de chegada para uma saída dada ou a hora de saída para uma chegada desejada, e a margem para a janela do compromisso. Usada quando a pessoa pergunta quanto a viagem leva, a que horas chega ou a que horas sai. NÃO serve para cadastrar a viagem, escolher a saída pela pessoa nem lançar despesa.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  related:
    - acompanhar-veiculo
    - definir-viagem
    - evoluir-habilidade
    - organizar-ponto-de-contato
    - sincronizar-cronograma
---

# Prever tempo de viagem

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `Folga mínima em minutos` é o tempo que a previsão soma para imprevisto na estrada, como chuva, acidente e fila.
"Folga mínima em minutos": "60"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Peça o trecho, a janela do compromisso, como a montagem de uma feira, e o que a pessoa já fixou: a saída, para calcular a chegada, ou a chegada desejada, para calcular a saída. Sem nenhuma das duas, pergunte e pare. A viagem, o cronograma e o veículo vêm do mapeamento de dados do projeto, e se o veículo ou o cronograma não estiverem no workspace conectado, pare.

### Passo 2

Leia o histórico do mesmo trecho, no mesmo sentido: os marcos de saída, parada e chegada do cronograma das viagens concluídas e as leituras do computador de bordo na página do veículo. Prefira o tempo medido de saída a chegada. O computador de bordo conta só o tempo com o motor ligado, então as paradas com o motor desligado ficam de fora e entram depois.

### Passo 3

Calcule a duração corrida base pela mediana dos trechos. O pior caso é o maior tempo observado. Com menos de três trechos, diga que a amostra é pequena e use a base somada à `Folga mínima em minutos` como pior caso. Some as paradas fixas pela duração observada de cada uma, como abastecer, pedágio sem tag e café. Parada sem observação fica como lacuna nomeada, sem hora inventada.

### Passo 4

Confira se o trecho exige abastecer, pelo consumo e pela autonomia do veículo nas leituras. Com a saída dada, a chegada de cada cenário é a saída mais a duração corrida. Com a chegada desejada, a saída é a chegada menos a duração corrida. Mostre a base, a base com folga e o pior caso, cada um com a hora calculada e a margem para a janela do compromisso.

### Passo 5

Recomende a faixa e deixe a escolha com a pessoa. Se a margem do cenário base for menor que a folga, diga isso na primeira linha da resposta. A escolha da saída e o cronograma da viagem seguem `definir-viagem`. A data sai com o dia da semana, calculado como a regra do dia da semana manda.

### Passo 6

Ao fim de cada trecho, peça a hora de saída, as paradas, com local, duração e motivo, e a hora de chegada. Grave no cronograma uma linha por saída, por parada e por chegada, seguindo `definir-viagem`. A leitura do computador de bordo vai na página do veículo, seguindo `acompanhar-veiculo`. Não invente hora.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Computador de bordo como tempo total

Se você usar o tempo do computador de bordo como duração da viagem, a previsão sai curta e a pessoa chega depois do que foi dito.

1. Use o tempo medido de saída a chegada quando houver.
2. Some as paradas com o motor desligado ao tempo do computador de bordo.
3. Diga qual das duas fontes sustentou a base.

### Amostra pequena sem aviso

Se você apresentar a previsão de um ou dois trechos como se fosse média, a pessoa confia em um número que quase não tem dado.

1. Diga quantos trechos sustentam a previsão.
2. Com menos de três, use a folga como pior caso.
3. Peça os horários do próximo trecho para a amostra crescer.

### Saída escolhida pela skill

Se você decidir a saída pela pessoa, a viagem passa a seguir um horário que ela não escolheu.

1. Mostre os cenários e a margem.
2. Recomende uma faixa.
3. Registre a escolha dela por `definir-viagem`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a que horas sair para chegar às 15h de sábado? E se a gente sair às 10h, quando chega?

O histórico tinha dois trechos do mesmo sentido, de 9h40 e 9h54 de tempo de viagem. A previsão base ficou em 9h54 corridos, e a saída para chegar às 15h, às 5h06. Com 60 minutos de folga, a saída foi às 4h06. Avisei que a amostra era pequena. Para a saída às 10h, a chegada ficou às 19h54 no cenário base e às 21h com a folga, e mostrei a margem para a janela. A recomendação foi a faixa das 4h às 5h, e a escolha ficou com a pessoa.

## Casos-limite

- Sem histórico do trecho: não invente. Diga que a previsão não tem base e peça uma estimativa da pessoa, marcada como estimativa.
- O sentido do histórico é o oposto: use só como referência e diga isso.
- Várias paradas sem duração: some as que têm e nomeie as que faltam.
- A chegada desejada, ou a calculada, cai depois do fim da janela: avise antes de seguir.
- O pedido é só cadastrar a viagem: siga `definir-viagem`.

## Pegadinhas

- O computador de bordo parece o tempo da viagem. Ele conta só com o motor ligado, e as paradas ficam de fora.
- A velocidade média parece servir para qualquer trecho. Ela mistura trecho livre e fila: use o tempo do mesmo trecho.
- A tag de pedágio inativa parece só detalhe de custo. A cabine manual acrescenta tempo a cada pedágio.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
