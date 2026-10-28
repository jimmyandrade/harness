---
name: fatiar-pull-request
description: Corta a demanda em um rascunho por pergunta de revisão e empilha esses rascunhos. Usada quando a mesma demanda junta a chave, o componente e o lugar em que ele aparece. NÃO serve para commits da mesma pergunta nem para mesclar.
metadata:
  author: jimmyandrade
  version: "0.4.0"
  related:
    - criar-pull-request
    - criar-commit
    - atender-revisao-de-pull-request
    - evoluir-habilidade
---

# Fatiar pull request

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.

```yaml
# `Fatiar por subtarefa`: `não` junta só a mesma pergunta de revisão. `sim` abre um pull request por subtarefa, e dentro dela vale o mesmo corte.
"Fatiar por subtarefa": "não"
# `Cópia de trabalho` é `worktree` ou vazio. `worktree` trabalha num git worktree novo a partir da `main`, nunca no clone da pessoa. Vazio trabalha onde a pessoa já está.
"Cópia de trabalho": "worktree"
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Uma pergunta de revisão é o que uma pessoa julga sem abrir outro assunto.
A chave, o componente e o lugar em que ele aparece são perguntas diferentes.
Vários commits da mesma pergunta continuam no mesmo pull request.

```mermaid
flowchart LR
  Q{Quantas perguntas de revisão?} -->|uma| U[Um pull request]
  Q -->|mais de uma| E[Um rascunho por pergunta, empilhado]
  E --> F[Uma tarefa filha por rascunho]
  F --> R{O antigo tem comentário?}
  R -->|sim| A[Atenda no rascunho do arquivo]
  R -->|não| P[Aponte o antigo para os novos]
```

Conte as perguntas antes de abrir.
Com uma, abra um pull request só.
Com mais de uma, abra um rascunho por pergunta.
Empilhe: o de baixo entra primeiro, e o de cima abre contra a branch do de baixo.
Cada diff mostra só os arquivos daquela pergunta.
Quando a branch de baixo é atualizada porque ficou atrás da base, as de cima andam junto, para cada diff continuar só com os arquivos daquela pergunta. Siga `atender-revisao-de-pull-request`.
O teto de arquivos do repositório continua valendo para cada pull request.
Ele não junta perguntas para caber em menos pull requests.
Com `Fatiar por subtarefa` em `sim`, abra um pull request por subtarefa, e dentro dela repita este corte.
A abertura segue `criar-pull-request`. As branches nascem seguindo `Cópia de trabalho`.

### Passo 2

Se o pull request aberto mistura perguntas, abra os rascunhos e aponte o antigo para os novos.
Não reescreva a branch já publicada para cortar o pull request.
Uma atualização posterior da de baixo, porque ela ficou atrás da base, move as de cima. Isso segue `atender-revisao-de-pull-request`.
Cada rascunho ganha uma tarefa filha da tarefa da demanda.
O pull request cita essa filha no título e no corpo.
A criação da filha segue a habilidade de tarefa do projeto.
Cada comentário do antigo segue `atender-revisao-de-pull-request` no rascunho que tem o arquivo.
A resposta no antigo aponta o commit do novo.

### Passo 3

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### PR maior que a revisão

Se você juntar a chave, o componente e o lugar em que ele aparece num pull request só, a pessoa revisa assuntos diferentes de uma vez.

1. Abra um rascunho por pergunta, empilhado.
2. Cada diff fica só com os arquivos daquela pergunta.
3. O de baixo entra primeiro.

### Teto de arquivos junta assuntos

Se você mantiver os assuntos juntos porque o teto de arquivos ainda não estourou, a revisão continua misturada.

1. Separe mesmo assim.
2. O teto vale para cada pull request.
3. Ele não é motivo para juntar perguntas.

### Comentários ficaram no PR fechado

Se você fechar o pull request antigo e deixar os comentários só lá, a revisão não chega no rascunho que tem o arquivo.

1. Leve cada comentário com `atender-revisao-de-pull-request`.
2. Atenda no rascunho que tem o arquivo.
3. A resposta no antigo aponta o commit do novo.

### Fatia sem tarefa filha

Se você abrir o rascunho sem uma tarefa filha, o pull request fica só na tarefa da demanda inteira.

1. Crie uma tarefa filha por rascunho.
2. Cite a filha no título e no corpo.
3. A criação segue a habilidade de tarefa do projeto.

### A de baixo andou e o diff de cima misturou

Se você atualizar só a branch de baixo, o diff de cima passa a mostrar os arquivos de baixo.

1. Atualize cada branch de cima, na ordem.
2. Cada diff continua só com os arquivos daquela pergunta.
3. Siga `atender-revisao-de-pull-request`.

### Branch publicada reescrita

Se você reescrever a branch do pull request que já está aberto, a história publicada muda sem a pessoa ter pedido.

1. Abra os rascunhos novos.
2. Aponte o antigo para eles.
3. Não reescreva a branch já publicada.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### A demanda junta a chave, a tela e a página que monta a tela

Três rascunhos empilhados.
O primeiro só liga a chave.
O segundo só traz a tela.
O terceiro só monta a tela na página.
Cada diff mostra uma pergunta.
O teto de arquivos do repositório não juntou os três.

## Casos-limite

- A demanda cabe numa pergunta de revisão: um pull request só, mesmo com vários commits.
- O teto de arquivos ainda não estourou, mas o diff mistura perguntas: separe mesmo assim.
- O pull request aberto mistura perguntas e já tem comentário: abra os rascunhos, atenda cada comentário no rascunho do arquivo e aponte o commit novo na resposta.
- O pull request aberto mistura perguntas e ainda não tem comentário: abra os rascunhos, aponte o antigo e não reescreva a branch.
- Cada rascunho tem a própria tarefa filha, citada no título e no corpo.
- `Fatiar por subtarefa` em `sim`: um pull request por subtarefa, e dentro dela o mesmo corte.
- A branch de baixo fica atrás da base depois do corte: as de cima andam junto, e cada diff continua só com os arquivos daquela pergunta.

## Pegadinhas

- O teto de arquivos ainda folgado parece permissão para juntar a chave, o componente e o lugar em que ele aparece. Cada um é uma pergunta de revisão. O teto não junta.
- O mesmo tema da demanda parece um pull request só. O que junta é a pergunta de revisão.
- Reescrever a branch publicada parece o jeito mais curto de cortar. O corte novo são rascunhos empilhados. A branch antiga fica.
- Fechar o pull request antigo parece encerrar os comentários. Eles seguem no rascunho que tem o arquivo.
- A tarefa da demanda parece bastar para todos os rascunhos. Cada rascunho tem a própria tarefa filha.
- Atualizar só a de baixo parece não mexer nas de cima. O diff delas mistura os arquivos de baixo. Elas andam junto.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
