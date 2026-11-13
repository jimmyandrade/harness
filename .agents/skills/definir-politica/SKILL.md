---
name: definir-politica
description: Cria e atualiza as políticas do negócio, como venda, envio, atendimento, troca e devolução, com a fonte e a vigência, a partir de uma decisão ou de uma regra externa nova. Usada quando uma plataforma, um parceiro ou a pessoa muda uma regra, mesmo sem dizer política. NÃO serve para skill, instruções do projeto, artigo de como fazer nem tarefa.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  aliases:
    - definir-playbook
  related:
    - delegar-aviso-de-plataforma
    - formalizar-decisao
    - definir-tarefa
    - definir-artigo-da-base-de-conhecimento
    - evoluir-habilidade
---

# Definir política

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
"Formato da data com dia da semana": "terça-feira, 01/09/2026"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

A lista de políticas e o nome de cada propriedade vêm do mapeamento de dados do projeto, no workspace conectado. A lista pode ser um banco que guarda também outros tipos de página, como estratégia ou guia: o mapeamento diz como separar as políticas. Se a lista não estiver nessa conexão, pare e peça. Este texto usa os conceitos: o título da política, a área, a fonte e a data da revisão.

Receba a regra nova, quem a definiu, a data de vigência e o link da fonte, como o aviso da plataforma ou a decisão da pessoa.

### Passo 2

Busque a política pelo assunto e pela área antes de criar. Uma regra de uma plataforma entra na política do processo que ela muda, como envio, atendimento ou campanha, e não numa política por plataforma.

```mermaid
flowchart LR
  Q{A política do assunto existe?} -->|sim| A[Atualizar a regra na política]
  Q -->|não| C[Criar a política com a regra]
  A --> D{A regra pede uma escolha do negócio?}
  C --> D
  D -->|sim| F[formalizar-decisao]
  D -->|não| R[Registrar a mudança]
```

### Passo 3

Escreva a regra com as próprias palavras, curta e aplicável: o que fazer, quando e o prazo. Não cole o texto do aviso. A regra antiga que a nova substitui é reescrita, sem deixar as duas valendo.

Quando a regra abre uma escolha do negócio, como entrar ou não numa campanha que cobra anúncio, siga `formalizar-decisao` e não decida na política. A decisão tomada volta como regra na política.

A política diz a regra, não o passo a passo de tela. Quando cumprir a regra pede um passo numa ferramenta, ligue o artigo de `definir-artigo-da-base-de-conhecimento` que ensina esse passo, sem copiá-lo.

### Passo 4

Cada mudança deixa um comentário datado na página, com a data de vigência no `Formato da data com dia da semana`, a fonte e o que mudou. Os comentários formam o histórico. Atualize a data da revisão.

A regra que pede ação até uma data também vira tarefa por `definir-tarefa`.

Mostre o link da política, a regra como ficou, a vigência e a tarefa, quando houver.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Duas regras valendo

Se você acrescentar a regra nova e deixar a antiga, quem lê a política não sabe qual seguir.

1. Ache a regra antiga do mesmo assunto.
2. Reescreva-a com a nova.
3. Registre a troca no comentário datado.

### Aviso colado na política

Se você colar o texto do aviso, a política vira arquivo de e-mail e a regra se perde.

1. Escreva só a regra, com prazo e condição.
2. Ponha o link da fonte no comentário.

### Passo a passo na política

Se você escrever na política onde clicar, a regra fica escondida no meio do tutorial e o tutorial envelhece quando a tela muda.

1. Deixe na política só a regra.
2. Ligue o artigo que ensina o passo, ou siga `definir-artigo-da-base-de-conhecimento` quando ele não existe.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a plataforma reduziu o prazo de revisão de reembolso para 2 dias úteis

A política de devolução trocou o prazo de 3 por 2 dias úteis, com a vigência e o link do aviso no comentário datado. Não saiu tarefa, porque a regra não pedia ação até uma data.

### a campanha da plataforma cria anúncio automático cobrado de quem não configura

A política de campanhas ganhou a regra de configurar os anúncios 7 dias antes de cada campanha em que o negócio entrar, com o link do artigo que ensina a configurar. A escolha de entrar foi para `formalizar-decisao`.

## Casos-limite

- A lista de políticas não está no mapeamento: pare e peça.
- A regra vale só para uma plataforma: ela entra na política do processo, com a plataforma na condição.
- A fonte não traz a data de vigência: use a data do aviso e diga isso.
- A regra contradiz uma decisão da pessoa: siga `formalizar-decisao` antes de mudar.
- A página achada é estratégia, guia ou texto-base, não política: não ponha a regra nela. Crie a política e ligue as duas.

## Pegadinhas

- Uma política por plataforma parece organizada. A pessoa procura pelo processo, como envio ou atendimento.
- A regra da plataforma parece obrigar o negócio a participar. Ela vale para quem participa; a escolha fica com a pessoa.
- A decisão registrada na tarefa parece bastar. A tarefa fecha e a decisão some; a regra que ela criou fica na política.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
