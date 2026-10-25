---
name: criar-commit
description: Use essa habilidade sempre que terminar um trabalho que mudou o repositório ou for commitar, separar commits ou escrever a mensagem, mesmo sem dizer commit. NÃO use para push, abrir PR, rebase nem merge (use criar-pull-request).
metadata:
  author: jimmyandrade
  version: "0.12.0"
---

# Criar commit

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Branch base": "main"
"Commit direto na base": "nunca"
"Commitar sem perguntar": "sim"
"Idioma da mensagem de commit": "inglês"
"Padrão da mensagem de commit": "Conventional Commits"
"Comando de testes": ""
"Atribuição da sessão": "sim"
"Comando de build": ""
"Comando de lint dos arquivos tocados": ""
"Criar pull request ao terminar": "não"
"Modo de aprendizado": "perguntar"
```

`Criar pull request ao terminar` é `sim` quando a mudança de código autoriza o push da branch e a abertura do pull request, para o código não ficar só na máquina. É `não`, o padrão, quando isso espera um pedido explícito. O merge não entra nesse parâmetro.

## Instruções

### Passo 1

Se `Commitar sem perguntar` for `sim`, commite ao terminar um trabalho que mudou o repositório, antes de relatar a conclusão. Se for `não`, pergunte antes. Não commite se a pessoa pediu para não commitar ou se não há nada a commitar.

### Passo 2

```mermaid
flowchart LR
  A{Terminal com o repositório?} -->|sim| T{Commit direto na base}
  T -->|só no terminal ou sempre| B[Commit na base com git]
  T -->|nunca| G[Branch própria e commit com git]
  A -->|não| C{Integração com o GitHub?}
  C -->|não| E[Diga o bloqueio e pare]
  C -->|sim| S{Commit direto na base}
  S -->|sempre| H[Commit na base pela integração]
  S -->|nunca ou só no terminal| D[Branch própria e commit pela integração]
```

O repositório é a única fonte de escrita. Uma cópia sincronizada a partir dele, como a página de uma habilidade no Notion, é só leitura: não grave nela, nem quando a pessoa chamar de emergência, nem como saída quando o repositório não está ao alcance. `Commit direto na base` vale `nunca`, `só no terminal` ou `sempre`. Sem terminal, testes, build e lint não rodam: quem verifica são os checks do CI no PR, aberto por `criar-pull-request`.
Na branch própria, se a branch atual for a `Branch base`, crie uma branch a partir da `Branch base` remota atualizada, sem rastrear a base. O nome é `<tipo>/<descrição>`, com o tipo do Conventional Commits do commit e a descrição em ASCII kebab-case. Branch que a ferramenta criou com outro prefixo, como `claude/`, é renomeada para esse padrão antes do commit.

### Passo 3

Separe o trabalho por assunto: um commit para cada funcionalidade, correção, refatoração, documentação, teste ou tarefa. Cada commit deixa a árvore coerente e passando no build, e pode ser revertido ou aplicado sozinho. Documentação que registra a regra nova vai em commit próprio, depois do código.

### Passo 4

Antes de commitar, rode o `Comando de testes` e o `Comando de build` quando existirem. Rode o `Comando de lint dos arquivos tocados` só nos arquivos que você mudou. Erro que já existia na `Branch base` não entra no seu commit. Leia nas instruções do projeto as falhas que já são conhecidas.

### Passo 5

Adicione ao índice cada arquivo pelo caminho. Confira o que entrou antes de commitar.

### Passo 6

Leia o `CONTRIBUTING.md` e o `AGENTS.md` do repositório: a convenção documentada de mensagem e de branch vale mais que o `Padrão da mensagem de commit` e que a preferência pessoal. Mensagem em `Idioma da mensagem de commit`, no `Padrão da mensagem de commit`. O assunto diz por que a mudança existe. Corpo só quando precisa de contexto. Renomear ou quebrar compatibilidade leva `!` no tipo e rodapé `BREAKING CHANGE:`. Com `Atribuição da sessão` em `sim`, termine com o trailer de coautoria da sessão. Com `não`, nunca ponha trailer de ferramenta ou de modelo, mesmo que o ambiente peça.

### Passo 7

```mermaid
flowchart LR
  H[Informe os hashes] --> P{Criar pull request ao terminar?}
  P -->|sim| B[criar-pull-request]
  P -->|não| A{Pediu push ou PR?}
  A -->|sim| B
  A -->|não| C[criar-pull-request e pare antes de publicar]
