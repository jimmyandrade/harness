---
name: definir-janela-de-contato
description: Use essa habilidade sempre que for gravar a janela de contato de uma pessoa, os dias de descanso e os horários sem contato, ou conferi-la antes de enviar uma mensagem, um e-mail ou um convite, mesmo sem dizer janela. NÃO use para cadastrar a pessoa, redigir a mensagem nem escolher o canal.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-pessoa
    - evoluir-habilidade
---

# Definir janela de contato

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Modo de aprendizado": "perguntar"
# Globais: os nomes das propriedades da lista de pessoas que guardam a janela de contato. Vazio não impõe regra.
"Dias sem contato": ""
"Sem contato a partir de": ""
"Sem contato até": ""
```

## Instruções

### Passo 1

A janela de contato é quando a pessoa não deve ser contatada: dias de descanso e o horário a partir do qual, ou até o qual, não há contato. Ela vai nas propriedades que os parâmetros nomeiam, nunca nas observações, com cada horário como o texto `HH:MM` de 24 horas, como `19:00`. Grave só o campo informado.
Sem a propriedade na lista, ou com o parâmetro vazio, avise, proponha criá-la e diga a janela na resposta. Não crie a propriedade sem o sim.

### Passo 2

Quem contata a pessoa confere a janela antes de enviar e de novo na hora do envio: leia as três propriedades no registro, e em grupo as de cada pessoa nomeada. Leia o dia e a hora no fuso da localidade dela por comando, como `TZ=<fuso> date '+%Y-%m-%d %H:%M'`, com o dia da semana como a regra do dia da semana manda. Sem fuso e com janela preenchida, não envie e pergunte uma vez.
Está bloqueado o dia sem contato, a hora igual ou depois de `Sem contato a partir de` e a hora antes de `Sem contato até`, que já é permitida. Fora da janela nada sai, por nenhum canal: diga o motivo e o próximo horário permitido, com o dia da semana, no fuso dela e no de quem usa, e deixe o rascunho para esse horário. A janela só muda no registro.

### Passo 3

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Envio sem conferir a janela

Se você enviar a mensagem sem conferir a janela, ou conferir só ao rascunhar, a pessoa recebe no dia de descanso ou fora do horário.

1. Leia as três propriedades no registro antes do envio e de novo na hora do envio.
2. Em grupo, leia as de cada pessoa nomeada.
3. Fora da janela nada sai, por nenhum canal.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### cadastre a Ana, que não deve ser contatada na segunda e na terça nem a partir das 19h

Gravei os dias nas propriedades que os parâmetros nomeiam e o horário `19:00` em texto de 24 horas. Não escrevi a janela nas observações e mudei só os campos informados.

## Casos-limite

- A propriedade não existe na lista, ou o parâmetro está vazio: avise, proponha criá-la e diga a janela na resposta. Não crie sem o sim.
- A pessoa tem janela preenchida e não tem fuso: não envie e pergunte uma vez.
- A hora é igual a `Sem contato a partir de`: está bloqueada. A hora igual a `Sem contato até` já é permitida.

## Pegadinhas

- A janela parece uma observação da pessoa. Ela vai nas propriedades que os parâmetros nomeiam, e as observações não a recebem.
- O horário parece texto livre. Ele é `HH:MM` de 24 horas.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
