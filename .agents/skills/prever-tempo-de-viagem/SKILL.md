---
name: prever-tempo-de-viagem
description: Calcula a hora de saída de uma viagem de carro a partir da chegada desejada, pelo histórico do mesmo trecho, e mostra a margem para a janela do compromisso. Usada quando a pessoa pergunta a que horas sair ou quanto a viagem leva. NÃO serve para cadastrar a viagem, escolher a saída pela pessoa nem lançar despesa.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.0"
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

Peça a data e a hora de chegada desejadas, o trecho e a janela do compromisso, como a montagem de uma feira. Sem a chegada desejada, pergunte e pare. A viagem, o cronograma e o veículo vêm do mapeamento de dados do projeto, e se o veículo ou o cronograma não estiverem no workspace conectado, pare.

### Passo 2

Leia o histórico do mesmo trecho, no mesmo sentido: os marcos de saída, parada e chegada do cronograma das viagens concluídas e as leituras do computador de bordo na página do veículo. Prefira o tempo medido de saída a chegada. O computador de bordo conta só o tempo com o motor ligado, então as paradas com o motor desligado ficam de fora e entram depois.

### Passo 3

Calcule a duração corrida base pela mediana dos trechos. O pior caso é o maior tempo observado. Com menos de três trechos, diga que a amostra é pequena e use a base somada à `Folga mínima em minutos` como pior caso. Some as paradas fixas pela duração observada de cada uma, como abastecer, pedágio sem tag e café. Parada sem observação fica como lacuna nomeada, sem hora inventada.

### Passo 4

Confira se o trecho exige abastecer, pelo consumo e pela autonomia do veículo nas leituras. A saída para a chegada desejada é a chegada menos a duração corrida. Mostre a base, a base com folga e o pior caso, cada um com a hora de saída. Se a pessoa já tem uma saída planejada, mostre a chegada de cada cenário e a margem para a janela do compromisso.

### Passo 5

Recomende a faixa de saída e deixe a escolha com a pessoa. Se a margem do cenário base for menor que a folga, diga isso na primeira linha da resposta. A escolha da saída e o cronograma da viagem seguem `definir-viagem`. A data sai com o dia da semana.

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

### a que horas sair para chegar às 15h de sábado?

O histórico tinha dois trechos do mesmo sentido, de 9h40 e 9h54 de tempo de viagem. A previsão base ficou em 9h54 corridos, e a saída para chegar às 15h, às 5h06. Com 60 minutos de folga, a saída foi às 4h06. Avisei que a amostra era pequena. A recomendação foi a faixa das 4h às 5h, e a escolha ficou com a pessoa.

## Casos-limite

- Sem histórico do trecho: não invente. Diga que a previsão não tem base e peça uma estimativa da pessoa, marcada como estimativa.
- O sentido do histórico é o oposto: use só como referência e diga isso.
- Várias paradas sem duração: some as que têm e nomeie as que faltam.
- A chegada desejada é depois do fim da janela: avise antes de calcular.
- O pedido é só cadastrar a viagem: siga `definir-viagem`.

## Pegadinhas

- O computador de bordo parece o tempo da viagem. Ele conta só com o motor ligado, e as paradas ficam de fora.
- A velocidade média parece servir para qualquer trecho. Ela mistura trecho livre e fila: use o tempo do mesmo trecho.
- A tag de pedágio inativa parece só detalhe de custo. A cabine manual acrescenta tempo a cada pedágio.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