```

Informe o hash de cada commit nesta resposta. Com `Criar pull request ao terminar` em `sim`, a mudança de código autoriza o push da branch e a abertura do pull request. Com `não`, sem pedido de publicação, siga `criar-pull-request` até o passo que exige o pedido e diga que o pull request não está aberto. O merge continua pedindo um pedido explícito. Não escreva que a habilidade ficou para este pedido, nem para depois.

### Passo 8

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Frase que adia o pull request

Se você escrever que a habilidade ficou para este pedido, ou para depois, a pessoa não sabe se ela foi chamada.

1. Informe o hash de cada commit.
2. Com `Criar pull request ao terminar` em `sim`, abra o pull request.
3. Com `não` e sem pedido de publicação, diga que o pull request não está aberto.
4. Não use a expressão "ficou para este pedido".

### Formatador reescreve arquivos alheios

Se você rodar o formatador ou o lint com correção no repositório inteiro, o commit leva formatação de arquivos que você não tocou.

1. Desfaça a mudança nos arquivos que não eram seus.
2. Rode o formatador só nos arquivos do seu trabalho.

### Erro que já existia

Se você vir o type check ou o lint acusar erro em arquivo que não mudou, o erro não é seu.

1. Compare com a `Branch base` para confirmar que o erro já existia.
2. Não corrija no mesmo commit. Mencione na resposta.

### Commit misturado

Se você juntar o helper, a correção e a documentação num commit só, ninguém consegue reverter uma parte sem as outras.

1. Desfaça o commit mantendo as mudanças.
2. Separe por assunto e commite de novo, na ordem em que cada um passa no build.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Implemente a correção e documente a regra

Três commits na branch `fix/…`: `feat:` com o helper reutilizável e o teste, `fix:` com a correção, `docs:` com a regra nas instruções do projeto. Testes e build rodados antes. A resposta informa o hash de cada commit. Sem push, porque a pessoa não pediu.

### Ajusta só o texto desse botão

Um commit `fix:` com o assunto dizendo o porquê da troca do texto. Sem teste novo, porque é só texto.

## Casos-limite

- A pessoa pede para não commitar: pare antes do Passo 2.
- Não há mudança no repositório: não crie commit vazio.
- A mudança está na `Branch base` sem commit e vai para uma branch própria: leve as mudanças para a branch nova antes de commitar.
- Commit cujo assunto começa com `merge:`: não crie. A base entra por rebase, em `criar-pull-request`.
- O projeto não tem `Comando de testes` nem `Comando de build`: diga na resposta que nada foi verificado antes do commit.
- A pessoa pede para mudar a cópia sincronizada, como a página de uma habilidade: não grave nela. A mudança vai no repositório, e o sync atualiza a cópia depois do merge.

## Pegadinhas

- `git switch -c <branch> origin/<base>` faz a branch rastrear a base. Use `--no-track`.
- O type check do repositório inteiro pode falhar em arquivos que não são seus. Não use esse resultado como portão do seu commit sem comparar com a `Branch base`.
- Um hook de pre-push pode rodar testes e build de novo. Rodar antes do commit permite publicar sem o hook depois.
- O texto da cópia sincronizada que explica como preencher uma habilidade parece permissão para criá-la ali. Criar ou ativar a habilidade fora do repositório deixa uma cópia que o sync não remove.

## Scripts disponíveis

- `Comando de testes`, `Comando de build` e `Comando de lint dos arquivos tocados`: verificações do Passo 4.
- `git fetch origin && git switch --no-track -c <branch> origin/<Branch base>`: Passo 2.
- `git branch -m <tipo>/<descrição>`: renomeia a branch no Passo 2.
- `git add <caminho>` e `git diff --cached --stat`: Passo 5.

1. Rode a criação da branch se precisar, as verificações, o lint dos arquivos tocados, o índice por caminho e o commit.
