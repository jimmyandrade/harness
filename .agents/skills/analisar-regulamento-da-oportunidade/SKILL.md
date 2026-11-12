---
name: analisar-regulamento-da-oportunidade
description: Lê o manual, o regulamento, o edital e o contrato de uma oportunidade e separa o que a empresa deve fazer, com prazo, o que o texto não diz e o que as fontes contradizem. Usada quando chega o manual da oportunidade aprovada. NÃO serve para perguntar ao responsável, redigir a tarefa nem organizar a viagem.
metadata:
  author: jimmyandrade
  version: "0.1.6"
  related:
    - acompanhar-edital
    - consultar-responsavel-pela-oportunidade
    - definir-grupo-de-oportunidades
    - definir-tarefa
    - definir-viagem
    - evoluir-habilidade
    - organizar-ponto-de-contato
    - procurar-tarefa
---

# Analisar regulamento da oportunidade

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
"Formato da data com dia da semana": "terça-feira, 01/09/2026"
# `Contrato com o responsável` é `obrigatório` ou `não exigido`. `obrigatório` confere o contrato da participação no Passo 5.
"Contrato com o responsável": "não exigido"
# `Cláusulas do contrato` lista o que o contrato com o responsável pela oportunidade precisa tratar, como o local do estande no mapa aprovado.
"Cláusulas do contrato": []
# `Material para validar com o responsável` lista o que a empresa manda a ele para validar, como o PDF da expografia.
"Material para validar com o responsável": []
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Reúna as fontes da oportunidade: o manual, o regulamento ou o edital, o contrato, os e-mails e as mensagens da organização, incluindo as de grupo, e as notas do grupo de oportunidades. A página da oportunidade e a do ponto de contato vêm do mapeamento de dados do projeto.
Sem o texto, peça à pessoa e pare.
O manual traz a edição, a data e o local no cabeçalho: registre-os e diga à pessoa que ela confirma se o manual vale só para esta oportunidade ou para o grupo inteiro.

### Passo 2

Liste cada exigência: o que a empresa deve fazer, enviar, levar, pagar ou não fazer.
Cada exigência diz o prazo, quem cumpre e a fonte, com a página.
Formulário, cadastro de pessoas e de veículo, necessidade de energia, cardápio e pagamento são exigências com prazo, mesmo quando chegam como aviso no meio de um grupo.
Prazo relativo, como sete dias úteis antes, vira data: conte no calendário, com os feriados, e escreva no `Formato da data com dia da semana`, nunca de cabeça.
O prazo que já passou fica marcado como vencido, com a data de hoje.

### Passo 3

Liste cada lacuna: o que a logística da empresa precisa saber e o texto não responde.
Confira, no mínimo, o acesso e o horário de chegada na montagem e na desmontagem, a entrada de veículo, a carga e a descarga, a energia, o mapa do espaço e o que acontece se algo atrasar.
Cada lacuna vira uma pergunta curta e o motivo pelo qual importa.
Não preencha a lacuna por suposição: o que o texto não diz é pergunta, não hipótese.
Perguntar ao responsável segue `consultar-responsavel-pela-oportunidade`, não esta habilidade.

### Passo 4

Liste cada conflito: dado que as fontes dão diferente, como o endereço, o horário ou o nome do bairro.
Mostre as duas fontes lado a lado e não escolha.
A mensagem mais recente da organização costuma valer sobre o manual, mas as duas ficam na lista.

### Passo 5

Com `Contrato com o responsável` em `obrigatório`, confira se o contrato trata cada item de `Cláusulas do contrato` e cada lição das notas do grupo de oportunidades, com a consequência se o responsável descumprir.
Liste o que falta como pendência, para pedir a ele. Não redija o contrato.
Com `Material para validar com o responsável` preenchido, confira se cada item foi enviado e validado e liste o que falta.
Sem o e-mail do responsável, a pendência inclui pedi-lo.
Não gere o material aqui.

### Passo 6

Entregue três listas, nesta ordem: exigências, lacunas e conflitos.
Cada exigência com prazo vira tarefa no mesmo turno: confira antes com `procurar-tarefa` e crie com `definir-tarefa`.
Pergunte quem responde por cada uma. Não preencha responsável nem prazo que a pessoa não disse.
Item que o formulário oferece para alugar, como mesa, balcão ou cadeira, e que a empresa leva por conta própria, não se aluga: a resposta é que não precisa, e o item entra no checklist de coisas a levar para a oportunidade, como tarefa com a definição de concluído em itens. Item pago só se escolhe com o sim da pessoa.
Antes de cada prazo, avise a pessoa com o link da exigência, como o do formulário.
Exigência vencida: diga isso na hora e proponha cumpri-la agora ou perguntar se ainda é aceita.
O responsável pela marca é a pessoa dona da empresa do negócio. Leia o nome e o apelido no cadastro de pessoas, e o nome da marca, o telefone, o WhatsApp e o e-mail no cadastro da empresa, e preencha o formulário com eles sem perguntar à pessoa. Com mais de uma dona, pergunte qual responde.
O contato de uma inscrição é sempre o da empresa, nunca o telefone nem o e-mail pessoal de um sócio, mesmo quando o campo é do responsável. Sem o contato da empresa no cadastro, pare e peça, e não complete com o da pessoa.
Preencha o formulário numa aba da sessão. Se a pessoa arrastar a aba dela para o grupo e o contexto de abas disser que o grupo não existe, peça o contexto criando o grupo antes de dar a aba por perdida: ela pode aparecer nele.
O Google Formulários guarda o rascunho na conta: reabrir o link mostra o que já foi preenchido, inclusive os documentos que a pessoa digitou.
Ao preencher um formulário, leia a dica e a mensagem de erro de cada campo e escreva no formato que ele valida, como um telefone só com os dígitos e o DDD, sem o código do país nem pontuação.
Confira cada campo depois de preencher e não avance com erro na tela. O envio segue o sim da pessoa.
Dado de identidade que a exigência pede, como RG e CPF, a pessoa digita. O agente não o digita, mesmo que ele esteja no cadastro.
Diga em qual página do cadastro cada dado está, com o link, e o que o cadastro não tem, sem perguntar o que já está lá. O dado que falta vira recomendação de campo, sem criá-lo.

