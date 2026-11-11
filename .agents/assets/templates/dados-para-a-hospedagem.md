---
name: dados-para-a-hospedagem
description: Formato do rascunho da resposta a uma hospedagem que pede dados dos hóspedes antes da chegada, com a conversa de destino, o que a hospedagem pediu, os dados por hóspede, o veículo e a pergunta que pede o sim.
metadata:
  version: "0.1.0"
---

## Contexto

Use este modelo para mostrar à pessoa, no chat, o rascunho da resposta a uma hospedagem, anfitrião de plataforma ou hotel, que pede dados antes da chegada. A habilidade `responder-pedido-da-hospedagem` lê este modelo quando monta o rascunho e decide, pelos parâmetros dela, o que entra.

## Formato

**Hospedagem:** <nome ou endereço da hospedagem, com o código da reserva>

**Canal:** <plataforma, e-mail ou WhatsApp em que a resposta vai>

**O que a hospedagem pediu:** <o pedido, em uma linha, com a data da mensagem>

**Hóspedes**

| Hóspede | Nome completo | Documento | Origem do dado |
| --- | --- | --- | --- |
| 1 | <nome> | <documento, ou "falta"> | <página do cadastro, ou "informado agora"> |
| 2 | <nome> | <documento, ou "falta"> | <página do cadastro, ou "informado agora"> |

**Veículo:** <marca, modelo, cor e placa, ou "não vai de carro">

**Chegada:** <dia e horário previstos, ou "falta">

**Dados que não entram:** <o que a hospedagem não pediu e fica de fora>

```
<texto exato da resposta, no tom da marca>
```

**Falta antes de enviar:** <lista do que a pessoa ainda precisa informar, ou "nada">

**Posso enviar?** <pergunta que pede o sim>

## Estilo

- Português do Brasil, em prosa curta, sem gíria.
- Nome completo como está no cadastro; documento e placa só com a confirmação da pessoa.
- O texto exato da resposta vai num bloco de código, para a pessoa copiar.
