---
name: escrever-codigo
description: Aplica as preferências de código da pessoa antes de escrever ou alterar código, como comentários, tokens de design, estilo inline e o que fazer antes de criar um componente. Usada quando uma mudança vai escrever ou alterar código, inclusive quando o pedido é implementar uma issue. Não serve para testes, para commit nem para decidir a arquitetura. O pedido de implementar só termina quando a resposta tem o link do pull request.
metadata:
  author: jimmyandrade
  version: "0.12.0"
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
# `Tokens de design` diz onde ficam os tokens do projeto e como ler o nome de cada um, como o tema ou o arquivo de variáveis. Vazio, procure no sistema de estilos e nas instruções do projeto.
"Tokens de design": ""
# `Antes de criar um componente` lista o que ler e quais habilidades do repositório chamar, em ordem.
"Antes de criar um componente": ""
# `Cópia de trabalho` é `Global` e cada skill pode sobrescrevê-lo. `worktree` é o ideal: um git worktree novo da `main`. `workspace` é a exceção, uma cópia independente quando o `worktree` falha e usar o clone não é seguro. Vazio trabalha onde a pessoa já está.
"Cópia de trabalho": "worktree"
"Modo de aprendizado": "perguntar"
```
## Instruções

### Passo 1

Siga `Cópia de trabalho` antes de escrever. Com `worktree`, o ideal, crie um git worktree novo desta tarefa. Só use `workspace`, uma cópia independente do repositório, exclusiva desta tarefa e com a raiz de trabalho nela, quando o `worktree` não funcionar e escrever no clone não for seguro. Não use o clone aberto da pessoa nem uma cópia que outra tarefa já ocupa. Não apague a cópia no fim: o trabalho continua nela. Com valor vazio, escreva onde a pessoa já está.

Chame `levantar-ambiente-do-repositorio` para achar a convenção de código e as habilidades do repositório, nas instruções do projeto e nas habilidades do próprio repositório. Ela vale mais que qualquer preferência desta habilidade. Diga à pessoa quando uma preferência dela contraria o repositório e siga o repositório. Se a demanda é uma issue do rastreador, siga `preparar-tarefa-do-pull-request` para conferir se a descrição está no modelo do tipo antes de escrever. Não escreva código enquanto a descrição estiver fora do modelo. Antes de escrever o código, siga `escrever-teste`: com TDD, o padrão dela, o teste que falha vem primeiro, e o código é o que o faz passar.

Toda escolha de convenção que o código pede, como o nome de uma constante, de um arquivo ou de um tipo, a estrutura da pasta e a forma de um export, sai do repositório e nunca do hábito.
Antes de escolher, procure a regra nas instruções do projeto, nas habilidades e nos guias do repositório, e leia a que achar.
Sem regra escrita, copie um arquivo vizinho do mesmo tipo.
Diga na resposta de onde veio cada escolha, como "UPPER_CASE, do guia de nomes do repositório" ou "copiado do vizinho".

### Passo 2

Siga `Comentários no código`. Com um valor vazio, não comente o que o código já diz. Escreva os comentários no `Idioma dos comentários`. O comentário que explica uma função, um teste, uma constante ou outra declaração vai num bloco de documentação logo acima dela, como `/** */` do JSDoc em JavaScript e TypeScript, mesmo com uma frase só. O comentário de linha, como `//`, fica para uma frase curta que cabe numa linha, dentro do corpo. Várias linhas de `//` seguidas viram um bloco de documentação. Uma diretiva para uma ferramenta, como desligar uma regra de lint numa linha, continua sendo comentário de linha, com o motivo.

### Passo 3

Siga `Estilo inline` e `Tokens de design`.
Todo valor de cor, espaço, tipografia, raio e borda vem de um token do projeto e nunca é gravado como valor fixo.
Um valor que já tem uma variável de design ou uma classe vai para o sistema de estilos do projeto.
O estilo inline fica para o valor calculado em tempo de execução.
O valor que o desenho pede e não tem token não é gravado em silêncio: pare e diga à pessoa qual valor falta, de onde ele veio (o desenho, a variável e o valor lido) e qual é o token mais próximo.
Proponha as saídas: usar o token mais próximo, pedir o token novo a quem cuida do sistema de design, ou gravar o valor fixo com um comentário e a pendência declarada.
Siga a escolha da pessoa e registre-a na descrição do pull request.

### Passo 4

Organize o código para que cada mudança futura aconteça num lugar só.
Um valor usado em mais de um arquivo, como um endereço ou um limite, vira uma constante exportada de um módulo só.
Uma responsabilidade nova, como uma checagem que não é do módulo onde ela seria chamada, vai para um módulo próprio, que o outro importa.
Checagens que se acumulam, como recusas de uma validação, viram uma lista de funções aplicadas por uma composição, em vez de chamadas encadeadas uma a uma.

### Passo 5

Antes de criar um componente, siga `Antes de criar um componente`: leia o desenho de origem, e chame as habilidades do repositório para criar componentes, na ordem dada, em vez de refazer o passo a passo à mão. Sem habilidade do repositório, siga o componente mais parecido que já existe.

### Passo 6