### Passo 7

Leia também a janela de montagem e avise a pessoa na hora com o dia e o horário de cada uma, em especial a do dia anterior ao evento, porque ela muda a saída. O planejamento da saída segue `definir-viagem`.
Leia as lições nas notas do grupo de oportunidades e liste as que valem para esta participação.
O que o texto não trazia e a análise ensinou vira lição nas notas do grupo, por `definir-grupo-de-oportunidades`.

### Passo 8

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Formulário lido como aviso

Se você ler o formulário com prazo como mais uma mensagem do grupo, o prazo passa e a marca fica sem acesso de veículo, de energia ou de pessoas.

1. Liste cada formulário e cada prazo no começo, como o Passo 2 manda.
2. Crie a tarefa com prazo e responsável no mesmo turno.
3. Avise antes do prazo. Vencido, cumpra agora ou pergunte se ainda aceitam.

### Prazo contado de cabeça

Se você contar sete dias úteis sem o calendário, o prazo cai num feriado ou num fim de semana e a conta erra.

1. Conte no calendário, com os feriados do local.
2. Escreva a data com o dia da semana.
3. Dúvida sobre feriado: pergunte, em vez de arredondar.

### Lacuna preenchida por suposição

Se você supor que o carro entra na desmontagem porque entrou na montagem, a pessoa chega e é barrada.

1. Marque como lacuna o que o texto não diz.
2. Entregue a pergunta a `consultar-responsavel-pela-oportunidade`.
3. Só trate como resposta o que o responsável escreveu.

### Manual de outra edição

Se você usar o manual de uma edição ou de outro local como regra desta, as exigências e os horários não valem.

1. Leia a edição, a data e o local no cabeçalho.
2. Diga à pessoa de qual manual saiu cada exigência.
3. Peça a ela que confirme se o manual vale para o grupo inteiro.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a organização mandou o manual do expositor da feira de domingo, e o formulário de cadastro tinha prazo vencido

Li o manual e o grupo e entreguei as três listas. O cadastro de expositores e do veículo apareceu como exigência vencida, e criei a tarefa. O acesso do carro na desmontagem apareceu como lacuna, com a pergunta pronta. Os 7 dias úteis para informar a energia viraram a data, já vencida, com o dia da semana.

### o manual diz que a montagem é no domingo e uma mensagem do grupo oferece o sábado

As duas janelas entraram na lista de conflitos, lado a lado. Avisei a pessoa do dia e do horário de cada uma, porque a do sábado muda a saída da viagem.

## Casos-limite

- O texto é só um e-mail curto, sem manual: liste o que ele pede e o que falta, sem inventar seções.
- A oportunidade é um edital: as exigências são as regras da seleção. O resultado e as datas do edital seguem `acompanhar-edital`.
- O manual está só como imagem ou PDF escaneado: leia o texto da imagem e diga que a leitura pode ter falha.
- A pessoa quer a tarefa já escrita: o título, o prazo e a definição de concluído seguem `definir-tarefa`.
- O contrato não existe ainda: liste a pendência de pedi-lo ao responsável.

## Pegadinhas

- A aba arrastada pela pessoa parece perdida quando o grupo da sessão some do contexto. O preenchimento fica salvo como rascunho no formulário, e recriar o grupo pode trazer a aba de volta.
- O telefone do responsável pela marca parece ser o da pessoa. Numa inscrição, o contato é o da empresa, e o do sócio fica no cadastro dele.
- O campo de telefone parece aceitar qualquer formato legível. O formulário pode validar só os dígitos com o DDD e recusar o código do país, os parênteses e o hífen, e a mensagem de erro só aparece depois de preenchido.
- O manual de uma feira parece servir a todas as edições do mesmo grupo. O cabeçalho pode trazer o mês e o local de uma só.
- O aviso de grupo parece só comunicado. O formulário com prazo está nele.
- A mensagem mais recente da organização parece anular o manual. As duas ficam na lista, e a pessoa decide.
- O formulário pede RG e CPF do responsável. O agente não os digita.
- Sete dias úteis não são sete dias corridos: fim de semana e feriado não contam.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
