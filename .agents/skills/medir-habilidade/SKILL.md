---
name: medir-habilidade
description: Use essa habilidade sempre que for medir o tamanho de uma skill ou o profiling de uma execução no Claude, no Cursor ou em outro harness, mesmo sem dizer token, linha ou tempo. NÃO use no Notion, nem abra o repositório a partir dele, nem para testar se a skill atendeu o caso, evoluir a skill, nem gravar o eval.
metadata:
  author: jimmyandrade
  version: "0.4.0"
  related:
    - evoluir-habilidade
compatibility: Precisa de Python.
---

# Medir habilidade

## Parâmetros de configuração

```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Se a sessão é Notion, pare. Não meça. Não procure o script no disco, não abra o repositório e não rode a medição a partir desse chat. Não estime número. Diga que a medição roda no Claude, no Cursor ou em outro harness.

### Passo 2

O tamanho não roda a skill. Rode a medição do arquivo. Use só essa saída. Não reconte com outro codificador.
O corpo é o texto depois do fechamento do frontmatter. O catálogo é o nome, uma quebra de linha e a descrição. Os tokens usam o200k_base.
A saída traz tokens do corpo, a fatia do limite com uma casa decimal, linhas e palavras do arquivo, caracteres do corpo e tokens do catálogo. Não há limite de caracteres.

### Passo 3

Entregue esses números à pessoa. Tokens do corpo no limite falham. Linhas no limite falham. Palavras e tokens do catálogo no limite passam. Eles falham só quando passam do limite.
Se o próximo trecho deixar o corpo sem folga abaixo do limite de tokens, diga isso antes de escrever.

### Passo 4

O profiling lê uma execução que já aconteceu. Diga a duração e o passo que gastou o tempo. Se a duração não estiver no registro, diga que falta. Não invente o número.
Não diga se a skill atendeu o caso. Isso fica em `evoluir-habilidade`. Não grave `timing.json`, `grading.json` nem `benchmark.json`.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Medição no Notion

Se você procurar o script no disco do Notion, ou abrir o repositório para rodá-lo, a medição acontece onde esta habilidade não roda.

1. Pare antes de procurar.
2. Não abra o repositório e não rode o script a partir desse chat.
3. Não estime número. Diga que a medição roda no Claude, no Cursor ou em outro harness.

### Corpo com frontmatter

Se você contar o frontmatter no corpo, o total de tokens fica maior do que a checagem usa.

1. Comece o corpo depois do fechamento do frontmatter.
2. Use a saída da medição.
3. Não reconte.

### Limite igual

Se você reprovar palavras ou tokens do catálogo quando o número é igual ao limite, a skill passa na checagem e você diz que falhou.

1. Tokens do corpo no limite falham.
2. Linhas no limite falham.
3. Palavras e tokens do catálogo no limite passam.

### Duração inventada

Se você preencher o tempo sem o registro, o profiling mostra uma duração que ninguém mediu.

1. Leia o registro da execução.
2. Sem duração, diga que falta.
3. Não invente o número.

### Eval no lugar da medida

Se você gravar `timing.json`, `grading.json` ou `benchmark.json`, ou disser que a skill passou, a medida vira o teste.

1. Entregue tamanho ou profiling.
2. Não grave esses JSON.
3. Saber se atendeu o caso fica em `evoluir-habilidade`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### no Notion: meça procurar-compromisso.

parei. Não abri o repositório, não rodei o script e não estimei número. Disse que a medição roda no Claude, no Cursor ou em outro harness.

### quanto pesa esta skill?

não rodei a skill. Entreguei tokens do corpo, a fatia do limite, linhas, palavras, caracteres do corpo e tokens do catálogo, como a medição imprimiu.

### quanto tempo a última execução levou e onde gastou?

li o registro. Disse a duração e o passo que gastou o tempo. Sem duração no registro, disse que falta. Não disse se o caso passou. Não gravei JSON.

## Casos-limite

- A sessão é Notion e o script não está no disco: pare. Não abra o repositório para medir.
- A skill mudou: meça o tamanho e entregue os números, mesmo sem pedido explícito.
- Não houve execução: não há profiling. Meça só o tamanho.
- O script não está no harness: não invente os números. Diga que a medição não rodou.
- A pessoa pergunta se a skill atendeu o caso: use `evoluir-habilidade`.

## Pegadinhas

- A falta do script no Notion parece motivo para buscá-lo no GitHub. Esse chat não mede. A medição roda no Claude, no Cursor ou em outro harness.
- Outro codificador muda o total. A saída da medição é o número. O codificador é o200k_base.
- Igual ao limite de tokens do corpo falha. Igual ao limite de linhas falha. Igual ao limite de palavras ou do catálogo passa.
- Profiling não diz se a skill passou. Os JSON do eval não se escrevem à mão e não saem desta habilidade.
- Caracteres do corpo não têm limite. O número entra no relatório.

## Scripts disponíveis

- `measure.py` imprime o tamanho de uma skill. Lê os limites da configuração do projeto e, no que faltar, a do harness que traz esta habilidade. Não imprime profiling.

1. Com o repositório: `<python da checagem> <pasta desta habilidade>/scripts/measure.py .agents/skills/<nome>/SKILL.md`. O Python da checagem é o `.venv/bin/python` do harness que traz esta habilidade.
2. O ambiente é o mesmo da checagem. Python, com tiktoken. Sem rede.
3. Use só essa saída para o tamanho. Os caracteres do corpo vêm nela. O profiling vem do registro da execução, no passo 4.
4. No Notion, esta lista não autoriza abrir o repositório nem rodar o script. Sem o script no harness: não invente os números.
