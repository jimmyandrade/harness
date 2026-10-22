---
name: escrever-codigo
description: Aplica as preferências de código da pessoa antes de escrever ou alterar código, como comentários, estilo inline e o que fazer antes de criar um componente. Usada quando uma mudança vai escrever ou alterar código do projeto. Não serve para testes, para commit nem para decidir a arquitetura.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  notion: "false"
  related:
    - criar-commit
    - criar-pull-request
    - escrever-teste
    - evoluir-habilidade
    - levantar-ambiente-do-repositorio
---

# Escrever código

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra. Se as instruções do projeto ou de usuário têm uma seção com o nome desta habilidade, leia-a e aplique cada regra no passo que ela cita.

```yaml
"Comentários no código": ""
"Idioma dos comentários": "inglês"
"Estilo inline": ""
"Antes de criar um componente": ""
"Modo de aprendizado": "perguntar"
```

`Comentários no código` diz quando comentar, como `evitar; só se for estritamente necessário, em bloco de documentação`. `Estilo inline` diz quando o estilo escrito na própria marcação é aceito, e qual é o sistema de estilos do projeto. `Antes de criar um componente` lista o que ler e quais habilidades do repositório chamar, em ordem.

## Instruções

### Passo 1

Chame `levantar-ambiente-do-repositorio` para achar a convenção de código e as habilidades do repositório, nas instruções do projeto e nas habilidades do próprio repositório. Ela vale mais que qualquer preferência desta habilidade. Diga à pessoa quando uma preferência dela contraria o repositório e siga o repositório.

### Passo 2

Siga `Comentários no código`. Com um valor vazio, não comente o que o código já diz. Escreva os comentários no `Idioma dos comentários`. Uma diretiva para uma ferramenta, como desligar uma regra de lint numa linha, continua sendo comentário de linha, com o motivo.

### Passo 3

Siga `Estilo inline`. Um valor que já tem uma variável de design ou uma classe vai para o sistema de estilos do projeto. O estilo inline fica para o valor calculado em tempo de execução.

### Passo 4

Antes de criar um componente, siga `Antes de criar um componente`: leia o desenho de origem, e chame as habilidades do repositório para criar componentes, na ordem dada, em vez de refazer o passo a passo à mão. Sem habilidade do repositório, siga o componente mais parecido que já existe.

### Passo 5

Para o teste da mudança, chame `escrever-teste`. Para o commit e o pull request, siga `criar-commit` e `criar-pull-request`.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Comentário que repete o código

Se você comentar o que a linha já diz, o comentário envelhece e engana.

1. Apague o comentário.
2. Se a razão não é óbvia, escreva o porquê num bloco de documentação.

### Estilo inline para valor fixo

Se você escrever `style={{ padding: 16 }}` para um valor que já tem variável de design, o desenho deixa de acompanhar o tema.

1. Troque pelo sistema de estilos do projeto.
2. Deixe o estilo inline só para o valor que depende de dado em execução.

### Componente criado à mão

Se você montar o componente sem chamar a habilidade do repositório, ele sai sem a estrutura, os arquivos e as verificações que o projeto exige.

1. Leia o desenho de origem.
2. Chame as habilidades do repositório na ordem dada.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Crie o componente de cartão de resumo do pedido

Li o desenho do cartão e chamei a habilidade do repositório que cria componentes, depois a que confere o resultado. Usei o sistema de estilos do projeto para o espaçamento e a cor. Só a largura da barra de progresso, calculada pelo valor do pedido, ficou inline. Não deixei comentário que repete o código.

### Ajuste o formatador de moeda

Mudei a função sem comentário novo. Um `eslint-disable-next-line` com o motivo ficou como comentário de linha, porque a regra não se aplica a esse caso.

## Casos-limite

- O repositório permite outro estilo: siga o repositório.
- Não há desenho de origem para o componente: diga isso e peça o desenho antes de criar.
- O valor de estilo é fixo mas o sistema de estilos não tem variável para ele: use o sistema de estilos e diga que falta a variável.
- O código é de um arquivo gerado: não aplique as preferências.

## Pegadinhas

- Uma diretiva de ferramenta não é um comentário de explicação: ela fica em comentário de linha, mesmo com `Comentários no código` em `evitar`.
- O estilo inline é aceito para valor calculado, mesmo com `Estilo inline` restrito.
- Preferência da pessoa não vai para a habilidade nem para as instruções de um repositório sem consenso do time.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
