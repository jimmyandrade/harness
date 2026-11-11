---
name: definir-negociacao
description: Use essa habilidade sempre que for registrar uma conversa com empresa ou pessoa, por WhatsApp, e-mail ou reunião, inclusive a que você acabou de enviar, ou antes de perguntar algo que essa conversa já pode ter respondido, como data, horário, valor ou combinado, mesmo sem dizer negociação. NÃO use para achar o e-mail, gravar o evento na agenda, organizar o ponto de contato, redigir a mensagem, nem cadastrar a oportunidade.
allowed-tools: notion:notion-ai-search notion:notion-fetch notion:notion-query-data-sources notion:notion-get-comments notion:notion-create-comment notion:notion-create-pages notion:notion-update-page
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - definir-agenda
    - evoluir-habilidade
    - organizar-ponto-de-contato
    - procurar-email
    - redigir-com-tom-de-voz
    - sincronizar-cronograma
---

# Definir negociação

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global`. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
# Os nomes dos bancos e das propriedades que a habilidade usa.
"Banco de negociações": "Negociações e Cotações"
"Banco de pessoas": "Pessoas"
"Banco de empresas": "Empresas"
"Banco de cronograma": "Cronograma"
"Banco de inscrições": "Inscrições"
"Propriedade da empresa abordada": "Empresa abordada"
"Propriedade da pessoa abordada": "Pessoa abordada"
"Propriedade da oportunidade": "Oportunidade"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Conversa ligada a um negócio, como cotação, proposta, parceria ou venda, fica na página da negociação, no `Banco de negociações`. Conversa sem negócio, como convite, agradecimento ou networking, fica na discussão da página da pessoa, no `Banco de pessoas`, e na da empresa, no `Banco de empresas`, quando há uma. Não crie negociação para ela. Se o banco não estiver no workspace conectado, pare e peça.

```mermaid
flowchart LR
  Q{O pedido é?} -->|registrar troca de mensagem ou reunião| R[Passo 2]
  Q -->|pergunta sobre oportunidade, ponto de contato, viagem ou horário| C[Passo 4]
  Q -->|achar o e-mail| E[procurar-email]
  Q -->|gravar data ou horário no cronograma| S[sincronizar-cronograma]
  Q -->|evento com horário na agenda| A[definir-agenda]
  Q -->|planejar o ponto de contato| P[organizar-ponto-de-contato]
  Q -->|texto para a empresa ou pessoa| T[redigir-com-tom-de-voz]
