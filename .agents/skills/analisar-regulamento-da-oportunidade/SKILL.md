---
name: analisar-regulamento-da-oportunidade
description: Lê o manual, o regulamento, o edital e o contrato de uma oportunidade e separa o que a empresa deve fazer, com prazo, o que o texto não diz e o que as fontes contradizem. Usada quando chega o manual da oportunidade aprovada. NÃO serve para perguntar ao responsável, redigir a tarefa, organizar a viagem nem escrever o projeto que a inscrição pede.
metadata:
  author: jimmyandrade
  version: "0.5.0"
  related:
    - acompanhar-edital
    - acompanhar-itens-do-ponto-de-contato
    - anexar-arquivo-no-notion
    - consultar-responsavel-pela-oportunidade
    - definir-grupo-de-oportunidades
    - definir-tarefa
    - definir-viagem
    - evoluir-habilidade
    - inscrever-na-oportunidade
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

Antes de reunir as fontes, confirme com a pessoa de qual feira ou oportunidade se trata quando o pedido não nomeia a edição, ou quando a pessoa citada, o grupo ou a data pode ligar-se a mais de uma. Diga qual você entendeu e espere a confirmação. Não use o que achou de uma para responder sobre outra, nem escolha a mais recente ou a mais conhecida.

Reúna as fontes da oportunidade: o manual, o regulamento ou o edital, o contrato, os e-mails e as mensagens da organização, incluindo as de grupo, e as notas do grupo de oportunidades. A página da oportunidade e a do ponto de contato vêm do mapeamento de dados do projeto.
Sem o texto, peça à pessoa e pare.

O contrato, ou outro documento que a pessoa vai assinar ou conferir, que você leu ou cita fica aberto para ela no navegador embutido do aplicativo, e não no Chrome dela, na primeira página ou no trecho citado.
Se ele só abre por um link pessoal com token, como o de uma assinatura eletrônica, abra só para ler: nunca clique em assinar, concluir nem enviar, e diga isso.
Se o navegador do aplicativo não o abrir, a resposta traz ao menos o link.

Toda oportunidade tem o edital e o manual anexados na própria página, nas propriedades de editais e anexos. Sem eles, procure nas fontes e diga à pessoa que faltam, também nas oportunidades antigas. Só libere a falta quando a pessoa der a justificativa de por que não existem ou não foram anexados. Sem justificativa, insista.

O arquivo que não sobe para o Notion não encerra o assunto. O arquivo local sobe como `anexar-arquivo-no-notion` manda. Diga à pessoa o erro exato e investigue a causa antes de dizer que não consegue, como o tamanho, o tipo ou o jeito de anexar. Não reclame do limite sem ter descoberto o porquê.
O manual traz a edição, a data e o local no cabeçalho: registre-os e diga à pessoa que ela confirma se o manual vale só para esta oportunidade ou para o grupo inteiro.

### Passo 2

Liste cada exigência: o que a empresa deve fazer, enviar, levar, pagar ou não fazer.
Cada exigência diz o prazo, quem cumpre e a fonte, com a página.
Formulário, cadastro de pessoas e de veículo, necessidade de energia, cardápio e pagamento são exigências com prazo, mesmo quando chegam como aviso no meio de um grupo.
Prazo relativo, como sete dias úteis antes, vira data: conte no calendário, com os feriados, e escreva no `Formato da data com dia da semana`, com o dia calculado pela regra do dia da semana.
O prazo que já passou fica marcado como vencido, com a data de hoje.
Quando a inscrição pede um projeto escrito, como justificativa, objetivos, orçamento ou cronograma, ele é uma exigência à parte: liste o prazo, o formato, o limite de tamanho e os critérios de avaliação, que são o que o projeto precisa atender.

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
A exigência de projeto escrito tem como responsável a produção cultural, o papel do agente `producao-cultural`: proponha-o e a pessoa confirma. A tarefa leva o regulamento lido, o prazo, o formato, o limite e os critérios. Esta habilidade não escreve o projeto, e `inscrever-na-oportunidade` só usa o texto que a produção cultural devolver.
Antes de cada prazo, avise a pessoa com o link da exigência, como o do formulário.
Exigência vencida: diga isso na hora e proponha cumpri-la agora ou perguntar se ainda é aceita.
Exigência que é um formulário ou cadastro da organização segue `inscrever-na-oportunidade`, e o que ela manda levar segue `acompanhar-itens-do-ponto-de-contato`.

Toda resposta que cita o contrato leva o link para abri-lo, o do e-mail ou o da plataforma de assinatura, em Markdown clicável, junto de cada cláusula citada, com o número da cláusula e o da página.

### Passo 7

Leia também a janela de montagem e avise a pessoa na hora com o dia e o horário de cada uma, em especial a do dia anterior ao evento, porque ela muda a saída. O planejamento da saída segue `definir-viagem`.
O conteúdo do manual fica no corpo da página da oportunidade, abaixo do callout, para ninguém precisar abrir o PDF de novo. Com transcrição de reunião na página, não a substitua: ponha as informações do manual na parte de anotações. O manual muito extenso pode ficar no corpo, mesmo quando o callout pede só propriedades; se o callout ou o modelo da oportunidade disser o contrário, proponha atualizá-los.

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
2. Calcule o dia da semana pela regra do dia da semana e escreva a data.
3. Dúvida sobre feriado: pergunte, em vez de arredondar.

### Lacuna preenchida por suposição

Se você supor que o carro entra na desmontagem porque entrou na montagem, a pessoa chega e é barrada.

1. Marque como lacuna o que o texto não diz.
2. Entregue a pergunta a `consultar-responsavel-pela-oportunidade`.
3. Só trate como resposta o que o responsável escreveu.

### Contrato citado sem link

Se você citar uma cláusula e não deixar o contrato aberto nem o link, a pessoa confere de memória ou procura o e-mail.

1. Abra o documento no navegador do aplicativo, só para ler.
2. Ponha o link clicável em toda resposta que o cita.
3. Cite cada cláusula com o número dela e o da página.

### Manual de outra edição

Se você usar o manual de uma edição ou de outro local como regra desta, as exigências e os horários não valem.

1. Confirme de qual oportunidade a pessoa fala antes de buscar. Leia a edição, a data e o local no cabeçalho.
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
- A inscrição pede um projeto escrito: ele vira exigência, com a tarefa para a produção cultural, e a análise não o escreve.
- O contrato não existe ainda: liste a pendência de pedi-lo ao responsável.

## Pegadinhas

- O manual de uma feira parece servir a todas as edições do mesmo grupo. O cabeçalho pode trazer o mês e o local de uma só.
- O aviso de grupo parece só comunicado. O formulário com prazo está nele.
- A mensagem mais recente da organização parece anular o manual. As duas ficam na lista, e a pessoa decide.
- Sete dias úteis não são sete dias corridos: fim de semana e feriado não contam.
- O edital parece só um formulário. Ele pode pedir um projeto escrito, com prazo próprio e outro responsável.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
