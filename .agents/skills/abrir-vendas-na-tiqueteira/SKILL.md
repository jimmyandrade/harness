---
name: abrir-vendas-na-tiqueteira
description: Abre a venda antecipada de um evento na tiqueteira dele. Acha as datas sem venda aberta, duplica o evento-modelo, ajusta ingressos e virada de lote, publica e grava o link no evento. Usada quando um show precisa de link de ingressos ou um lote novo não vende. Não serve para a venda na porta, criar o evento no banco nem definir preço e quantidade.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-lote-de-ingresso
    - evoluir-habilidade
---

# Abrir vendas na tiqueteira

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Nome do data source de eventos": ""
"Nome do data source de produtos": ""
"Nome do data source de tiqueteiras": ""
# `Campos do evento` liga cada papel ao nome da propriedade no banco de eventos. `local` é a cidade, a praça ou a casa do evento.
"Campos do evento":
  "nome": ""
  "data": ""
  "status": ""
  "link de ingressos": ""
  "produto": ""
  "local": ""
  "tiqueteira": ""
"Campos do produto":
  "nome": ""
  "antecedência da campanha": ""
# `Campos da tiqueteira` liga cada papel ao nome da propriedade no banco de tiqueteiras. `painel` é onde a tiqueteira cria eventos e lotes, e `passo a passo` é o artigo com os detalhes de tela dela.
"Campos da tiqueteira":
  "nome": ""
  "painel": ""
  "passo a passo": ""
# `Tiqueteira padrão` é a tiqueteira sugerida quando o evento não tem uma. Ela não é gravada sem o sim da pessoa.
"Tiqueteira padrão": ""
"Status que pedem venda aberta": []
"Status do evento com vendas abertas": ""
# `Término da janela de venda` é quando cada lote para de vender, como `dia do evento, às 23:59`.
"Término da janela de venda": ""
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Procure no workspace conectado os data sources de eventos, de produtos e de tiqueteiras dos parâmetros e use-os sem perguntar.
Se algum parâmetro estiver vazio, pergunte uma vez e pare.
Não use um banco de outro workspace.

### Passo 2

Liste os eventos de hoje em diante com `status` em `Status que pedem venda aberta`: `nome`, `data`, `status`, `link de ingressos` e `tiqueteira`.
Evento sem `tiqueteira`: peça para a pessoa preencher o campo e sugira `Tiqueteira padrão`. Não grave a tiqueteira sozinho e não siga com esse evento.
Abra o `painel` de cada tiqueteira e leia a lista de eventos até o fim, com o ID e a data de cada um.
Cada evento do banco sem evento correspondente na tiqueteira é um bloqueio.
Ordene os bloqueios pela folga até o fim da `antecedência da campanha` do `produto` do evento: quem já passou do prazo vem primeiro.
Não grave o número de dias no texto: ele vem do produto.

Evento sem contrato, sem casa ou sem atração definida não é tarefa de venda.
Separe numa lista à parte e devolva a quem fecha o contrato.

### Passo 3

Leia o `passo a passo` da tiqueteira antes de mexer no painel. Os detalhes de tela ficam nele, não aqui.

Crie o evento duplicando o evento-modelo: o mais recente do mesmo `produto` no mesmo `local`, na mesma tiqueteira.
Informe a data e a hora novas, corrija o nome, a casa, o endereço e a descrição, e mantenha o evento privado.
Quando a descrição ou a capa citam algo só da edição anterior, como uma atração, reescreva a descrição e deixe o evento privado até a capa nova chegar.

### Passo 4

Confira cada ingresso do evento novo.
A janela de venda abre na data combinada e termina no `Término da janela de venda`.
Valor, quantidade, grupos e cortesias vêm da edição mais recente do mesmo `produto` no mesmo `local`, não da memória nem de uma tabela antiga.
No grupo de lotes em sequência, só o primeiro lote abre pela data.
Cada lote seguinte vira só a partir do anterior e termina no `Término da janela de venda`.
Cortesias nunca entram na virada.
Para os lotes no banco de lotes, siga `definir-lote-de-ingresso`.

### Passo 5

Monte o plano, item por item: o evento, cada ingresso com janela, valor, quantidade e virada, os lotes no banco e a publicação.
Execute cada item só com o sim de quem pediu.
Depois de publicar, abra o link público e confira a data e os lotes.

### Passo 6

Grave no evento o `link de ingressos` e mude o `status` para `Status do evento com vendas abertas`.
Devolva uma linha por evento: data, produto, local, tiqueteira, link e ID na tiqueteira.
Se a atração já recebeu o material com outro link, avise que o link mudou.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Lote que não vende depois da duplicação

Se você duplicar e publicar sem abrir cada ingresso, os lotes ficam com a janela do evento-modelo, que já terminou, e nada vende.

1. Abra cada ingresso antes de publicar.
2. Ajuste o início e o término.

### Virada perdida na duplicação

Se você confiar que a duplicação trouxe a virada de lote, os lotes seguintes podem vir sem lote anterior marcado e nunca abrir.

1. Abra cada lote seguinte.
2. Marque só o anterior e salve o ingresso, conforme o `passo a passo` da tiqueteira.

### Edição anterior na página de venda

Se você publicar sem trocar a descrição e a capa, a página de venda mostra a atração da edição anterior.

1. Reescreva a descrição.
2. Deixe o evento privado até a capa nova chegar.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### quais shows estão sem venda aberta?

Duas datas estão com data confirmada no banco e sem evento na tiqueteira delas. Uma já passou da antecedência da campanha do produto e vem primeiro. Uma data está sem contrato e foi para a lista de quem fecha o contrato.

### os lotes do evento novo não abrem

O evento foi duplicado e os lotes 2 a 5 vieram sem virada. O plano marca em cada um só o lote anterior e salva o ingresso. Nada foi salvo antes do sim.

## Casos-limite

- A duplicação não confirma: a conta não tem permissão para criar evento. Peça a quem tem, ou crie o evento do zero e diga isso.
- O lote está vendendo: mudar preço ou janela gera atendimento e estorno. Avise antes e peça o sim.
- O produto não tem antecedência preenchida: liste o evento sem ordenar e diga o que falta no produto.
- A tiqueteira não tem `passo a passo`: diga isso e siga com cuidado redobrado em cada tela.

## Pegadinhas

- O painel da tiqueteira pode pedir login e verificação em duas etapas. A pessoa entra e digita o código. A IA nunca digita senha nem código.
- O valor cadastrado na tiqueteira segue a regra de taxa dela. O lote no banco segue `Valor inclui a taxa` da `definir-lote-de-ingresso`, que pode ser outra.
- Fechar a janela da virada sem salvar o ingresso não grava a virada.
- O artigo de passo a passo é para pessoas. Não o edite como se fosse uma skill.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
