---
name: definir-instrucoes-do-projeto
description: Use essa habilidade sempre que for criar, revisar, enxugar ou reorganizar as instruções do projeto, inclusive os parâmetros das habilidades, mesmo sem dizer AGENTS. NÃO use para escrever uma skill, o guia de contribuição, o mapa da arquitetura nem a documentação do produto.
metadata:
  author: jimmyandrade
  version: "0.4.0"
  related:
    - criar-habilidade
    - evoluir-habilidade
---

# Definir instruções do projeto

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Idioma das instruções do projeto": "português"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Leia as instruções do projeto inteiras e meça o tamanho delas com a checagem de skills. Elas carregam em toda sessão, por isso têm os mesmos limites do corpo de uma skill.

### Passo 2

Classifique cada trecho pelo destino, antes de escrever. Grave o plano como uma tabela: trecho, destino, motivo.

```mermaid
flowchart LR
  A{O trecho é} -->|regra do Notion ou de qualquer lugar| F[Fica nas instruções]
  A -->|regra de código, inclusive de segurança| C[Guia de contribuição]
  A -->|mapa de arquivos, pastas e dados| R[Mapa da arquitetura]
  A -->|interface, tipografia e tom| D[Documento de design]
  A -->|procedimento com passos| S[criar-habilidade]
  A -->|funcionalidade do produto| P[Documentação do produto]
  A -->|fato do negócio| N[Nos dados, fora do texto]
  A -->|valor de parâmetro| B[Bloco de parâmetros]
```

Na dúvida entre ficar e sair, saia: o destino continua a um link de distância.

### Passo 3

Escreva no `Idioma das instruções do projeto`, uma regra por linha, no imperativo, sem justificar. Separe o que vale em qualquer lugar, o que vale só no Notion e o que vale só em ferramentas de código. A regra de código, inclusive a de segurança, como comando, branch, build e segredo, vai para o guia de contribuição e nunca entra na parte do Notion. A parte do Notion copia do modelo, palavra por palavra, a abertura, o aviso e as duas subseções. Só as regras sob a identidade do agente e a interação de chat mudam de um projeto para outro. A parte de ferramentas de código é só a ordem de ler o guia, copiada do modelo. A abertura descreve o documento, não o repositório: para quais ferramentas e quais tarefas ele serve.

Leia .agents/assets/templates/agents-md.md quando for gerar a saída.

### Passo 4

Monte o bloco de parâmetros como árvore: a entrada `Global` e uma entrada por nome de habilidade. Copie cada chave do bloco de parâmetros da própria habilidade, letra por letra. Um valor que mais de uma habilidade usa fica em `Global`. O resto fica sob o nome da habilidade. Entra só o valor que difere do padrão da habilidade. Um valor que a habilidade calcula sozinha, como o repositório a partir do remoto, também conta como padrão e sai do bloco.

### Passo 5

Para cada trecho que sai, crie ou atualize o destino antes de apagar daqui. Depois troque as referências antigas que apontavam para as instruções do projeto, nos documentos e nos comentários de código.

### Passo 6

Rode a checagem de skills de novo. Se passar do limite, volte ao Passo 2 e tire mais. Repita até passar.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Chave parecida

Se você escrever "Idioma da mensagem" quando a habilidade lê "Idioma da mensagem de commit", a habilidade não acha o valor e usa o padrão sem avisar.

1. Abra o bloco de parâmetros da habilidade instalada.
2. Copie a chave exata.

### Regra de código duplicada

Se você deixar nas instruções do projeto uma regra de código que também está no guia de contribuição, como não enviar direto para a branch principal ou não expor segredo, as duas cópias divergem com o tempo.

1. Deixe a regra só no guia de contribuição.
2. Nas instruções, mantenha só a ordem de ler o guia.

### Técnica no Notion

Se você deixar comando, branch ou build na parte geral, quem lê no Notion recebe instrução que não serve para ele.

1. Mova para a parte de ferramentas de código.
2. Deixe na parte geral só o que vale nos dois lugares.

### Referência quebrada

Se você mover um trecho e não trocar as referências, outros documentos e comentários apontam para uma seção que não existe mais.

1. Procure as menções às instruções do projeto no repositório.
2. Aponte cada uma para o destino novo.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### as instruções do projeto passaram de 7000 tokens

O conteúdo foi para o guia de contribuição, sem mudança. As instruções ficaram com a ordem de ler o guia e o bloco de parâmetros. As regras de segurança ficaram só no guia. Os documentos e os comentários que citavam as instruções passaram a citar o guia.

### acrescente o idioma das mensagens de commit

O valor entrou em `Global`, com a chave "Idioma da mensagem de commit", copiada da habilidade de commit, porque a habilidade de pull request também precisa dele.

## Casos-limite

- O projeto ainda não tem instruções: comece pelo modelo, só com a parte do Notion, a ordem de ler o guia e o bloco de parâmetros.
- O bloco atual não tem árvore: ele continua valendo como `Global`. Reorganize quando mexer nele.
- Uma habilidade renomeou uma chave numa versão nova: troque a chave junto com a subida da versão.
- O trecho é um esquema de dados ou um fato do negócio: ele não entra no texto. O esquema fica no repositório do negócio, e o fato fica nos dados.
- As instruções estão em outro idioma: reescreva no `Idioma das instruções do projeto`. O guia de contribuição mantém o idioma dele.

## Pegadinhas

- O Claude Code lê as instruções do projeto mesmo sem o arquivo de instruções do Claude. Não crie esse arquivo só para importar as instruções.
- A checagem mede as instruções do projeto como corpo de skill, mesmo sem frontmatter e mesmo num projeto que só instala o core. As regras de estrutura de skill não valem para elas.
- A ordem de ler o guia é a única ligação entre as instruções e as regras de código. O guia só vale se o agente obedecer a essa ordem, então ela fica escrita como ordem, não como sugestão. Regra que não pode depender dessa leitura ganha uma verificação automática, como um teste ou uma checagem no commit.
- No Notion, as instruções do projeto são uma página escrita pela sincronização. Não edite essa página. A mudança vai no repositório.
- Mover o arquivo inteiro e criar outro com o nome antigo não aparece como renomeação no histórico. O histórico das linhas movidas fica no nome antigo.

## Scripts disponíveis

- `node_modules/harness/.agents/scripts/check-skill/run-check.sh AGENTS.md`: tamanho das instruções no Passo 1 e no Passo 6, num projeto que instala o core.
- `.agents/scripts/check-skill/run-check.sh AGENTS.md`: o mesmo, no repositório do core.
- `git grep -n AGENTS.md`: referências do Passo 5.

1. Meça, classifique, escreva, monte os parâmetros, mova, troque as referências e meça de novo.
