---
name: garantir-ingresso
description: Garante o ingresso de um evento na tiqueteira, grátis ou pago, pela integração ou pelo navegador. Usada quando a pessoa pede para se inscrever, tirar ou comprar o ingresso. NÃO serve para abrir vendas, curso, edital nem só registrar a inscrição.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.7.0"
  aliases:
    - fazer-inscricao
  related:
    - procurar-agenda
    - definir-agenda
    - procurar-oportunidade
    - definir-inscricao
    - definir-pessoa
    - definir-empresa
    - redigir-com-tom-de-voz
    - abrir-vendas-na-tiqueteira
    - evoluir-habilidade
---

# Garantir ingresso

## Parâmetros de configuração

```yaml
# `Sem integração` é o que fazer quando a plataforma não tem conector, MCP, CLI nem API para quem compra: `perguntar` oferece o navegador ou a inscrição feita pela pessoa, com o comprovante; `navegador` segue direto pelo navegador.
"Sem integração": "perguntar"
# `Aceite de termos obrigatórios` e `Aceite de termos opcionais` são `automático`, que deixa a IA decidir pelo Passo 5; `perguntar`, que pergunta cada termo; ou `aceitar`, que aceita sem perguntar e não é recomendado.
"Aceite de termos obrigatórios": "automático"
"Aceite de termos opcionais": "perguntar"
# `CNPJ na inscrição da empresa` é `perguntar`, `preencher`, com o CNPJ do cadastro da empresa, ou `não preencher`.
"CNPJ na inscrição da empresa": "perguntar"
# `Avisar quem se apresenta` é `perguntar`, que oferece avisar a palestrante, a facilitadora ou a atração que a pessoa vai, ou `não`.
"Avisar quem se apresenta": "perguntar"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Ache a edição com `procurar-oportunidade` e leia o cronograma dela, quando houver. O link do ingresso vem da edição.

Antes do navegador, procure uma integração da plataforma para quem compra: conector, MCP, CLI ou API. A API de uma tiqueteira costuma servir só a quem organiza o evento, para ler pedidos e participantes e fazer check-in.

```mermaid
flowchart LR
  A{Há integração para quem compra?} -->|sim| B[Use a integração]
  A -->|não| C{Sem integração}
  C -->|perguntar| D[Ofereça o navegador ou a inscrição feita pela pessoa]
  C -->|navegador| E[Siga pelo navegador aberto]
```

Quando a pessoa prefere se inscrever sozinha, peça o print ou o e-mail do pedido e siga para `definir-inscricao`.

### Passo 2

Leia a descrição do evento e a página de programação antes de escolher o ingresso.

```mermaid
flowchart LR
  A{A atividade tem ingresso próprio?} -->|sim| B[Escolha o ingresso da atividade]
  A -->|não, ingresso por dia| C{A fonte diz a regra da sala?}
  C -->|sim| D[Escolha o ingresso do dia e avise a regra]
  C -->|não| F[Pergunte à organização]
```

Quando a sala é por ordem de chegada, diga a sala, o andar, o horário, a lotação e a hora do credenciamento.

Quando nem a página, nem o e-mail, nem a conversa no WhatsApp dizem como se entra na atividade, redija a pergunta à organização com `redigir-com-tom-de-voz`. Envie só com o sim da pessoa.

### Passo 3

Confira o login na tiqueteira. Sem login, peça a credencial ao gerenciador de senhas conectado e preencha com ele; sem gerenciador, ou com o preenchimento falhando, peça que a pessoa entre na conta no navegador e espere o aviso.

A pessoa titular da conta é a participante: confirme o nome que o checkout mostra. Sem a quantidade, peça um ingresso no nome da conta e diga que dá para acrescentar outros.

### Passo 4

Preencha todo campo do checkout, obrigatório ou opcional, que o cadastro responde: o da pessoa titular, lido por `definir-pessoa`, e o da empresa, lido por `definir-empresa`. A tabela liga cada campo já visto à fonte dele.

| Campo do checkout | Fonte |
| --- | --- |
| Nome, e-mail, CPF e telefone | Conta da tiqueteira, conferida com o cadastro da pessoa |
| CEP, rua, número, complemento, bairro, cidade e estado | Endereço do cadastro da pessoa |
| CNPJ | Cadastro da empresa, conforme `CNPJ na inscrição da empresa` |
| Nome da empresa | Cadastro da empresa |
| Segmento | Atividade da empresa no cadastro |
| Necessidade de acessibilidade | Cadastro da pessoa; sem registro, fica vazio |

Um campo que nenhum cadastro responde vira pergunta, e um campo fora da tabela entra nela ao final. Quando o agente não pode digitar um documento, ele pede que a pessoa preencha esse campo.

Confira se o checkout mostra um prazo de reserva. Com prazo, junte numa mensagem só os campos que o cadastro não respondeu e os termos que pedem o sim.

### Passo 5

Leia cada termo e veja se ele é obrigatório. O obrigatório segue `Aceite de termos obrigatórios`, e o opcional segue `Aceite de termos opcionais`. Em `perguntar`, resuma o termo e espere a resposta.

Em `automático`, é sensível o termo que cede imagem ou voz, usa os dados além do evento, como marketing ou compartilhamento, ou gera cobrança. O obrigatório sensível espera o sim, e o resto se aceita. O opcional sensível fica desmarcado, e o que só serve à pessoa, como certificado ou lembrete do evento, se marca. Cada decisão entra no relatório.

No ingresso pago, mostre o item, o valor total e o meio de pagamento e espere o sim. Os dados do cartão ficam com a pessoa.

### Passo 6

Finalize. Feche o pop-up de prêmio, cashback ou publicidade sem clicar na oferta e confira que ele sumiu.

Guarde o print da tela do pedido confirmado com o pop-up e, depois de fechá-lo, o print sem ele, com o número e o status. Se o pop-up não fechar, fica só o print com ele, e o relatório diz isso.

Passe o pedido a `definir-inscricao`, com o print, a hora do envio e o status que a tela mostrou. Atualize a linha da atividade no cronograma.

Confira com `procurar-agenda` se a atividade já está na agenda no dia e no horário dela, inclusive o evento que a tiqueteira ou o Gmail criam sozinhos a partir do e-mail de confirmação, que pode ter outro título. Data, horário e local vêm do e-mail de confirmação da tiqueteira e da oportunidade e do cronograma no Notion. Só se faltar, crie com `definir-agenda`, com os links da oportunidade e da inscrição. Avise o compromisso que bate com o horário, com quem é, o canal para remarcar e onde ele foi registrado, lido no evento, na negociação, nas reuniões e nas conversas. Sem canal registrado, diga isso e, se o compromisso veio de uma ligação, peça o número a quem atendeu, como manda `definir-agenda`.

### Passo 7

Quando quem se apresenta na atividade está no cadastro de `definir-pessoa`, siga `Avisar quem se apresenta`. Em `perguntar`, procure antes nas conversas e no e-mail se o aviso já saiu.

Sem aviso, ofereça avisar que a pessoa vai prestigiar. Quando o convite veio de quem se apresenta, a mensagem agradece o convite e confirma a presença, e o registro da conversa diz quem convidou. O aviso vai pelo canal do cadastro, como WhatsApp, perfil social ou e-mail. A mensagem passa por `redigir-com-tom-de-voz` e sai só com o sim da pessoa ao texto e ao canal.

### Passo 8

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`. Cada campo do checkout que não estava na tabela do Passo 4 entra nela, com a fonte que respondeu.