Rode o teste da mudança e confirme que ele passa. Para o commit e o pull request, siga `criar-commit` e `criar-pull-request`. O pedido de implementar só está pronto quando a resposta tem o link do pull request. Com `Criar pull request ao terminar` em `rascunho`, esse pull request é um rascunho. Uma resposta que só diz que o código está pronto, sem o link, não encerra o pedido. Depois do push, uma vez, o título e a descrição têm de continuar contando o que o código faz. Não confira a cada commit.

### Passo 7

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Conferência a cada commit

Se você conferir o título e a descrição a cada commit, a conferência gasta token antes do push e se repete.

1. Faça os commits sem essa conferência.
2. Depois do push, uma vez, siga a conferência de `criar-pull-request`.

### Convenção escolhida de hábito

Se você nomear uma constante ou um arquivo pelo que costuma usar, sem conferir o repositório, a escolha pode coincidir com a regra dele ou contrariá-la, e você não sabe qual dos dois.

1. Procure a regra nas instruções do projeto, nas habilidades e nos guias do repositório antes de escolher.
2. Sem regra escrita, copie um vizinho do mesmo tipo.
3. Diga na resposta de onde veio a escolha.

### Comentário que repete o código

Se você comentar o que a linha já diz, o comentário envelhece e engana.

1. Apague o comentário.
2. Se a razão não é óbvia, escreva o porquê num bloco de documentação.

### Valor fixo no lugar do token

Se você escrever `style={{ padding: 16 }}` ou uma cor em hexadecimal para um valor que já tem token, o desenho deixa de acompanhar o tema.

1. Troque pelo token, no sistema de estilos do projeto.
2. Deixe o estilo inline só para o valor que depende de dado em execução.

### Valor sem token gravado em silêncio

Se você gravar o valor fixo de algo que o desenho pede e que não tem token, sem avisar, o tema deixa de acompanhá-lo e ninguém sabe que o token falta.

1. Pare antes de gravar.
2. Diga qual valor falta, de onde ele veio e qual é o token mais próximo.
3. Proponha as três saídas do Passo 3, espere a escolha e registre-a na descrição do pull request.

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

Li o desenho do cartão e chamei a habilidade do repositório que cria componentes, depois a que confere o resultado. Usei os tokens do projeto para o espaçamento e a cor. Só a largura da barra de progresso, calculada pelo valor do pedido, ficou inline. Não deixei comentário que repete o código.

### Implemente a barra de anúncio da issue PROJ-1

Conferi a descrição contra o modelo antes do código. No fim, o pull request estava em rascunho e a resposta levou o link.

### Aplique o desenho do cartão no tema escuro

Troquei cada cor e cada espaço pelo token do projeto.
O fundo do item fechado, `#1f1f21` no desenho, não tinha token, e o mais próximo era um cinza bem mais escuro.
Parei e disse isso, com a variável do desenho e os três caminhos. A pessoa escolheu pedir o token novo e usar o mais próximo até ele chegar, e o pull request registrou a escolha e a pendência.

### Ajuste o formatador de moeda

Mudei a função sem comentário novo. Um `eslint-disable-next-line` com o motivo ficou como comentário de linha, porque a regra não se aplica a esse caso.

## Casos-limite

- O repositório permite outro estilo: siga o repositório.
- Não há desenho de origem para o componente: diga isso e peça o desenho antes de criar.
- O valor de estilo é fixo mas o sistema de estilos não tem token para ele: não grave o valor. Diga qual falta, de onde veio e o token mais próximo, ofereça as três saídas do Passo 3 e registre a escolha.
- O código é de um arquivo gerado: não aplique as preferências.
- Vários commits sobem juntos: a conferência do título e da descrição é uma, depois do push.
- `Cópia de trabalho` em `workspace` ou `worktree`: a tarefa não entra no clone aberto nem numa cópia já ocupada.
- O pedido é implementar e `Criar pull request ao terminar` está em `rascunho`: a resposta leva o link do rascunho. Sem o link, o pedido não terminou.

## Pegadinhas

- Uma diretiva de ferramenta não é um comentário de explicação: ela fica em comentário de linha, mesmo com `Comentários no código` em `evitar`.
- Várias linhas de `//` acima de uma função parecem mais leves que um bloco. O editor mostra o bloco de documentação ao passar o mouse na função, e a sequência de `//` não.
- O estilo inline é aceito para valor calculado, mesmo com `Estilo inline` restrito.
- Um hexadecimal que veio do desenho parece o valor certo para gravar. O desenho liga o valor a uma variável, e o token do projeto é que o acompanha no tema.
- Gravar o valor fixo parece mais rápido que avisar. O aviso custa uma frase, e o token que falta fica registrado para quem cuida do sistema de design.
- Preferência da pessoa não vai para a habilidade nem para as instruções de um repositório sem consenso do time.
- Conferir a cada commit parece necessário. A conferência é uma vez, depois do push.
- O nome que você usa sempre parece o certo. Acertar por hábito não prova que o repositório tem essa regra, e a pessoa pergunta de onde veio.
- Reutilizar a worktree aberta parece mais rápido. Com `Cópia de trabalho` em `workspace` ou `worktree`, a tarefa abre uma cópia nova e ela fica no fim.
- O código pronto parece o fim do pedido de implementar. O fim é o link do pull request.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
