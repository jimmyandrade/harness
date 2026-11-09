---
name: definir-arquivos-da-habilidade
description: Define onde ficam os scripts, referências, modelos e testes de uma skill e escreve Scripts disponíveis. Usada quando a skill ganha, move ou renomeia um arquivo além do SKILL.md, ou quando se propõe um script. Não serve para escrever o texto da skill, a descrição nem gravar no Notion.
metadata:
  author: jimmyandrade
  version: "0.9.0"
  related:
    - criar-habilidade
    - evoluir-habilidade
---

# Definir arquivos da habilidade

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Idioma do nome dos scripts": "inglês"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

A pasta da skill tem `SKILL.md`. `scripts/`, `references/`, `assets/` e `features/` são opcionais. `features/` é o teste Gherkin, em português. `scripts/` é código executável. `references/` é documentação lida sob demanda.
Script de uma skill fica em `scripts/` dela. No Notion, é arquivo dessa página. Script usado por várias skills fica em `.agents/scripts/<nome>/`. No Notion, não entra na página de uma skill só.
O nome do script, e o da pasta dele em `.agents/scripts/`, fica no `Idioma do nome dos scripts`, sem acento e na convenção de nome da linguagem.
O nome e o lugar seguem essa regra desde a proposta, inclusive numa lista na conversa, antes de o arquivo existir.
Antes de propor um script, decida pelo [Passo 3](#passo-3) se ele é preciso: comando curto ou de ferramenta que já resolve fica listado em `Scripts disponíveis`, e só comando longo vira script.
Tabela que estoura o limite vai para `references/`, com a condição de leitura. "Leia o material se a API não retornar 200" serve.

Uma decisão de caso que a skill aprende com a pessoa, como classificar um item ou escolher um destino, fica numa árvore de decisão Mermaid, `flowchart TD`, num arquivo `.mmd` ao lado do `config.yaml`, e um parâmetro cita o arquivo. A árvore é lida de cima para baixo e a primeira pergunta que bater decide. Quando nenhuma bate, a skill pergunta e acrescenta a regra na árvore. O texto da skill guarda só o comportamento geral, nunca a decisão de um caso.

O `README.md` da pasta de skills é o grafo Mermaid de como as skills se relacionam, gerado por script. Num harness de negócio, ele também mostra as skills do core, num grupo próprio. Não edite à mão: gere de novo depois de mudar `metadata.related`. O Lefthook roda a checagem das skills no commit, e ela falha quando esse README está desatualizado. Não commite se ela falhar.

### Passo 2

Modelo de entrada ou saída não entra no corpo, nem quando é curto.
Modelo de saída fica em `.agents/assets/templates/`, fora da skill. No corpo, cite pelo nome, numa frase e nada antes dela: ``Leia o modelo de saída `<nome>` quando for gerar a saída.`` Não escreva o caminho. Liste o nome em `metadata.models`, um por linha.
Modelo de entrada de uma skill fica em `assets/` dela. Modelo de entrada de várias skills fica em `.agents/assets/`. No corpo: `Leia assets/<modelo> quando for pedir a entrada.` ou `Leia .agents/assets/<modelo> quando for pedir a entrada.`
No Notion, o modelo de saída é a página com o mesmo nome no banco de modelos, e a frase da skill fica igual. O modelo de entrada da skill, anexe à página. `assets/<modelo>` viaja com a skill. Nos dois casos, o arquivo entra só quando a frase manda ler.

### Passo 3

Feche com `Scripts disponíveis`: uma lista dos scripts e, em seguida, a lista ordenada de execução. Sem script, a lista é `Nenhum.` e a execução diz que não há script.
Os passos não citam comando nem nome de arquivo.
O passo diz o que será feito.
O comando fica só em `Scripts disponíveis`.
Comando curto fica nessa seção, com versão fixa quando o ecossistema permite.
Comando longo vira script testado em `scripts/`.
Se um pacote já resolve, cite o comando nessa seção e não crie `scripts/`. O pré-requisito também vai em `compatibility`.
No Notion o script pode faltar. A lista ordenada separa os dois caminhos. O passo escolhe no início, sem repetir o comando.

### Passo 4

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Script para comando curto

Se você propuser um script para cada comando da tarefa, a skill ganha arquivos que só repetem comandos de ferramentas prontas, e a pessoa pergunta por que não ficaram na skill.

1. Meça cada comando: curto, ou de ferramenta que já resolve, fica listado em `Scripts disponíveis`.
2. Proponha script só para o comando longo, ou com lógica que pede teste.

### Modelo no corpo

Se você descrever o formato em texto corrido ou colar o modelo na skill, o agente deixa de casar a estrutura e o modelo entra em toda execução.

1. Mova o modelo de saída para `.agents/assets/templates/`. O de entrada, para `assets/` da skill ou, se várias usam, para `.agents/assets/`.
2. Deixe no corpo só a frase que manda ler o modelo: o de saída pelo nome, o de entrada pelo caminho.
3. Não leia o modelo em nenhum outro passo.

### Script compartilhado na skill

Se você deixar em uma skill um script que outras também usam, ele fica preso na página dessa skill.

1. Mova para `.agents/scripts/<nome>/`.
2. Aponte as skills para esse caminho.
3. Não anexe o arquivo à página de uma skill só.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Duas skills passam a rodar o mesmo script de checagem

O script sai de `scripts/` da primeira skill e vai para `.agents/scripts/check-skill/`. As duas citam o comando em `Scripts disponíveis`, e nenhum passo repete o comando.

## Casos-limite

- O script vale para uma skill: `scripts/` dentro dela. Vale para várias: `.agents/scripts/<nome>/`.
- A skill passaria do limite de linhas ou de tokens do corpo: proponha `references/` e a condição de leitura.
- O script já existe com o nome em outro idioma: renomeie para o `Idioma do nome dos scripts` e atualize `Scripts disponíveis`.
- Um pacote já resolve: o comando fica em `Scripts disponíveis`, sem `scripts/`.
- A skill não tem script: a lista é `Nenhum.` e a execução diz que não há script.

## Pegadinhas

- Juntar comandos curtos num script só parece mais organizado. Ele esconde o que cada comando faz e pode faltar na página do Notion; listados, os comandos valem nos dois lugares.
- O nome de um script proposto só parece seguir o idioma da skill. Ele segue `Idioma do nome dos scripts`, que tem inglês como padrão, mesmo numa skill em português.
- Modelo de saída não entra no corpo. Fica em `.agents/assets/templates/`, e a frase cita o nome, não o caminho.
- No Notion, o script pode faltar na página. A execução precisa de um caminho sem ele.

## Scripts disponíveis

- `.agents/scripts/skill-graph/run-graph.sh`: gera o `README.md` da pasta de skills.
- `.agents/scripts/check-skill/run-check.sh`: roda a checagem que o Lefthook roda no commit.

1. Depois de mudar `metadata.related`, rode `.agents/scripts/skill-graph/run-graph.sh`.
2. Antes de commitar, rode `.agents/scripts/check-skill/run-check.sh` quando não houver hook de pre-commit.
