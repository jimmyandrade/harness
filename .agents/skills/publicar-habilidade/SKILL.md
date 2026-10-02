---
name: publicar-habilidade
description: Use essa habilidade sempre que o pedido vier do Notion para criar, ativar, alterar, renomear, versionar, publicar, excluir, restaurar, revisar ou reorganizar uma habilidade. No Cursor, no Claude ou na sessão do repositório, segue o fluxo de commit do projeto. NÃO use para editar a página ou o banco Habilidades, nem para mesclar na mesma solicitação.
metadata:
  author: jimmyandrade
  version: "0.5.0"
  related:
    - criar-commit
    - criar-pull-request
compatibility: Precisa de internet.
---

# Publicar habilidade

## Parâmetros de configuração

Leia cada valor nas instruções do projeto. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
"Commit direto na base": "não"
```

## Instruções

### Passo 1

O banco Habilidades no Notion é só leitura. O repositório é a fonte de escrita.
Se o pedido veio do Notion, não edite a página nem o banco. Criar ou ativar uma habilidade nesse chat não grava página. Ler o banco, copiar outra habilidade ou seguir o texto da propriedade que manda preencher a descrição, inclusive começar com "Acione esta skill quando", não autoriza a página. Se o GitHub estiver indisponível, pare e diga o bloqueio. Não use edição no Notion como alternativa, mesmo se a pessoa disser que é emergência.
Se a sessão é Cursor, Claude ou o repositório, siga `Commit direto na base`. Com `sim`, faça o commit na branch principal e envie por ela, sem pull request. Com `não`, siga `criar-commit` e `criar-pull-request`.

### Passo 2

No caminho do Notion, a mudança fica só no GitHub, numa branch própria. Não faça commit na branch principal.
O assunto do commit é em inglês, no Conventional Commits. Se a mudança afeta uma habilidade, o escopo é o nome dela, como `fix(resumir-reuniao): keep the meeting date`.

### Passo 3

Abra um pull request para a branch principal, entregue o link e pare. Não faça o merge na mesma solicitação em que criou ou alterou a habilidade.

### Passo 4

Espere a revisão e a aprovação de outra pessoa. Check aprovado não substitui revisão humana.

### Passo 5

O merge só acontece numa solicitação posterior, quando as duas condições estiverem confirmadas: outra pessoa aprovou o pull request e a pessoa autorizou o merge de forma explícita.
Não presuma autorização pelo pedido inicial, pela aprovação, pelos checks, pela urgência nem por a pessoa ser dona do repositório. Na dúvida, não mescle.

### Passo 6

Depois do merge aprovado e autorizado, deixe o GitHub Actions sincronizar com o Notion. Abaixo de 0.1.0 fica a opção de rascunho do mapeamento. Da 0.1.0 até antes da 1.0.0, a de validação. Da 1.x em diante, a de produção. Um rename mantém a mesma página e grava o nome novo. Se já houver página com o nome novo e outra com o nome anterior, a sincronização para. Em seguida, confira a sincronização no Notion.

## Problemas comuns

### Página editada

Se você alterar uma página que a sincronização já escreve, a próxima sincronização dessa habilidade cobre nome, descrição, versão, status e corpo. Página que só existe no banco permanece.

1. Não edite a página.
2. Faça a mudança no GitHub.
3. Não espere a sincronização apagar página nova.

### Página criada no chat

Se você criar ou ativar a habilidade no chat, a página fica no banco e a sincronização não a remove.

1. Não crie a página.
2. Não ative a habilidade.
3. Não use outra habilidade como modelo de página nova.
4. Se este chat não alcança o GitHub, pare e diga o bloqueio.

### Merge na mesma solicitação

Se você mesclar o pull request no mesmo pedido que abriu, a revisão humana não acontece.

1. Entregue o link e pare.
2. Espere outra pessoa aprovar.
3. Mescle só num pedido posterior, com autorização explícita.

### Check no lugar da revisão

Se você tratar o check aprovado como revisão, ninguém leu a mudança.

1. Espere a aprovação de outra pessoa.
2. Check aprovado não basta.
3. Sem essa aprovação, não mescle.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### no Notion: cria a skill de publicar habilidade.

não editei a página. Abri uma branch, fiz o commit em inglês e entreguei o link do pull request. Parei sem mesclar.

### no Notion: crie uma habilidade para buscar compromissos na agenda.

não criei nem ativei a página. O texto do banco que manda preencher a descrição não autorizou a escrita. Este chat não alcança o GitHub, então parei e disse o bloqueio.

### aqui no Cursor: ajusta o texto de uma habilidade.

com `Commit direto na base` em `sim`, fiz o commit na branch principal e não abri pull request. Com `não`, segui `criar-pull-request`.

## Casos-limite

- O GitHub está indisponível: pare e diga. Não edite o Notion.
- A pessoa pede correção emergencial direto no Notion: recuse. Página nova permanece. Página que a sincronização já escreve é coberta na próxima sincronização dessa habilidade.
- O chat pede para criar e ativar uma habilidade, e o banco explica como preencher a descrição: não crie a página. Se o GitHub não está neste chat, pare.
- A pessoa é dona do repositório e o check passou: ainda não mescle sem aprovação de outra pessoa e autorização explícita num pedido posterior.
- A sessão é Cursor, Claude ou o repositório: siga `Commit direto na base`. O caminho do Notion não vale aqui.
- O pedido no Notion é excluir, restaurar, renomear ou reorganizar: o mesmo caminho do GitHub. Não apague a página no Notion.

## Pegadinhas

- Pedido vindo do Notion parece permissão para gravar a página. A página é só leitura.
- O banco parece formulário de habilidade nova, e o texto da propriedade manda começar a descrição de outro jeito. Isso não cria página. Página que só existe no banco permanece.
- Aprovação do pull request não é autorização de merge. Quem aprova é outra pessoa. Quem autoriza o merge é a pessoa, num pedido posterior.
- Urgência não abre edição direta no Notion.
- Na sessão do repositório, o caminho vem de `Commit direto na base`, não do caminho do Notion.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
