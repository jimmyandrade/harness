---
name: registro-da-hospedagem
description: Formato do texto que fica no registro de uma hospedagem candidata ou usada, com o link com datas, o preço, a nota, as avaliações baixas lidas, o anfitrião, o que falta confirmar e o estado da triagem.
metadata:
  version: "0.1.0"
---

## Contexto

Use este modelo para o texto livre que acompanha a hospedagem no banco de dados, tanto a candidata de uma cotação quanto a que a pessoa usou. A habilidade `definir-hospedagem` lê este modelo quando grava o registro. O texto serve para a próxima busca não reler a plataforma.

## Formato

Em um parágrafo por tema, nesta ordem:

- Estado e data: <triagem, descartada com o motivo, em espera, aprovada, pedido de reserva enviado com o código, usada>, com a data.
- Link: <o link do anúncio com as datas e os hóspedes; sem datas quando a estadia já passou>.
- Preço e nota: <total do período, diária média, nota e número de avaliações, com a faixa de estrelas>.
- O que tem: <cama, ar-condicionado, estacionamento e o horário, e o que mais pesa para quem viaja>.
- Anfitrião: <nome, anos, o ID do perfil quando há, a resposta às avaliações baixas>.
- Avaliações baixas lidas: <data da leitura, o que cada uma diz, inteiras>.
- Distância: <em km até o compromisso, medida ou estimada>.
- Falta confirmar: <o que só o anfitrião responde>.

As propriedades da hospedagem ficam preenchidas: o check-in e o check-out com data e hora, os hóspedes, o anfitrião quando se sabe quem é, e o endereço.

## Estilo

Texto direto, em frases curtas, sem opinião sem fonte. Cada número leva a unidade. O que não se sabe fica em "Falta confirmar", e não se inventa.
