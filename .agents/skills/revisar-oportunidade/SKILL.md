---
name: revisar-oportunidade
description: Revisa o conteúdo, o corpo e as anotações de uma edição que já existe, preserva o bloco de anotações e o callout e passa cada fato para a propriedade certa. Usada quando a pessoa pede para revisar, limpar, enriquecer, consolidar, reorganizar ou atualizar uma edição. NÃO serve para cadastrar a edição, o grupo ou a programação, nem para inscrever ou criar a tarefa.
allowed-tools: notion:notion-ai-search notion:notion-fetch notion:notion-update-page notion:notion-create-comment
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - criar-oportunidade
    - procurar-oportunidade
    - definir-grupo-de-oportunidades
    - criar-ideia-de-conteudo
    - definir-tarefa
    - evoluir-habilidade
---

# Revisar oportunidade

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
"Formato da data com dia da semana": "terça-feira, 01/09/2026"
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

A lista de oportunidades e o nome de cada propriedade vêm do mapeamento de dados do projeto, no workspace conectado. Se a lista não estiver nessa conexão, pare. Não use a lista de outro workspace. Este texto usa os conceitos: o corpo da edição, o bloco de anotações, o callout de orientações, as notas de curadoria, a decisão humana e o grupo da edição.

A edição precisa existir. Saber se ela existe fica com `procurar-oportunidade`, e cadastrá-la fica com `criar-oportunidade`. O grupo fica com `definir-grupo-de-oportunidades`. Não preencha fórmula, rollup nem botão. Não invente categoria nem prioridade.

### Passo 2

Na edição, bloco de anotações, reunião, transcrição, resumo ou outro bloco de notas da pessoa fica inteiro. Não sugira apagar, arquivar, substituir, ocultar nem remover. O bloco é evidência, mesmo quando um fato dele também cabe numa propriedade.

Na revisão do conteúdo, do corpo ou das anotações, leia o bloco para preencher a propriedade que a lista já tem. Data, localidade, empresa ou local, canal, links, taxa, variações de nome e decisão humana entram só quando o bloco afirma um valor que a propriedade já aceita.

O comentário analítico vai nas notas de curadoria. O bloco não vira checklist, resumo nem texto operacional, e não se copia de novo no corpo. Se o bloco não basta para afirmar, a propriedade fica vazia e a pendência fica nas notas de curadoria. Não invente o dado nem a propriedade. O bloco do grupo fica com `definir-grupo-de-oportunidades`.

### Passo 3

Se a página tem um callout com orientações de preenchimento ou governança, preserve-o integralmente ao revisar, limpar ou migrar o corpo. Se ele não existe e a pessoa pede para organizar o corpo, avise antes de concluir.

### Passo 4

Ao revisar ou migrar o corpo, uma possível ação de conteúdo, como bastidores, enquete, cobertura, look ou collab de post, vira ideia pela `criar-ideia-de-conteudo` e, se exige execução, tarefa pela `definir-tarefa` ligada à oportunidade, ambas com data. Sem data segura, pergunte.

A leitura estratégica de fit e de relação estética vai para as notas de curadoria como síntese permanente, sem checklist.

### Passo 5

A intercorrência da edição, como um problema com o local do estande, vai num comentário da edição, não no corpo nem nas notas de curadoria. O comentário começa pela data e hora do fato, e cada fato novo é um comentário novo, para os comentários formarem a linha do tempo.

### Passo 6

Mostre a edição, o que passou do bloco para cada propriedade, o que ficou pendente nas notas de curadoria e o link. Data de evento, compromisso ou prazo sai no formato da data com dia da semana, calculado com a data, o horário e o fuso do evento. Sem horário ou sem fuso, e se o dia puder mudar, peça. Não invente.

Se a fonte trouxer um dia da semana incompatível com a data, sinalize e não grave. A decisão humana fica com a pessoa e não vira pergunta nem pendência na resposta.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Bloco de anotações removido

Se você apagar, arquivar, substituir, ocultar ou remover o bloco de anotações ao revisar a edição, a evidência da pessoa some.

1. Mantenha o bloco inteiro, com o mesmo texto.
2. Fato estruturável pode ir para a propriedade.
3. Não copie o bloco de novo no corpo.

### Callout apagado

Se você limpar o corpo e apagar o callout de orientações, quem preenche a próxima edição perde a regra de governança.

1. Preserve o callout integralmente.
2. Sem callout e com pedido para organizar o corpo, avise antes de concluir.
3. Não reescreva o callout.

### Intercorrência nas notas

Se você gravar uma intercorrência nas notas de curadoria ou no corpo, a linha do tempo da edição se perde.

1. Grave a intercorrência num comentário da edição.
2. Comece o comentário pela data e hora do fato.
3. Cada fato novo é um comentário novo.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### revise as anotações da edição. O bloco diz que o evento foi em Cidade Exemplo, sem dia e sem valor.

Localidade só entra se a página já existe. Data e taxa ficaram vazias. A pendência ficou nas notas de curadoria. O bloco ficou inteiro.

### limpe o corpo da edição. A página tem um callout de orientações de preenchimento.

Reorganizei o corpo e preservei o callout integralmente. O bloco de anotações ficou inteiro, e a ação de bastidores virou ideia de conteúdo com data.

### o estande do Festival Rota Sul ficou fora do mapa aprovado

Gravei um comentário na edição, começando pela data e hora do fato. Não escrevi a intercorrência no corpo nem nas notas de curadoria.

## Casos-limite

- A edição não existe: siga `procurar-oportunidade` e, se faltar, `criar-oportunidade`. Não revise o que não existe.
- A página já tem bloco de anotações, reunião, transcrição ou resumo: ele fica inteiro. Um fato dele pode ir para a propriedade.
- O bloco não afirma o valor: a propriedade fica vazia. A pendência vai nas notas de curadoria.
- O callout não existe e a pessoa pede para organizar o corpo: avise antes de concluir.
- Ação de conteúdo sem data segura: pergunte a data antes de criar a ideia ou a tarefa.
- Intercorrência na edição: comentário datado na página. Não vai no corpo nem nas notas de curadoria.

## Pegadinhas

- O bloco de anotações parece rascunho que a limpeza apaga. Ele é evidência da pessoa. A propriedade recebe a cópia, e o bloco permanece.
- O callout parece texto de rascunho do corpo. Ele guarda as orientações de preenchimento e a governança da página.
- A intercorrência parece nota de curadoria. As notas guardam a síntese permanente. O fato do dia é comentário.
- Revisar parece poder cadastrar o que falta. O cadastro fica com `criar-oportunidade`, e o grupo com `definir-grupo-de-oportunidades`.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