```

### Passo 2

Com negócio, ache a negociação da empresa e da oportunidade antes de criar outra. Ligue a página pelas propriedades `Propriedade da empresa abordada`, `Propriedade da pessoa abordada` e `Propriedade da oportunidade`. Se uma segunda pessoa da mesma empresa falar, confira no schema se a propriedade da pessoa abordada aceita mais de uma antes de somar. Se não aceitar, pergunte.

### Passo 3

Grave cada troca como um comentário na discussão da página da negociação, ou da pessoa quando não há negócio, uma por data ou bloco de mensagens. Comece com `Data da mensagem:` e a data, ou `Data do registro:` quando for uma ação do negócio sem mensagem, e diga o canal e quem falou. Resuma os fatos: datas, horários, valores, decisões e pendências. Cite entre aspas só a frase cuja grafia importa, como um horário dito de outro jeito. Antes de gravar, leia os comentários que já existem e não repita a mesma mensagem.

Depois de enviar uma mensagem, um e-mail ou um comprovante de pagamento a uma empresa ou pessoa, registre a troca na mesma rodada, sem perguntar se deve registrar. Na resposta, diga o que registrou, com o link da página, e o que não registrou e por quê.

### Passo 4

Antes de perguntar à pessoa um fato sobre oportunidade, ponto de contato, viagem ou horário, consulte nesta ordem e marque cada fonte:

- [ ] Comentários da negociação e da página da pessoa
- [ ] `Banco de cronograma`
- [ ] `Banco de inscrições`
- [ ] Página da oportunidade e do ponto de contato
- [ ] E-mail, com `procurar-email`

Pergunte só o que nenhuma fonte responde e diga quais você consultou. Se duas fontes divergem, mostre as duas com a data de cada uma. Não escolha uma.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Pergunta já respondida

Se você perguntar um horário ou combinado sem ler a negociação, a pessoa repete o que já disse no WhatsApp ou no e-mail.

1. Siga o checklist do Passo 4.
2. Responda com o que achou e a fonte.
3. Pergunte só o que faltou.

### Histórico no corpo da página

Se você gravar o histórico no corpo da página ou num comentário de propriedade, ele some do topo da página e quebra a linha do tempo.

1. Grave na discussão da página.
2. Deixe o corpo como está.
3. Se o fato tiver propriedade própria, como status ou valor, atualize a propriedade.

### Registro que espera pergunta

Se você enviar a mensagem e só oferecer registrar a troca, a negociação fica sem o que o negócio disse e a pessoa tem de pedir o registro.

1. Registre na mesma rodada do envio, sem perguntar.
2. Diga na resposta o que registrou, com o link, e o que não registrou.
3. Um pagamento já registrado como despesa entra no comentário com o link da despesa.

### Divergência escondida

Se você escolher uma das fontes quando elas divergem, a pessoa chega na hora errada.

1. Mostre as duas versões, com fonte e data.
2. Pergunte qual vale ou sugira confirmar com a empresa.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a Dora mandou no WhatsApp que a montagem é depois das 17

Gravei na discussão da negociação com Mel Almeida sobre a Feira Exemplo 2026: "Data da mensagem: 16/10/2026, 4h09 (WhatsApp, Dora Ribeiro)", com "Ideal que seja montado hoje, após as 17". Avisei que o manual da organização diz montagem a partir das 18h.

### que horas a gente chega na Feira Exemplo amanhã?

Consultei os comentários da negociação, o cronograma, as inscrições e o e-mail. O manual de 14/10 diz chegar às 6h para credenciamento e montagem da mesa. Não perguntei.

### a palestrante agradeceu e a gente convidou ela pra um café

Não havia cotação, proposta, parceria nem venda. Gravei na discussão da página da pessoa, com a data, o canal e quem falou, e a pendência da resposta ao café. Não criei negociação.

### a Isadora também respondeu pela Feira Exemplo

Conferi se a propriedade da pessoa abordada aceita mais de uma pessoa antes de somar Isadora Ribeiro à negociação.

## Casos-limite

- A negociação não existe: busque pela empresa e pela oportunidade antes de criar, e só crie quando há negócio.
- A conversa é um convite, um agradecimento ou um café, sem negócio: grave na discussão da página da pessoa. Não crie negociação.
- A conversa não tem data: use `Data aproximada:` e diga de onde veio.
- Várias mensagens no mesmo dia e assunto: um comentário só, com os horários.
- A pessoa corrige um fato já gravado: novo comentário datado com a correção. Não apague o anterior.
- O banco não está no workspace conectado: pare e peça.

## Pegadinhas

- A página do `Banco de negociações` pode ter um callout com a regra. O corpo não é linha do tempo.
- A linha do tempo do cliente numa loja parece o lugar da conversa, mas a API da loja pode não gravar comentário nela. A conversa fica na discussão da página da pessoa.
- Toda conversa parece pedir uma negociação. Sem cotação, proposta, parceria ou venda, não há negócio: a linha do tempo é a discussão da página da pessoa.
- Um comentário de propriedade fica escondido no campo. Só a discussão da página aparece no topo.
- O mesmo fato pode estar no WhatsApp, no e-mail e no manual com horários diferentes. A data mais recente não é automaticamente a certa.
- A empresa abordada e a pessoa abordada são relações. Telefone e grafias vêm por rollup e não se gravam aqui.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
