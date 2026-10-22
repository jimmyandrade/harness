---
name: escrever-teste
description: Escreve ou altera testes de unidade seguindo a convenção de testes do projeto, com o Better Specs como padrão. Usada quando uma mudança precisa de teste novo, quando um teste existente muda ou quando uma revisão pede um teste. Não serve para decidir o que testar, rodar a suíte inteira nem refatorar testes antigos.
metadata:
  author: jimmyandrade
  version: "0.2.0"
  notion: "false"
  related:
    - criar-commit
    - escrever-codigo
    - evoluir-habilidade
    - levantar-ambiente-do-repositorio
---

# Escrever teste

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco, depois nas instruções de usuário. Quando um valor não estiver lá, use o padrão abaixo. Um valor vazio não impõe regra. Se as instruções do projeto ou de usuário têm uma seção com o nome desta habilidade, leia-a e aplique cada regra no passo que ela cita.

```yaml
"Convenção de testes": "Better Specs"
"Idioma dos títulos dos testes": "inglês"
"Alcance da mudança": "só as linhas tocadas"
"Comando de testes": ""
"Modo de aprendizado": "perguntar"
```

`Convenção de testes` é o nome do guia que os títulos e a estrutura seguem. `Alcance da mudança` é `só as linhas tocadas` ou `arquivo inteiro`. `Comando de testes` roda os testes do arquivo afetado.

## Instruções

### Passo 1

Chame `levantar-ambiente-do-repositorio` para achar a convenção de testes, os comandos e o runtime, nas instruções do projeto e nas habilidades do próprio repositório. Ela vale mais que a `Convenção de testes`. Leia um teste vizinho do mesmo tipo para copiar o jeito de montar, de limpar e de nomear.

### Passo 2

Escreva os títulos e a estrutura pela `Convenção de testes`. Com o Better Specs:

- `describe` leva o nome do que é testado: a função, o componente ou o método.
- Cada contexto começa com "when", "with" ou "without" e descreve a condição.
- `it` é curto, na terceira pessoa do presente, e nunca usa "should".
- Cada teste de unidade tem uma expectativa.
- O corpo segue Arrange, Act, Assert, nessa ordem.
- Variações do mesmo caso entram em `it.each`, não em testes copiados.

Os títulos ficam no `Idioma dos títulos dos testes`.

### Passo 3

Respeite o `Alcance da mudança`. Com `só as linhas tocadas`, o padrão vale para o teste que você escreve ou altera e para o caso novo dentro de um arquivo antigo. Não renomeie, não reagrupe e não reescreva teste que a mudança não tocou, mesmo que ele use "should" ou várias expectativas.

### Passo 4

Rode o `Comando de testes`, ou o que `levantar-ambiente-do-repositorio` achou, nos arquivos afetados. Se o teste cobre uma correção, confirme que ele falha sem a correção e passa com ela. Se a convenção do repositório tem lint de testes, rode-o. O commit segue `criar-commit`.

### Passo 5

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Teste antigo reescrito

Se você renomear os testes que já estavam no arquivo para o padrão novo, o diff cresce e a revisão perde o que de fato mudou.

1. Volte os títulos que você não precisava tocar.
2. Aplique o padrão só ao que você escreveu ou alterou.

### Várias expectativas num teste

Se você juntar três verificações num `it`, uma falha esconde as outras e o título deixa de dizer o que quebrou.

1. Separe em um teste por expectativa.
2. Se o Arrange for caro, divida num contexto com a preparação comum.

### Título com "should"

Se você escrever `it("should return the total")`, o título repete a convenção que o projeto quer evitar.

1. Reescreva na terceira pessoa do presente: `it("returns the total")`.
2. Mantenha o contexto em "when", "with" ou "without".

### Variações copiadas

Se você copiar o mesmo teste mudando só o valor, a manutenção multiplica.

1. Use `it.each` com a tabela de casos.
2. Deixe o título dizer o que varia.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### Escreva o teste da função que soma o total de um pedido

Li um teste vizinho e copiei o jeito de montar os dados. Criei `describe("calculateOrderTotal")`, com o contexto "when the order has a discount" e o contexto "without items". Cada `it` tem uma expectativa, como `it("returns the discounted total")`. Os descontos de 10% e de 20% entraram num `it.each`. Rodei os testes do arquivo e passaram.

### Adicione um caso ao arquivo de testes do formatador de datas

O arquivo antigo usa "should" nos títulos. Escrevi só o caso novo no padrão, `it("returns an empty string for an invalid date")`, dentro de um contexto "with an invalid date". Não mexi nos títulos antigos.

## Casos-limite

- O repositório define outra convenção: ela vale mais que o Better Specs.
- O arquivo é novo: o arquivo inteiro segue o padrão.
- O teste é de integração ou de tela, com várias verificações por natureza: siga a convenção do repositório para esse tipo, e aplique o Better Specs aos títulos.
- Não existe `Comando de testes`: diga isso e leia o `package` ou o arquivo de tarefas do projeto antes de perguntar.
- A revisão aponta um teste antigo fora do padrão: não o reescreva, a menos que a mudança o tenha tocado.

## Pegadinhas

- O Better Specs nasceu em RSpec. Em Jest ou Vitest valem os mesmos princípios, sem `let` nem `subject`.
- "Só as linhas tocadas" inclui um `it` novo num arquivo antigo, e o contexto novo que o abriga.
- Mudar o título de um teste antigo conta como tocá-lo e aparece no diff.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
