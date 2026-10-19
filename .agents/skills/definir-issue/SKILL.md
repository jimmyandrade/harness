---
name: definir-issue
description: Abre, revisa, edita e traduz issues do GitHub no idioma do projeto. Usada quando a demanda técnica vira issue, mesmo sem dizer issue. Não serve para tarefa fora do GitHub, para o pull request nem para triar a demanda.
compatibility: Precisa de internet.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  related:
    - criar-pull-request
    - evoluir-habilidade
---

# Definir issue

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo. `Repositório` vem do remoto `origin` quando as instruções não dizem.

```yaml
"Repositório": ""
"Idioma da issue": "português do Brasil"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Receba a demanda técnica e o `Repositório`. Sem repositório nas instruções nem remoto `origin`, pergunte e pare.

### Passo 2

Antes de abrir, procure issues abertas e fechadas com o mesmo assunto. Se uma cobre a demanda, mostre o número, o título, o estado e o link, e pare. Não abra outra.

### Passo 3

Escreva o título em Conventional Commits, `tipo: descrição`, e a descrição no `Idioma da issue`. O tipo vem do efeito da entrega, não da palavra do pedido: `feat` para o que a pessoa passa a poder fazer, `fix` para o que estava errado, `perf`, `refactor`, `docs`, `test`, `ci`, `build` ou `chore`. Uma issue é uma entrega só.

### Passo 4

Leia .agents/assets/templates/issue-do-github.md quando for gerar a saída.

### Passo 5

Escreva o corpo inteiro no `Idioma da issue`: problema com o caso real, proposta e critério de pronto verificável. Nome de arquivo, de comando e de parâmetro fica como no código.

### Passo 6

Ao revisar ou editar, mostre a mudança antes de gravar. Uma issue em outro idioma ganha título e corpo no `Idioma da issue`, sem perder link nem referência.

### Passo 7

Mostre o número e o link. O pull request que resolve cita a issue com `Closes #<número>`, seguindo `criar-pull-request`.

### Passo 8

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Tipo pela palavra do pedido

Se você escolher o tipo pela palavra "erro" ou "melhoria", a issue nasce com o tipo errado.

1. Pergunte o que muda para quem usa.
2. Escolha o tipo por esse efeito.

### Issue com duas entregas

Se você juntar duas entregas numa issue, o pull request não consegue fechá-la sozinho.

1. Separe em duas issues.
2. Cite uma na outra quando houver dependência.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### O agente do Notion não abre o modelo de saída citado pela skill

`feat: publicar os modelos de saída no Notion e citá-los nas páginas das skills`, com problema, proposta e critério de pronto em português do Brasil.

## Casos-limite

- O repositório é público: a issue não cita empresa, workspace, base, pessoa nem segredo.
- A demanda é de negócio, sem entrega no código: não abra issue.
- O comentário de revisão pede outra issue: ela segue os mesmos passos.

## Pegadinhas

- Commit e pull request seguem os próprios idiomas. O `Idioma da issue` vale só para a issue.
- O título em inglês parece obrigatório por causa do Conventional Commits. Só o tipo é fixo. A descrição segue o `Idioma da issue`.
- A busca só nas abertas parece bastar. A issue fechada também conta, e reabrir é melhor que duplicar.

## Scripts disponíveis

- Nenhum.

1. Busca: `gh issue list --repo <Repositório> --state all --search "<assunto>"`.
2. Abrir: `gh issue create --repo <Repositório> --title "<título>" --body-file <arquivo>`.
3. Editar: `gh issue edit <número> --repo <Repositório> --title "<título>" --body-file <arquivo>`.
4. No Notion, sem o `gh`: entregue o título e o corpo prontos para a pessoa abrir a issue.
