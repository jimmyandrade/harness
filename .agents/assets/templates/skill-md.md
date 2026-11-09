---
name: skill-md
description: Formato do SKILL.md de uma habilidade, com o frontmatter, as seções na ordem, o bloco de parâmetros, os passos, os problemas comuns, os exemplos e as pegadinhas.
metadata:
  version: "0.1.0"
---

## Contexto

Use este modelo para escrever, mudar ou revisar o `SKILL.md` de uma habilidade. A `criar-habilidade` lê este modelo ao escrever a primeira versão, a `evoluir-habilidade` ao mudar uma skill e a `revisar-habilidade` ao conferir a estrutura. O nome e a descrição seguem a `descrever-habilidade-ou-schema`, a versão segue a `evoluir-habilidade`, e as pastas, os scripts e `Scripts disponíveis` seguem a `definir-arquivos-da-habilidade`.

## Formato

```markdown
---
name: <verbo-e-entidade>
description: <o que a skill faz, em terceira pessoa>. Usada quando <a intenção de quem pede>. NÃO serve para <o que fica de fora>.
compatibility: <só quando precisa de internet ou de Python>
metadata:
  author: <organização>
  version: "0.1.0"
  aliases:
    - <nome anterior>
  related:
    - <skill citada no corpo>
  models:
    - <modelo de saída citado no corpo>
---

# <Nome com espaço no lugar do hífen e com acentos>

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
# `<Parâmetro>` é `<valor>` ou `<outro valor>`. <O que cada valor faz.>
"<Parâmetro>": "<padrão>"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

<O que o agente faz, sem comando nem nome de arquivo.>

### Passo <N>

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### <Nome do problema>

Se você <o erro que o agente cometeria>, <o que dá errado>.

1. <Correção.>
2. <Correção.>

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### <pedido real, como a pessoa escreveu>

<O que a skill fez e entregou.>

## Casos-limite

- <Situação>: <o que fazer>.

## Pegadinhas

- <O que parece verdade>. <O fato do ambiente que contraria.>

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
```

## Estilo

Salve a skill como `.agents/skills/<nome>/SKILL.md` no repositório de origem dela. O `name` é igual ao nome da pasta, em ASCII e kebab-case. O título de nível 1 e o corpo mantêm ortografia, gramática e todos os acentos, com maiúscula só no começo e em nome próprio.

O frontmatter tem `name`, `description` e `metadata`. `metadata.author` é a organização e `metadata.version` é semver entre aspas. `compatibility` entra só quando a skill precisa de internet ou de Python, sem citar produto, git, docker nem jq. `license` não entra enquanto o projeto não exigir licença. `allowed-tools`, se existir, é uma lista separada por espaço. `aliases`, `tags`, `related` e `models` são um item por linha, começando com `-`. O frontmatter não tem `metadata.notion` nem `metadata.internal`, porque toda skill sincroniza com o Notion. Ao criar a skill, `evals/evals.json` nasce com `skill_name` e `evals` vazio.

As seções vêm nesta ordem: `Parâmetros de configuração`, `Instruções`, `Problemas comuns`, `Exemplos de entrada e saída`, `Casos-limite`, `Pegadinhas` e `Scripts disponíveis`. Não há prefácio que repita a descrição.

O bloco `yaml` de parâmetros inclui `"Modo de aprendizado": "perguntar"`. A explicação de um parâmetro fica no comentário YAML na linha de cima da chave, nunca no texto do passo nem num parágrafo depois do bloco. No comentário, o nome do parâmetro e cada valor possível ficam entre crases. O passo cita a chave. Valor que muda de um projeto para outro, como pasta, caminho ou nome de banco, vira parâmetro.

Cada heading de nível 3 em `Instruções` é `Passo 1`, `Passo 2`, na ordem e sem sufixo de letra. O último passo manda seguir `evoluir-habilidade` conforme `Modo de aprendizado`. Roteamento para outra habilidade, ou mais de um desfecho, fica num flowchart Mermaid no sentido configurado. Um caminho de cliques numa tela também: um nó por tela, campo ou botão, com o nome que aparece na tela, e as armadilhas numa lista curta depois.

Cite outra habilidade pelo nome entre crases, ou no nó de um flowchart, e liste-a em `metadata.related`. Cite um modelo de saída numa frase, ``Leia o modelo de saída `<nome>` quando for gerar a saída.``, e liste-o em `metadata.models`. O texto não cita arquivo nem caminho, a não ser ao apontar um modelo de entrada, ao propor `references/` quando a skill passaria do limite, e em `Scripts disponíveis`. O texto diz "instruções do projeto", sem citar arquivo, espaço de trabalho nem página.

Agrupe na mesma linha as frases que tratam do mesmo tema, e separe os temas com uma linha em branco. O texto fica legível de relance, sem bloco gigante nem uma frase por linha, e o diff mostra só o tema que mudou. Numa lista, a frase que fica sozinha vira item próprio, e a que só se entende com a anterior fica no mesmo item.

Em `Problemas comuns`, cada problema é um heading de nível 3, um parágrafo que começa com `Se você` e uma lista ordenada. Em `Exemplos de entrada e saída`, a entrada é um heading de nível 3 e a saída é o parágrafo seguinte, com uma linha em branco entre pares, sem `Entrada:`, `Saída:` nem `<dl>`, que o Notion não mostra. Um nome, uma data ou um alias só entra nos exemplos. Em `Pegadinhas`, cada item é o fato do ambiente que contraria o que o agente suporia, não um conselho geral.
