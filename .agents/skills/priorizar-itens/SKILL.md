---
name: priorizar-itens
description: Classifica itens em Deve ter, Deveria ter, Poderia ter e Não terá agora (MoSCoW) e os ordena, pelo impacto. Usada para priorizar achados, ajustes recebidos, escopo de um card ou trabalho que não cabe todo. Não serve para decidir a ação final nem para escrever o texto que vai ao público.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - evoluir-habilidade
---

# Priorizar itens

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário, que o agente do Notion não lê. Quando um valor não estiver lá, use o padrão abaixo. Um critério vazio usa a definição do Passo 2.

```yaml
"Ação de Deve ter": "fazer antes de seguir; bloqueia"
"Ação de Deveria ter": "fazer ou justificar por escrito"
"Ação de Poderia ter": "opcional; pode ficar para outro momento"
"Ação de Não terá agora": "não fazer agora; registrar à parte se valer"
"Critério de Deve ter": ""
"Critério de Deveria ter": ""
"Critério de Poderia ter": ""
"Critério de Não terá agora": ""
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Entenda o que será priorizado e para quê: achados de uma revisão, ajustes que alguém pediu, o escopo de um card ou trabalho que não cabe todo. Peça a lista, ou monte-a com a pessoa. Se os itens são páginas de uma base de dados, leia o título e o que ajuda a medir o impacto, como a descrição e o prazo. Cada item é uma coisa que pode ser feita ou não, com uma frase que diz qual.

### Passo 2

Use os critérios dos parâmetros. Sem critério, use estas definições:

- **Deve ter (Must):** sem isso o trabalho falha ou perde o sentido: erro confirmado, perda de dado, quebra de regra obrigatória.
- **Deveria ter (Should):** importante, mas sem falha comprovada: risco plausível, teste que falta para lógica nova, erro sem tratamento.
- **Poderia ter (Could):** não é essencial, mas melhora ou diferencia: simplificação, nome, organização.
- **Não terá agora (Won't):** não pertence a este trabalho ou já tem trabalho próprio: pedido fora do escopo, refatoração grande, tema de outra entrega.

### Passo 3

Classifique cada item, com uma frase que diz por quê. A classificação segue o impacto, não a confiança: um erro confirmado de nome é Poderia ter, e uma suspeita de vazamento de dado pode ser Deve ter até alguém descartar. Se for Deve ter só por suspeita, diga que é suspeita.

- Na dúvida entre duas categorias, suba uma.
- Não rebaixe um item pela pressa nem pela pessoa que o trouxe.
- Um item dentro do escopo nunca é Não terá agora. Essa categoria contém o escopo, não descarta item em silêncio. Na dúvida entre Não terá agora e Poderia ter, é Poderia ter.

### Passo 4

Ordene: Deve ter, depois Deveria ter, depois Poderia ter, dentro de cada tema. Os itens de Não terá agora ficam à parte, listados, com o motivo.

### Passo 5

Entregue a lista agrupada por categoria, cada item com a frase do Passo 3 e a ação do parâmetro `Ação de …` da categoria dele. Quem chamou decide como falar disso e o que fazer. Não escreva o texto que vai ao público.

Se os itens estão numa base de dados e as instruções do projeto ligam o conceito de prioridade a uma propriedade, grave a categoria nela. Sem essa propriedade, entregue a lista e sugira no fim criar a propriedade. Nunca crie esquema nem escreva a categoria no corpo da página.

Quando houver mais itens do que dá para fazer, proponha a classificação e deixe a pessoa ajustar antes de seguir.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Item do escopo mandado para Não terá agora

Se você marcar como Não terá agora um item que está dentro do escopo, ele some sem que ninguém decida isso.

1. Reclassifique como Poderia ter.
2. Use Não terá agora só para o que não pertence a este trabalho.
3. Liste os itens dessa categoria com o motivo.

### Classificação pela confiança

Se você rebaixar um item porque não tem certeza dele, uma suspeita séria passa por detalhe.

1. Meça o impacto se a suspeita for verdadeira.
2. Classifique pelo impacto.
3. Diga que é suspeita, não fato.

### Classificação pela pessoa

Se você der mais peso ao item de quem fala mais ou tem mais cargo, a lista reflete a hierarquia e não o impacto.

1. Classifique cada item pelo que ele muda.
2. Revise a ordem sem olhar quem trouxe cada item.

### Ação aplicada antes de classificar tudo

Se você agir no primeiro item antes de classificar todos, a ordem de Deve ter para Poderia ter se perde.

1. Classifique todos.
2. Ordene.
3. Só depois aja, na ordem.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Priorize os cinco achados da revisão do PR da Ana

Deve ter: o erro de contagem que perde um item do carrinho (confirmado). Deveria ter: a falta de teste da lógica nova. Poderia ter: dois nomes pouco claros e uma função que pode ser simplificada. Não terá agora: a ideia de reescrever o módulo inteiro, que tem trabalho próprio. A ação de cada grupo vem dos parâmetros.

### Separe o escopo do card de relatórios

Deve ter: exportar a tabela em CSV. Deveria ter: manter os filtros na exportação. Poderia ter: escolher as colunas. Não terá agora: exportar em PDF, que fica para outro card. A lista cabe em dois PRs, um por grupo.

## Casos-limite

- Um item só: classifique e entregue do mesmo jeito.
- A lista não cabe na tela: agrupe por tema e mostre os Deve ter primeiro.
- Os itens são páginas de uma base de dados sem propriedade de prioridade: entregue a lista no chat e sugira a propriedade, sem alterar as páginas.
- A pessoa discorda de uma categoria: ajuste. A classificação final é dela.
- Nenhum item é Deve ter: diga isso. Não promova um item só para ter um.
- O critério do projeto contradiz a definição do Passo 2: o critério do projeto vale.

## Pegadinhas

- A sigla MoSCoW vem de Must, Should, Could e Won't. O "o" não é categoria.
- Não terá agora não é "nunca": é "não neste trabalho".
- Dois itens iguais em categorias diferentes indicam um critério que não está claro. Diga qual foi o critério usado.
- A categoria é um rótulo de trabalho. Quem escreve o texto para o público decide se a mostra.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
