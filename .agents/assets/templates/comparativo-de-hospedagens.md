---
name: comparativo-de-hospedagens
description: Formato do comparativo entre hospedagens candidatas, com uma coluna por candidata, as linhas de preço, cama, comodidades, estacionamento, avaliação, risco, anfitrião, distância e o que falta, e a leitura final.
metadata:
  version: "0.1.0"
---

## Contexto

Use este modelo quando duas ou mais candidatas seguem vivas e a pessoa precisa decidir. A habilidade `definir-hospedagem` lê este modelo quando monta a saída. A tabela ajuda a equilibrar preço, distância e avaliação, e deixa à vista o que ainda falta confirmar.

## Formato

Uma tabela com uma coluna por candidata, cada nome como link com as datas da viagem e o número de hóspedes, e estas linhas:

| Linha | O que entra |
|---|---|
| Total do período | o total que a página do anúncio mostra para as datas e os hóspedes, com a diária média; com desconto, o total e o preço original, como "R$ 1.130, de R$ 1.288", e se a plataforma mostra taxas separadas; nunca só um dos dois valores |
| Cama | o tipo de cama; queen ou king vale como casal |
| Ar-condicionado | se tem e onde, ou o que há no lugar |
| Estacionamento | gratuito ou pago, no prédio ou fora, e o horário quando se sabe |
| Nota | a nota e o número de avaliações, com a faixa de estrelas |
| Piores avaliações | o que as mais baixas dizem, lidas inteiras |
| Barulho e outras sensibilidades | o que a pessoa que viaja não tolera, lido no cadastro dela |
| Anfitrião | o nome do perfil, os anos, a resposta dele às avaliações baixas |
| Distância até o compromisso | em km, dizendo se é medida pelo endereço ou estimada |
| Falta confirmar | o que só o anfitrião responde |

Depois da tabela, a leitura em poucas frases: a candidata à frente nos "deve ter", o que cada uma custa a mais ou a menos, e o risco de cada uma. Termine com a pergunta da decisão.

## Estilo

Tabela enxuta e leitura em frases curtas, sem opinião sem fonte. Cada link leva as datas da viagem. O que não se mediu é dito como estimativa.
