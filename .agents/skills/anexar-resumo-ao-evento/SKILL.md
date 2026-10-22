---
name: anexar-resumo-ao-evento
description: Anexa um resumo ou trecho do que foi discutido à descrição de um evento que já existe na agenda, só depois da confirmação da pessoa e sem sobrescrever o que já estava escrito. Usada quando um registro de reunião ou uma conversa vira um resumo para o evento correspondente. Não serve para criar o evento, achar a reunião nem escrever a ata.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  notion: "false"
  related:
    - definir-agenda
    - evoluir-habilidade
    - procurar-agenda
---

# Anexar resumo ao evento

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra.

```yaml
"Confirmar antes de escrever na descrição": "sim"
"Título da seção de resumo": "Resumo da reunião"
"Modo de aprendizado": "perguntar"
```

`Confirmar antes de escrever na descrição` em `sim` exige a confirmação da pessoa para cada atualização. `Título da seção de resumo` é o cabeçalho da seção em que o resumo é anexado.

## Instruções

### Passo 1

Peça o resumo pronto e o evento, ou o horário aproximado dele. Sem resumo, pare: esta habilidade não escreve a ata.

### Passo 2

Ache o evento com `procurar-agenda`. Use só o necessário para identificá-lo, que é o título, o horário e o dia. Não busque nem mostre dado de outros participantes além disso. Se mais de um evento casa, liste e pergunte qual. Se nenhum casa, diga isso e pare. Não aproxime nem invente um evento.

### Passo 3

A descrição de um evento com convidados fica visível a outras pessoas. Com `Confirmar antes de escrever na descrição` em `sim`, mostre o texto exato que vai entrar e o evento de destino, e espere a confirmação da pessoa para aquela atualização. A confirmação de um evento não vale para outro.

### Passo 4

Leia a descrição atual do evento. Anexe o resumo ao que já existe, numa seção separada com o `Título da seção de resumo`, e grave com `definir-agenda`. Não sobrescreva, não resuma e não apague o que estava escrito. Leia o evento de volta e confirme que o texto antigo continua lá.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Descrição sobrescrita

Se você gravar o resumo no lugar da descrição, o que as outras pessoas já tinham escrito se perde.

1. Leia a descrição atual antes de gravar.
2. Anexe numa seção separada.
3. Releia o evento e confira o texto antigo.

### Escrita sem confirmação

Se você atualizar a descrição porque a pessoa pediu o resumo, o texto aparece para os convidados sem ela ter lido.

1. Mostre o texto exato e o evento.
2. Espere a confirmação daquele evento.

### Dado de outros participantes

Se você abrir os dados dos convidados para achar o evento, expõe o que não precisava.

1. Identifique o evento pelo título, pelo horário e pelo dia.
2. Não leia nem cite dado de quem não for necessário.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Coloque este resumo no evento de ontem às 15h

Achei um evento às 15h de ontem, "Planejamento do trimestre". Mostrei o texto do resumo e o evento, e você confirmou. Anexei numa seção "Resumo da reunião" abaixo da descrição que já existia, e conferi que o texto antigo continua lá.

### Coloque este resumo no evento da semana passada

Achei dois eventos que casam com a semana passada, "Revisão de metas" e "Planejamento". Listei os dois e perguntei qual. Não gravei nada.

## Casos-limite

- Nenhum evento casa: diga isso e pare.
- A descrição está vazia: a seção entra sozinha, com o título.
- Já existe uma seção com o mesmo título: pergunte se atualiza essa seção ou cria outra.
- A pessoa não é dona do evento e não pode editar: diga isso e entregue o texto para quem pode.
- O resumo traz assunto sensível: pergunte antes de colocar numa descrição visível.

## Pegadinhas

- A descrição de um evento com convidados parece privada. Todos os convidados a veem.
- Confirmar o texto parece confirmar o evento. A confirmação vale para aquele evento e para aquele texto.
- O editor da agenda pode trocar a formatação da descrição existente. Releia depois de gravar.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