## Problemas comuns

### Ingresso da atividade procurado à toa

Se você procurar um ingresso para a palestra num evento com ingresso por dia, a inscrição não sai ou sai no dia errado.

1. Leia a programação e a descrição.
2. Peça o ingresso do dia da atividade.
3. Diga a regra da sala, ou pergunte à organização quando nenhuma fonte diz.

### Reserva expirada

Se você perguntar um campo de cada vez num checkout com prazo, a reserva expira e o ingresso volta à venda.

1. Preencha primeiro o que o cadastro responde.
2. Junte numa mensagem só os campos que faltam e os termos que pedem o sim.

### Campo preenchido por um clique fora do lugar

Se você clicar por coordenada depois de a página rolar, o texto vai para outro campo e o checkout aponta campo obrigatório vazio.

1. Confira os valores dos campos depois de preencher.
2. Corrija o que ficou vazio ou trocado.

### Comprovante com publicidade

Se você guardar o print com o pop-up de prêmio aberto, o comprovante esconde o número e o status do pedido.

1. Feche o pop-up e confira que ele sumiu.
2. Guarde os dois prints, com e sem o pop-up. Quando ele não fecha, fica só o print com ele.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### faça a inscrição na palestra de segunda às 17h no Festival Rota Sul

A tiqueteira não tem integração para quem compra, e a pessoa escolheu o navegador. A programação diz que as salas lotam por ordem de chegada, então pedi o ingresso grátis de segunda-feira, 29/09/2026. O endereço veio do cadastro da titular, e o termo obrigatório de cessão de imagem esperou o sim. O pedido saiu confirmado e foi para `definir-inscricao`, com o print sem o pop-up.

### compre dois ingressos da primeira fila

Mostrei o item, o valor total e o cartão salvo na conta e esperei o sim antes de finalizar. Os dados do cartão ficaram com a pessoa.

## Casos-limite

- O checkout pede CAPTCHA: pare e peça que a pessoa resolva.
- A pessoa recusa um termo obrigatório: deixe o checkout sem finalizar e diga que a reserva pode expirar.
- A conta logada é de outra pessoa: diga o nome que aparece e pergunte antes de seguir.
- A inscrição é num curso ou num edital, sem ingresso: esta skill não cobre.

## Pegadinhas

- A API pública de uma tiqueteira parece servir para tirar ingresso. Ela costuma ser só de quem organiza, sem rota para criar pedido.
- O link "monte sua trilha" da programação parece a inscrição na atividade. Ele só monta uma lista para a pessoa.
- O checkout pede dados da pessoa titular da conta, e não da empresa, salvo o CNPJ.
- A tela de sucesso de algumas tiqueteiras abre com uma oferta de prêmio ou cashback. Ela é publicidade e não faz parte do pedido.
- Login, senha, código e dados de cartão são da pessoa. A IA nunca os digita.
- O e-mail de confirmação da tiqueteira parece pôr a atividade na agenda, ou parece nunca pôr. Às vezes a tiqueteira ou o Gmail criam o evento, às vezes não: confira antes de criar, para não duplicar.
- O pedido confirmado parece encerrar o trabalho. Quando a palestrante é conhecida, ela ainda não sabe que a pessoa vai: o aviso é o passo que falta.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
