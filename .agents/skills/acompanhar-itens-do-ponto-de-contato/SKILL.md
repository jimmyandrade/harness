---
name: acompanhar-itens-do-ponto-de-contato
description: Acompanha o que a empresa leva a um ponto de contato, do preparo à volta. Cria as linhas de itens, confere na ida, na montagem, na desmontagem e na volta, e acusa o que ficou para trás. Usada ao organizar um ponto físico ou ao conferir os bens antes, durante e depois dele. NÃO serve para cadastrar o bem, registrar o estado dele nem organizar a viagem.
metadata:
  author: jimmyandrade
  version: "0.1.0"
  aliases:
    - preparar-itens-do-ponto-de-contato
  related:
    - analisar-regulamento-da-oportunidade
    - definir-ativo-imobilizado
    - definir-tarefa
    - definir-viagem
    - evoluir-habilidade
    - inscrever-na-oportunidade
    - organizar-ponto-de-contato
    - procurar-tarefa
    - registrar-ciclo-do-ativo
---

# Acompanhar itens do ponto de contato

## Parâmetros de configuração

Leia cada valor nas instruções do projeto: primeiro na entrada com o nome desta habilidade, depois na entrada `Global` ou no primeiro nível do bloco. Quando um valor não estiver lá, use o padrão abaixo.
```yaml
"Modo de aprendizado": "perguntar"
```

## Instruções

### Passo 1

Peça o ponto de contato ou a oportunidade. Se a pessoa passou o link, essa é a página. Sem a página, pare.
A lista de itens por ponto de contato e o nome de cada propriedade vêm do mapeamento de dados do projeto. Cada linha liga um bem ao ponto e guarda a origem do item, a situação na ida, na montagem, na desmontagem e na volta, e uma observação.
Sem essa lista no mapeamento, diga a limitação e recomende a lista. Não a crie sem a autorização da pessoa.

### Passo 2

Para preparar, junte, nesta ordem, o que o ponto leva:

1. As linhas que o ponto já tem.
2. Os suportes que a expografia do ponto cita, como uma arara.
3. O que o regulamento pede levar, como extensão, filtro de linha, adaptador e meio de pagamento próprio, lido da análise de `analisar-regulamento-da-oportunidade`.
4. O material que a organização pediu para validar.
5. As linhas dos pontos anteriores do mesmo grupo de oportunidades e as lições nas notas do grupo, como proposta, dizendo que vêm de lá.

Compare com o que a organização fornece, na propriedade de mobiliário da oportunidade.
O que ela fornece e a empresa também leva é pergunta: a empresa leva o próprio por escolha ou por esquecimento?
O que ela não fornece e a lista não tem é lacuna: pergunte à pessoa, com o item e a quantidade, antes de fechar a lista.

### Passo 3

Crie uma linha por bem, com o bem, o ponto, a origem do item e a situação da ida como prevista. Cada unidade é uma linha.
O item fornecido pela organização ou alugado, que não é um bem da empresa, entra sem o bem ligado, com a origem dita.
Confira com `procurar-tarefa` e crie, por `definir-tarefa`, uma tarefa do ponto com o prazo na véspera da saída da viagem ou da montagem, lido de `definir-viagem`. A definição de concluído manda conferir os itens na ida, na montagem, na desmontagem e na volta.
Pergunte quem responde. Não preencha responsável que a pessoa não disse. Avise a pessoa antes do prazo, com o link.

### Passo 4

Em cada momento, leia as linhas do ponto e pergunte, item a item, só o que a pessoa ainda não disse.

1. Na ida: o bem saiu de onde fica guardado e entrou no carro, ou foi esquecido, ou não foi preciso.
2. Na montagem: o bem foi usado ou não.
3. Na desmontagem: o bem foi recolhido ou deixado para trás.
4. Na volta: o bem foi devolvido ou não.

Grave a situação do momento só com a resposta da pessoa. Não preencha um momento por suposição nem antes do anterior.
Item esquecido na ida e comprado ou alugado no local vira outra linha, com a origem dita.

### Passo 5

Ao fim, liste na hora cada linha esquecida, deixada para trás ou não devolvida.
Bem perdido, danificado ou emprestado segue `registrar-ciclo-do-ativo`.
O item que faltou vira lição nas notas do grupo de oportunidades, e as linhas do próximo ponto o levam.

### Passo 6

Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`.

## Problemas comuns

### Item esquecido

Se você montar a lista só pelo que a pessoa lembra, mesa e cadeira ficam de fora ou vão sem precisar.

1. Junte as cinco fontes do Passo 2.
2. Compare com o que a organização fornece.
3. Pergunte só a diferença.

### Item alugado que a empresa tem

Se você deixar o formulário alugar mesa, balcão ou cadeira que a empresa tem, ela paga duas vezes.

1. Leia as linhas do ponto.
2. Responda ao formulário por `inscrever-na-oportunidade`.
3. Deixe o item na lista.

### Momento preenchido por suposição

Se você marcar que o bem voltou porque foi montado, o que ficou para trás passa despercebido.

1. Pergunte em cada momento.
2. Grave só a resposta da pessoa.
3. Não preencha um momento antes do anterior.

### Volta sem conferir

Se você encerrar o acompanhamento na desmontagem, o bem que não chegou em casa não aparece.

1. Peça a situação da volta de cada linha.
2. Liste as que não voltaram.
3. Registre o que se perdeu em `registrar-ciclo-do-ativo`.

## Exemplos de entrada e saída

Estes exemplos ilustram fatos. Eles podem não estar no data source.

### a organização fornece tenda e uma cadeira e não fornece mesa

Li as linhas do ponto e o que o regulamento pede. A mesa não está fornecida e a empresa a tem: criei a linha dela, com a ida prevista. A cadeira fornecida não entrou. Criei a tarefa com o prazo na véspera da saída. Na desmontagem, perguntei item a item e a mesa ficou como recolhida.

## Casos-limite

- A oportunidade não tem a propriedade de mobiliário preenchida: peça à pessoa o que a organização fornece, não suponha.
- Ponto sem linhas: monte pelas outras fontes e diga de onde veio cada item.
- Ponto de um dia só, sem viagem: o prazo é a véspera da montagem.
- O ponto ainda não existe: crie as linhas sem o ponto e ligue quando ele for criado.

## Pegadinhas

- A expografia parece a lista de mobiliário. Ela é de peça sobre suporte, e mesa e cadeira só entram por terem uma linha no ponto.
- A mesa da empresa parece sempre necessária. Quando a organização fornece, ela fica em casa.
- O bem que voltou para casa parece não precisar de registro. A volta marcada mostra que nada ficou para trás.
- Cada cadeira é uma linha: a quantidade é quantas linhas o ponto tem.

## Scripts disponíveis

- Nenhum.

1. Não há script para executar.
