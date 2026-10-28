---
name: escrever-codigo
description: Aplica as preferências de código da pessoa antes de escrever ou alterar código, como comentários, estilo inline e o que fazer antes de criar um componente. Usada quando uma mudança vai escrever ou alterar código, inclusive quando o pedido é implementar uma issue. Não serve para testes, para commit nem para decidir a arquitetura. O pedido de implementar só termina quando a resposta tem o link do pull request.
metadata:
  author: jimmyandrade
  version: "0.8.0"
  related:
    - criar-commit
    - criar-pull-request
    - escrever-teste
    - evoluir-habilidade
    - levantar-ambiente-do-repositorio
    - preparar-tarefa-do-pull-request
---

# Escrever código

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra. Se as instruções do projeto ou de usuário têm uma seção com o nome desta habilidade, leia-a e aplique cada regra no passo que ela cita.
```yaml
# `Comentários no código` diz quando comentar, como `evitar; só se for estritamente necessário, em bloco de documentação`.
"Comentários no código": ""
"Idioma dos comentários": "inglês"
# `Estilo inline` diz quando o estilo escrito na própria marcação é aceito, e qual é o sistema de estilos do projeto.
"Estilo inline": ""
# `Antes de criar um componente` lista o que ler e quais habilidades do repositório chamar, em ordem.
"Antes de criar um componente": ""
# `Cópia de trabalho` é `Global` e cada skill pode sobrescrevê-lo. `workspace` cria uma cópia independente, exclusiva da tarefa, e muda a raiz para ela. `worktree` cria um git worktree novo da `main`. Vazio trabalha onde a pessoa já está.
"Cópia de trabalho": "worktree"
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Siga `Cópia de trabalho` antes de escrever. Com `workspace`, crie uma cópia independente do repositório, exclusiva desta tarefa, e mude a raiz de trabalho para ela. Com `worktree`, crie um git worktree novo desta tarefa. Não use o clone aberto da pessoa nem uma cópia que outra tarefa já ocupa. Não apague a cópia no fim: o trabalho continua nela. Com valor vazio, escreva onde a pessoa já está.

Chame `levantar-ambiente-do-repositorio` para achar a convenção de código e as habilidades do repositório, nas instruções do projeto e nas habilidades do próprio repositório. Ela vale mais que qualquer preferência desta habilidade. Diga à pessoa quando uma preferência dela contraria o repositório e siga o repositório. Se a demanda é uma issue do rastreador, siga `preparar-tarefa-do-pull-request` para conferir se a descrição está no modelo do tipo antes de escrever. Não escreva código enquanto a descrição estiver fora do modelo. Antes de escrever o código, siga `escrever-teste`: com TDD, o padrão dela, o teste que falha vem primeiro, e o código é o que o faz passar.

### Passo 2

Siga `Comentários no código`. Com um valor vazio, não comente o que o código já diz. Escreva os comentários no `Idioma dos comentários`. Uma diretiva para uma ferramenta, como desligar uma regra de lint numa linha, continua sendo comentário de linha, com o motivo.

### Passo 3

Siga `Estilo inline`. Um valor que já tem uma variável de design ou uma classe vai para o sistema de estilos do projeto. O estilo inline fica para o valor calculado em tempo de execução.

### Passo 4

Antes de criar um componente, siga `Antes de criar um componente`: leia o desenho de origem, e chame as habilidades do repositório para criar componentes, na ordem dada, em vez de refazer o passo a passo à mão. Sem habilidade do repositório, siga o componente mais parecido que já existe.

### Passo 5

Rode o teste da mudança e confirme que ele passa. Para o commit e o pull request, siga `criar-commit` e `criar-pull-request`. O pedido de implementar só está pronto quando a resposta tem o link do pull request. Com `Criar pull request ao terminar` em `rascunho`, esse pull request é um rascunho. Uma resposta que só diz que o código está pronto, sem o link, não encerra o pedido. Depois do push, uma vez, o título e a descrição têm de continuar contando o que o código faz. Não confira a cada commit.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Conferência a cada commit

Se você conferir o título e a descrição a cada commit, a conferência gasta token antes do push e se repete.

1. Faça os commits sem essa conferência.
2. Depois do push, uma vez, siga a conferência de `criar-pull-request`.

### Comentário que repete o código

Se você comentar o que a linha já diz, o comentário envelhece e engana.

1. Apague o comentário.
2. Se a razão não é óbvia, escreva o porquê num bloco de documentação.

### Estilo inline para valor fixo

Se você escrever `style={{ padding: 16 }}` para um valor que já tem variável de design, o desenho deixa de acompanhar o tema.

1. Troque pelo sistema de estilos do projeto.
2. Deixe o estilo inline só para o valor que depende de dado em execução.

### Implementação sem pull request

Se você entregar o código e não abrir o pull request, a pessoa não tem onde revisar.

1. Siga `criar-commit` e `criar-pull-request`.
2. Com `Criar pull request ao terminar` em `rascunho`, abra em rascunho.
3. A resposta leva o link.

### Componente criado à mão

Se você montar o componente sem chamar a habilidade do repositório, ele sai sem a estrutura, os arquivos e as verificações que o projeto exige.

1. Leia o desenho de origem.
2. Chame as habilidades do repositório na ordem dada.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Crie o componente de cartão de resumo do pedido

Li o desenho do cartão e chamei a habilidade do repositório que cria componentes, depois a que confere o resultado. Usei o sistema de estilos do projeto para o espaçamento e a cor. Só a largura da barra de progresso, calculada pelo valor do pedido, ficou inline. Não deixei comentário que repete o código.

### Implemente a barra de anúncio da issue PROJ-1

Conferi a descrição contra o modelo antes do código. No fim, o pull request estava em rascunho e a resposta levou o link.

### Ajuste o formatador de moeda

Mudei a função sem comentário novo. Um `eslint-disable-next-line` com o motivo ficou como comentário de linha, porque a regra não se aplica a esse caso.

## Casos-limite

- O repositório permite outro estilo: siga o repositório.
- Não há desenho de origem para o componente: diga isso e peça o desenho antes de criar.
- O valor de estilo é fixo mas o sistema de estilos não tem variável para ele: use o sistema de estilos e diga que falta a variável.
- O código é de um arquivo gerado: não aplique as preferências.
- Vários commits sobem juntos: a conferência do título e da descrição é uma, depois do push.
- `Cópia de trabalho` em `workspace` ou `worktree`: a tarefa não entra no clone aberto nem numa cópia já ocupada.
- O pedido é implementar e `Criar pull request ao terminar` está em `rascunho`: a resposta leva o link do rascunho. Sem o link, o pedido não terminou.

## Pegadinhas

- Uma diretiva de ferramenta não é um comentário de explicação: ela fica em comentário de linha, mesmo com `Comentários no código` em `evitar`.
- O estilo inline é aceito para valor calculado, mesmo com `Estilo inline` restrito.
- Preferência da pessoa não vai para a habilidade nem para as instruções de um repositório sem consenso do time.
- Conferir a cada commit parece necessário. A conferência é uma vez, depois do push.
- Reutilizar a worktree aberta parece mais rápido. Com `Cópia de trabalho` em `workspace` ou `worktree`, a tarefa abre uma cópia nova e ela fica no fim.
- O código pronto parece o fim do pedido de implementar. O fim é o link do pull request.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
